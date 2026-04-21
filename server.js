#!/usr/bin/env node
/**
 * XO Preview Platform — Express server
 * Generates XO-branded previews of Zuuvi campaign links
 */

const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('./lib/db');
const { extractBanners } = require('./lib/extractor');
const { generatePreviewHtml } = require('./lib/renderer');
const analytics = require('./lib/analytics');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'xo-preview-dev-secret-change-me';
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const PREVIEWS_DIR = path.join(DATA_DIR, 'previews');
if (!fs.existsSync(PREVIEWS_DIR)) fs.mkdirSync(PREVIEWS_DIR, { recursive: true });

// ── Middleware ─────────────────────────────────────────────────────────────────
app.set('trust proxy', 1);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new SQLiteStore({ dir: DATA_DIR, db: 'sessions.sqlite' }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  }
}));

// Make user available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.baseUrl = BASE_URL;
  next();
});

// ── Auth middleware ────────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

// ── Users (from env or defaults) ──────────────────────────────────────────────
const bcrypt = require('bcryptjs');

function getUsers() {
  // Format: USER_1=email:password,USER_2=email:password
  // Or use defaults for dev
  const defaults = [
    { email: 'jbf@xo.dk', password: 'xopreview2024', name: 'JBF' },
    { email: 'cca@xo.dk', password: 'xopreview2024', name: 'CCA' },
    { email: 'demo@xo.dk', password: 'demo', name: 'Demo' },
  ];

  const users = [];
  // Check env vars
  for (let i = 1; i <= 20; i++) {
    const val = process.env[`USER_${i}`];
    if (val) {
      const [email, password, name] = val.split(':');
      if (email && password) users.push({ email, password, name: name || email.split('@')[0] });
    }
  }
  // Use defaults only if no env users defined
  if (users.length === 0) return defaults;
  return users;
}

// ── Routes: Auth ──────────────────────────────────────────────────────────────
app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.send(renderPage('login', { error: null }, req));
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());

  if (!user || user.password !== password) {
    return res.send(renderPage('login', { error: 'Forkert email eller password' }, req));
  }

  req.session.user = { email: user.email, name: user.name };
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// ── Routes: Dashboard ─────────────────────────────────────────────────────────
app.get('/', requireAuth, (req, res) => {
  const previews = db.getAllPreviews();
  res.send(renderPage('dashboard', { previews }, req));
});

// ── Routes: Create preview ────────────────────────────────────────────────────
app.get('/new', requireAuth, (req, res) => {
  res.send(renderPage('new', { error: null }, req));
});

app.post('/new', requireAuth, async (req, res) => {
  const { url, name } = req.body;

  if (!url || !url.includes('zuuvi')) {
    return res.send(renderPage('new', { error: 'Indtast en gyldig Zuuvi URL' }, req));
  }

  const id = uuidv4().slice(0, 8);
  const campaignName = name || 'Campaign Preview';

  // Create DB entry first (status: generating)
  db.createPreview({
    id,
    name: campaignName,
    zuuvi_url: url,
    status: 'generating',
    created_by: req.session.user.email,
  });

  // Redirect to a "generating" page that polls for completion
  res.redirect(`/generating/${id}`);

  // Start extraction in background
  try {
    console.log(`[${id}] Starting banner extraction from: ${url}`);
    const result = await extractBanners(url);

    // Save banner data as JSON for dynamic rendering
    db.updatePreview(id, {
      name: campaignName,
      status: 'ready',
      banner_count: result.banners.length,
      live_count: result.banners.filter(b => b.html && b.html.length > 100).length,
      banners_json: JSON.stringify(result.banners),
    });

    console.log(`[${id}] Preview ready: ${result.banners.length} banners`);
  } catch (err) {
    console.error(`[${id}] Extraction failed:`, err.message);
    db.updatePreview(id, { status: 'error', error_msg: err.message });
  }
});

