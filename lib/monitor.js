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
    type TEXT NOT NULL DEFAULT 'http',   -- 'http' | 'tcp'
    target TEXT NOT NULL,                -- URL or host:port
    interval_sec INTEGER NOT NULL DEFAULT 60,
    active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS monitor_checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monitor_id INTEGER NOT NULL,
    checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL,               -- 'up' | 'down'
    response_ms INTEGER,
    status_code INTEGER,
    error TEXT,
    FOREIGN KEY (monitor_id) REFERENCES monitors(id) ON DELETE CASCADE
  );
`);

// ── Migrations / renames ─────────────────────────────────────────────────────
// Keep monitor names up to date without requiring a full DB wipe
const renames = [
  { target: '65.108.237.36:22',   name: 'Linux — Kontor (Page)' },
  { target: '116.202.112.183:22', name: 'Hetzner — Doblify Prod' },
  { target: '65.109.87.116:22',   name: 'Hetzner — Doblify Stage' },
];
for (const r of renames) {
  db.prepare('UPDATE monitors SET name = ? WHERE target = ?').run(r.name, r.target);
}

// Add any missing monitors that aren't seeded yet
const existingTargets = new Set(db.prepare('SELECT target FROM monitors').all().map(r => r.target));
const toAdd = [
  { name: 'Hetzner — Doblify Prod',  type: 'tcp', target: '116.202.112.183:22', interval_sec: 120 },
  { name: 'Hetzner — Doblify Stage', type: 'tcp', target: '65.109.87.116:22',   interval_sec: 120 },
];
const insertMissing = db.prepare('INSERT INTO monitors (name, type, target, interval_sec) VALUES (?, ?, ?, ?)');
for (const m of toAdd) {
  if (!existingTargets.has(m.target)) insertMissing.run(m.name, m.type, m.target, m.interval_sec);
}

// Seed default monitors if empty
const monitorCount = db.prepare('SELECT COUNT(*) as n FROM monitors').get().n;
if (monitorCount === 0) {
  const insert = db.prepare(`
    INSERT INTO monitors (name, type, target, interval_sec) VALUES (?, ?, ?, ?)
  `);
  const seeds = [
    ['studio.xo.dk',              'http', 'https://studio.xo.dk',       60],
    ['xo.dk',                    'http', 'https://xo.dk',              60],
    ['Doblify (prod)',            'http', 'https://doblify.com',        60],
    ['Hetzner — Page Server',    'tcp',  '65.108.237.36:22',           120],
    ['Hetzner — Doblify Prod',   'tcp',  '116.202.112.183:22',         120],
    ['Hetzner — Doblify Stage',  'tcp',  '65.109.87.116:22',           120],
  ];
  for (const s of seeds) insert.run(...s);
}

// ── Queries ───────────────────────────────────────────────────────────────────

function getAllMonitors() {
  return db.prepare('SELECT * FROM monitors ORDER BY id').all();
}

function getMonitorById(id) {
  return db.prepare('SELECT * FROM monitors WHERE id = ?').get(id);
}

function addMonitor({ name, type = 'http', target, interval_sec = 60 }) {
  const r = db.prepare(
    'INSERT INTO monitors (name, type, target, interval_sec) VALUES (?, ?, ?, ?)'
  ).run(name, type, target, interval_sec);
  return r.lastInsertRowid;
}

function updateMonitor(id, fields) {
  const allowed = ['name', 'type', 'target', 'interval_sec', 'active'];
  const parts = Object.keys(fields).filter(k => allowed.includes(k));
  if (!parts.length) return;
  const sql = `UPDATE monitors SET ${parts.map(k => `${k} = ?`).join(', ')} WHERE id = ?`;
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

  // Get previous status for change detection
  const prev = db.prepare(
    'SELECT status FROM monitor_checks WHERE monitor_id = ? ORDER BY checked_at DESC LIMIT 1'
  ).get(monitor.id);

  db.prepare(`
    INSERT INTO monitor_checks (monitor_id, status, response_ms, status_code, error)
    VALUES (?, ?, ?, ?, ?)
  `).run(monitor.id, result.status, result.response_ms ?? null, result.status_code ?? null, result.error ?? null);

  // Dispatch notifications on status change
  const statusChanged = !prev || prev.status !== result.status;
  if (statusChanged) {
    const event = result.status === 'down' ? 'down' : 'recovery';
    // Lazy-load to avoid circular deps at startup
    try {
      const notify = require('./notify');
      notify.dispatchNotifications(monitor, event, result.response_ms).catch(
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
    const last = getLastCheck(m.id);
    const uptime24h = uptimePercent(m.id, 24);
    const uptime7d = uptimePercent(m.id, 168);
    const avgMs = avgResponseMs(m.id, 24);
    return { ...m, last, uptime24h, uptime7d, avgMs };
  });
}

module.exports = {
  getAllMonitors, getMonitorById, addMonitor, updateMonitor, deleteMonitor,
  getRecentChecks, getLastCheck, uptimePercent, avgResponseMs,
  runCheck, startScheduler, getMonitorSummary,
};
