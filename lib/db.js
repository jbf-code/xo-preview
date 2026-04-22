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
try { db.exec('ALTER TABLE previews ADD COLUMN banners_json TEXT'); } catch (_) { /* already exists */ }

// Hosted campaigns table
db.exec(`
  CREATE TABLE IF NOT EXISTS hosted_campaigns (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_by TEXT,
    status TEXT NOT NULL DEFAULT 'processing',
    error_msg TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS hosted_formats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id TEXT NOT NULL,
    format_name TEXT NOT NULL,
    width INTEGER,
    height INTEGER,
    r2_prefix TEXT,
    cdn_url TEXT,
    tag_html TEXT,
    FOREIGN KEY (campaign_id) REFERENCES hosted_campaigns(id) ON DELETE CASCADE
  )
`);
try { db.exec('ALTER TABLE hosted_campaigns ADD COLUMN views INTEGER DEFAULT 0'); } catch (_) {}
try { db.exec('ALTER TABLE hosted_campaigns ADD COLUMN total_size_bytes INTEGER DEFAULT 0'); } catch (_) {}
try { db.exec('ALTER TABLE hosted_campaigns ADD COLUMN format_count INTEGER DEFAULT 0'); } catch (_) {}
try { db.exec('ALTER TABLE hosted_formats ADD COLUMN size_bytes INTEGER DEFAULT 0'); } catch (_) {}
try { db.exec('ALTER TABLE hosted_formats ADD COLUMN file_count INTEGER DEFAULT 0'); } catch (_) {}
try { db.exec('ALTER TABLE hosted_formats ADD COLUMN views INTEGER DEFAULT 0'); } catch (_) {}
try { db.exec('ALTER TABLE hosted_formats ADD COLUMN click_url TEXT DEFAULT NULL'); } catch (_) {}

// ── Themes table ─────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS themes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    accent_color TEXT NOT NULL DEFAULT '#e87722',
    bg_color TEXT NOT NULL DEFAULT '#0e0e10',
    header_color TEXT NOT NULL DEFAULT '#18181b',
    logo_base64 TEXT,
    is_default INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Migrate previews to include theme_id
try { db.exec("ALTER TABLE previews ADD COLUMN theme_id TEXT DEFAULT 'xo-default'"); } catch (_) {}

// Seed default XO theme (only if no themes exist)
(function seedDefaultTheme() {
  const count = db.prepare('SELECT COUNT(*) as c FROM themes').get();
  if (count.c === 0) {
    const { XO_LOGO_BASE64 } = require('./pages');
    db.prepare(`
      INSERT OR IGNORE INTO themes (id, name, accent_color, bg_color, header_color, logo_base64, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('xo-default', 'XO', '#e87722', '#0e0e10', '#18181b', XO_LOGO_BASE64, 1);
  }
})();

// ── Prepared statements
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
      banners_json = COALESCE(@banners_json, banners_json),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `),
  delete: db.prepare('DELETE FROM previews WHERE id = ?'),
  incrementViews: db.prepare('UPDATE previews SET views = views + 1 WHERE id = ?'),
  updateZuuviUrl: db.prepare('UPDATE previews SET zuuvi_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'),
  updateBannersJson(id, json) {
    db.prepare('UPDATE previews SET banners_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(json, id);
  },
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
      banners_json: fields.banners_json || null,
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

  // ── Hosted Campaigns ──────────────────────────────────────────────────────
  getAllHosted() {
    return db.prepare(`
      SELECT c.*,
        COUNT(f.id) AS format_count_live,
        COALESCE(SUM(f.size_bytes), 0) AS total_size_live,
        COALESCE(SUM(f.file_count), 0) AS total_files_live,
        COALESCE(SUM(f.views), 0) AS total_impressions
      FROM hosted_campaigns c
      LEFT JOIN hosted_formats f ON f.campaign_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `).all();
  },

  getHosted(id) {
    return db.prepare('SELECT * FROM hosted_campaigns WHERE id = ?').get(id);
  },

  createHosted({ id, name, created_by }) {
    return db.prepare('INSERT INTO hosted_campaigns (id, name, created_by) VALUES (?, ?, ?)').run(id, name, created_by);
  },

  updateHosted(id, fields) {
    const sets = [];
    const vals = [];
    for (const [k, v] of Object.entries(fields)) {
      sets.push(`${k} = ?`);
      vals.push(v);
    }
    sets.push('updated_at = CURRENT_TIMESTAMP');
    vals.push(id);
    db.prepare(`UPDATE hosted_campaigns SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
  },

  deleteHosted(id) {
    db.prepare('DELETE FROM hosted_formats WHERE campaign_id = ?').run(id);
    db.prepare('DELETE FROM hosted_campaigns WHERE id = ?').run(id);
  },

  addHostedFormat({ campaign_id, format_name, width, height, r2_prefix, cdn_url, tag_html, size_bytes, file_count, click_url }) {
    return db.prepare(`
      INSERT INTO hosted_formats (campaign_id, format_name, width, height, r2_prefix, cdn_url, tag_html, size_bytes, file_count, click_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(campaign_id, format_name, width, height, r2_prefix, cdn_url, tag_html, size_bytes || 0, file_count || 0, click_url || null);
  },

  incrementFormatViews(formatId) {
    db.prepare('UPDATE hosted_formats SET views = views + 1 WHERE id = ?').run(formatId);
  },

  updateHostedFormatTag(formatId, tagHtml) {
    db.prepare('UPDATE hosted_formats SET tag_html = ? WHERE id = ?').run(tagHtml, formatId);
  },

  updateFormatClickUrl(formatId, clickUrl) {
    db.prepare('UPDATE hosted_formats SET click_url = ? WHERE id = ?').run(clickUrl, formatId);
  },

  getHostedFormats(campaignId) {
    return db.prepare('SELECT * FROM hosted_formats WHERE campaign_id = ? ORDER BY format_name').all(campaignId);
  },

  getHostedFormat(formatId) {
    return db.prepare('SELECT * FROM hosted_formats WHERE id = ?').get(formatId);
  },

  updateHostedFormat(formatId, fields) {
    const sets = [];
    const vals = [];
    for (const [k, v] of Object.entries(fields)) {
      sets.push(`${k} = ?`);
      vals.push(v);
    }
    vals.push(formatId);
    db.prepare(`UPDATE hosted_formats SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
  },

  incrementHostedViews(id) {
    db.prepare('UPDATE hosted_campaigns SET views = views + 1 WHERE id = ?').run(id);
  },

  // ── Themes ────────────────────────────────────────────────────────────────
  getAllThemes() {
    return db.prepare('SELECT * FROM themes ORDER BY is_default DESC, created_at ASC').all();
  },

  getTheme(id) {
    return db.prepare('SELECT * FROM themes WHERE id = ?').get(id);
  },

  createTheme({ id, name, accent_color, bg_color, header_color, logo_base64 }) {
    return db.prepare(`
      INSERT INTO themes (id, name, accent_color, bg_color, header_color, logo_base64, is_default)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `).run(id, name, accent_color, bg_color, header_color, logo_base64 || null);
  },

  deleteTheme(id) {
    const theme = db.prepare('SELECT is_default FROM themes WHERE id = ?').get(id);
    if (!theme || theme.is_default) return false;
    db.prepare('DELETE FROM themes WHERE id = ?').run(id);
    return true;
  },

  setPreviewTheme(previewId, themeId) {
    return db.prepare("UPDATE previews SET theme_id = ? WHERE id = ?").run(themeId, previewId);
  },
};
