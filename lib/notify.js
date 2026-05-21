/**
 * XO Studio — Notification Engine
 * Sends Telegram + Email alerts when monitors change status.
 * Recipients, rules, cooldowns and quiet hours are stored in SQLite.
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const https = require('https');
const nodemailer = require('nodemailer');

const dataDir = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const db = new Database(path.join(dataDir, 'xo-preview.sqlite'));

// ── Schema ─────────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS notification_recipients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    telegram_chat_id TEXT,
    email TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS notification_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monitor_id INTEGER,              -- NULL = applies to all monitors
    recipient_id INTEGER NOT NULL,
    on_down INTEGER NOT NULL DEFAULT 1,
    on_recovery INTEGER NOT NULL DEFAULT 1,
    cooldown_min INTEGER NOT NULL DEFAULT 15,
    quiet_start TEXT DEFAULT '22:00', -- HH:MM local time
    quiet_end TEXT DEFAULT '07:00',   -- HH:MM local time
    active INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (recipient_id) REFERENCES notification_recipients(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS notification_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monitor_id INTEGER NOT NULL,
    monitor_name TEXT,
    recipient_id INTEGER,
    channel TEXT NOT NULL,           -- 'telegram' | 'email'
    event TEXT NOT NULL,             -- 'down' | 'recovery'
    message TEXT,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    error TEXT
  );
`);

// ── Seed default recipient (JB) ───────────────────────────────────────────────

const recipientCount = db.prepare('SELECT COUNT(*) as n FROM notification_recipients').get().n;
if (recipientCount === 0) {
  const jbId = db.prepare(
    'INSERT INTO notification_recipients (name, telegram_chat_id, email) VALUES (?, ?, ?)'
  ).run('JB', '8326264778', 'jbf@xo.dk').lastInsertRowid;

  // Default rule: all monitors → JB, 15 min cooldown, quiet 22:00–07:00
  db.prepare(
    'INSERT INTO notification_rules (monitor_id, recipient_id, on_down, on_recovery, cooldown_min) VALUES (?, ?, 1, 1, 15)'
  ).run(null, jbId);
}

// ── Recipient queries ─────────────────────────────────────────────────────────

function getRecipients() {
  return db.prepare('SELECT * FROM notification_recipients ORDER BY id').all();
}
function getRecipientById(id) {
  return db.prepare('SELECT * FROM notification_recipients WHERE id = ?').get(id);
}
function addRecipient({ name, telegram_chat_id, email }) {
  return db.prepare(
    'INSERT INTO notification_recipients (name, telegram_chat_id, email) VALUES (?, ?, ?)'
  ).run(name, telegram_chat_id || null, email || null).lastInsertRowid;
}
function updateRecipient(id, fields) {
  const allowed = ['name', 'telegram_chat_id', 'email', 'active'];
  const parts = Object.keys(fields).filter(k => allowed.includes(k));
  if (!parts.length) return;
  db.prepare(`UPDATE notification_recipients SET ${parts.map(k => `${k}=?`).join(',')} WHERE id=?`)
    .run(...parts.map(k => fields[k]), id);
}
function deleteRecipient(id) {
  db.prepare('DELETE FROM notification_recipients WHERE id = ?').run(id);
}

// Upsert a recipient linked to a Studio user (by email)
function upsertUserRecipient(email, name, telegram_chat_id) {
  const existing = db.prepare('SELECT id FROM notification_recipients WHERE email = ?').get(email);
  if (existing) {
    db.prepare('UPDATE notification_recipients SET name = ?, telegram_chat_id = ? WHERE id = ?')
      .run(name, telegram_chat_id || null, existing.id);
    return existing.id;
  } else {
    return db.prepare('INSERT INTO notification_recipients (name, email, telegram_chat_id) VALUES (?, ?, ?)')
      .run(name, email, telegram_chat_id || null).lastInsertRowid;
  }
}

function getRecipientByEmail(email) {
  return db.prepare('SELECT * FROM notification_recipients WHERE email = ?').get(email);
}

// ── Rule queries ──────────────────────────────────────────────────────────────

function getRules() {
  return db.prepare(`
    SELECT r.*, rec.name as recipient_name
    FROM notification_rules r
    JOIN notification_recipients rec ON rec.id = r.recipient_id
    ORDER BY r.id
  `).all();
}
function addRule({ monitor_id, recipient_id, on_down = 1, on_recovery = 1, cooldown_min = 15, quiet_start = '22:00', quiet_end = '07:00' }) {
  return db.prepare(
    'INSERT INTO notification_rules (monitor_id, recipient_id, on_down, on_recovery, cooldown_min, quiet_start, quiet_end) VALUES (?,?,?,?,?,?,?)'
  ).run(monitor_id || null, recipient_id, on_down, on_recovery, cooldown_min, quiet_start, quiet_end).lastInsertRowid;
}
function deleteRule(id) {
  db.prepare('DELETE FROM notification_rules WHERE id = ?').run(id);
}

// ── Notification log ──────────────────────────────────────────────────────────

function getNotificationLog(limit = 50) {
  return db.prepare('SELECT * FROM notification_log ORDER BY sent_at DESC LIMIT ?').all(limit);
}

function logNotification({ monitor_id, monitor_name, recipient_id, channel, event, message, error }) {
  db.prepare(
    'INSERT INTO notification_log (monitor_id, monitor_name, recipient_id, channel, event, message, error) VALUES (?,?,?,?,?,?,?)'
  ).run(monitor_id, monitor_name, recipient_id || null, channel, event, message || null, error || null);
}

// ── Cooldown check ────────────────────────────────────────────────────────────

function isInCooldown(monitorId, recipientId, cooldownMin) {
  const since = new Date(Date.now() - cooldownMin * 60 * 1000).toISOString();
  const row = db.prepare(`
    SELECT COUNT(*) as n FROM notification_log
    WHERE monitor_id = ? AND recipient_id = ? AND event = 'down' AND sent_at >= ? AND error IS NULL
  `).get(monitorId, recipientId, since);
  return row.n > 0;
}

// ── Quiet hours check ─────────────────────────────────────────────────────────

function isQuietHours(quietStart, quietEnd) {
  const now = new Date();
  // Use Copenhagen timezone
  const timeStr = now.toLocaleTimeString('da-DK', { timeZone: 'Europe/Copenhagen', hour12: false, hour: '2-digit', minute: '2-digit' });
  const [h, m] = timeStr.split(':').map(Number);
  const nowMin = h * 60 + m;

  const [sh, sm] = quietStart.split(':').map(Number);
  const [eh, em] = quietEnd.split(':').map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;

  // Overnight quiet period (e.g. 22:00 – 07:00)
  if (startMin > endMin) {
    return nowMin >= startMin || nowMin < endMin;
  }
  return nowMin >= startMin && nowMin < endMin;
}

// ── Send channels ─────────────────────────────────────────────────────────────

function sendTelegram(chatId, text) {
  const token = process.env.PAGE_TELEGRAM_BOT_TOKEN;
  if (!token) return Promise.reject(new Error('PAGE_TELEGRAM_BOT_TOKEN not set'));

  const body = JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' });
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${token}/sendMessage`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        const parsed = JSON.parse(data);
        if (parsed.ok) resolve(parsed);
        else reject(new Error(parsed.description || 'Telegram API error'));
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function sendEmail(to, subject, html) {
  const smtpPass  = process.env.PAGE_EMAIL_PASSWORD;
  const smtpUser  = process.env.STUDIO_EMAIL_USER  || process.env.PAGE_EMAIL_USER  || 'page@xo.dk';
  const fromAddr  = process.env.STUDIO_EMAIL_FROM  || smtpUser;
  const fromName  = process.env.STUDIO_EMAIL_NAME  || 'XO Studio';
  if (!smtpPass) return Promise.reject(new Error('PAGE_EMAIL_PASSWORD not set'));

  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
    tls: { ciphers: 'SSLv3' },
  });

  return transporter.sendMail({
    from: `"${fromName}" <${fromAddr}>`,
    to,
    subject,
    html,
  });
}

// ── Message formatters ────────────────────────────────────────────────────────

function formatDownMsg(monitor, responseMs) {
  const ms = responseMs ? ` (${responseMs}ms)` : '';
  return {
    telegram: `🔴 <b>DOWN: ${monitor.name}</b>\n${monitor.target}${ms}\n\n<i>${new Date().toLocaleString('da-DK', { timeZone: 'Europe/Copenhagen' })}</i>`,
    emailSubject: `🔴 DOWN: ${monitor.name}`,
    emailHtml: `<h2 style="color:#dc2626">🔴 DOWN: ${monitor.name}</h2><p><b>Target:</b> ${monitor.target}</p>${responseMs ? `<p><b>Response:</b> ${responseMs}ms</p>` : ''}<p><small>${new Date().toLocaleString('da-DK', { timeZone: 'Europe/Copenhagen' })}</small></p>`,
  };
}

function formatRecoveryMsg(monitor, responseMs) {
  const ms = responseMs ? ` — ${responseMs}ms` : '';
  return {
    telegram: `🟢 <b>UP: ${monitor.name}</b>\n${monitor.target}${ms}\n\n<i>${new Date().toLocaleString('da-DK', { timeZone: 'Europe/Copenhagen' })}</i>`,
    emailSubject: `🟢 Recovered: ${monitor.name}`,
    emailHtml: `<h2 style="color:#16a34a">🟢 Recovered: ${monitor.name}</h2><p><b>Target:</b> ${monitor.target}</p>${responseMs ? `<p><b>Response:</b> ${responseMs}ms</p>` : ''}<p><small>${new Date().toLocaleString('da-DK', { timeZone: 'Europe/Copenhagen' })}</small></p>`,
  };
}

// ── Main dispatch ─────────────────────────────────────────────────────────────

async function dispatchNotifications(monitor, event, responseMs) {
  // Find all matching rules (monitor-specific or catch-all)
  const rules = db.prepare(`
    SELECT r.*, rec.telegram_chat_id, rec.email, rec.name as recipient_name
    FROM notification_rules r
    JOIN notification_recipients rec ON rec.id = r.recipient_id
    WHERE r.active = 1 AND rec.active = 1
      AND (r.monitor_id IS NULL OR r.monitor_id = ?)
      AND (? = 'down' AND r.on_down = 1 OR ? = 'recovery' AND r.on_recovery = 1)
  `).all(monitor.id, event, event);

  for (const rule of rules) {
    // Quiet hours — skip for recovery (only apply to down alerts)
    if (event === 'down' && isQuietHours(rule.quiet_start, rule.quiet_end)) {
      console.log(`[notify] Quiet hours — skipping ${monitor.name} → ${rule.recipient_name}`);
      continue;
    }

    // Cooldown — only for down events
    if (event === 'down' && isInCooldown(monitor.id, rule.recipient_id, rule.cooldown_min)) {
      console.log(`[notify] Cooldown active — skipping ${monitor.name} → ${rule.recipient_name}`);
      continue;
    }

    const msgs = event === 'down'
      ? formatDownMsg(monitor, responseMs)
      : formatRecoveryMsg(monitor, responseMs);

    // Telegram
    if (rule.telegram_chat_id) {
      try {
        await sendTelegram(rule.telegram_chat_id, msgs.telegram);
        logNotification({ monitor_id: monitor.id, monitor_name: monitor.name, recipient_id: rule.recipient_id, channel: 'telegram', event, message: msgs.telegram });
        console.log(`[notify] Telegram sent → ${rule.recipient_name} (${event}: ${monitor.name})`);
      } catch (e) {
        console.error(`[notify] Telegram failed → ${rule.recipient_name}:`, e.message);
        logNotification({ monitor_id: monitor.id, monitor_name: monitor.name, recipient_id: rule.recipient_id, channel: 'telegram', event, message: msgs.telegram, error: e.message });
      }
    }

    // Email
    if (rule.email) {
      try {
        await sendEmail(rule.email, msgs.emailSubject, msgs.emailHtml);
        logNotification({ monitor_id: monitor.id, monitor_name: monitor.name, recipient_id: rule.recipient_id, channel: 'email', event, message: msgs.emailSubject });
        console.log(`[notify] Email sent → ${rule.email} (${event}: ${monitor.name})`);
      } catch (e) {
        console.error(`[notify] Email failed → ${rule.email}:`, e.message);
        logNotification({ monitor_id: monitor.id, monitor_name: monitor.name, recipient_id: rule.recipient_id, channel: 'email', event, message: msgs.emailSubject, error: e.message });
      }
    }
  }
}

// ── Test notification ─────────────────────────────────────────────────────────

async function sendTest(recipientId) {
  const rec = getRecipientById(recipientId);
  if (!rec) throw new Error('Recipient not found');

  const testMsg = {
    telegram: `✅ <b>XO Monitor — Test notification</b>\n\nDette er en testbesked fra XO Studio Monitor.\n\n<i>${new Date().toLocaleString('da-DK', { timeZone: 'Europe/Copenhagen' })}</i>`,
    emailSubject: '✅ XO Monitor — Test notification',
    emailHtml: '<h2>✅ XO Monitor — Test</h2><p>Dette er en testbesked fra XO Studio Monitor.</p>',
  };

  const results = [];
  if (rec.telegram_chat_id) {
    try {
      await sendTelegram(rec.telegram_chat_id, testMsg.telegram);
      results.push({ channel: 'telegram', ok: true });
    } catch (e) {
      results.push({ channel: 'telegram', ok: false, error: e.message });
    }
  }
  if (rec.email) {
    try {
      await sendEmail(rec.email, testMsg.emailSubject, testMsg.emailHtml);
      results.push({ channel: 'email', ok: true });
    } catch (e) {
      results.push({ channel: 'email', ok: false, error: e.message });
    }
  }
  return results;
}

module.exports = {
  getRecipients, getRecipientById, addRecipient, updateRecipient, deleteRecipient,
  upsertUserRecipient, getRecipientByEmail,
  getRules, addRule, deleteRule,
  getNotificationLog,
  dispatchNotifications,
  sendTest,
};
