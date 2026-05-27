/**
 * XO Studio — Monitor Engine
 * Simple HTTP/TCP uptime monitoring built into studio.
 * No external dependencies beyond better-sqlite3 (already in use).
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const net = require('net');

const dataDir = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'xo-preview.sqlite'));
db.pragma('journal_mode = WAL');

// ── Schema ─────────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS monitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'http',         -- 'http' | 'tcp' (primary check)
    target TEXT NOT NULL,                      -- URL or host:port
    secondary_type TEXT,                       -- optional second check type
    secondary_target TEXT,                     -- optional second check target
    interval_sec INTEGER NOT NULL DEFAULT 300,
    fail_threshold INTEGER NOT NULL DEFAULT 2,
    active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS monitor_checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monitor_id INTEGER NOT NULL,
    checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL,               -- 'up' | 'down' (primary check)
    response_ms INTEGER,
    status_code INTEGER,
    error TEXT,
    sec_status TEXT,                    -- secondary check (optional)
    sec_response_ms INTEGER,
    sec_status_code INTEGER,
    sec_error TEXT,
    FOREIGN KEY (monitor_id) REFERENCES monitors(id) ON DELETE CASCADE
  );
`);

// ── Schema migrations
try { db.exec('ALTER TABLE monitors ADD COLUMN secondary_type TEXT'); } catch (_) {}
try { db.exec('ALTER TABLE monitors ADD COLUMN secondary_target TEXT'); } catch (_) {}
try { db.exec('ALTER TABLE monitors ADD COLUMN fail_threshold INTEGER NOT NULL DEFAULT 2'); } catch (_) {}
try { db.exec('ALTER TABLE monitor_checks ADD COLUMN sec_status TEXT'); } catch (_) {}
try { db.exec('ALTER TABLE monitor_checks ADD COLUMN sec_response_ms INTEGER'); } catch (_) {}
try { db.exec('ALTER TABLE monitor_checks ADD COLUMN sec_status_code INTEGER'); } catch (_) {}
try { db.exec('ALTER TABLE monitor_checks ADD COLUMN sec_error TEXT'); } catch (_) {}

// ── Migrations / fixes ─────────────────────────────────────────────────────────────────────
// All migrations are idempotent — safe to re-run on every server start.

// Fix: TCP port 22 is firewalled from Railway — switch Hetzner servers to HTTP (target only, NOT name)
db.prepare(`UPDATE monitors SET type='http', target='http://116.202.112.183'
  WHERE target='116.202.112.183:22'`).run();
db.prepare(`UPDATE monitors SET type='http', target='http://65.109.87.116'
  WHERE target='65.109.87.116:22'`).run();
// Fix: set pre-stage as secondary on Page server (only if not already set)
db.prepare(`UPDATE monitors SET secondary_type='http', secondary_target='http://65.108.237.36:8099'
  WHERE target='65.108.237.36:22' AND secondary_target IS NULL`).run();

// Fix: remove stale doblify.com entry (returns 455, not useful)
db.prepare(`DELETE FROM monitors WHERE target='https://doblify.com'`).run();

// Add any monitors that are still missing
const existingTargets = new Set(db.prepare('SELECT target FROM monitors').all().map(r => r.target));
const toAdd = [
  { name: 'studio.xo.dk',             type: 'http', target: 'https://studio.xo.dk',      interval_sec: 300, fail_threshold: 2 },
  { name: 'xo.dk',                    type: 'http', target: 'https://xo.dk',             interval_sec: 300, fail_threshold: 2 },
  { name: 'Linux — Kontor (Page)',     type: 'tcp',  target: '65.108.237.36:22',          interval_sec: 300, fail_threshold: 2, secondary_type: 'http', secondary_target: 'http://65.108.237.36:8099' },
  { name: 'Hetzner — Doblify Prod',   type: 'http', target: 'http://116.202.112.183',    interval_sec: 300, fail_threshold: 2 },
  { name: 'Hetzner — Doblify Stage',  type: 'http', target: 'http://65.109.87.116',      interval_sec: 300, fail_threshold: 2 },
  { name: 'Doblify — Pre-stage',      type: 'http', target: 'http://65.108.237.36:8099', interval_sec: 300, fail_threshold: 2 },
];
const insertMissing = db.prepare('INSERT INTO monitors (name, type, target, secondary_type, secondary_target, interval_sec, fail_threshold) VALUES (?, ?, ?, ?, ?, ?, ?)');
for (const m of toAdd) {
  if (!existingTargets.has(m.target)) {
    insertMissing.run(m.name, m.type, m.target, m.secondary_type || null, m.secondary_target || null, m.interval_sec, m.fail_threshold ?? 2);
  }
}

// Migrate existing monitors to new defaults (interval=300, fail_threshold=2)
db.prepare(`UPDATE monitors SET interval_sec = 300 WHERE interval_sec IN (60, 120)`).run();
db.prepare(`UPDATE monitors SET fail_threshold = 2 WHERE fail_threshold IS NULL OR fail_threshold = 1`).run();

// ── Queries ───────────────────────────────────────────────────────────────────

function getAllMonitors() {
  return db.prepare('SELECT * FROM monitors ORDER BY id').all();
}

function getMonitorById(id) {
  return db.prepare('SELECT * FROM monitors WHERE id = ?').get(id);
}

function addMonitor({ name, type = 'http', target, secondary_type, secondary_target, interval_sec = 300, fail_threshold = 2 }) {
  const r = db.prepare(
    'INSERT INTO monitors (name, type, target, secondary_type, secondary_target, interval_sec, fail_threshold) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(name, type, target, secondary_type || null, secondary_target || null, interval_sec, fail_threshold);
  return r.lastInsertRowid;
}

function updateMonitor(id, fields) {
  const allowed = ['name', 'type', 'target', 'secondary_type', 'secondary_target', 'interval_sec', 'fail_threshold', 'active'];
  const parts = Object.keys(fields).filter(k => allowed.includes(k));
  if (!parts.length) return;
  const sql = 'UPDATE monitors SET ' + parts.map(k => k + ' = ?').join(', ') + ' WHERE id = ?';
  db.prepare(sql).run(...parts.map(k => fields[k]), id);
}

function deleteMonitor(id) {
  db.prepare('DELETE FROM monitors WHERE id = ?').run(id);
}

function getRecentChecks(monitorId, limit = 30) {
  return db.prepare(`
    SELECT * FROM monitor_checks
    WHERE monitor_id = ?
    ORDER BY checked_at DESC
    LIMIT ?
  `).all(monitorId, limit);
}

function getLastCheck(monitorId) {
  return db.prepare(`
    SELECT * FROM monitor_checks
    WHERE monitor_id = ?
    ORDER BY checked_at DESC
    LIMIT 1
  `).get(monitorId);
}

/** Uptime % over the last N hours */
function uptimePercent(monitorId, hours = 24) {
  const since = new Date(Date.now() - hours * 3600 * 1000).toISOString();
  const row = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'up' THEN 1 ELSE 0 END) as up_count
    FROM monitor_checks
    WHERE monitor_id = ? AND checked_at >= ?
  `).get(monitorId, since);
  if (!row || row.total === 0) return null;
  return Math.round((row.up_count / row.total) * 100);
}

/** Average response time over last 24h (up checks only) */
function avgResponseMs(monitorId, hours = 24) {
  const since = new Date(Date.now() - hours * 3600 * 1000).toISOString();
  const row = db.prepare(`
    SELECT AVG(response_ms) as avg_ms
    FROM monitor_checks
    WHERE monitor_id = ? AND checked_at >= ? AND status = 'up'
  `).get(monitorId, since);
  return row && row.avg_ms ? Math.round(row.avg_ms) : null;
}

// ── Check logic ───────────────────────────────────────────────────────────────

function checkHttp(target) {
  return new Promise((resolve) => {
    const start = Date.now();
    const url = new URL(target);
    const mod = url.protocol === 'https:' ? https : http;
    const req = mod.get(target, {
      timeout: 10000,
      headers: { 'User-Agent': 'XO-Monitor/1.0' },
    }, (res) => {
      res.resume(); // drain
      const ms = Date.now() - start;
      const up = res.statusCode < 500;
      resolve({ status: up ? 'up' : 'down', response_ms: ms, status_code: res.statusCode });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 'down', error: 'timeout', response_ms: Date.now() - start });
    });
    req.on('error', (e) => {
      resolve({ status: 'down', error: e.message, response_ms: Date.now() - start });
    });
  });
}

function checkTcp(target) {
  return new Promise((resolve) => {
    const [host, portStr] = target.split(':');
    const port = parseInt(portStr, 10);
    const start = Date.now();
    const sock = net.createConnection({ host, port, timeout: 10000 });
    sock.on('connect', () => {
      sock.destroy();
      resolve({ status: 'up', response_ms: Date.now() - start });
    });
    sock.on('timeout', () => {
      sock.destroy();
      resolve({ status: 'down', error: 'timeout', response_ms: Date.now() - start });
    });
    sock.on('error', (e) => {
      resolve({ status: 'down', error: e.message, response_ms: Date.now() - start });
    });
  });
}

async function runCheck(monitor) {
  let result;
  try {
    if (monitor.type === 'tcp') {
      result = await checkTcp(monitor.target);
    } else {
      result = await checkHttp(monitor.target);
    }
  } catch (e) {
    result = { status: 'down', error: e.message };
  }

  // Run secondary check if configured
  let secResult = null;
  if (monitor.secondary_target && monitor.secondary_type) {
    try {
      secResult = monitor.secondary_type === 'tcp'
        ? await checkTcp(monitor.secondary_target)
        : await checkHttp(monitor.secondary_target);
    } catch (e) {
      secResult = { status: 'down', error: e.message };
    }
  }

  // Overall status = down if either check fails
  const overallStatus = result.status === 'down' || (secResult && secResult.status === 'down') ? 'down' : 'up';

  // Insert current check result
  db.prepare(
    'INSERT INTO monitor_checks (monitor_id, status, response_ms, status_code, error, sec_status, sec_response_ms, sec_status_code, sec_error) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(
    monitor.id, overallStatus,
    result.response_ms ?? null, result.status_code ?? null, result.error ?? null,
    secResult ? secResult.status : null,
    secResult ? (secResult.response_ms ?? null) : null,
    secResult ? (secResult.status_code ?? null) : null,
    secResult ? (secResult.error ?? null) : null
  );

  // Fail threshold: require N consecutive downs before alerting
  const failThreshold = monitor.fail_threshold ?? 2;
  const recentChecks = db.prepare(
    'SELECT status FROM monitor_checks WHERE monitor_id = ? ORDER BY checked_at DESC LIMIT ?'
  ).all(monitor.id, failThreshold);
  const consecutiveDowns = recentChecks.length === failThreshold && recentChecks.every(c => c.status === 'down');
  const previousCheck = db.prepare(
    'SELECT status FROM monitor_checks WHERE monitor_id = ? ORDER BY checked_at DESC LIMIT 1 OFFSET 1'
  ).get(monitor.id);
  const prevStatus = previousCheck ? previousCheck.status : null;

  // Alert on DOWN: only after N consecutive failures
  // Alert on RECOVERY: as soon as it comes back up (after having been confirmed down)
  const shouldAlertDown = overallStatus === 'down' && consecutiveDowns && prevStatus !== 'down';
  // For recovery: check if the check before current run had enough consecutive downs to have been alerted
  const prevChecks = db.prepare(
    'SELECT status FROM monitor_checks WHERE monitor_id = ? ORDER BY checked_at DESC LIMIT ? OFFSET 1'
  ).all(monitor.id, failThreshold);
  const wasConfirmedDown = prevChecks.length === failThreshold && prevChecks.every(c => c.status === 'down');
  const shouldAlertRecovery = overallStatus === 'up' && wasConfirmedDown;

  if (shouldAlertDown || shouldAlertRecovery) {
    const event = overallStatus === 'down' ? 'down' : 'recovery';
    try {
      const notify = require('./notify');
      notify.dispatchNotifications(monitor, event, result.response_ms ?? secResult?.response_ms).catch(
        e => console.error('[monitor] notify dispatch error:', e.message)
      );
    } catch (e) {
      console.error('[monitor] notify load error:', e.message);
    }
  }

  return result;
}

// ── Prune old checks (keep 30 days) ──────────────────────────────────────────

function pruneOldChecks() {
  const cutoff = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
  db.prepare('DELETE FROM monitor_checks WHERE checked_at < ?').run(cutoff);
}

// ── Scheduler ─────────────────────────────────────────────────────────────────

let _schedulerRunning = false;

function startScheduler() {
  if (_schedulerRunning) return;
  _schedulerRunning = true;

  // Track last-run per monitor
  const lastRun = new Map();

  async function tick() {
    const monitors = getAllMonitors().filter(m => m.active);
    const now = Date.now();
    for (const m of monitors) {
      const last = lastRun.get(m.id) || 0;
      if (now - last >= m.interval_sec * 1000) {
        lastRun.set(m.id, now);
        runCheck(m).catch(e => console.error(`[monitor] check failed for ${m.name}:`, e.message));
      }
    }
  }

  // Run immediately on start, then every 15s tick
  tick();
  setInterval(tick, 15_000);

  // Prune old data daily
  setInterval(pruneOldChecks, 24 * 3600 * 1000);

  console.log('[monitor] Scheduler started');
}

// ── Status summary for all monitors ──────────────────────────────────────────

function getMonitorSummary() {
  const monitors = getAllMonitors();
  return monitors.map(m => {
    const last     = getLastCheck(m.id);
    const uptime24h = uptimePercent(m.id, 24);
    const uptime7d  = uptimePercent(m.id, 168);
    const avgMs     = avgResponseMs(m.id, 24);
    return { ...m, last, uptime24h, uptime7d, avgMs };
  });
}

module.exports = {
  getAllMonitors, getMonitorById, addMonitor, updateMonitor, deleteMonitor,
  getRecentChecks, getLastCheck, uptimePercent, avgResponseMs,
  runCheck, startScheduler, getMonitorSummary,
};
