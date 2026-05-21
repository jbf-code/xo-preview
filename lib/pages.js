/**
 * Page templates — inline HTML for the web platform UI
 * All pages use XO dark theme branding
 */

const XO_LOGO_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODQiIGhlaWdodD0iNDYiIHZpZXdCb3g9IjEwNSAzMTUgMzkwIDIxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBhcmlhLWxhYmVsPSJYTyAzNjAgR3JhcGhpY3MiPgogICAgICA8c3R5bGU+LnN0MHtmaWxsOiNmZmZ9LnN0MXtmaWxsOiNGRjU4MDB9PC9zdHlsZT4KICAgICAgPGc+CiAgICAgICAgPHBhdGggY2xhc3M9InN0MSIgZD0iTTE1MS41LDQxNS4ybC00My42LTY2LjZ2LTI5LjdoMTcuOHM0MS40LDYyLjcsNDEuNCw2Mi43bC0uMiwzMy41aC0xNS40Wk0xNjYuOSw0MjYuNXYzMy40Yy0uMSwwLTQxLjIsNjIuNS00MS4yLDYyLjVoLTE3LjhjMCwuMSwwLTI5LjUsMC0yOS41bDQzLjYtNjYuM2gxNS40Wk0xOTMuNyw0MjYuNWw0Myw2Ni4zdjI5LjdsLTE3LjcuMi00MC44LTYyLjl2LTMzLjJoMTUuNVpNMTc4LjMsNDE1LjJ2LTMzLjRzNDAuOS02Mi44LDQwLjktNjIuOGgxNy41djI5LjdsLTQzLDY2LjZoLTE1LjRaIj48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9InN0MSIgZD0iTTI4Ny4zLDM5NmwtMTguOSwxOS4yLTExLjMtMTEuNnYtNDguNmwxNS4xLTE1LjEsMTUuMSwxNS4xdjQxWk0yNTcsNDg2LjRsMTUuMSwxNS4xLDE1LjEtMTUuMXYtNDFsLTE4LjktMTguOS0xMS4zLDExLjN2NDguNlpNMzY1LjIsMzMzLjlsLTE1LjEsMTUuM2gtNTdsLTE1LjEtMTUuMywxNS4xLTE1aDU3bDE1LjEsMTVaTTI5My4xLDUyMi41bC0xNS4xLTE1LjEsMTUuMS0xNS4xaDU3bDE1LjEsMTUuMS0xNS4xLDE1LjFoLTU3Wk0zODUuOCw0MDMuNmwtMTEuMywxMS42LTE4LjktMTkuMnYtNDFsMTUuMS0xNS4xLDE1LjEsMTUuMXY0OC42Wk0zODUuOCw0ODYuNGwtMTUuMSwxNS4xLTE1LjEtMTUuMXYtNDFsMTguOS0xOC45LDExLjMsMTEuM3Y0OC42WiI+PC9wYXRoPgogICAgICA8L2c+CiAgICAgIDxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00NDguOCwzNjYuOGMtMy42LDcuOS0xMC42LDExLjItMTguOCwxMS4yLTE0LjIsMC0yNC05LjItMjQtMjguNnM2LjYtMjUuOSwxOC42LTMwYzIuNy0xLDMuOS0uMyw0LjksMi4zbDIuMSw2YzEsMi43LjMsMy45LTIuMyw0LjktNi45LDIuNC0xMC4zLDYuMS0xMC4zLDE2LjhzNC4zLDE0LDExLjQsMTQsMTEuMS0zLjksMTEuMS0xMS42di0xMS42YzAtMi44LjktMy44LDMuOC0zLjhoNWMyLjksMCwzLjgsMSwzLjgsMy44djkuNmMwLDcsNCwxMS43LDEwLjUsMTEuN3MxMC43LTQuMywxMC43LTEyLjUtMy4yLTEzLjQtMTAuMS0xNS44Yy0yLjgtMS0zLjEtMi4xLTIuMy00LjlsMi4xLTZjMS0yLjcsMi4yLTMuMyw0LjktMi4zLDEyLDQuMSwxOC41LDEyLjYsMTguNSwyOS4zcy04LjUsMjYuMy0yMi41LDI2LjMtMTMuNC0yLjgtMTYuOC04LjhaIj48L3BhdGg+CiAgICAgIDxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00NTYuNCw0MjIuMWMwLDE5LjYtOC4zLDI4LjktMjUsMjguOXMtMjUuNC0xMS4yLTI1LjQtMzAsMTEuMS0yOS45LDI4LjktMjkuOWgyNC4xYzE4LjEsMCwyOSwxMC41LDI5LDI5LjlzLTYuMywyNC41LTE3LjYsMjguOGMtMi43LDEtMy44LjMtNC45LTIuM2wtMi4xLTUuOWMtMS4xLTIuNy0uNC0zLjgsMi4zLTQuOSw2LTIuNCw5LjItNy4zLDkuMi0xNS43cy01LjUtMTYtMTUuOS0xNmgtNC45Yy45LDMsMi4xLDguNiwyLjEsMTcuMVpNNDE5LDQyMS4xYzAsMTAuMyw0LjMsMTYsMTIuNCwxNnMxMi40LTQuNSwxMi40LTE1LjktMS44LTE0LjYtMi42LTE2LjFoLTYuM2MtMTAuMiwwLTE1LjgsNS42LTE1LjgsMTZaIj48L3BhdGg+CiAgICAgIDxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00ODguMSw0OTMuMWMwLDE4LjctMTAuMywyOS40LTI2LjcsMjkuNGgtMjguNmMtMTYuNSwwLTI2LjgtMTAuNy0yNi44LTI5LjRzMTAuNC0yOS41LDI2LjgtMjkuNWgyOC42YzE2LjQsMCwyNi43LDEwLjgsMjYuNywyOS41Wk00NzUuMSw0OTMuMmMwLTkuOS00LjktMTUuNi0xMy43LTE1LjZoLTI4LjZjLTguOCwwLTEzLjgsNS43LTEzLjgsMTUuNnM1LDE1LjQsMTMuOCwxNS40aDI4LjZjOC44LDAsMTMuNy01LjcsMTMuNy0xNS40WiI+PC9wYXRoPgogICAgPC9zdmc+';

function escHtml(s) { return s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : ''; }

/**
 * Shared header CSS — used by both shell() and renderer.js
 */
function getSharedHeaderCSS() {
  return `
  .topbar {
    height: 90px; background: var(--header-bg, var(--surface)); border-bottom: 1px solid var(--border); overflow: visible;
    display: flex; align-items: center; padding: 0 24px; gap: 16px;
  }
  .topbar-logo { display: flex; align-items: center; text-decoration: none; flex-shrink: 0; overflow: visible; z-index: 10; }
  .topbar-logo img { height: 65px; }
  .topbar-sep { width: 1px; height: 24px; background: var(--border); margin: 0 4px; flex-shrink: 0; }
  .topbar-title { font-size: 14px; color: var(--text-2); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
  .topbar-spacer { flex: 1; }
  .topbar-stats { display: flex; gap: 10px; align-items: center; flex-shrink: 0; }
  .topbar-nav { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
  .topbar-nav a { font-size: 13px; font-weight: 500; color: var(--text-2); padding: 6px 12px; border-radius: var(--radius); text-decoration: none; transition: all 0.15s; }
  .topbar-nav a:hover { background: var(--surface2); color: var(--text); }
  .topbar-nav a.active { background: var(--accent-dim); color: var(--accent); }
  .topbar-user { font-size: 12px; color: var(--text-3); white-space: nowrap; flex-shrink: 0; }
  .topbar-user a { color: var(--text-3); margin-left: 8px; text-decoration: none; }
  .topbar-user a:hover { color: var(--accent); }
  .topbar-login { font-size: 13px; font-weight: 500; color: var(--text-2); text-decoration: none; padding: 6px 14px; border-radius: var(--radius); border: 1px solid var(--border2); flex-shrink: 0; transition: all 0.15s; }
  .topbar-login:hover { background: var(--surface2); color: var(--text); }
  .stat-pill {
    display: flex; align-items: center; gap: 6px; background: var(--surface2);
    border: 1px solid var(--border); border-radius: 20px; padding: 4px 12px;
    font-size: 12px; font-weight: 500; color: var(--text-2);
  }
  .stat-pill .count { color: var(--accent); font-weight: 700; }
  .shared-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--accent-dim); border: 1px solid var(--accent); border-radius: 20px; padding: 4px 14px; font-size: 11px; color: var(--accent-2); font-weight: 600; text-decoration: none; }
  @media (max-width: 600px) {
    .topbar { padding: 0 12px; gap: 6px; height: 56px; }
    .topbar-logo img { height: 40px; }
    .topbar-stats { display: none; }
    .topbar-sep { display: none; }
    .topbar-nav { gap: 0; }
    .topbar-nav a { padding: 4px 6px; font-size: 11px; }
    .topbar-title { display: none; }
    .topbar-user { font-size: 11px; }
  }`;
}

