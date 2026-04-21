/**
 * Database layer — SQLite via better-sqlite3
 */
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Use /app/data on Railway (persistent volume) or local ./data
const dataDir = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'xo-preview.sqlite'));

// Enable WAL mode for better concurrent access
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS previews (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Campaign Preview',
    zuuvi_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'generating',
    banner_count INTEGER DEFAULT 0,
    live_count INTEGER DEFAULT 0,
    error_msg TEXT,
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Migrations
try { db.exec('ALTER TABLE previews ADD COLUMN views INTEGER DEFAULT 0'); } catch (_) { /* already exists */ }

// Prepared statements
const stmts = {
  getAll: db.prepare('SELECT * FROM previews ORDER BY created_at DESC'),
  getById: db.prepare('SELECT * FROM previews WHERE id = ?'),
  insert: db.prepare(`
    INSERT INTO previews (id, name, zuuvi_url, status, created_by)
    VALUES (@id, @name, @zuuvi_url, @status, @created_by)
  `),
  update: db.prepare(`
    UPDATE previews SET
      name = COALESCE(@name, name),
      zuuvi_url = COALESCE(@zuuvi_url, zuuvi_url),
      status = COALESCE(@status, status),
      banner_count = COALESCE(@banner_count, banner_count),
      live_count = COALESCE(@live_count, live_count),
      error_msg = @error_msg,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `),
  delete: db.prepare('DELETE FROM previews WHERE id = ?'),
  incrementViews: db.prepare('UPDATE previews SET views = views + 1 WHERE id = ?'),
  updateZuuviUrl: db.prepare('UPDATE previews SET zuuvi_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'),
};

module.exports = {
  getAllPreviews() {
    return stmts.getAll.all();
  },

  getPreview(id) {
    return stmts.getById.get(id);
  },

  createPreview({ id, name, zuuvi_url, status, created_by }) {
    return stmts.insert.run({ id, name, zuuvi_url, status, created_by });
  },

  updatePreview(id, fields) {
    return stmts.update.run({
      id,
      name: fields.name || null,
      zuuvi_url: fields.zuuvi_url || null,
      status: fields.status || null,
      banner_count: fields.banner_count ?? null,
      live_count: fields.live_count ?? null,
      error_msg: fields.error_msg || null,
    });
  },

  deletePreview(id) {
    return stmts.delete.run(id);
  },

  incrementViews(id) {
    return stmts.incrementViews.run(id);
  },

  updateZuuviUrl(id, newUrl) {
    return stmts.updateZuuviUrl.run(newUrl, id);
  },
};
