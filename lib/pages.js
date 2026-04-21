/**
 * Page templates — inline HTML for the web platform UI
 * All pages use XO dark theme branding
 */

const XO_LOGO_BASE64 = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAxMDgwIDEwODAiPgogIDwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAzMC4yLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiAyLjEuMSBCdWlsZCAxKSAgLS0+CiAgPGRlZnM+CiAgICA8c3R5bGU+CiAgICAgIC5zdDAgewogICAgICAgIGZpbGw6ICNmZmY7CiAgICAgIH0KCiAgICAgIC5zdDEgewogICAgICAgIGZpbGw6ICNmZjU4MDA7CiAgICAgIH0KICAgIDwvc3R5bGU+CiAgPC9kZWZzPgogIDxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01MTIuOSw0ODAuNWM2LjMsMi45LDksOC41LDksMTUuMSwwLDExLjQtNy40LDE5LjMtMjMsMTkuM3MtMjAuOC01LjMtMjQuMS0xNC45Yy0uOC0yLjEtLjMtMy4xLDEuOS0zLjlsNC44LTEuN2MyLjEtLjgsMy4xLS4zLDMuOSwxLjksMiw1LjUsNC45LDguMywxMy41LDguM3MxMS4zLTMuNSwxMS4zLTkuMS0zLjEtOC45LTkuMy04LjloLTkuM2MtMi4yLDAtMy0uNy0zLTN2LTRjMC0yLjMuOC0zLDMtM2g3LjdjNS42LDAsOS40LTMuMiw5LjQtOC40cy0zLjUtOC42LTEwLTguNi0xMC43LDIuNi0xMi43LDguMWMtLjgsMi4yLTEuNywyLjUtMy45LDEuOWwtNC44LTEuN2MtMi4xLS44LTIuNy0xLjgtMS45LTMuOSwzLjMtOS42LDEwLjEtMTQuOCwyMy41LTE0LjhzMjEuMSw2LjgsMjEuMSwxOGMwLDUuOS0yLjIsMTAuNy03LDEzLjVaIi8+CiAgPHBhdGggY2xhc3M9InN0MCIgZD0iTTU2MS4xLDQ3NC40YzE1LjcsMCwyMy4yLDYuNywyMy4yLDIwLjFzLTksMjAuNC0yNC4xLDIwLjQtMjQtOC45LTI0LTIzLjJ2LTE5LjRjMC0xNC42LDguNC0yMy4zLDI0LTIzLjNzMTkuNyw1LjEsMjMuMSwxNC4xYy44LDIuMS4zLDMtMS45LDMuOWwtNC43LDEuN2MtMi4xLjktMywuNC0zLjktMS45LTItNC44LTUuOS03LjQtMTIuNi03LjRzLTEyLjksNC40LTEyLjksMTIuOHYzLjljMi40LS43LDYuOS0xLjcsMTMuOC0xLjdaTTU2MC4zLDUwNC40YzguMywwLDEyLjktMy41LDEyLjktOS45cy0zLjYtOS45LTEyLjgtOS45LTExLjcsMS40LTEzLDJ2NS4xYzAsOC4yLDQuNSwxMi43LDEyLjksMTIuN1oiLz4KICA8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNjIxLjksNDQ4LjljMTUsMCwyMy42LDguMywyMy42LDIxLjR2MjNjMCwxMy4yLTguNiwyMS41LTIzLjYsMjEuNXMtMjMuNy04LjMtMjMuNy0yMS41di0yM2MwLTEzLjEsOC43LTIxLjQsMjMuNy0yMS40Wk02MjIsNDU5LjRjLTgsMC0xMi41LDMuOS0xMi41LDExdjIzYzAsNy4xLDQuNiwxMS4xLDEyLjUsMTEuMXMxMi4zLTQsMTIuMy0xMS4xdi0yM2MwLTcuMS00LjYtMTEtMTIuMy0xMVoiLz4KICA8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNjY4LjksNDc4LjdjLTguMSwwLTE0LjctNi41LTE0LjctMTQuNnM2LjUtMTQuNiwxNC43LTE0LjYsMTQuNiw2LjMsMTQuNiwxNC42LTYuNiwxNC42LTE0LjYsMTQuNlpNNjY4LjksNDcwLjVjMy42LDAsNi40LTMsNi40LTYuM3MtMi45LTYuNS02LjQtNi41LTYuNCwzLTYuNCw2LjUsMi45LDYuMyw2LjQsNi4zWiIvPgogIDxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01MjMuOCw1NTkuOXYxMmMwLDEyLjEtOS4xLDIxLTI1LjUsMjFzLTI1LjUtOC45LTI1LjUtMjMuMnYtMTkuNWMwLTE0LjMsOS4xLTIzLjIsMjUuNS0yMy4yczIwLjksNS4zLDI0LjMsMTQuOWMuNywyLjEuMiwzLjEtMS45LDMuOWwtNC45LDEuN2MtMi4xLjgtMywuNC0zLjgtMS45LTIuMS01LjUtNi4yLTguMi0xMy43LTguMnMtMTQuNCw0LjUtMTQuNCwxMi43djE5LjdjMCw4LjIsNS4yLDEyLjcsMTQuNCwxMi43czE0LjQtNC41LDE0LjQtMTAuNXYtNC44aC0xMy40Yy0yLjIsMC0zLS44LTMtMy4xdi00LjFjMC0yLjMuOC0zLDMtM2gyMS40YzIuMywwLDMsLjcsMywzWiIvPgogIDxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01ODQsNTQ3LjhjMCw5LjMtNC4zLDE1LjUtMTEuNywxOCwxLjIsMSwyLDIuMiwyLjksMy44bDkuNywxOC44YzEsMS43LjcsMy0xLjUsM2gtNS4xYy0zLjgsMC01LjEtLjUtNi4yLTIuN2wtNy40LTE1LjJjLTIuNC00LjktNC42LTYuMi0xMC43LTYuMmgtNi42djIxLjFjMCwyLjItLjcsMy0zLDNoLTUuMWMtMi4yLDAtMy0uOC0zLTN2LTU3LjRjMC0yLjIuOC0zLDMtM2gyNC44YzEyLjQsMCwyMCw3LjMsMjAsMTkuN1pNNTYzLDUzOC42aC0xNS41djE4LjRoMTUuNWM2LDAsOS40LTMuMiw5LjQtOS4ycy0zLjQtOS4yLTkuNC05LjJaIi8+CiAgPHBhdGggY2xhc3M9InN0MCIgZD0iTTY0Ny45LDU5MS42aC00LjdjLTMuOCwwLTQuNi0uNS01LjMtMi43bC00LjEtMTEuNWgtMjQuN2wtNC4yLDExLjVjLS43LDIuMS0xLjIsMi43LTUsMi43aC00LjFjLTIuMiwwLTMuMy0xLTIuNS0zbDIyLjItNThjLjgtMiwxLjctMi41LDMuOC0yLjVoNC43YzIsMCwzLC41LDMuOCwyLjRsMjIuMyw1OC4xYy43LDIsMCwzLTIuMywzWk02MjMuOSw1NDkuNGMtMS45LTUuNS0yLjEtMTAuOC0yLjEtMTAuOWgtLjVjMCwwLDAsNS44LTIsMTAuOGwtNi45LDE4LjloMTguM2wtNi44LTE4LjhaIi8+CiAgPHBhdGggY2xhc3M9InN0MCIgZD0iTTcxMS4yLDU0OC45YzAsMTMtOCwyMC42LTIxLjEsMjAuNmgtMTUuNXYxOWMwLDIuMi0uNywzLTMsM2gtNS4xYy0yLjIsMC0zLS44LTMtM3YtNTcuNGMwLTIuMi44LTMsMy0zaDIzLjdjMTMsMCwyMS4xLDcuOCwyMS4xLDIwLjdaTTY5OS41LDU0OC45YzAtNi40LTMuOS0xMC4zLTEwLjUtMTAuM2gtMTQuNXYyMC41aDE0LjVjNi41LDAsMTAuNS0zLjgsMTAuNS0xMC4yWiIvPgogIDxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik03NzMuMiw1MzEuMnY1Ny40YzAsMi4yLS43LDMtMywzaC01LjFjLTIuMywwLTMtLjgtMy0zdi0yMy44aC0yNi41djIzLjhjMCwyLjItLjcsMy0zLDNoLTUuMWMtMi4yLDAtMy0uOC0zLTN2LTU3LjRjMC0yLjIuOC0zLDMtM2g1LjFjMi4zLDAsMywuOCwzLDN2MjNoMjYuNXYtMjNjMC0yLjIuNy0zLDMtM2g1LjFjMi4zLDAsMywuOCwzLDNaIi8+CiAgPHBhdGggY2xhc3M9InN0MCIgZD0iTTc5MS4xLDUyOC4yaDUuMWMyLjMsMCwzLC44LDMsM3Y1Ny40YzAsMi4yLS43LDMtMywzaC01LjFjLTIuMiwwLTMtLjgtMy0zdi01Ny40YzAtMi4yLjgtMywzLTNaIi8+CiAgPHBhdGggY2xhc3M9InN0MCIgZD0iTTgzOC45LDUyNi45YzEzLjEsMCwyMC45LDUuMywyNC4zLDE0LjkuNywyLjEuMiwzLjEtMS45LDMuOWwtNC45LDEuN2MtMi4yLjYtMywuNC0zLjgtMS45LTItNS41LTYuMi04LjItMTMuNy04LjJzLTE0LjMsNC41LTE0LjMsMTIuN3YxOS42YzAsOC4yLDUuMSwxMi44LDE0LjMsMTIuOHMxMS43LTIuOSwxMy43LTguM2MuOC0yLjIsMS44LTIuNywzLjktMS45bDQuOCwxLjdjMi4xLjgsMi43LDEuOCwxLjksMy45LTMuMyw5LjctMTEuMSwxNS0yNC4zLDE1cy0yNS41LTguOS0yNS41LTIzLjN2LTE5LjRjMC0xNC4zLDkuMS0yMy4yLDI1LjUtMjMuMloiLz4KICA8cGF0aCBjbGFzcz0ic3QwIiBkPSJNODk4LjksNTI2LjljMTIuOCwwLDE5LjIsNC42LDIzLjUsMTMuNCwxLDIsLjUsMy4xLTEuNyw0LjFsLTQuOSwyLjFjLTIsLjktMi45LjUtMy45LTEuNS0yLjQtNC43LTUuOS03LjUtMTMtNy41cy0xMywyLjctMTMsOC4yLDcuMyw3LjYsMTUuNSw4LjVjMTAuNSwxLjIsMjIuNiwzLjksMjIuNiwxOC44cy05LDE5LjctMjUuNSwxOS43LTIwLjgtNS4yLTI0LjUtMTQuOGMtLjgtMi4yLS4zLTMuMiwxLjktMy45bDQuOC0xLjhjMi4xLS43LDMtLjMsMy45LDEuOSwyLjIsNS4zLDcsOC4zLDEzLjgsOC4zczE0LjItMi45LDE0LjItOS4zLTYuNS03LjUtMTQuMS04LjNjLTEwLjgtMS4yLTI0LjItMy0yNC4yLTE4LjcsMC0xMS4zLDguNC0xOS4zLDI0LjUtMTkuM1oiLz4KICA8Zz4KICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yMDEuOSw1MTUuMWwtNDMuNi02Ni42di0yOS43aDE3LjhzNDEuNCw2Mi43LDQxLjQsNjIuN3YzMy41aC0xNS42Wk0yMTcuNCw1MjYuNXYzMy40Yy0uMSwwLTQxLjIsNjIuNS00MS4yLDYyLjVoLTE3LjhjMCwuMSwwLTI5LjUsMC0yOS41bDQzLjYtNjYuM2gxNS40Wk0yNDQuMSw1MjYuNWw0Myw2Ni4zdjI5LjdsLTE3LjcuMi00MC44LTYyLjl2LTMzLjJoMTUuNVpNMjI4LjcsNTE1LjF2LTMzLjVzNDAuOS02Mi44LDQwLjktNjIuOGgxNy41djI5LjdsLTQzLDY2LjZoLTE1LjRaIi8+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzM3LjcsNDk1LjlsLTE4LjksMTkuMi0xMS4zLTExLjZ2LTQ4LjZsMTUuMS0xNS4xLDE1LjEsMTUuMXY0MVpNMzA3LjUsNTg2LjNsMTUuMSwxNS4xLDE1LjEtMTUuMXYtNDFsLTE4LjktMTguOS0xMS4zLDExLjN2NDguNlpNNDE1LjYsNDMzLjhsLTE1LjEsMTUuM2gtNTdsLTE1LjEtMTUuMywxNS4xLTE1aDU3bDE1LjEsMTVaTTM0My41LDYyMi40bC0xNS4xLTE1LjEsMTUuMS0xNS4xaDU3bDE1LjEsMTUuMS0xNS4xLDE1LjFoLTU3Wk00MzYuMyw1MDMuNWwtMTEuMywxMS42LTE4LjktMTkuMnYtNDFsMTUuMS0xNS4xLDE1LjEsMTUuMXY0OC42Wk00MzYuMyw1ODYuM2wtMTUuMSwxNS4xLTE1LjEtMTUuMXYtNDFsMTguOS0xOC45LDExLjMsMTEuM3Y0OC42WiIvPgogIDwvZz4KPC9zdmc+';