// ── Routes: Generating status (poll endpoint) ─────────────────────────────────
app.get('/generating/:id', requireAuth, (req, res) => {
  const preview = db.getPreview(req.params.id);
  if (!preview) return res.status(404).send(renderPage('error', { message: 'Preview ikke fundet' }, req));

  if (preview.status === 'ready') return res.redirect(`/preview/${preview.id}`);
  if (preview.status === 'error') return res.send(renderPage('error', { message: `Fejl: ${preview.error_msg}` }, req));

  res.send(renderPage('generating', { preview }, req));
});

app.get('/api/status/:id', requireAuth, (req, res) => {
  const preview = db.getPreview(req.params.id);
  if (!preview) return res.json({ status: 'not_found' });
  res.json({ status: preview.status, error: preview.error_msg });
});

// ── Routes: Admin dashboard ─────────────────────────────────────────────────────
app.get('/admin', requireAuth, (req, res) => {
  const previews = db.getAllPreviews();
  res.send(renderPage('admin', { previews }, req));
});

// ── Routes: Edit / Re-generate preview ───────────────────────────────────────────
app.post('/edit/:id', requireAuth, async (req, res) => {
  const preview = db.getPreview(req.params.id);
  if (!preview) return res.status(404).send(renderPage('error', { message: 'Preview ikke fundet' }, req));

  const newUrl = (req.body.url || '').trim() || preview.zuuvi_url;
  const newName = (req.body.name || '').trim() || preview.name;

  // Update DB: new URL + name, reset to generating
  db.updatePreview(req.params.id, {
    zuuvi_url: newUrl,
    name: newName,
    status: 'generating',
    banner_count: 0,
    live_count: 0,
    error_msg: null,
  });

  // Redirect to generating page
  res.redirect(`/generating/${req.params.id}`);

  // Start extraction in background
  const id = req.params.id;
  try {
    console.log(`[${id}] Re-generating from: ${newUrl}`);
    const result = await extractBanners(newUrl);

    db.updatePreview(id, {
      name: newName,
      status: 'ready',
      banner_count: result.banners.length,
      live_count: result.banners.filter(b => b.html && b.html.length > 100).length,
      banners_json: JSON.stringify(result.banners),
    });

    console.log(`[${id}] Re-generated: ${result.banners.length} banners`);
  } catch (err) {
    console.error(`[${id}] Re-generation failed:`, err.message);
    db.updatePreview(id, { status: 'error', error_msg: err.message });
  }
});

// ── Routes: View preview (PUBLIC — no auth required) ──────────────────────────
app.get('/preview/:id', (req, res) => {
  const preview = db.getPreview(req.params.id);
  if (!preview || preview.status !== 'ready') {
    return res.status(404).send(renderPage('error', { message: 'Preview ikke fundet eller ikke klar endnu' }, req));
  }

  // Increment view counter (fire-and-forget)
  try { db.incrementViews(preview.id); } catch (_) {}

  // Dynamic rendering — always uses latest template code
  if (preview.banners_json) {
    const banners = JSON.parse(preview.banners_json);
    const html = generatePreviewHtml({
      id: preview.id,
      campaignName: preview.name,
      clientName: '',
      banners,
      zuuviUrl: preview.zuuvi_url,
    });
    return res.send(html);
  }

  // Fallback: serve old static file if banners_json not yet saved
  const htmlPath = path.join(PREVIEWS_DIR, `${preview.id}.html`);
  if (!fs.existsSync(htmlPath)) {
    return res.status(404).send(renderPage('error', { message: 'Preview-fil mangler — re-generer fra Admin' }, req));
  }
  res.sendFile(htmlPath);
});

// ── Routes: Delete preview ────────────────────────────────────────────────────
app.post('/delete/:id', requireAuth, (req, res) => {
  const preview = db.getPreview(req.params.id);
  if (preview) {
    const htmlPath = path.join(PREVIEWS_DIR, `${preview.id}.html`);
    if (fs.existsSync(htmlPath)) fs.unlinkSync(htmlPath);
    db.deletePreview(req.params.id);
  }
  res.redirect('/');
});