/**
 * Shared header HTML
 * @param {Object} options
 * @param {Object|null} options.user - Current user or null
 * @param {string} options.title - Header title ("XO Studio" or campaign name)
 * @param {boolean} options.showNav - Show Previews/Admin nav links (defaults to !!user)
 * @param {boolean} options.showAuth - Show login/logout section (defaults to true)
 * @param {string} options.stats - Optional HTML for stat pills
 * @param {string} options.activePage - 'previews' | 'admin' for active nav highlight
 */
function sharedHeader({ user = null, title = 'XO Studio', showNav, showAuth = true, stats = '', activePage = '', logoSrc = null } = {}) {
  const shouldShowNav = showNav !== undefined ? showNav : !!user;

  const navHtml = (user && shouldShowNav) ? `
  <nav class="topbar-nav">
    <a href="/"${activePage === 'previews' ? ' class="active"' : ''}>Previews</a>
    <a href="/hosting"${activePage === 'hosting' ? ' class="active"' : ''}>Hosting</a>
    <a href="/monitor"${activePage === 'monitor' ? ' class="active"' : ''}>Monitor</a>
    <a href="/settings"${activePage === 'settings' ? ' class="active"' : ''}>Indstillinger</a>
  </nav>
  <div class="topbar-sep"></div>` : '';

  const authHtml = showAuth
    ? (user
        ? `<div class="topbar-user">${escHtml(user.name || user.email)} · <a href="/logout">Log ud</a></div>`
        : `<a href="/login" class="topbar-login">Log ind</a>`)
    : '';

  return `<div class="topbar">
  <a href="https://xo.dk" target="_blank" class="topbar-logo">
    <img src="${logoSrc || XO_LOGO_BASE64}" alt="XO">
  </a>
  <div class="topbar-sep"></div>
  <div class="topbar-title">${escHtml(title)}</div>
  <div class="topbar-spacer"></div>
  ${stats ? `<div class="topbar-stats">${stats}</div>` : ''}
  ${stats && navHtml ? '<div class="topbar-sep"></div>' : ''}
  ${navHtml}
  ${authHtml}
</div>`;
}

function shell(title, body, opts = {}) {
  const { user, ...headerOpts } = opts;
  const finalHeaderOpts = {
    user: user || null,
    title: headerOpts.headerTitle || 'XO Studio',
    showAuth: headerOpts.showAuth !== undefined ? headerOpts.showAuth : true,
    ...headerOpts
  };

  return `<!DOCTYPE html>
<html lang="da">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escHtml(title)} — XO Studio</title>
<link rel="icon" type="image/png" href="${XO_LOGO_BASE64}">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0c1a28; --surface: #142233; --surface2: #1a2d40; --surface3: #213548;
    --border: #2a2a2a; --border2: #333; --text: #e8e8e8; --text-2: #aaa; --text-3: #666;
    --accent: #FF5800; --accent-2: #FF7A33; --accent-dim: #331500;
    --font: system-ui, -apple-system, 'Inter', 'Segoe UI', sans-serif;
    --mono: 'SF Mono', 'Fira Code', ui-monospace, monospace;
    --radius: 8px;
  }
  body { font-family: var(--font); background: var(--bg); color: var(--text); min-height: 100vh; }
  a { color: var(--accent); text-decoration: none; }
  a:hover { color: var(--accent-2); }

  ${getSharedHeaderCSS()}

  .container { max-width: 800px; margin: 0 auto; padding: 48px 24px; }

  .btn {
    display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px;
    border-radius: var(--radius); font-size: 14px; font-weight: 600;
    cursor: pointer; border: none; transition: all 0.15s; text-decoration: none;
  }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: var(--accent-2); color: #fff; }
  .btn-secondary { background: var(--surface2); color: var(--text-2); border: 1px solid var(--border2); }
  .btn-secondary:hover { background: var(--surface3); color: var(--text); }
  .btn-danger { background: transparent; color: #e74c3c; border: 1px solid #e74c3c44; font-size: 12px; padding: 6px 12px; }
  .btn-danger:hover { background: #e74c3c22; }
  .btn-sm { padding: 6px 12px; font-size: 12px; }

  .input {
    width: 100%; padding: 12px 16px; background: var(--surface2);
    border: 1px solid var(--border2); border-radius: var(--radius);
    color: var(--text); font-size: 14px; font-family: var(--font);
    transition: border-color 0.15s;
  }
  .input:focus { outline: none; border-color: var(--accent); }
  .input::placeholder { color: var(--text-3); }

  .label { display: block; font-size: 13px; font-weight: 600; color: var(--text-2); margin-bottom: 6px; }

  .card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px 24px;
  }

  .error-msg { color: #e74c3c; font-size: 13px; padding: 10px 16px; background: #e74c3c18; border: 1px solid #e74c3c44; border-radius: var(--radius); margin-bottom: 16px; }

  /* ── Global mobile responsive ─────────────────────────────────────────────── */
  @media (max-width: 640px) {
    /* Page padding */
    div[style*="max-width:1200px"], div[style*="max-width: 1200px"] { padding: 16px 12px !important; }
    /* Tables: hide secondary columns, allow horizontal scroll */
    .tbl-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    /* Cards: full width */
    .card { border-radius: 6px; }
    /* Buttons: ensure tap targets */
    .btn { min-height: 36px; }
    /* Grid forms: stack to single column */
    .form-grid-mobile { grid-template-columns: 1fr !important; }
    /* Monitor add-form grid */
    .mon-add-grid { grid-template-columns: 1fr 1fr !important; }
    /* Settings user table */
    .settings-user-tg { width: 120px !important; }
    /* Notification panels */
    .notif-grid { grid-template-columns: 1fr !important; }
    /* Alert rules form grid */
    .rules-form-grid { grid-template-columns: 1fr 1fr !important; }
  }
</style>
</head>
<body>
${sharedHeader(finalHeaderOpts)}
${body}
</body>
</html>`;
}

