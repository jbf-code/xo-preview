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
    height: 90px; background: var(--header-bg, var(--surface)); border-bottom: 1px solid var(--border); overflow: visible;
    display: flex; align-items: center; padding: 0 24px; gap: 16px;
  }
  .topbar-logo { display: flex; align-items: center; text-decoration: none; flex-shrink: 0; overflow: visible; z-index: 10; }
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
function sharedHeader({ user = null, title = 'XO Studio', showNav, showAuth = true, stats = '', activePage = '', logoSrc = null } = {}) {
  const shouldShowNav = showNav !== undefined ? showNav : !!user;

  const navHtml = (user && shouldShowNav) ? `
  <nav class="topbar-nav">
    <a href="/"${activePage === 'previews' ? ' class="active"' : ''}>Previews</a>
    <a href="/hosting"${activePage === 'hosting' ? ' class="active"' : ''}>Hosting</a>
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
  const userRows = (users || []).map(u => `
    <tr>
      <td style="padding:10px 16px;font-weight:500;">${escHtml(u.name)}</td>
      <td style="padding:10px 16px;color:var(--text-2);font-size:13px;">${escHtml(u.email)}</td>
    </tr>`).join('');

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
        </tr>
      </thead>
      <tbody>
        ${userRows || '<tr><td colspan="2" style="text-align:center;padding:40px 0;color:var(--text-3);">Ingen brugere</td></tr>'}
      </tbody>
    </table>
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
            ${!t.is_default ? `
            <form method="POST" action="/settings/themes/${escHtml(t.id)}/delete" style="margin:0;">
              <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Slet tema?')">🗑 Slet</button>
            </form>` : `<span style="font-size:11px;color:var(--text-3);">Standard-tema kan ikke slettes</span>`}
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
  return shell('Indstillinger', body, { ...ctx, activePage: 'settings' });
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

module.exports = { login, dashboard, new: newPreview, generating, error, settings, hosting, 'hosting-new': hostingNew, 'hosting-detail': hostingDetail, 'hosting-replace': hostingReplace, 'hosting-replace-confirm': hostingReplaceConfirm, 'edit-preview': editPreview, 'confirm-delete': confirmDelete, 'theme-new': themeNew, sharedHeader, getSharedHeaderCSS, XO_LOGO_BASE64, escHtml };