// ── Page renderer ─────────────────────────────────────────────────────────────
function renderPage(page, data = {}, req) {
  const pages = require('./lib/pages');
  const user = req.session.user || null;
  return pages[page](data, { user, baseUrl: BASE_URL });
}

// ── Start ─────────────────────────────────────────────────────────────────────
// ── Routes: Hosting ───────────────────────────────────────────────────────────
const multer = require('multer');
const AdmZip = require('adm-zip');
const r2 = require('./lib/r2');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } });

app.get('/hosting', requireAuth, async (req, res) => {
  const campaigns = db.getAllHosted();
  const cdnStats = await analytics.getCampaignStats();
  // Merge CDN stats into campaign data
  for (const c of campaigns) {
    const stats = cdnStats[c.id] || {};
    c.cdn_requests = stats.requests || 0;
    c.cdn_mb_served = stats.mb_served || 0;
  }
  res.send(renderPage('hosting', { campaigns }, req));
});

app.get('/hosting/new', requireAuth, (req, res) => {
  res.send(renderPage('hosting-new', { error: null }, req));
});

app.post('/hosting/upload', requireAuth, upload.single('zipfile'), async (req, res) => {
  if (!r2.isConfigured()) {
    return res.send(renderPage('hosting-new', { error: 'R2 storage not configured. Contact admin.' }, req));
  }
  if (!req.file) {
    return res.send(renderPage('hosting-new', { error: 'Upload a ZIP file.' }, req));
  }

  const campaignName = (req.body.name || '').trim() || 'Unnamed Campaign';
  const id = uuidv4().slice(0, 8);

  db.createHosted({ id, name: campaignName, created_by: req.session.user.email });
  res.redirect(`/hosting/${id}`);

  // Process in background
  try {
    console.log(`[hosting:${id}] Processing upload: ${req.file.originalname} (${(req.file.size / 1024).toFixed(0)} KB)`);
    const zip = new AdmZip(req.file.buffer);
    const entries = zip.getEntries();

    const innerZips = entries.filter(e => e.entryName.endsWith('.zip'));
    const formatPackages = [];

    if (innerZips.length > 0) {
      // ZIP of ZIPs (Zuuvi googleAdManager-display export)
      for (const innerEntry of innerZips) {
        const formatName = path.basename(innerEntry.entryName, '.zip');
        const innerZip = new AdmZip(innerEntry.getData());
        const files = innerZip.getEntries()
          .filter(e => !e.isDirectory)
          .map(e => ({ name: e.entryName, buffer: e.getData() }));
        formatPackages.push({ formatName, files });
      }
    } else {
      // Single banner or grouped by directories
      const groups = {};
      for (const entry of entries) {
        if (entry.isDirectory) continue;
        const parts = entry.entryName.split('/');
        if (parts.some(p => p.startsWith('__') || p.startsWith('.'))) continue;
        let groupName, fileName;
        if (parts.length > 1) { groupName = parts[0]; fileName = parts.slice(1).join('/'); }
        else { groupName = 'default'; fileName = parts[0]; }
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push({ name: fileName, buffer: entry.getData() });
      }
      const groupNames = Object.keys(groups);
      if (groupNames.length === 1 && groups[groupNames[0]].some(f => f.name === 'index.html')) {
        const indexFile = groups[groupNames[0]].find(f => f.name === 'index.html');
        const html = indexFile.buffer.toString('utf8');
        const sizeMatch = html.match(/ad\.size["']?\s*content=["']?width=(\d+),\s*height=(\d+)/i);
        const formatName = sizeMatch ? `${sizeMatch[1]}x${sizeMatch[2]}` : groupNames[0];
        formatPackages.push({ formatName, files: groups[groupNames[0]] });
      } else {
        for (const [groupName, files] of Object.entries(groups)) {
          if (files.some(f => f.name === 'index.html' || f.name.endsWith('/index.html'))) {
            formatPackages.push({ formatName: groupName, files });
          }
        }
      }
    }

    if (formatPackages.length === 0) {
      db.updateHosted(id, { status: 'error', error_msg: 'No valid banner formats found in ZIP' });
      return;
    }

    let totalSizeBytes = 0;
    for (const pkg of formatPackages) {
      const pkgSize = pkg.files.reduce((sum, f) => sum + f.buffer.length, 0);
      totalSizeBytes += pkgSize;
      console.log(`[hosting:${id}] Uploading format: ${pkg.formatName} (${pkg.files.length} files, ${(pkgSize / 1024).toFixed(0)} KB)`);
      const { indexUrl, prefix } = await r2.uploadBannerPackage(id, pkg.formatName, pkg.files);
      let width = 0, height = 0;
      const dimMatch = pkg.formatName.match(/(\d+)x(\d+)/);
      if (dimMatch) { width = parseInt(dimMatch[1]); height = parseInt(dimMatch[2]); }
      // Extract click URL from index.html
      let clickUrl = null;
      const indexFile = pkg.files.find(f => f.name.endsWith('index.html'));
      if (indexFile) {
        const html = indexFile.buffer.toString('utf-8');
        // Try clickTag = "url" pattern first (Zuuvi/GWD standard)
        const ctMatch = html.match(/clickTag\s*=\s*["']([^"']+)["']/);
        if (ctMatch) clickUrl = ctMatch[1];
        // Fallback: look for landing URLs (not asset URLs)
        if (!clickUrl) {
          const urlMatches = html.match(/"(https?:\/\/(?!s0\.2mdn|assets\.zuuvi|cdnjs|fonts)[^"]+)"/g);
          if (urlMatches) {
            for (const m of urlMatches) {
              const url = m.slice(1, -1);
              if (!url.match(/\.(js|css|otf|woff|svg|png|jpg|mp4|gif)$/i)) { clickUrl = url; break; }
            }
          }
        }
      }
      // Clean GAM tag — no external tracking pixels (ad servers reject foreign URLs)
      const tag = `<iframe width="${width}" height="${height}" src="${indexUrl}?cachebuster=%%CACHEBUSTER%%&dfpclick=%%CLICK_URL_ESC%%" frameborder="0" style="border: none" scrolling="no"></iframe>`;
      db.addHostedFormat({ campaign_id: id, format_name: pkg.formatName, width, height, r2_prefix: prefix, cdn_url: indexUrl, tag_html: tag, size_bytes: pkgSize, file_count: pkg.files.length, click_url: clickUrl });
    }

    db.updateHosted(id, { status: 'ready', total_size_bytes: totalSizeBytes, format_count: formatPackages.length });
    console.log(`[hosting:${id}] Ready: ${formatPackages.length} formats, ${(totalSizeBytes / 1024 / 1024).toFixed(1)} MB total`);
  } catch (err) {
    console.error(`[hosting:${id}] Error:`, err.message);
    db.updateHosted(id, { status: 'error', error_msg: err.message });
  }
});

app.get('/hosting/:id', requireAuth, async (req, res) => {
  const campaign = db.getHosted(req.params.id);
  if (!campaign) return res.status(404).send(renderPage('error', { message: 'Hosted campaign not found' }, req));
  const formats = db.getHostedFormats(req.params.id);
  const formatStats = await analytics.getFormatStats(req.params.id);
  // Merge CDN stats into format data
  const statsMap = {};
  for (const s of formatStats) statsMap[s.format] = s;
  for (const f of formats) {
    const s = statsMap[f.format_name] || {};
    f.cdn_requests = s.requests || 0;
    f.cdn_mb_served = s.mb_served || 0;
  }
  res.send(renderPage('hosting-detail', { campaign, formats }, req));
});

// Scan click URLs for a specific campaign (fetch from CDN, parse HTML)
app.post('/hosting/:id/scan-clicks', requireAuth, async (req, res) => {
  const formats = db.getHostedFormats(req.params.id);
  const cdnBase = process.env.CDN_BASE_URL || 'https://cdn.xo.dk';
  for (const f of formats) {
    try {
      const resp = await fetch(`${cdnBase}/hosted/${req.params.id}/${f.format_name}/index.html`);
      if (!resp.ok) continue;
      const html = await resp.text();
      let clickUrl = null;
      const ctMatch = html.match(/clickTag\s*=\s*["']([^"']+)["']/);
      if (ctMatch) clickUrl = ctMatch[1];
      if (!clickUrl) {
        const urlMatches = html.match(/"(https?:\/\/(?!s0\.2mdn|assets\.zuuvi|cdnjs|fonts)[^"]+)"/g);
        if (urlMatches) {
          for (const m of urlMatches) {
            const url = m.slice(1, -1);
            if (!url.match(/\.(js|css|otf|woff|svg|png|jpg|mp4|gif)$/i)) { clickUrl = url; break; }
          }
        }
      }
      if (clickUrl) db.updateFormatClickUrl(f.id, clickUrl);
    } catch (_) {}
  }
  res.redirect(`/hosting/${req.params.id}`);
});