// ── Login page ────────────────────────────────────────────────────────────────
function login({ error }, ctx) {
  const body = `
<div class="container" style="max-width:400px;margin-top:80px;">
  <div style="text-align:center;margin-bottom:32px;">
    <img src="${XO_LOGO_BASE64}" alt="XO" style="height:270px;margin-bottom:16px;">
    <h2 style="font-size:20px;font-weight:700;">XO Studio</h2>
    <p style="font-size:13px;color:var(--text-3);margin-top:4px;">Log ind for at oprette og administrere previews</p>
  </div>
  ${error ? `<div class="error-msg">${escHtml(error)}</div>` : ''}
  <form method="POST" action="/login" class="card" style="display:flex;flex-direction:column;gap:16px;">
    <div>
      <label class="label" for="email">Email</label>
      <input class="input" type="email" id="email" name="email" placeholder="din@xo.dk" required autofocus>
    </div>
    <div>
      <label class="label" for="password">Password</label>
      <input class="input" type="password" id="password" name="password" placeholder="••••••••" required>
    </div>
    <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">Log ind</button>
  </form>
</div>`;
  // Login page has shared header, but no nav or user/logout controls
  return shell('Login', body, { ...ctx, showNav: false, showAuth: false });
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function dashboard({ previews }, ctx) {
  const rows = previews.map(p => {
    const statusClass = p.status === 'ready' ? 'status-ready' : (p.status === 'error' ? 'status-error' : '');
    const statusText = p.status === 'ready' ? `✅ Klar (${p.live_count}/${p.banner_count})` : (p.status === 'error' ? '❌ Fejl' : 'Genererer...');
    const previewUrl = `/preview/${p.id}`;
    return `
    <tr class="${statusClass}">
      <td style="padding:12px 16px;white-space:nowrap;">
        <a href="${previewUrl}" target="_blank" style="font-weight:600;color:var(--text);">${escHtml(p.name)}</a>
        <div style="font-size:11px;color:var(--text-3);">${new Date(p.created_at).toLocaleString('da-DK',{dateStyle:'short',timeStyle:'short'})}</div>
      </td>
      <td style="padding:12px 16px;max-width:300px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:var(--mono);font-size:12px;color:var(--text-2);">
        <a href="${escHtml(p.zuuvi_url)}" target="_blank" title="${escHtml(p.zuuvi_url)}">${escHtml(p.zuuvi_url)}</a>
      </td>
      <td style="padding:12px 16px;font-size:12px;font-weight:500;">${statusText}</td>
      <td style="padding:12px 16px;font-size:12px;text-align:center;">${p.views}</td>
      <td style="padding:12px 16px;">
        <div style="display:flex;align-items:center;gap:6px;">
          <a href="${previewUrl}" class="btn btn-secondary btn-sm" target="_blank">👁️ Vis</a>
          <button class="btn btn-secondary btn-sm copy-link-btn" data-url="${previewUrl}">📋</button>
          <a href="/edit/${escHtml(p.id)}" class="btn btn-secondary btn-sm">✏️ Redigér</a>
          <a href="/delete/${escHtml(p.id)}/confirm" class="btn btn-danger btn-sm">🗑</a>
        </div>
      </td>
    </tr>`;
  }).join('');

  const empty = previews.length === 0
    ? `<tr><td colspan="5" style="text-align:center;padding:60px 0;color:var(--text-3);">Ingen previews endnu</td></tr>`
    : '';

  const body = `
<div style="max-width:1200px;margin:0 auto;padding:32px 24px;">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
    <div>
      <h1 style="font-size:22px;font-weight:700;">Mine Previews</h1>
      <p style="font-size:13px;color:var(--text-3);margin-top:4px;">${previews.length} preview${previews.length !== 1 ? 's' : ''} oprettet</p>
    </div>
    <a href="/new" class="btn btn-primary">+ Nyt Preview</a>
  </div>
  <div class="card tbl-responsive" style="padding:0;overflow:hidden;">
    <table style="width:100%;border-collapse:collapse;min-width:500px;">
      <thead>
        <tr style="border-bottom:1px solid var(--border);">
          <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;">Campaign</th>
          <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;">Source URL</th>
          <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;">Status</th>
          <th style="padding:10px 16px;text-align:center;font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;">Visninger</th>
          <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;">Handlinger</th>
        </tr>
      </thead>
      <tbody>
        ${empty}
        ${rows}
      </tbody>
    </table>
  </div>
</div>
<script>
document.querySelectorAll('.copy-link-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var self = this;
    navigator.clipboard.writeText(location.origin + this.dataset.url).then(function() {
      self.textContent = '✅'; setTimeout(function() { self.textContent = '📋'; }, 1500);
    });
  });
});
</script>`;
  return shell('Dashboard', body, { ...ctx, activePage: 'previews' });
}

// ── New preview ───────────────────────────────────────────────────────────────
function newPreview({ error, themes }, ctx) {
  const themeOptions = (themes || []).map(t =>
    `<option value="${escHtml(t.id)}"${t.is_default ? ' selected' : ''}>${escHtml(t.name)}</option>`
  ).join('');

  const body = `
<div class="container" style="max-width:600px;">
  <div style="margin-bottom:24px;">
    <h1 style="font-size:22px;font-weight:700;">Nyt Preview</h1>
    <p style="font-size:13px;color:var(--text-3);margin-top:4px;">Indsæt et campaign link for at starte.</p>
  </div>
  ${error ? `<div class="error-msg">${escHtml(error)}</div>` : ''}
  <form method="POST" action="/new" class="card" style="display:flex;flex-direction:column;gap:20px;">
    <div>
      <label class="label" for="name">Campaign Navn (valgfrit)</label>
      <input class="input" type="text" id="name" name="name" placeholder="E.g., Sommerkampagne 2024">
    </div>
    <div>
      <label class="label" for="url">Campaign URL</label>
      <input class="input" type="url" id="url" name="url" placeholder="Indsæt campaign preview-link..." required>
    </div>
    ${themes && themes.length > 0 ? `
    <div>
      <label class="label" for="theme_id">Tema</label>
      <select class="input" id="theme_id" name="theme_id">
        ${themeOptions}
      </select>
    </div>` : ''}
    <div style="display:flex;gap:12px;justify-content:flex-end;">
      <a href="/" class="btn btn-secondary">Annuller</a>
      <button type="submit" class="btn btn-primary">Opret Preview →</button>
    </div>
  </form>
</div>`;
  return shell('Nyt Preview', body, ctx);
}

// ── Generating page ───────────────────────────────────────────────────────────
function generating({ preview }, ctx) {
  const body = `
<div class="container" style="text-align:center;padding-top:100px;">
  <div style="font-size:24px;margin-bottom:12px;">⚙️</div>
  <h1 style="font-size:20px;font-weight:600;">Genererer preview...</h1>
  <p style="font-size:13px;color:var(--text-3);margin-top:8px;">
    Kampagnen '${escHtml(preview.name)}' er ved at blive behandlet.<br>
    Siden opdaterer automatisk, når den er klar.
  </p>
</div>
<script>
  const checkStatus = () => {
    fetch('/api/status/${preview.id}')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ready' || data.status === 'error') {
          location.reload();
        } else {
          setTimeout(checkStatus, 2000);
        }
      }).catch(() => setTimeout(checkStatus, 5000));
  };
  setTimeout(checkStatus, 2000);
</script>`;
  return shell('Genererer...', body, ctx);
}

// ── Error page ────────────────────────────────────────────────────────────────
function error({ message }, ctx) {
  const body = `
<div class="container" style="text-align:center;padding-top:100px;">
  <div style="font-size:24px;margin-bottom:12px;">😕</div>
  <h1 style="font-size:20px;font-weight:600;">Der skete en fejl</h1>
  <p style="font-size:13px;color:var(--text-2);margin-top:8px;background:var(--surface2);padding:12px;border-radius:var(--radius);font-family:var(--mono);">${escHtml(message)}</p>
  <a href="/" class="btn btn-primary" style="margin-top:24px;">← Tilbage til forsiden</a>
</div>`;
  return shell('Fejl', body, ctx);
}


// ── Settings page ─────────────────────────────────────────────────────────────
function settings({ users, previewCount, hostingCount, passwordChanged, passwordError, themes }, ctx) {
  const userRows = (users || []).map(u => {
    const safeEmail = escHtml(u.email);
    const safeEmailJs = u.email.replace(/'/g, "\\'");
    const safeName = escHtml(u.name);
    const safeNameJs = u.name.replace(/'/g, "\\'");
    const tgVal = escHtml(u.telegram_chat_id || '');
    return `
    <tr id="row-${safeEmail}">
      <td style="padding:10px 16px;font-weight:500;">${safeName}
        <span style="font-size:10px;color:var(--text-3);margin-left:4px;">${u.fromDb ? '(DB)' : 'Env'}</span>
      </td>
      <td style="padding:10px 16px;color:var(--text-2);font-size:13px;">${safeEmail}</td>
      <td style="padding:8px 16px;">
        ${u.telegram_chat_id
          ? `<span style="font-size:12px;color:#2ecc71;">&#10003; ${tgVal}</span>`
          : '<span style="font-size:12px;color:var(--text-3);">Ikke sat</span>'}
      </td>
      <td style="padding:8px 16px;text-align:right;">
        <button class="btn btn-secondary btn-sm" onclick="toggleEdit('${safeEmailJs}')">Rediger</button>
        ${u.fromDb ? `<button class="btn btn-danger btn-sm" style="margin-left:4px;" onclick="deleteUser('${safeEmailJs}', '${safeNameJs}')">Slet</button>` : ''}
      </td>
    </tr>
    <tr id="edit-${safeEmail}" style="display:none;background:var(--surface2);">
      <td colspan="4" style="padding:16px 20px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
          ${u.fromDb ? `<div><label class="label">Navn</label><input class="input" id="edit-name-${safeEmail}" value="${safeName}"></div>` : ''}
          ${u.fromDb ? `<div><label class="label">Email</label><input class="input" id="edit-email-${safeEmail}" value="${safeEmail}" type="email"></div>` : `<div><label class="label">Email</label><input class="input" value="${safeEmail}" disabled style="opacity:.5;"></div>`}
          <div><label class="label">Telegram Chat ID</label><input class="input" id="edit-tg-${safeEmail}" value="${tgVal}" placeholder="8326264778"></div>
          ${u.fromDb ? `<div><label class="label">Nyt password <span style="color:var(--text-3);font-weight:400;">(tom = uændret)</span></label><input class="input" type="password" id="edit-pw-${safeEmail}" placeholder="Min. 8 tegn"></div>` : '<div></div>'}
        </div>
        <div id="edit-err-${safeEmail}" style="display:none;color:#ef4444;font-size:12px;margin-bottom:8px;"></div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-primary" onclick="saveEdit('${safeEmailJs}', ${u.fromDb ? 'true' : 'false'})">Gem ændringer</button>
          <button class="btn btn-secondary" onclick="toggleEdit('${safeEmailJs}')">Annuller</button>
          ${u.fromDb ? `<button class="btn btn-danger" style="margin-left:auto;" onclick="deleteUser('${safeEmailJs}', '${safeNameJs}')">🗑 Slet bruger</button>` : ''}
        </div>
      </td>
    </tr>`;
  }).join('');

  const successMsg = passwordChanged ? `
    <div style="background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.3);color:#22c55e;padding:12px 16px;border-radius:var(--radius);margin-bottom:20px;font-size:13px;font-weight:500;">
      ✅ Password ændret succesfuldt
    </div>` : '';

  const errorMsg = passwordError ? `
    <div style="background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);color:#ef4444;padding:12px 16px;border-radius:var(--radius);margin-bottom:20px;font-size:13px;font-weight:500;">
      ❌ ${escHtml(passwordError)}
    </div>` : '';

  const body = `
<div style="max-width:1200px;margin:0 auto;padding:32px 24px;">
  <div style="margin-bottom:24px;">
    <h1 style="font-size:22px;font-weight:700;">Indstillinger</h1>
    <p style="font-size:13px;color:var(--text-3);margin-top:4px;">Administrer brugere, password og systeminfo</p>
  </div>

  <!-- Stats cards -->
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:32px;">
    <div class="card" style="padding:20px;text-align:center;">
      <div style="font-size:28px;font-weight:700;color:var(--accent);">${previewCount || 0}</div>
      <div style="font-size:12px;color:var(--text-3);margin-top:4px;text-transform:uppercase;letter-spacing:.05em;">Previews</div>
    </div>
    <div class="card" style="padding:20px;text-align:center;">
      <div style="font-size:28px;font-weight:700;color:var(--accent);">${hostingCount || 0}</div>
      <div style="font-size:12px;color:var(--text-3);margin-top:4px;text-transform:uppercase;letter-spacing:.05em;">Hostede kampagner</div>
    </div>
    <div class="card" style="padding:20px;text-align:center;">
      <div style="font-size:28px;font-weight:700;color:var(--accent);">${(users || []).length}</div>
      <div style="font-size:12px;color:var(--text-3);margin-top:4px;text-transform:uppercase;letter-spacing:.05em;">Brugere</div>
    </div>
  </div>

  <!-- Password change -->
  <div class="card" style="padding:24px;margin-bottom:24px;">
    <h2 style="font-size:16px;font-weight:600;margin-bottom:16px;">🔑 Skift password</h2>
    ${successMsg}
    ${errorMsg}
    <form method="POST" action="/settings/password" style="display:flex;flex-direction:column;gap:12px;max-width:400px;">
      <div>
        <label class="label">Nuværende password</label>
        <input class="input" type="password" name="current_password" required autocomplete="current-password">
      </div>
      <div>
        <label class="label">Nyt password</label>
        <input class="input" type="password" name="new_password" required minlength="8" autocomplete="new-password">
      </div>
      <div>
        <label class="label">Bekræft nyt password</label>
        <input class="input" type="password" name="confirm_password" required minlength="8" autocomplete="new-password">
      </div>
      <div style="margin-top:4px;">
        <button type="submit" class="btn btn-primary">Gem nyt password</button>
      </div>
    </form>
  </div>

  <!-- Users table -->
  <div class="card" style="padding:0;overflow:hidden;margin-bottom:24px;">
    <div style="padding:16px 20px;border-bottom:1px solid var(--border);">
      <h2 style="font-size:16px;font-weight:600;margin:0;">👥 Brugere</h2>
    </div>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="border-bottom:1px solid var(--border);">
          <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;">Navn</th>
          <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;">Email</th>
          <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;">Telegram Chat ID</th>
          <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;"></th>
        </tr>
      </thead>
      <tbody>
        ${userRows || '<tr><td colspan="4" style="text-align:center;padding:40px 0;color:var(--text-3);">Ingen brugere</td></tr>'}
      </tbody>
    </table>
  </div>

  <!-- Opret ny bruger -->
  <div class="card" style="padding:24px;margin-bottom:24px;" id="addUserCard">
    <h2 style="font-size:16px;font-weight:600;margin-bottom:16px;">➕ Opret ny bruger</h2>
    <div id="addUserError" style="display:none;color:#ef4444;font-size:13px;margin-bottom:12px;"></div>
    <style>@media(max-width:640px){.new-user-grid{grid-template-columns:1fr 1fr !important}.new-user-grid .u-opret{grid-column:1/-1}}</style>
    <div class="new-user-grid" style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:12px;align-items:end;">
      <div><label class="label">Navn</label><input class="input" id="newUserName" placeholder="JB"></div>
      <div><label class="label">Email</label><input class="input" type="email" id="newUserEmail" placeholder="jb@xo.dk"></div>
      <div><label class="label">Password</label><input class="input" type="password" id="newUserPw" placeholder="Min. 8 tegn"></div>
      <div class="u-opret"><button class="btn btn-primary" onclick="createUser()">Opret</button></div>
    </div>
  </div>

  <!-- Temaer -->
  <div class="card" style="padding:0;overflow:hidden;margin-bottom:24px;">
    <div style="padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
      <h2 style="font-size:16px;font-weight:600;margin:0;">🎨 Temaer</h2>
      <a href="/settings/themes/new" class="btn btn-primary btn-sm">+ Opret nyt tema</a>
    </div>
    <div style="padding:20px;">
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;">
        ${(themes || []).map(t => `
        <div style="background:var(--surface2);border:1px solid var(--border2);border-radius:var(--radius);overflow:hidden;">
          <div style="height:48px;background:${escHtml(t.header_color)};display:flex;align-items:center;padding:0 12px;">
            ${t.logo_base64 ? `<img src="${escHtml(t.logo_base64)}" alt="logo" style="height:32px;">` : `<span style="font-size:12px;font-weight:700;color:#fff;">${escHtml(t.name)}</span>`}
          </div>
          <div style="padding:12px;">
            <div style="font-weight:600;font-size:14px;margin-bottom:8px;">${escHtml(t.name)}</div>
            <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
              <div style="width:18px;height:18px;border-radius:3px;background:${escHtml(t.accent_color)};border:1px solid var(--border2);" title="Accent"></div>
              <div style="width:18px;height:18px;border-radius:3px;background:${escHtml(t.bg_color)};border:1px solid var(--border2);" title="Baggrund"></div>
              <div style="width:18px;height:18px;border-radius:3px;background:${escHtml(t.header_color)};border:1px solid var(--border2);" title="Header"></div>
              <span style="font-size:11px;color:var(--text-3);">${t.is_default ? '⭐ Standard' : ''}</span>
            </div>
            <div style="display:flex;gap:6px;">
              <a href="/settings/themes/${escHtml(t.id)}/edit" class="btn btn-secondary btn-sm">✏️ Redigér</a>
              ${!t.is_default ? `
              <a href="/settings/themes/${escHtml(t.id)}/delete/confirm" class="btn btn-danger btn-sm">🗑 Slet</a>` : ''}
            </div>
          </div>
        </div>`).join('')}
        ${(themes || []).length === 0 ? '<p style="color:var(--text-3);font-size:13px;">Ingen temaer endnu.</p>' : ''}
      </div>
    </div>
  </div>

  <!-- System info -->
  <div class="card" style="padding:24px;">
    <h2 style="font-size:16px;font-weight:600;margin-bottom:16px;">⚙️ System</h2>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;font-size:13px;">
      <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--surface2);border-radius:var(--radius);">
        <span style="color:var(--text-3);">Platform</span>
        <span style="font-weight:500;">XO Studio</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--surface2);border-radius:var(--radius);">
        <span style="color:var(--text-3);">CDN</span>
        <span style="font-weight:500;">cdn.xo.dk</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--surface2);border-radius:var(--radius);">
        <span style="color:var(--text-3);">Region</span>
        <span style="font-weight:500;">EU</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--surface2);border-radius:var(--radius);">
        <span style="color:var(--text-3);">Analytics</span>
        <span style="font-weight:500;">Cloudflare Analytics Engine</span>
      </div>
    </div>
  </div>
</div>`;
  const settingsScript = `<script>
function createUser() {
  var name  = document.getElementById('newUserName').value.trim();
  var email = document.getElementById('newUserEmail').value.trim();
  var pw    = document.getElementById('newUserPw').value;
  var errEl = document.getElementById('addUserError');
  if (!name || !email || !pw) { errEl.textContent = 'Udfyld alle felter'; errEl.style.display='block'; return; }
  fetch('/settings/users/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name, email: email, password: pw })
  }).then(function(r) { return r.json(); }).then(function(d) {
    if (d.ok) { location.reload(); }
    else { errEl.textContent = d.error || 'Fejl'; errEl.style.display = 'block'; }
  });
}

