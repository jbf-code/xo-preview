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
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'xo-preview-dev-secret-change-me';
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.set('trust proxy', 1);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new SQLiteStore({ dir: path.join(__dirname, 'data'), db: 'sessions.sqlite' }),
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
  res.send(renderPage('login', { error: null }));
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());

  if (!user || user.password !== password) {
    return res.send(renderPage('login', { error: 'Forkert email eller password' }));
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
  res.send(renderPage('dashboard', { previews }));
});

// ── Routes: Create preview ────────────────────────────────────────────────────
app.get('/new', requireAuth, (req, res) => {
  res.send(renderPage('new', { error: null }));
});

app.post('/new', requireAuth, async (req, res) => {
  const { url, name } = req.body;

  if (!url || !url.includes('zuuvi')) {
    return res.send(renderPage('new', { error: 'Indtast en gyldig Zuuvi URL' }));
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

    // Generate HTML
    const html = generatePreviewHtml({
      id,
      campaignName: result.campaignName || campaignName,
      clientName: result.clientName || '',
      banners: result.banners,
      zuuviUrl: url,
    });

    // Save HTML to disk
    const previewDir = path.join(__dirname, 'previews');
    if (!fs.existsSync(previewDir)) fs.mkdirSync(previewDir, { recursive: true });
    fs.writeFileSync(path.join(previewDir, `${id}.html`), html);

    // Update DB
    db.updatePreview(id, {
      name: result.campaignName || campaignName,
      status: 'ready',
      banner_count: result.banners.length,
      live_count: result.banners.filter(b => b.html && b.html.length > 100).length,
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
  if (!preview) return res.status(404).send(renderPage('error', { message: 'Preview ikke fundet' }));

  if (preview.status === 'ready') return res.redirect(`/preview/${preview.id}`);
  if (preview.status === 'error') return res.send(renderPage('error', { message: `Fejl: ${preview.error_msg}` }));

  res.send(renderPage('generating', { preview }));
});

app.get('/api/status/:id', requireAuth, (req, res) => {
  const preview = db.getPreview(req.params.id);
  if (!preview) return res.json({ status: 'not_found' });
  res.json({ status: preview.status, error: preview.error_msg });
});

// ── Routes: Admin dashboard ─────────────────────────────────────────────────────
app.get('/admin', requireAuth, (req, res) => {
  const previews = db.getAllPreviews();
  res.send(renderPage('admin', { previews }));
});

// ── Routes: Edit / Re-generate preview ───────────────────────────────────────────
app.post('/edit/:id', requireAuth, async (req, res) => {
  const preview = db.getPreview(req.params.id);
  if (!preview) return res.status(404).send(renderPage('error', { message: 'Preview ikke fundet' }));

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

    const html = generatePreviewHtml({
      id,
      campaignName: result.campaignName || newName,
      clientName: result.clientName || '',
      banners: result.banners,
      zuuviUrl: newUrl,
    });

    const previewDir = path.join(__dirname, 'previews');
    if (!fs.existsSync(previewDir)) fs.mkdirSync(previewDir, { recursive: true });
    fs.writeFileSync(path.join(previewDir, `${id}.html`), html);

    db.updatePreview(id, {
      name: result.campaignName || newName,
      status: 'ready',
      banner_count: result.banners.length,
      live_count: result.banners.filter(b => b.html && b.html.length > 100).length,
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
    return res.status(404).send(renderPage('error', { message: 'Preview ikke fundet eller ikke klar endnu' }));
  }

  const htmlPath = path.join(__dirname, 'previews', `${preview.id}.html`);
  if (!fs.existsSync(htmlPath)) {
    return res.status(404).send(renderPage('error', { message: 'Preview-fil mangler' }));
  }

  // Increment view counter (fire-and-forget)
  try { db.incrementViews(preview.id); } catch (_) {}

  res.sendFile(htmlPath);
});

// ── Routes: Delete preview ────────────────────────────────────────────────────
app.post('/delete/:id', requireAuth, (req, res) => {
  const preview = db.getPreview(req.params.id);
  if (preview) {
    const htmlPath = path.join(__dirname, 'previews', `${preview.id}.html`);
    if (fs.existsSync(htmlPath)) fs.unlinkSync(htmlPath);
    db.deletePreview(req.params.id);
  }
  res.redirect('/');
});

// ── Page renderer ─────────────────────────────────────────────────────────────
function renderPage(page, data = {}) {
  const pages = require('./lib/pages');
  return pages[page](data, { user: data.user || null, baseUrl: BASE_URL });
}

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 XO Preview Platform running at http://localhost:${PORT}\n`);
});