// Update click URL for a format — rewrites the actual index.html on R2
app.post('/hosting/:campaignId/format/:formatId/click-url', requireAuth, async (req, res) => {
  const { campaignId, formatId } = req.params;
  const newClickUrl = (req.body.click_url || '').trim();
  const format = db.getHostedFormats(campaignId).find(f => f.id === parseInt(formatId));
  if (!format) return res.redirect(`/hosting/${campaignId}`);

  // Update DB
  db.updateFormatClickUrl(format.id, newClickUrl || null);

  // Rewrite index.html on R2 if URL changed
  if (newClickUrl && r2.isConfigured()) {
    try {
      const cdnBase = process.env.CDN_BASE_URL || 'https://cdn.xo.dk';
      const resp = await fetch(`${cdnBase}/hosted/${campaignId}/${format.format_name}/index.html`);
      if (resp.ok) {
        let html = await resp.text();
        const oldUrl = format.click_url;
        if (oldUrl && html.includes(oldUrl)) {
          html = html.split(oldUrl).join(newClickUrl);
        } else {
          // Replace clickTag assignment
          html = html.replace(/(clickTag\s*=\s*["'])[^"']*(["'])/, `$1${newClickUrl}$2`);
          // Also replace any window.open URL references
          html = html.replace(/"(https?:\/\/(?!s0\.2mdn|assets\.zuuvi|cdnjs|fonts\.)[^"]+)"/, `"${newClickUrl}"`);
        }
        const key = `hosted/${campaignId}/${format.format_name}/index.html`;
        await r2.uploadFile(key, Buffer.from(html, 'utf-8'), 'text/html');
        console.log(`[hosting] Rewrote click URL in ${key}: ${newClickUrl}`);
      }
    } catch (err) {
      console.error(`[hosting] Error rewriting click URL:`, err.message);
    }
  }
  res.redirect(`/hosting/${campaignId}`);
});

// Internal tracking pixel — NOT included in GAM tags (ad servers reject foreign URLs)
// Can be used manually for internal tracking: /hosting/pixel/:campaignId/:formatId
const PIXEL_GIF = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
app.get('/hosting/pixel/:campaignId/:formatId', (req, res) => {
  try {
    db.incrementFormatViews(parseInt(req.params.formatId));
    db.incrementHostedViews(req.params.campaignId);
  } catch (_) {}
  res.set({ 'Content-Type': 'image/gif', 'Cache-Control': 'no-cache, no-store', 'Expires': '0' });
  res.send(PIXEL_GIF);
});

app.post('/hosting/delete/:id', requireAuth, async (req, res) => {
  const campaign = db.getHosted(req.params.id);
  if (campaign) {
    if (r2.isConfigured()) { try { await r2.deletePrefix(`hosted/${req.params.id}/`); } catch (_) {} }
    db.deleteHosted(req.params.id);
  }
  res.redirect('/hosting');
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 XO Studio running at http://localhost:${PORT}\n`);
});