function deleteUser(email, name) {
  if (!confirm('Slet bruger ' + name + ' (' + email + ')?')) return;
  fetch('/settings/users/' + encodeURIComponent(email), { method: 'DELETE' })
    .then(function(r) { return r.json(); }).then(function(d) {
      if (d.ok) { location.reload(); }
      else { alert(d.error || 'Kunne ikke slette'); }
    });
}

function toggleEdit(email) {
  var row = document.getElementById('edit-' + email);
  if (!row) return;
  row.style.display = row.style.display === 'none' ? '' : 'none';
}

function saveEdit(email, isDbUser) {
  var tgEl    = document.getElementById('edit-tg-'    + email);
  var nameEl  = document.getElementById('edit-name-'  + email);
  var emailEl = document.getElementById('edit-email-' + email);
  var pwEl    = document.getElementById('edit-pw-'    + email);
  var errEl   = document.getElementById('edit-err-'   + email);
  var body = { telegram_chat_id: tgEl ? tgEl.value.trim() || null : null };
  if (isDbUser) {
    if (nameEl)  body.name = nameEl.value.trim();
    if (emailEl && emailEl.value.trim() !== email) body.new_email = emailEl.value.trim();
    if (pwEl && pwEl.value) body.password = pwEl.value;
  }
  if (errEl) errEl.style.display = 'none';
  fetch('/settings/users/' + encodeURIComponent(email), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(function(r) { return r.json(); }).then(function(d) {
    if (d.ok) { location.reload(); }
    else if (errEl) { errEl.textContent = d.error || 'Ukendt fejl'; errEl.style.display = 'block'; }
  });
}

function saveTelegram(email) {
  var input = document.getElementById('tg-' + email);
  if (!input) return;
  var val = input.value.trim();
  fetch('/settings/users/telegram', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, telegram_chat_id: val || null })
  }).then(function(r) {
    if (r.ok) {
      var cell = input.parentNode;
      var check = cell.querySelector('.tg-check');
      if (val) {
        if (!check) {
          var s = document.createElement('span');
          s.className = 'tg-check';
          s.style.cssText = 'font-size:11px;color:#2ecc71;';
          s.textContent = '\u2713';
          cell.appendChild(s);
        } else { check.style.display = ''; }
      } else if (check) { check.style.display = 'none'; }
      var t = document.createElement('div');
      t.textContent = val ? 'Telegram gemt \u2713' : 'Telegram fjernet';
      t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:var(--surface3);color:var(--text);border:1px solid var(--border2);padding:10px 18px;border-radius:var(--radius);font-size:13px;z-index:999;';
      document.body.appendChild(t);
      setTimeout(function() { t.remove(); }, 2500);
    }
  });
}
<\/script>`;
  return shell('Indstillinger', body + settingsScript, { ...ctx, activePage: 'settings' });
}

// ── Hosting pages ────────────────────────────────────────────────────────────
function hosting({ campaigns }, ctx) {
  const rows = campaigns.map(c => {
    const statusText = c.status === 'ready' ? '✅ Live' : (c.status === 'error' ? '❌ Fejl' : '⏳ Processing...');
    const sizeBytes = c.total_size_live || c.total_size_bytes || 0;
    const sizeMB = sizeBytes > 0 ? (sizeBytes >= 1048576 ? (sizeBytes / 1048576).toFixed(1) + ' MB' : (sizeBytes / 1024).toFixed(0) + ' KB') : '—';
    const fmtCount = c.format_count_live || c.format_count || 0;
    const impressions = c.cdn_impressions || c.cdn_requests || c.total_impressions || c.views || 0;
    const mbServed = c.cdn_mb_served ? c.cdn_mb_served.toFixed(1) + ' MB' : '—';
    return `
    <tr>
      <td style="padding:12px 16px;white-space:nowrap;">
        <a href="/hosting/${escHtml(c.id)}" style="font-weight:600;color:var(--text);">${escHtml(c.name)}</a>
        <div style="font-size:11px;color:var(--text-3);">${new Date(c.created_at).toLocaleString('da-DK',{dateStyle:'short',timeStyle:'short'})}</div>
      </td>
      <td style="padding:12px 16px;font-size:12px;font-weight:500;">${statusText}</td>
      <td style="padding:12px 16px;font-size:12px;color:var(--text-2);font-family:var(--mono);">${fmtCount} formater</td>
      <td style="padding:12px 16px;font-size:12px;color:var(--text-2);font-family:var(--mono);">${sizeMB}</td>
      <td style="padding:12px 16px;font-size:12px;text-align:center;font-weight:600;">${impressions}</td>
      <td style="padding:12px 16px;font-size:12px;text-align:center;color:var(--text-2);font-family:var(--mono);">${mbServed}</td>
      <td style="padding:12px 16px;">
        <div style="display:flex;align-items:center;gap:6px;">
          <a href="/hosting/${escHtml(c.id)}" class="btn btn-secondary btn-sm">📝 Tags</a>
          <a href="/hosting/delete/${escHtml(c.id)}/confirm" class="btn btn-danger btn-sm">🗑</a>
        </div>
      </td>
    </tr>`;
  }).join('');

  const empty = campaigns.length === 0
    ? '<tr><td colspan="7" style="text-align:center;padding:60px 0;color:var(--text-3);">Ingen hosted campaigns endnu</td></tr>'
    : '';

  const body = `
