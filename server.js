#!/usr/bin/env node
/**
 * XO Preview Platform — Express server
 * Generates XO-branded previews of Zuuvi campaign links
 */

const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
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

// ── Security middleware ────────────────────────────────────────────────────────
app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com", "https://assets.zuuvi.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      frameSrc: ["'self'", "https:"],
      connectSrc: ["'self'", "https:"],
    },
  },
}));

// Rate limiting on login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'For mange loginforsøg — prøv igen om 15 minutter.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Middleware ─────────────────────────────────────────────────────────────────
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
  // Format: USER_1=email:bcrypt_hash:name
  // Or use hashed defaults for dev
  const defaults = [
    { email: 'jbf@xo.dk', hashedPassword: '$2a$10$yaLqU6uksyyst1JKQoWE4OgDebpGULiDBNrRqE7.fNv9WnwgEjzcK', name: 'JBF' },
    { email: 'cca@xo.dk', hashedPassword: '$2a$10$486kUMYZdf/GOUWinakVIeMmomP6FO3xE6RbfqbZZJjavTE9K/yty', name: 'CCA' },
  ];

  const users = [];
  // Check env vars (format: email:bcrypt_hash:name)
  for (let i = 1; i <= 20; i++) {
    const val = process.env[`USER_${i}`];
    if (val) {
      // Split on first two colons only (bcrypt hashes contain $)
      const firstColon = val.indexOf(':');
      if (firstColon === -1) continue;
      const email = val.slice(0, firstColon);
      const rest = val.slice(firstColon + 1);
      // Find the last colon for the name (bcrypt hash is between)
      const lastColon = rest.lastIndexOf(':');
      let hashedPassword, name;
      if (lastColon > 0 && rest[lastColon - 1] !== '$') {
        hashedPassword = rest.slice(0, lastColon);
        name = rest.slice(lastColon + 1);
      } else {
        hashedPassword = rest;
        name = email.split('@')[0];
      }
      if (email && hashedPassword) users.push({ email, hashedPassword, name });
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

app.post('/login', loginLimiter, (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());

  if (!user || !bcrypt.compareSync(password || '', user.hashedPassword)) {
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
    c.cdn_impressions = stats.impressions || 0;
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
    f.cdn_impressions = s.impressions || 0;
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

// ── Routes: Hosting Replace/Update ────────────────────────────────────────────

// Temp storage for upload data between validation and confirmation
const replaceTempStore = new Map();

// Helper: parse ZIP into format packages (same logic as /hosting/upload)
function parseZipToFormats(zipBuffer) {
  const zip = new AdmZip(zipBuffer);
  const entries = zip.getEntries();
  const innerZips = entries.filter(e => e.entryName.endsWith('.zip'));
  const formatPackages = [];

  if (innerZips.length > 0) {
    for (const innerEntry of innerZips) {
      const formatName = path.basename(innerEntry.entryName, '.zip');
      const innerZip = new AdmZip(innerEntry.getData());
      const files = innerZip.getEntries()
        .filter(e => !e.isDirectory)
        .map(e => ({ name: e.entryName, buffer: e.getData() }));
      formatPackages.push({ formatName, files });
    }
  } else {
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
  return formatPackages;
}

// Helper: parse meta tags from HTML
function parseMeta(html) {
  const result = {};
  const templateMatch = html.match(/<meta[^>]*name=["']?zuuvi-template-id["']?[^>]*content=["']?([^"'\s>]+)/i);
  if (templateMatch) result.templateId = templateMatch[1];
  const bannerMatch = html.match(/<meta[^>]*name=["']?zuuvi-banner-id["']?[^>]*content=["']?([^"'\s>]+)/i);
  if (bannerMatch) result.bannerId = bannerMatch[1];
  const sizeMatch = html.match(/<meta[^>]*name=["']?ad\.size["']?[^>]*content=["']?width=(\d+),\s*height=(\d+)/i);
  if (sizeMatch) { result.adWidth = parseInt(sizeMatch[1]); result.adHeight = parseInt(sizeMatch[2]); }
  return result;
}

// Helper: extract click URL from HTML
function parseClickUrl(html) {
  const ctMatch = html.match(/clickTag\s*=\s*["']([^"']+)["']/);
  if (ctMatch) return ctMatch[1];
  const urlMatches = html.match(/"(https?:\/\/(?!s0\.2mdn|assets\.zuuvi|cdnjs|fonts)[^"]+)"/g);
  if (urlMatches) {
    for (const m of urlMatches) {
      const url = m.slice(1, -1);
      if (!url.match(/\.(js|css|otf|woff|svg|png|jpg|mp4|gif)$/i)) return url;
    }
  }
  return null;
}

// Campaign-level replace: show form
app.get('/hosting/:id/replace', requireAuth, (req, res) => {
  const campaign = db.getHosted(req.params.id);
  if (!campaign) return res.status(404).send(renderPage('error', { message: 'Campaign ikke fundet' }, req));
  res.send(renderPage('hosting-replace', { campaign, format: null, error: null }, req));
});

// Campaign-level replace: process upload → validate → show confirmation
app.post('/hosting/:id/replace', requireAuth, upload.single('zipfile'), async (req, res) => {
  const campaign = db.getHosted(req.params.id);
  if (!campaign) return res.status(404).send(renderPage('error', { message: 'Campaign ikke fundet' }, req));
  if (!req.file) return res.send(renderPage('hosting-replace', { campaign, format: null, error: 'Upload en ZIP fil.' }, req));
  if (!r2.isConfigured()) return res.send(renderPage('hosting-replace', { campaign, format: null, error: 'R2 storage ikke konfigureret.' }, req));

  try {
    const formatPackages = parseZipToFormats(req.file.buffer);
    if (formatPackages.length === 0) {
      return res.send(renderPage('hosting-replace', { campaign, format: null, error: 'Ingen gyldige banner formater fundet i ZIP.' }, req));
    }

    const existingFormats = db.getHostedFormats(req.params.id);
    const existingNames = existingFormats.map(f => f.format_name);
    const newNames = formatPackages.map(p => p.formatName);

    const warnings = [];
    const matchedFormats = [];
    const newFormats = [];
    const missingFormats = [];

    // Check format count
    if (newNames.length !== existingNames.length) {
      warnings.push(`Antal formater ændret: ${existingNames.length} eksisterende → ${newNames.length} i ny ZIP`);
    }

    // Categorize formats
    for (const name of newNames) {
      if (existingNames.includes(name)) matchedFormats.push(name);
      else newFormats.push(name);
    }
    for (const name of existingNames) {
      if (!newNames.includes(name)) missingFormats.push(name);
    }

    // Dimension & meta validation for matched formats
    const cdnBase = process.env.CDN_BASE_URL || 'https://cdn.xo.dk';
    for (const pkg of formatPackages) {
      const existingFmt = existingFormats.find(f => f.format_name === pkg.formatName);
      if (!existingFmt) continue;

      const newIndex = pkg.files.find(f => f.name === 'index.html' || f.name.endsWith('/index.html'));
      if (!newIndex) continue;
      const newHtml = newIndex.buffer.toString('utf-8');
      const newMeta = parseMeta(newHtml);

      // Check ad.size vs format dimensions
      if (newMeta.adWidth && newMeta.adHeight) {
        if (newMeta.adWidth !== existingFmt.width || newMeta.adHeight !== existingFmt.height) {
          warnings.push(`${pkg.formatName}: ad.size (${newMeta.adWidth}x${newMeta.adHeight}) matcher ikke eksisterende (${existingFmt.width}x${existingFmt.height})`);
        }
      }

      // Fetch old index.html for template/banner ID comparison
      try {
        const resp = await fetch(`${cdnBase}/hosted/${campaign.id}/${pkg.formatName}/index.html`);
        if (resp.ok) {
          const oldHtml = await resp.text();
          const oldMeta = parseMeta(oldHtml);
          if (oldMeta.templateId && newMeta.templateId && oldMeta.templateId !== newMeta.templateId) {
            warnings.push(`${pkg.formatName}: Denne banner er fra en anden Zuuvi template (${oldMeta.templateId} → ${newMeta.templateId})`);
          }
          if (oldMeta.bannerId && newMeta.bannerId && oldMeta.bannerId !== newMeta.bannerId) {
            warnings.push(`${pkg.formatName}: Banner ID ændret (${oldMeta.bannerId} → ${newMeta.bannerId})`);
          }
        }
      } catch (_) { /* CDN fetch failed, skip comparison */ }
    }

    // New formats that don't match existing dimensions
    for (const name of newFormats) {
      warnings.push(`Nyt format: ${name} findes ikke i den eksisterende kampagne — vil blive tilføjet`);
    }

    // Store temp data
    const tempKey = require('crypto').randomUUID();
    replaceTempStore.set(tempKey, {
      campaignId: campaign.id,
      formatPackages,
      matchedFormats,
      newFormats,
      missingFormats,
      createdAt: Date.now(),
    });
    // Auto-clean after 15 min
    setTimeout(() => replaceTempStore.delete(tempKey), 15 * 60 * 1000);

    res.send(renderPage('hosting-replace-confirm', {
      campaign, format: null, warnings, newFormats, missingFormats, matchedFormats, tempKey
    }, req));
  } catch (err) {
    console.error(`[hosting:replace] Error:`, err.message);
    res.send(renderPage('hosting-replace', { campaign, format: null, error: `Fejl: ${err.message}` }, req));
  }
});

// Campaign-level replace: execute confirmed replacement
app.post('/hosting/:id/replace/confirm', requireAuth, async (req, res) => {
  const campaign = db.getHosted(req.params.id);
  if (!campaign) return res.status(404).send(renderPage('error', { message: 'Campaign ikke fundet' }, req));

  const tempData = replaceTempStore.get(req.body.tempKey);
  if (!tempData || tempData.campaignId !== campaign.id) {
    return res.send(renderPage('error', { message: 'Upload-data udløbet. Upload venligst igen.' }, req));
  }
  replaceTempStore.delete(req.body.tempKey);

  const existingFormats = db.getHostedFormats(campaign.id);

  try {
    let totalSizeBytes = 0;
    let totalFormats = existingFormats.length;

    for (const pkg of tempData.formatPackages) {
      const pkgSize = pkg.files.reduce((sum, f) => sum + f.buffer.length, 0);
      totalSizeBytes += pkgSize;
      const existingFmt = existingFormats.find(f => f.format_name === pkg.formatName);

      // Delete old files and upload new ones
      console.log(`[hosting:${campaign.id}] Replacing format: ${pkg.formatName}`);
      await r2.deletePrefix(`hosted/${campaign.id}/${pkg.formatName}/`);
      const { indexUrl, prefix } = await r2.uploadBannerPackage(campaign.id, pkg.formatName, pkg.files);

      // Parse new click URL
      let clickUrl = null;
      const indexFile = pkg.files.find(f => f.name.endsWith('index.html'));
      if (indexFile) clickUrl = parseClickUrl(indexFile.buffer.toString('utf-8'));

      // Parse dimensions
      let width = 0, height = 0;
      const dimMatch = pkg.formatName.match(/(\d+)x(\d+)/);
      if (dimMatch) { width = parseInt(dimMatch[1]); height = parseInt(dimMatch[2]); }

      if (existingFmt) {
        // Update existing format
        db.updateHostedFormat(existingFmt.id, {
          size_bytes: pkgSize,
          file_count: pkg.files.length,
          click_url: clickUrl,
        });
      } else {
        // Add new format
        const tag = `<iframe width="${width}" height="${height}" src="${indexUrl}?cachebuster=%%CACHEBUSTER%%&dfpclick=%%CLICK_URL_ESC%%" frameborder="0" style="border: none" scrolling="no"></iframe>`;
        db.addHostedFormat({
          campaign_id: campaign.id,
          format_name: pkg.formatName,
          width, height,
          r2_prefix: prefix,
          cdn_url: indexUrl,
          tag_html: tag,
          size_bytes: pkgSize,
          file_count: pkg.files.length,
          click_url: clickUrl,
        });
        totalFormats++;
      }
    }

    // Add back size of non-replaced formats
    for (const ef of existingFormats) {
      if (!tempData.formatPackages.find(p => p.formatName === ef.format_name)) {
        totalSizeBytes += ef.size_bytes || 0;
      }
    }

    db.updateHosted(campaign.id, {
      total_size_bytes: totalSizeBytes,
      format_count: totalFormats,
      status: 'ready',
    });

    console.log(`[hosting:${campaign.id}] Campaign replace done: ${tempData.formatPackages.length} formats replaced`);
    res.redirect(`/hosting/${campaign.id}`);
  } catch (err) {
    console.error(`[hosting:${campaign.id}] Replace error:`, err.message);
    res.send(renderPage('error', { message: `Fejl under opdatering: ${err.message}` }, req));
  }
});

// Format-level replace: show form
app.get('/hosting/:id/format/:formatId/replace', requireAuth, (req, res) => {
  const campaign = db.getHosted(req.params.id);
  if (!campaign) return res.status(404).send(renderPage('error', { message: 'Campaign ikke fundet' }, req));
  const format = db.getHostedFormat(parseInt(req.params.formatId));
  if (!format || format.campaign_id !== campaign.id) return res.status(404).send(renderPage('error', { message: 'Format ikke fundet' }, req));
  res.send(renderPage('hosting-replace', { campaign, format, error: null }, req));
});

// Format-level replace: process upload → validate → show confirmation
app.post('/hosting/:id/format/:formatId/replace', requireAuth, upload.single('zipfile'), async (req, res) => {
  const campaign = db.getHosted(req.params.id);
  if (!campaign) return res.status(404).send(renderPage('error', { message: 'Campaign ikke fundet' }, req));
  const format = db.getHostedFormat(parseInt(req.params.formatId));
  if (!format || format.campaign_id !== campaign.id) return res.status(404).send(renderPage('error', { message: 'Format ikke fundet' }, req));
  if (!req.file) return res.send(renderPage('hosting-replace', { campaign, format, error: 'Upload en ZIP fil.' }, req));
  if (!r2.isConfigured()) return res.send(renderPage('hosting-replace', { campaign, format, error: 'R2 storage ikke konfigureret.' }, req));

  try {
    const formatPackages = parseZipToFormats(req.file.buffer);

    // For single format: use first format found, or the one matching format_name
    let pkg = formatPackages.find(p => p.formatName === format.format_name) || formatPackages[0];
    if (!pkg) {
      return res.send(renderPage('hosting-replace', { campaign, format, error: 'Ingen gyldige banner formater fundet i ZIP.' }, req));
    }

    const warnings = [];

    // If ZIP contains multiple formats, warn
    if (formatPackages.length > 1) {
      warnings.push(`ZIP indeholder ${formatPackages.length} formater — kun ${pkg.formatName} bruges til erstatning af ${format.format_name}`);
    }

    const newIndex = pkg.files.find(f => f.name === 'index.html' || f.name.endsWith('/index.html'));
    if (newIndex) {
      const newHtml = newIndex.buffer.toString('utf-8');
      const newMeta = parseMeta(newHtml);

      // Check ad.size
      if (newMeta.adWidth && newMeta.adHeight) {
        if (newMeta.adWidth !== format.width || newMeta.adHeight !== format.height) {
          warnings.push(`ad.size (${newMeta.adWidth}x${newMeta.adHeight}) matcher ikke eksisterende (${format.width}x${format.height})`);
        }
      }

      // Dimension from format name
      const dimMatch = pkg.formatName.match(/(\d+)x(\d+)/);
      if (dimMatch) {
        const pw = parseInt(dimMatch[1]), ph = parseInt(dimMatch[2]);
        if (pw !== format.width || ph !== format.height) {
          warnings.push(`Format dimensioner (${pw}x${ph}) matcher ikke eksisterende (${format.width}x${format.height})`);
        }
      }

      // Fetch old for template/banner ID comparison
      const cdnBase = process.env.CDN_BASE_URL || 'https://cdn.xo.dk';
      try {
        const resp = await fetch(`${cdnBase}/hosted/${campaign.id}/${format.format_name}/index.html`);
        if (resp.ok) {
          const oldHtml = await resp.text();
          const oldMeta = parseMeta(oldHtml);
          if (oldMeta.templateId && newMeta.templateId && oldMeta.templateId !== newMeta.templateId) {
            warnings.push(`Denne banner er fra en anden Zuuvi template (${oldMeta.templateId} → ${newMeta.templateId})`);
          }
          if (oldMeta.bannerId && newMeta.bannerId && oldMeta.bannerId !== newMeta.bannerId) {
            warnings.push(`Banner ID ændret (${oldMeta.bannerId} → ${newMeta.bannerId})`);
          }
        }
      } catch (_) {}
    }

    // Store temp data
    const tempKey = require('crypto').randomUUID();
    replaceTempStore.set(tempKey, {
      campaignId: campaign.id,
      formatId: format.id,
      pkg,
      createdAt: Date.now(),
    });
    setTimeout(() => replaceTempStore.delete(tempKey), 15 * 60 * 1000);

    res.send(renderPage('hosting-replace-confirm', {
      campaign, format, warnings, newFormats: [], missingFormats: [], matchedFormats: [format.format_name], tempKey
    }, req));
  } catch (err) {
    console.error(`[hosting:format-replace] Error:`, err.message);
    res.send(renderPage('hosting-replace', { campaign, format, error: `Fejl: ${err.message}` }, req));
  }
});

// Format-level replace: execute confirmed replacement
app.post('/hosting/:id/format/:formatId/replace/confirm', requireAuth, async (req, res) => {
  const campaign = db.getHosted(req.params.id);
  if (!campaign) return res.status(404).send(renderPage('error', { message: 'Campaign ikke fundet' }, req));
  const format = db.getHostedFormat(parseInt(req.params.formatId));
  if (!format || format.campaign_id !== campaign.id) return res.status(404).send(renderPage('error', { message: 'Format ikke fundet' }, req));

  const tempData = replaceTempStore.get(req.body.tempKey);
  if (!tempData || tempData.campaignId !== campaign.id || tempData.formatId !== format.id) {
    return res.send(renderPage('error', { message: 'Upload-data udløbet. Upload venligst igen.' }, req));
  }
  replaceTempStore.delete(req.body.tempKey);

  try {
    const pkg = tempData.pkg;
    const pkgSize = pkg.files.reduce((sum, f) => sum + f.buffer.length, 0);

    console.log(`[hosting:${campaign.id}] Replacing format: ${format.format_name}`);
    await r2.deletePrefix(`hosted/${campaign.id}/${format.format_name}/`);
    await r2.uploadBannerPackage(campaign.id, format.format_name, pkg.files);

    // Parse new click URL
    let clickUrl = null;
    const indexFile = pkg.files.find(f => f.name.endsWith('index.html'));
    if (indexFile) clickUrl = parseClickUrl(indexFile.buffer.toString('utf-8'));

    db.updateHostedFormat(format.id, {
      size_bytes: pkgSize,
      file_count: pkg.files.length,
      click_url: clickUrl,
    });

    // Recalculate campaign total size
    const allFormats = db.getHostedFormats(campaign.id);
    const totalSize = allFormats.reduce((sum, f) => sum + (f.id === format.id ? pkgSize : (f.size_bytes || 0)), 0);
    db.updateHosted(campaign.id, { total_size_bytes: totalSize });

    console.log(`[hosting:${campaign.id}] Format replace done: ${format.format_name}`);
    res.redirect(`/hosting/${campaign.id}`);
  } catch (err) {
    console.error(`[hosting:${campaign.id}] Format replace error:`, err.message);
    res.send(renderPage('error', { message: `Fejl under opdatering: ${err.message}` }, req));
  }
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