function escHtml(s) { return s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : ''; }

/**
 * Shared header CSS — used by both shell() and renderer.js
 */
function getSharedHeaderCSS() {
  return `
  .topbar {
    height: 180px; background: var(--surface); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 24px; gap: 16px;
  }
  .topbar-logo { display: flex; align-items: center; text-decoration: none; flex-shrink: 0; }
  .topbar-logo img { height: 162px; }
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
    .topbar { padding: 0 12px; gap: 8px; }
    .topbar-stats { display: none; }
    .topbar-nav { gap: 0; }
    .topbar-nav a { padding: 4px 8px; font-size: 12px; }
    .topbar-title { display: none; }
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
function sharedHeader({ user = null, title = 'XO Studio', showNav, showAuth = true, stats = '', activePage = '' } = {}) {
  const shouldShowNav = showNav !== undefined ? showNav : !!user;

  const navHtml = (user && shouldShowNav) ? `
  <nav class="topbar-nav">
    <a href="/"${activePage === 'previews' ? ' class="active"' : ''}>Previews</a>
    <a href="/admin"${activePage === 'admin' ? ' class="active"' : ''}>Admin</a>
  </nav>
  <div class="topbar-sep"></div>` : '';

  const authHtml = showAuth
    ? (user
        ? `<div class="topbar-user">${escHtml(user.name || user.email)} · <a href="/logout">Log ud</a></div>`
        : `<a href="/login" class="topbar-login">Log ind</a>`)
    : '';

  return `<div class="topbar">
  <a href="https://xo.dk" target="_blank" class="topbar-logo">
    <img src="${XO_LOGO_BASE64}" alt="XO">
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
          <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText(location.origin+'${previewUrl}').then(()=>this.textContent='✅').catch(()=>{})">📋</button>
          <button class="btn btn-secondary btn-sm" onclick="toggleEdit('${escHtml(p.id)}')">✏️ Redigér</button>
          <form method="POST" action="/delete/${escHtml(p.id)}" onsubmit="return confirm('Slet preview?')" style="margin:0;">
            <button type="submit" class="btn btn-danger btn-sm">🗑</button>
          </form>
        </div>
      </td>
    </tr>
    <tr id="edit-${escHtml(p.id)}" style="display:none;background:var(--surface2);">
      <td colspan="5" style="padding:16px 24px;">
        <form method="POST" action="/edit/${escHtml(p.id)}" style="display:flex;flex-direction:column;gap:12px;max-width:600px;">
          <div style="font-size:13px;font-weight:600;color:var(--text-2);margin-bottom:4px;">Redigér preview</div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <div style="flex:1;min-width:200px;">
              <label class="label">Campaign navn</label>
              <input class="input" name="name" value="${escHtml(p.name)}" placeholder="Campaign navn">
            </div>
            <div style="flex:2;min-width:300px;">
              <label class="label">Source URL</label>
              <input class="input" name="url" value="${escHtml(p.zuuvi_url)}" placeholder="Indsæt preview-link" required>
            </div>
          </div>
          <div style="display:flex;gap:8px;">
            <button type="submit" class="btn btn-primary btn-sm">🔄 Gem & regenerér</button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="toggleEdit('${escHtml(p.id)}')">Annullér</button>
          </div>
        </form>
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
  <div class="card" style="padding:0;overflow:hidden;">
    <table style="width:100%;border-collapse:collapse;">
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
function toggleEdit(id) {
  const row = document.getElementById('edit-' + id);
  row.style.display = row.style.display === 'none' ? 'table-row' : 'none';
}
</script>`;
  return shell('Dashboard', body, { ...ctx, activePage: 'previews' });
}

// ── New preview ───────────────────────────────────────────────────────────────
function newPreview({ error }, ctx) {
  const body = `
<div class="container" style="max-width:600px;">
  <div style="margin-bottom:24px;">
    <h1 style="font-size:22px;font-weight:700;">Nyt Preview</h1>
    <p style="font-size:13px;color:var(--text-3);margin-top:4px;">Indsæt et Zuuvi share-link for at starte.</p>
  </div>
  ${error ? `<div class="error-msg">${escHtml(error)}</div>` : ''}
  <form method="POST" action="/new" class="card" style="display:flex;flex-direction:column;gap:20px;">
    <div>
      <label class="label" for="name">Campaign Navn (valgfrit)</label>
      <input class="input" type="text" id="name" name="name" placeholder="E.g., Sommerkampagne 2024">
    </div>
    <div>
      <label class="label" for="url">Zuuvi Share URL</label>
      <input class="input" type="url" id="url" name="url" placeholder="https://app.zuuvi.com/share/..." required>
    </div>
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


// ── Admin dashboard ───────────────────────────────────────────────────────────
function admin({ previews }, ctx) {
    const rows = previews.map(p => {
    const statusClass = p.status === 'ready' ? 'status-ready' : (p.status === 'error' ? 'status-error' : '');
    const statusText = p.status === 'ready' ? `✅ Klar (${p.live_count}/${p.banner_count})` : (p.status === 'error' ? '❌ Fejl' : 'Genererer...');
    const previewUrl = `/preview/${p.id}`;
    return `
    <tr class="${statusClass}">
      <td style="padding:12px 16px;white-space:nowrap;">
        <a href="${previewUrl}" target="_blank" style="font-weight:600;color:var(--text);">${escHtml(p.name)}</a>
        <div style="font-size:11px;color:var(--text-3);">${p.created_by} @ ${new Date(p.created_at).toLocaleString('da-DK',{dateStyle:'short',timeStyle:'short'})}</div>
      </td>
      <td style="padding:12px 16px;max-width:300px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:var(--mono);font-size:12px;color:var(--text-2);">
        <a href="${escHtml(p.zuuvi_url)}" target="_blank" title="${escHtml(p.zuuvi_url)}">${escHtml(p.zuuvi_url)}</a>
      </td>
      <td style="padding:12px 16px;font-size:12px;font-weight:500;">${statusText}</td>
      <td style="padding:12px 16px;font-size:12px;text-align:center;">${p.views}</td>
      <td style="padding:12px 16px;">
        <div style="display:flex;align-items:center;gap:6px;">
          <a href="${previewUrl}" class="btn btn-secondary btn-sm" target="_blank">👁️ Vis</a>
          <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText(location.origin+'${previewUrl}').then(()=>this.textContent='✅').catch(()=>{})">📋</button>
          <button class="btn btn-secondary btn-sm" onclick="toggleEdit('${escHtml(p.id)}')">✏️ Redigér</button>
          <form method="POST" action="/delete/${escHtml(p.id)}" onsubmit="return confirm('Slet preview?')" style="margin:0;">
            <button type="submit" class="btn btn-danger btn-sm">🗑</button>
          </form>
        </div>
      </td>
    </tr>
    <tr id="edit-${escHtml(p.id)}" style="display:none;background:var(--surface2);">
      <td colspan="5" style="padding:16px 24px;">
        <form method="POST" action="/edit/${escHtml(p.id)}" style="display:flex;flex-direction:column;gap:12px;max-width:600px;">
          <div style="font-size:13px;font-weight:600;color:var(--text-2);margin-bottom:4px;">Redigér preview</div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <div style="flex:1;min-width:200px;">
              <label class="label">Campaign navn</label>
              <input class="input" name="name" value="${escHtml(p.name)}" placeholder="Campaign navn">
            </div>
            <div style="flex:2;min-width:300px;">
              <label class="label">Source URL</label>
              <input class="input" name="url" value="${escHtml(p.zuuvi_url)}" placeholder="Indsæt preview-link" required>
            </div>
          </div>
          <div style="display:flex;gap:8px;">
            <button type="submit" class="btn btn-primary btn-sm">🔄 Gem & regenerér</button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="toggleEdit('${escHtml(p.id)}')">Annullér</button>
          </div>
        </form>
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
      <h1 style="font-size:22px;font-weight:700;">Admin Dashboard</h1>
      <p style="font-size:13px;color:var(--text-3);margin-top:4px;">${previews.length} preview${previews.length !== 1 ? 's' : ''} i alt</p>
    </div>
    <a href="/new" class="btn btn-primary">+ Nyt Preview</a>
  </div>
  <div class="card" style="padding:0;overflow:hidden;">
    <table style="width:100%;border-collapse:collapse;">
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
function toggleEdit(id) {
  const row = document.getElementById('edit-' + id);
  row.style.display = row.style.display === 'none' ? 'table-row' : 'none';
}
</script>`;
 return shell('Admin', body, { ...ctx, activePage: 'admin' });
}

module.exports = { login, dashboard, new: newPreview, generating, error, admin, sharedHeader, getSharedHeaderCSS, XO_LOGO_BASE64, escHtml };