<div style="max-width:1200px;margin:0 auto;padding:32px 24px;">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
    <div>
      <h1 style="font-size:22px;font-weight:700;">Hosted Campaigns</h1>
      <p style="font-size:13px;color:var(--text-3);margin-top:4px;">${campaigns.length} campaign${campaigns.length !== 1 ? 's' : ''} · ${campaigns.reduce((s,c) => s + (c.format_count_live || c.format_count || 0), 0)} formater · ${campaigns.reduce((s,c) => s + (c.cdn_impressions || c.cdn_requests || 0), 0).toLocaleString()} impressions · ${campaigns.reduce((s,c) => s + (c.cdn_mb_served || 0), 0).toFixed(1)} MB served</p>
    </div>
    <a href="/hosting/new" class="btn btn-primary">+ Upload Banner Package</a>
  </div>
  <div class="card" style="padding:0;overflow:hidden;">
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="border-bottom:1px solid var(--border);">
          <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;">Campaign</th>
          <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;">Status</th>
          <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;">Formater</th>
          <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;">Størrelse</th>
          <th style="padding:10px 16px;text-align:center;font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;">Impressions</th>
          <th style="padding:10px 16px;text-align:center;font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;">Served</th>
          <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;">Handlinger</th>
        </tr>
      </thead>
      <tbody>${rows}${empty}</tbody>
    </table>
  </div>
</div>`;
  return shell('Hosting', body, { ...ctx, activePage: 'hosting' });
}

function hostingNew({ error }, ctx) {
  const body = `
<div style="max-width:1200px;margin:0 auto;padding:32px 24px;">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
    <h1 style="font-size:22px;font-weight:700;">Upload Banner Package</h1>
    <a href="/hosting" class="btn btn-secondary">← Tilbage</a>
  </div>
  <div class="card" style="padding:32px;max-width:600px;">
    ${error ? `<div class="error-msg">${escHtml(error)}</div>` : ''}
    <p style="font-size:13px;color:var(--text-3);margin-bottom:20px;">Upload en Zuuvi "Google Ad Manager Display" export for at hoste banner assets på XO CDN.</p>
    <form method="POST" action="/hosting/upload" enctype="multipart/form-data">
      <div style="margin-bottom:16px;">
        <label class="label" for="name">Campaign Name</label>
        <input class="input" type="text" id="name" name="name" placeholder="f.eks. Ørsted TruePower Spring 2026" required>
      </div>
      <div style="margin-bottom:20px;">
        <label class="label" for="zipfile">Banner ZIP</label>
        <input class="input" type="file" id="zipfile" name="zipfile" accept=".zip" required style="padding:8px;">
      </div>
      <div style="display:flex;gap:8px;">
        <button type="submit" class="btn btn-primary">Upload & Host</button>
        <a href="/hosting" class="btn btn-secondary">Annuller</a>
      </div>
    </form>
  </div>
</div>`;
  return shell('Upload Banner', body, { ...ctx, activePage: 'hosting' });
}

function hostingDetail({ campaign, formats }, ctx) {
  const isReady = campaign.status === 'ready';
  const isProcessing = campaign.status === 'processing';
  const isError = campaign.status === 'error';

  let statusHtml = '';
  if (isProcessing) statusHtml = `<div class="card" style="padding:20px;background:var(--accent-dim);border:1px solid var(--accent);margin-bottom:24px;"><strong>⏳ Processing...</strong> Upload og behandling er i gang. Siden opdaterer automatisk.</div>`;
  if (isError) statusHtml = `<div class="error-msg">${escHtml(campaign.error_msg || 'Unknown error')}</div>`;

  const formatRows = formats.map((f, i) => `
    <div class="card" style="padding:20px;margin-bottom:16px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <span style="font-family:var(--mono);font-size:14px;font-weight:700;background:var(--surface2);border:1px solid var(--border2);padding:6px 12px;border-radius:4px;">${escHtml(f.format_name)}</span>
          <span style="font-size:12px;color:var(--text-3);font-family:var(--mono);">${f.width} × ${f.height} px</span>
          <span style="font-size:11px;color:var(--text-3);">📁 ${f.file_count || 0} filer · 👁 ${f.cdn_impressions || 0} impressions · ${f.cdn_requests || 0} requests · 📦 ${f.cdn_mb_served ? f.cdn_mb_served.toFixed(2) + ' MB' : '—'} served</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <a href="/hosting/${escHtml(campaign.id)}/format/${f.id}/replace" class="btn btn-secondary btn-sm">🔄 Opdatér</a>
          <a href="${escHtml(f.cdn_url)}" target="_blank" class="btn btn-secondary btn-sm">👁️ Preview</a>
        </div>
      </div>
      <div style="margin-bottom:12px;">
        <label style="font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;display:block;">🔗 Click URL</label>
        <form method="POST" action="/hosting/${escHtml(campaign.id)}/format/${f.id}/click-url" style="display:flex;gap:8px;align-items:center;">
          <input name="click_url" value="${escHtml(f.click_url || '')}" class="input" style="font-family:var(--mono);font-size:11px;flex:1;" placeholder="https://...">
          <button type="submit" class="btn btn-primary btn-sm">💾 Gem</button>
        </form>
      </div>
      <div style="margin-bottom:12px;">
        <label style="font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;display:block;">Google Ad Manager Tag</label>
        <div style="position:relative;">
          <textarea id="tag-${i}" readonly style="width:100%;height:56px;font-family:var(--mono);font-size:11px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);padding:10px;resize:none;color:var(--text);line-height:1.4;">${escHtml(f.tag_html)}</textarea>
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('tag-${i}').select();document.execCommand('copy');this.textContent='✅ Kopieret';setTimeout(()=>this.textContent='📋 Kopiér',1500)" style="position:absolute;top:8px;right:8px;">📋 Kopiér</button>
        </div>
      </div>
      <div>
        <label style="font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;display:block;">Direct URL</label>
        <div style="display:flex;gap:8px;align-items:center;">
          <input id="url-${i}" readonly value="${escHtml(f.cdn_url)}" class="input" style="font-family:var(--mono);font-size:11px;flex:1;" onclick="this.select()">
          <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText(document.getElementById('url-${i}').value).then(()=>{this.textContent='✅';setTimeout(()=>this.textContent='📋',1500)})">📋</button>
        </div>
      </div>
    </div>`).join('');

  const body = `
<div style="max-width:1200px;margin:0 auto;padding:32px 24px;">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
    <div>
      <h1 style="font-size:22px;font-weight:700;">${escHtml(campaign.name)}</h1>
      <p style="font-size:13px;color:var(--text-3);margin-top:4px;">Af ${escHtml(campaign.created_by || 'unknown')} · ${new Date(campaign.created_at).toLocaleString('da-DK',{dateStyle:'short',timeStyle:'short'})}</p>
    </div>
    <div style="display:flex;gap:8px;">
      <a href="/hosting/${escHtml(campaign.id)}/replace" class="btn btn-primary">🔄 Opdatér kampagne</a>
      <form method="POST" action="/hosting/${escHtml(campaign.id)}/scan-clicks" style="margin:0;"><button type="submit" class="btn btn-secondary">🔗 Scan Click URLs</button></form>
      ${isReady ? `<a href="/hosting/${escHtml(campaign.id)}/get-tags" class="btn btn-secondary" download>📄 Get Tags</a>` : ''}
      ${isReady ? `<a href="/hosting/${escHtml(campaign.id)}/get-index-tags" class="btn btn-secondary" download>📦 Get Index Tags</a>` : ''}
      ${isReady ? `<a href="/hosting/${escHtml(campaign.id)}/get-js-tags" class="btn btn-secondary" download>📜 Get JS Tags</a>` : ''}
      ${isReady ? `<a href="/hosting/${escHtml(campaign.id)}/get-cf-tags" class="btn btn-secondary" download style="background:var(--surface2);border:1px solid #F6821F44;color:#F6821F;">☁️ CF Tags</a>` : ''}
      <a href="/hosting" class="btn btn-secondary">← Tilbage</a>
    </div>
  </div>
  ${statusHtml}
  ${isProcessing ? '<meta http-equiv="refresh" content="3">' : ''}
  ${isReady ? `<p style="margin-bottom:20px;font-size:14px;"><strong>${formats.length}</strong> format${formats.length !== 1 ? 'er' : ''} hosted på <a href="https://cdn.xo.dk" target="_blank" style="color:var(--accent);">cdn.xo.dk</a></p>` : ''}
  ${formatRows}
</div>`;
  return shell(campaign.name, body, { ...ctx, activePage: 'hosting' });
}

// ── Replace / Update pages ──────────────────────────────────────────────────

function hostingReplace({ campaign, format, error }, ctx) {
  const isFormat = !!format;
  const title = isFormat
    ? `Opdatér format: ${format.format_name}`
    : `Opdatér kampagne: ${campaign.name}`;
  const actionUrl = isFormat
    ? `/hosting/${escHtml(campaign.id)}/format/${format.id}/replace`
    : `/hosting/${escHtml(campaign.id)}/replace`;
  const description = isFormat
    ? `Upload en ny ZIP med opdateret banner for <strong>${escHtml(format.format_name)}</strong>. CDN URL forbliver uændret.`
    : `Upload en ny Zuuvi "Google Ad Manager Display" export. Eksisterende CDN URLs og GAM tags forbliver uændrede.`;

  const body = `
<div style="max-width:1200px;margin:0 auto;padding:32px 24px;">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
    <h1 style="font-size:22px;font-weight:700;">${escHtml(title)}</h1>
    <a href="/hosting/${escHtml(campaign.id)}" class="btn btn-secondary">← Tilbage</a>
  </div>
  <div class="card" style="padding:32px;max-width:600px;">
    ${error ? `<div class="error-msg">${escHtml(error)}</div>` : ''}
    <p style="font-size:13px;color:var(--text-3);margin-bottom:20px;">${description}</p>
    <form method="POST" action="${actionUrl}" enctype="multipart/form-data">
      <div style="margin-bottom:20px;">
        <label class="label" for="zipfile">Ny Banner ZIP</label>
        <input class="input" type="file" id="zipfile" name="zipfile" accept=".zip" required style="padding:8px;">
      </div>
      <div style="display:flex;gap:8px;">
        <button type="submit" class="btn btn-primary">Upload & Validér</button>
        <a href="/hosting/${escHtml(campaign.id)}" class="btn btn-secondary">Annullér</a>
      </div>
    </form>
  </div>
</div>`;
  return shell(title, body, { ...ctx, activePage: 'hosting' });
}

function hostingReplaceConfirm({ campaign, format, warnings, newFormats, missingFormats, matchedFormats, tempKey }, ctx) {
  const isFormat = !!format;
  const title = isFormat
    ? `Bekræft opdatering: ${format.format_name}`
    : `Bekræft opdatering: ${campaign.name}`;
  const actionUrl = isFormat
    ? `/hosting/${escHtml(campaign.id)}/format/${format.id}/replace/confirm`
    : `/hosting/${escHtml(campaign.id)}/replace/confirm`;

  const hasWarnings = warnings && warnings.length > 0;
  const hasNewFormats = newFormats && newFormats.length > 0;
  const hasMissing = missingFormats && missingFormats.length > 0;

  let warningsHtml = '';
  if (hasWarnings) {
    warningsHtml = `
    <div class="card" style="padding:20px;background:#4a350088;border:1px solid #f0ad4e88;margin-bottom:20px;">
      <div style="font-size:14px;font-weight:700;color:#f0ad4e;margin-bottom:12px;">⚠️ Advarsler fundet</div>
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;">
        ${warnings.map(w => `<li style="font-size:13px;color:var(--text-2);padding:8px 12px;background:var(--surface2);border-radius:var(--radius);border-left:3px solid #f0ad4e;">
          <span style="color:#f0ad4e;">⚠️</span> ${escHtml(w)}
        </li>`).join('')}
      </ul>
    </div>`;
  }

  let newFormatsHtml = '';
  if (hasNewFormats) {
    newFormatsHtml = `
    <div class="card" style="padding:16px;margin-bottom:16px;border:1px solid #5cb85c88;">
      <div style="font-size:13px;font-weight:600;color:#5cb85c;margin-bottom:8px;">➕ Nye formater der tilføjes</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${newFormats.map(n => `<span style="font-family:var(--mono);font-size:12px;background:var(--surface2);border:1px solid var(--border2);padding:4px 10px;border-radius:4px;">${escHtml(n)}</span>`).join('')}
      </div>
    </div>`;
  }

  let missingHtml = '';
  if (hasMissing) {
    missingHtml = `
    <div class="card" style="padding:16px;margin-bottom:16px;border:1px solid #f0ad4e88;">
      <div style="font-size:13px;font-weight:600;color:#f0ad4e;margin-bottom:8px;">⚡ Eksisterende formater ikke i ny ZIP (beholdes uændrede)</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${missingFormats.map(m => `<span style="font-family:var(--mono);font-size:12px;background:var(--surface2);border:1px solid var(--border2);padding:4px 10px;border-radius:4px;">${escHtml(m)}</span>`).join('')}
      </div>
    </div>`;
  }

  const matchCount = isFormat ? 1 : (matchedFormats ? matchedFormats.length : 0);
  const summaryText = isFormat
    ? `Du er ved at erstatte formatet <strong>${escHtml(format.format_name)}</strong>. CDN URL forbliver uændret.`
    : `Du er ved at erstatte <strong>${matchCount}</strong> format${matchCount !== 1 ? 'er' : ''}${hasNewFormats ? ` og tilføje <strong>${newFormats.length}</strong> nye` : ''}. CDN URLs forbliver uændrede.`;

  const body = `
<div style="max-width:1200px;margin:0 auto;padding:32px 24px;">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
    <h1 style="font-size:22px;font-weight:700;">${escHtml(title)}</h1>
    <a href="/hosting/${escHtml(campaign.id)}" class="btn btn-secondary">← Tilbage</a>
  </div>
  <div style="max-width:700px;">
    <div class="card" style="padding:20px;margin-bottom:20px;">
      <p style="font-size:14px;color:var(--text-2);">${summaryText}</p>
    </div>
    ${warningsHtml}
    ${newFormatsHtml}
    ${missingHtml}
    <form method="POST" action="${actionUrl}">
      <input type="hidden" name="tempKey" value="${escHtml(tempKey)}">
      <div style="display:flex;gap:12px;">
        <button type="submit" class="btn ${hasWarnings ? 'btn-danger' : 'btn-primary'}" style="${hasWarnings ? 'background:#e74c3c;color:#fff;border:none;padding:10px 20px;font-size:14px;font-weight:600;' : ''}">${hasWarnings ? '⚠️ Fortsæt alligevel' : '✅ Bekræft opdatering'}</button>
        <a href="/hosting/${escHtml(campaign.id)}" class="btn btn-secondary">Annullér</a>
      </div>
    </form>
  </div>
</div>`;
  return shell(title, body, { ...ctx, activePage: 'hosting' });
}

function editPreview({ preview, themes, currentThemeId }, ctx) {
  const themeOptions = (themes || []).map(t =>
    `<option value="${escHtml(t.id)}"${(currentThemeId || 'xo-default') === t.id ? ' selected' : ''}>${escHtml(t.name)}</option>`
  ).join('');

  const body = `
<div style="max-width:600px;margin:40px auto;padding:32px 24px;">
  <div class="card" style="padding:32px;">
    <h1 style="font-size:20px;font-weight:700;margin-bottom:20px;">Redigér preview</h1>
    <form method="POST" action="/edit/${escHtml(preview.id)}">
      <div style="margin-bottom:16px;">
        <label class="label">Campaign navn</label>
        <input class="input" name="name" value="${escHtml(preview.name)}" placeholder="Campaign navn">
      </div>
      <div style="margin-bottom:16px;">
        <label class="label">Source URL</label>
        <input class="input" name="url" value="${escHtml(preview.zuuvi_url)}" placeholder="Indsæt campaign preview-link" required>
      </div>
      ${themes && themes.length > 0 ? `
      <div style="margin-bottom:20px;">
        <label class="label">Tema</label>
        <select class="input" name="theme_id">
          ${themeOptions}
        </select>
      </div>` : '<div style="margin-bottom:20px;"></div>'}
      <div style="display:flex;gap:8px;">
        <button type="submit" class="btn btn-primary">🔄 Gem & regenerér</button>
        <a href="/" class="btn btn-secondary">Annullér</a>
      </div>
    </form>
  </div>
</div>`;
  return shell('Redigér: ' + escHtml(preview.name), body, { ...ctx, activePage: 'previews' });
}

function confirmDelete({ name, type, deleteUrl, cancelUrl }, ctx) {
  const typeLabel = type === 'hosting' ? 'hosted campaign' : 'preview';
  const extraWarning = type === 'hosting' ? '<p style="color:#e74c3c;font-size:13px;margin-top:8px;">Alle filer på CDN slettes også!</p>' : '';
  const body = `
<div style="max-width:500px;margin:80px auto;padding:32px 24px;text-align:center;">
  <div class="card" style="padding:32px;">
    <div style="font-size:48px;margin-bottom:16px;">⚠️</div>
    <h1 style="font-size:20px;font-weight:700;margin-bottom:8px;">Slet ${typeLabel}?</h1>
    <p style="font-size:15px;color:var(--text-2);margin-bottom:4px;"><strong>${escHtml(name)}</strong></p>
    <p style="font-size:13px;color:var(--text-3);">Dette kan ikke fortrydes.</p>
    ${extraWarning}
    <div style="display:flex;gap:12px;justify-content:center;margin-top:24px;">
      <a href="${escHtml(cancelUrl)}" class="btn btn-secondary">Annullér</a>
      <form method="POST" action="${escHtml(deleteUrl)}" style="margin:0;">
        <button type="submit" class="btn btn-danger">🗑 Slet</button>
      </form>
    </div>
  </div>
</div>`;
  return shell('Bekræft sletning', body, { ...ctx });
}

// ── Theme new page ──────────────────────────────────────────────────────────────
function themeNew({ error }, ctx) {
  const body = `
<div class="container" style="max-width:560px;">
  <div style="margin-bottom:24px;">
    <h1 style="font-size:22px;font-weight:700;">Opret nyt tema</h1>
    <p style="font-size:13px;color:var(--text-3);margin-top:4px;">Tilpas farver og logo til dine previews.</p>
  </div>
  ${error ? `<div class="error-msg">${escHtml(error)}</div>` : ''}
  <form method="POST" action="/settings/themes" enctype="multipart/form-data" class="card" style="display:flex;flex-direction:column;gap:20px;">
    <div>
      <label class="label" for="theme_name">Tema navn</label>
      <input class="input" type="text" id="theme_name" name="name" placeholder="F.eks. Klient A" required>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
      <div>
        <label class="label" for="accent_color">Accent farve</label>
        <input type="color" id="accent_color" name="accent_color" value="#e87722" style="width:100%;height:42px;padding:2px 4px;background:var(--surface2);border:1px solid var(--border2);border-radius:var(--radius);cursor:pointer;">
      </div>
      <div>
        <label class="label" for="bg_color">Baggrunds farve</label>
        <input type="color" id="bg_color" name="bg_color" value="#0e0e10" style="width:100%;height:42px;padding:2px 4px;background:var(--surface2);border:1px solid var(--border2);border-radius:var(--radius);cursor:pointer;">
      </div>
      <div>
        <label class="label" for="header_color">Header farve</label>
        <input type="color" id="header_color" name="header_color" value="#18181b" style="width:100%;height:42px;padding:2px 4px;background:var(--surface2);border:1px solid var(--border2);border-radius:var(--radius);cursor:pointer;">
      </div>
    </div>
    <div>
      <label class="label" for="logo">Logo (PNG, SVG, JPG)</label>
      <input class="input" type="file" id="logo" name="logo" accept="image/png,image/svg+xml,image/jpeg" style="padding:8px;">
      <p style="font-size:11px;color:var(--text-3);margin-top:4px;">Valgfrit — bruges i preview headeren i stedet for XO-logoet.</p>
    </div>
    <div style="display:flex;gap:12px;justify-content:flex-end;">
      <a href="/settings" class="btn btn-secondary">Annuller</a>
      <button type="submit" class="btn btn-primary">Opret tema</button>
    </div>
  </form>
</div>`;
  return shell('Nyt tema', body, { ...ctx, activePage: 'settings' });
}

function themeEdit({ theme, error }, ctx) {
  const body = `
<div class="container" style="max-width:560px;">
  <div style="margin-bottom:24px;">
    <h1 style="font-size:22px;font-weight:700;">Redigér tema</h1>
    <p style="font-size:13px;color:var(--text-3);margin-top:4px;">Tilpas farver og logo til dine previews.</p>
  </div>
  ${error ? `<div class="error-msg">${escHtml(error)}</div>` : ''}
  <form method="POST" action="/settings/themes/${escHtml(theme.id)}/edit" enctype="multipart/form-data" class="card" style="display:flex;flex-direction:column;gap:20px;">
    <div>
      <label class="label" for="theme_name">Tema navn</label>
      <input class="input" type="text" id="theme_name" name="name" value="${escHtml(theme.name)}" placeholder="F.eks. Klient A" required>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
      <div>
        <label class="label" for="accent_color">Accent farve</label>
        <input type="color" id="accent_color" name="accent_color" value="${escHtml(theme.accent_color)}" style="width:100%;height:42px;padding:2px 4px;background:var(--surface2);border:1px solid var(--border2);border-radius:var(--radius);cursor:pointer;">
      </div>
      <div>
        <label class="label" for="bg_color">Baggrunds farve</label>
        <input type="color" id="bg_color" name="bg_color" value="${escHtml(theme.bg_color)}" style="width:100%;height:42px;padding:2px 4px;background:var(--surface2);border:1px solid var(--border2);border-radius:var(--radius);cursor:pointer;">
      </div>
      <div>
        <label class="label" for="header_color">Header farve</label>
        <input type="color" id="header_color" name="header_color" value="${escHtml(theme.header_color)}" style="width:100%;height:42px;padding:2px 4px;background:var(--surface2);border:1px solid var(--border2);border-radius:var(--radius);cursor:pointer;">
      </div>
    </div>
    <div>
      <label class="label" for="logo">Logo (PNG, SVG, JPG)</label>
      ${theme.logo_base64 ? `<div style="margin-bottom:8px;"><img src="${theme.logo_base64}" style="max-height:40px;max-width:160px;object-fit:contain;"></div>` : ''}
      <input class="input" type="file" id="logo" name="logo" accept="image/png,image/svg+xml,image/jpeg" style="padding:8px;">
      <p style="font-size:11px;color:var(--text-3);margin-top:4px;">Upload nyt logo for at erstatte det nuværende.</p>
    </div>
    <div style="display:flex;gap:12px;justify-content:flex-end;">
      <a href="/settings" class="btn btn-secondary">Annullér</a>
      <button type="submit" class="btn btn-primary">Gem ændringer</button>
    </div>
  </form>
</div>`;
  return shell('Redigér tema', body, { ...ctx, activePage: 'settings' });
}

// ── Monitor page ──────────────────────────────────────────────────────────────

function monitor(ctx = {}) {
  // Server renders only the static shell. All dynamic content is client-rendered.
  const body = '<style>@keyframes pulse-red{0%,100%{opacity:1}50%{opacity:.3}} @keyframes spin{to{transform:rotate(360deg)}}</style>'
    + '<div style="max-width:1200px;margin:0 auto;padding:32px 24px;">'

    // header — status + last-updated filled by JS
    + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px;">'
    + '<div><h1 style="font-size:22px;font-weight:700;">Monitor</h1>'
    + '<p style="font-size:13px;color:var(--text-3);margin-top:4px;" id="monStatus">Loading...</p></div>'
    + '<span style="font-size:12px;color:var(--text-3);" id="monUpdated"></span>'
    + '</div>'

    // monitor cards grid — filled by JS
    + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;margin-bottom:32px;" id="monGrid">'
    + '<div id="monLoading" class="card" style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text-3);">'
    + '<div style="width:24px;height:24px;border:2px solid var(--accent);border-top-color:transparent;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 12px;"></div>'
    + 'Loading monitors...</div>'
    + '</div>'

    // add monitor
    + '<div class="card" style="margin-bottom:24px;">'
    + '<h2 style="font-size:14px;font-weight:700;color:var(--text-2);text-transform:uppercase;letter-spacing:.05em;margin-bottom:16px;">Add monitor</h2>'
    + '<style>@media(max-width:640px){.mon-form-main{grid-template-columns:1fr !important}.mon-form-sec{grid-template-columns:1fr 1fr !important}}</style>'
    + '<div class="mon-form-main" style="display:grid;grid-template-columns:2fr 1fr 3fr 1fr;gap:12px;align-items:end;">'
    + '<div><label class="label">Name</label><input class="input" id="monName" placeholder="My Service"></div>'
    + '<div><label class="label">Type</label><select class="input" id="monType"><option value="http">HTTP</option><option value="tcp">TCP</option></select></div>'
    + '<div><label class="label">Target</label><input class="input" id="monTarget" placeholder="https://... or host:port"></div>'
    + '<div><label class="label">Interval (s)</label><input class="input" type="number" id="monInterval" value="60" min="15"></div>'
    + '</div>'
    + '<div style="border-top:1px solid var(--border);padding-top:12px;margin-top:12px;">'
    + '<div class="mon-form-sec" style="display:grid;grid-template-columns:1fr 2fr;gap:12px;align-items:end;">'
    + '<div><label class="label">Secondary type <span style="color:var(--text-3);font-weight:400;">(optional)</span></label><select class="input" id="monSecType"><option value="">None</option><option value="http">HTTP</option><option value="tcp">TCP</option></select></div>'
    + '<div><label class="label">Secondary target</label><input class="input" id="monSecTarget" placeholder="https://... or host:port"></div>'
    + '</div>'
    + '<div style="margin-top:12px;"><button class="btn btn-primary" onclick="addMonitor()">+ Add</button></div>'
    + '</div></div>'

    // notifications
    + '<hr style="border:none;border-top:1px solid var(--border);margin:8px 0 24px;">'
    + '<h2 style="font-size:14px;font-weight:700;color:var(--text-2);text-transform:uppercase;letter-spacing:.05em;margin-bottom:16px;">Notifications</h2>'
    + '<style>@media(max-width:640px){.notif-panels{grid-template-columns:1fr !important}.rules-grid{grid-template-columns:1fr !important}}</style>'
    + '<div class="notif-panels" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px;">'

    // Users panel (read-only — managed in Settings)
    + '<div class="card">'
    + '<h3 style="font-size:13px;font-weight:700;color:var(--text-2);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">Brugere</h3>'
    + '<p style="font-size:12px;color:var(--text-3);margin-bottom:12px;">Telegram-numre administreres under <a href="/settings" style="color:var(--accent);">Indstillinger</a></p>'
    + '<div id="userList"><span style="color:var(--text-3);font-size:13px;">Loading...</span></div>'
    + '</div>'

    + '<div class="card">'
    + '<h3 style="font-size:13px;font-weight:700;color:var(--text-2);text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px;">Alert rules</h3>'
    + '<div id="ruleList" style="margin-bottom:16px;"><span style="color:var(--text-3);font-size:13px;">Loading...</span></div>'
    + '<div class="rules-grid" style="border-top:1px solid var(--border);padding-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:10px;">'
    + '<div><label class="label">Bruger</label><select class="input" id="rulRecipient"><option value="">V\u00e6lg...</option></select></div>'
    + '<div style="grid-column:1/-1;"><label class="label">Monitors <span style="color:var(--text-3);font-weight:400;">(ingen valgt = alle)</span></label>'
    + '<div id="rulMonitorChecks" style="display:flex;flex-wrap:wrap;gap:8px;padding:10px 12px;background:var(--surface2);border:1px solid var(--border2);border-radius:var(--radius);min-height:44px;">'
    + '<span style="color:var(--text-3);font-size:13px;">Loading...</span></div></div>'
    + '<div><label class="label">Cooldown (min)</label><input class="input" type="number" id="rulCooldown" value="15" min="1"></div>'
    + '<div><label class="label">Quiet hours</label><div style="display:flex;gap:6px;"><input class="input" type="time" id="rulQS" value="22:00"><input class="input" type="time" id="rulQE" value="07:00"></div></div>'
    + '<div style="grid-column:1/-1;display:flex;gap:16px;">'
    + '<label style="display:flex;align-items:center;gap:6px;font-size:13px;color:var(--text-2);cursor:pointer;"><input type="checkbox" id="rulDown" checked> DOWN</label>'
    + '<label style="display:flex;align-items:center;gap:6px;font-size:13px;color:var(--text-2);cursor:pointer;"><input type="checkbox" id="rulRecov" checked> Recovery</label>'
    + '</div>'
    + '<div style="grid-column:1/-1;"><button class="btn btn-primary btn-sm" onclick="addRule()">Add rule</button></div>'
    + '</div></div>'
    + '</div>'

    + '<div class="card">'
    + '<h3 style="font-size:13px;font-weight:700;color:var(--text-2);text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px;">Notification log</h3>'
    + '<div id="notifLog"><span style="color:var(--text-3);font-size:13px;">Loading...</span></div>'
    + '</div>'

    + '<div id="toast" style="position:fixed;bottom:24px;right:24px;background:var(--surface3);color:var(--text);border:1px solid var(--border2);padding:10px 18px;border-radius:var(--radius);font-size:13px;z-index:999;opacity:0;transition:opacity .3s;pointer-events:none;"></div>'
    + '<script src="/monitor-notif.js?v=' + (process.env.RAILWAY_DEPLOYMENT_ID || Date.now()) + '"><\/script>'
    + '</div>';

  return shell('Monitor', body, { ...ctx, activePage: 'monitor' });
}

module.exports = { login, dashboard, new: newPreview, generating, error, settings, hosting, 'hosting-new': hostingNew, 'hosting-detail': hostingDetail, 'hosting-replace': hostingReplace, 'hosting-replace-confirm': hostingReplaceConfirm, 'edit-preview': editPreview, 'confirm-delete': confirmDelete, 'theme-new': themeNew, 'theme-edit': themeEdit, monitor, sharedHeader, getSharedHeaderCSS, XO_LOGO_BASE64, escHtml };
