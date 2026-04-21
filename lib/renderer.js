/**
 * Generate the XO-branded preview HTML that gets served as the public preview page
 */

// XO logo as base64 (extracted from xo.dk)
const XO_LOGO_BASE64 = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAxMDgwIDEwODAiPgogIDwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAzMC4yLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiAyLjEuMSBCdWlsZCAxKSAgLS0+CiAgPGRlZnM+CiAgICA8c3R5bGU+CiAgICAgIC5zdDAgewogICAgICAgIGZpbGw6ICNmZmY7CiAgICAgIH0KCiAgICAgIC5zdDEgewogICAgICAgIGZpbGw6ICNmZjU4MDA7CiAgICAgIH0KICAgIDwvc3R5bGU+CiAgPC9kZWZzPgogIDxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01MTIuOSw0ODAuNWM2LjMsMi45LDksOC41LDksMTUuMSwwLDExLjQtNy40LDE5LjMtMjMsMTkuM3MtMjAuOC01LjMtMjQuMS0xNC45Yy0uOC0yLjEtLjMtMy4xLDEuOS0zLjlsNC44LTEuN2MyLjEtLjgsMy4xLS4zLDMuOSwxLjksMiw1LjUsNC45LDguMywxMy41LDguM3MxMS4zLTMuNSwxMS4zLTkuMS0zLjEtOC45LTkuMy04LjloLTkuM2MtMi4yLDAtMy0uNy0zLTN2LTRjMC0yLjMuOC0zLDMtM2g3LjdjNS42LDAsOS40LTMuMiw5LjQtOC40cy0zLjUtOC42LTEwLTguNi0xMC43LDIuNi0xMi43LDguMWMtLjgsMi4yLTEuNywyLjUtMy45LDEuOWwtNC44LTEuN2MtMi4xLS44LTIuNy0xLjgtMS45LTMuOSwzLjMtOS42LDEwLjEtMTQuOCwyMy41LTE0LjhzMjEuMSw2LjgsMjEuMSwxOGMwLDUuOS0yLjIsMTAuNy03LDEzLjVaIi8+CiAgPHBhdGggY2xhc3M9InN0MCIgZD0iTTU2MS4xLDQ3NC40YzE1LjcsMCwyMy4yLDYuNywyMy4yLDIwLjFzLTksMjAuNC0yNC4xLDIwLjQtMjQtOC45LTI0LTIzLjJ2LTE5LjRjMC0xNC42LDguNC0yMy4zLDI0LTIzLjNzMTkuNyw1LjEsMjMuMSwxNC4xYy44LDIuMS4zLDMtMS45LDMuOWwtNC43LDEuN2MtMi4xLjktMywuNC0zLjktMS45LTItNC44LTUuOS03LjQtMTIuNi03LjRzLTEyLjksNC40LTEyLjksMTIuOHYzLjljMi40LS43LDYuOS0xLjcsMTMuOC0xLjdaTTU2MC4zLDUwNC40YzguMywwLDEyLjktMy41LDEyLjktOS45cy0zLjYtOS45LTEyLjgtOS45LTExLjcsMS40LTEzLDJ2NS4xYzAsOC4yLDQuNSwxMi43LDEyLjksMTIuN1oiLz4KICA8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNjIxLjksNDQ4LjljMTUsMCwyMy42LDguMywyMy42LDIxLjR2MjNjMCwxMy4yLTguNiwyMS41LTIzLjYsMjEuNXMtMjMuNy04LjMtMjMuNy0yMS41di0yM2MwLTEzLjEsOC43LTIxLjQsMjMuNy0yMS40Wk02MjIsNDU5LjRjLTgsMC0xMi41LDMuOS0xMi41LDExdjIzYzAsNy4xLDQuNiwxMS4xLDEyLjUsMTEuMXMxMi4zLTQsMTIuMy0xMS4xdi0yM2MwLTcuMS00LjYtMTEtMTIuMy0xMVoiLz4KICA8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNjY4LjksNDc4LjdjLTguMSwwLTE0LjctNi41LTE0LjctMTQuNnM2LjUtMTQuNiwxNC43LTE0LjYsMTQuNiw2LjMsMTQuNiwxNC42LTYuNiwxNC42LTE0LjYsMTQuNlpNNjY4LjksNDcwLjVjMy42LDAsNi40LTMsNi40LTYuM3MtMi45LTYuNS02LjQtNi41LTYuNCwzLTYuNCw2LjUsMi45LDYuMyw2LjQsNi4zWiIvPgogIDxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01MjMuOCw1NTkuOXYxMmMwLDEyLjEtOS4xLDIxLTI1LjUsMjFzLTI1LjUtOC45LTI1LjUtMjMuMnYtMTkuNWMwLTE0LjMsOS4xLTIzLjIsMjUuNS0yMy4yczIwLjksNS4zLDI0LjMsMTQuOWMuNywyLjEuMiwzLjEtMS45LDMuOWwtNC45LDEuN2MtMi4xLjgtMywuNC0zLjgtMS45LTIuMS01LjUtNi4yLTguMi0xMy43LTguMnMtMTQuNCw0LjUtMTQuNCwxMi43djE5LjdjMCw4LjIsNS4yLDEyLjcsMTQuNCwxMi43czE0LjQtNC41LDE0LjQtMTAuNXYtNC44aC0xMy40Yy0yLjIsMC0zLS44LTMtMy4xdi00LjFjMC0yLjMuOC0zLDMtM2gyMS40YzIuMywwLDMsLjcsMywzWiIvPgogIDxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01ODQsNTQ3LjhjMCw5LjMtNC4zLDE1LjUtMTEuNywxOCwxLjIsMSwyLDIuMiwyLjksMy44bDkuNywxOC44YzEsMS43LjcsMy0xLjUsM2gtNS4xYy0zLjgsMC01LjEtLjUtNi4yLTIuN2wtNy40LTE1LjJjLTIuNC00LjktNC42LTYuMi0xMC43LTYuMmgtNi42djIxLjFjMCwyLjItLjcsMy0zLDNoLTUuMWMtMi4yLDAtMy0uOC0zLTN2LTU3LjRjMC0yLjIuOC0zLDMtM2gyNC44YzEyLjQsMCwyMCw3LjMsMjAsMTkuN1pNNTYzLDUzOC42aC0xNS41djE4LjRoMTUuNWM2LDAsOS40LTMuMiw5LjQtOS4ycy0zLjQtOS4yLTkuNC05LjJaIi8+CiAgPHBhdGggY2xhc3M9InN0MCIgZD0iTTY0Ny45LDU5MS42aC00LjdjLTMuOCwwLTQuNi0uNS01LjMtMi43bC00LjEtMTEuNWgtMjQuN2wtNC4yLDExLjVjLS43LDIuMS0xLjIsMi43LTUsMi43aC00LjFjLTIuMiwwLTMuMy0xLTIuNS0zbDIyLjItNThjLjgtMiwxLjctMi41LDMuOC0yLjVoNC43YzIsMCwzLC41LDMuOCwyLjRsMjIuMyw1OC4xYy43LDIsMCwzLTIuMywzWk02MjMuOSw1NDkuNGMtMS45LTUuNS0yLjEtMTAuOC0yLjEtMTAuOWgtLjVjMCwwLDAsNS40LTIsMTAuOGwtNi45LDE4LjloMTguM2wtNi44LTE4LjhaIi8+CiAgPHBhdGggY2xhc3M9InN0MCIgZD0iTTcxMS4yLDU0OC45YzAsMTMtOCwyMC42LTIxLjEsMjAuNmgtMTUuNXYxOWMwLDIuMi0uNywzLTMsM2gtNS4xYy0yLjIsMC0zLS44LTMtM3YtNTcuNGMwLTIuMi44LTMsMy0zaDIzLjdjMTMsMCwyMS4xLDcuOCwyMS4xLDIwLjdaTTY5OS41LDU0OC45YzAtNi40LTMuOS0xMC4zLTEwLjUtMTAuM2gtMTQuNXYyMC41aDE0LjVjNi41LDAsMTAuNS0zLjgsMTAuNS0xMC4yWiIvPgogIDxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik03NzMuMiw1MzEuMnY1Ny40YzAsMi4yLS43LDMtMywzaC01LjFjLTIuMywwLTMtLjgtMy0zdi0yMy44aC0yNi41djIzLjhjMCwyLjItLjcsMy0zLDNoLTUuMWMtMi4yLDAtMy0uOC0zLTN2LTU3LjRjMC0yLjIuOC0zLDMtM2g1LjFjMi4zLDAsMywuOCwzLDN2MjNoMjYuNXYtMjNjMC0yLjIuNy0zLDMtM2g1LjFjMi4zLDAsMywuOCwzLDNaIi8+CiAgPHBhdGggY2xhc3M9InN0MCIgZD0iTTc5MS4xLDUyOC4yaDUuMWMyLjMsMCwzLC44LDMsM3Y1Ny40YzAsMi4yLS43LDMtMywzaC01LjFjLTIuMiwwLTMtLjgtMy0zdi01Ny40YzAtMi4yLjgtMywzLTNaIi8+CiAgPHBhdGggY2xhc3M9InN0MCIgZD0iTTgzOC45LDUyNi45YzEzLjEsMCwyMC45LDUuMywyNC4zLDE0LjkuNywyLjEuMiwzLjEtMS45LDMuOWwtNC45LDEuN2MtMi4yLjYtMywuNC0zLjgtMS45LTItNS41LTYuMi04LjItMTMuNy04LjJzLTE0LjMsNC41LTE0LjMsMTIuN3YxOS42YzAsOC4yLDUuMSwxMi44LDE0LjMsMTIuOHMxMS43LTIuOSwxMy43LTguM2MuOC0yLjIsMS44LTIuNywzLjktMS45bDQuOCwxLjdjMi4xLjgsMi43LDEuOCwxLjksMy45LTMuMyw5LjctMTEuMSwxNS0yNC4zLDE1cy0yNS41LTguOS0yNS41LTIzLjN2LTE5LjRjMC0xNC4zLDkuMS0yMy4yLDI1LjUtMjMuMloiLz4KICA8cGF0aCBjbGFzcz0ic3QwIiBkPSJNODk4LjksNTI2LjljMTIuOCwwLDE5LjIsNC42LDIzLjUsMTMuNCwxLDIsLjUsMy4xLTEuNyw0LjFsLTQuOSwyLjFjLTIsLjktMi45LjUtMy45LTEuNS0yLjQtNC43LTUuOS03LjUtMTMtNy41cy0xMywyLjctMTMsOC4yLDcuMyw3LjYsMTUuNSw4LjVjMTAuNSwxLjIsMjIuNiwzLjksMjIuNiwxOC44cy05LDE5LjctMjUuNSwxOS43LTIwLjgtNS4yLTI0LjUtMTQuOGMtLjgtMi4yLS4zLTMuMiwxLjktMy45bDQuOC0xLjhjMi4xLS43LDMtLjMsMy45LDEuOSwyLjIsNS4zLDcsOC4zLDEzLjgsOC4zczE0LjItMi45LDE0LjItOS4zLTYuNS03LjUtMTQuMS04LjNjLTEwLjgtMS4yLTI0LjItMy0yNC4yLTE4LjcsMC0xMS4zLDguNC0xOS4zLDI0LjUtMTkuM1oiLz4KICA8Zz4KICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yMDEuOSw1MTUuMWwtNDMuNi02Ni42di0yOS43aDE3LjhzNDEuNCw2Mi43LDQxLjQsNjIuN3YzMy41aC0xNS42Wk0yMTcuNCw1MjYuNXYzMy40Yy0uMSwwLTQxLjIsNjIuNS00MS4yLDYyLjVoLTE3LjhjMCwuMSwwLTI5LjUsMC0yOS41bDQzLjYtNjYuM2gxNS40Wk0yNDQuMSw1MjYuNWw0Myw2Ni4zdjI5LjdsLTE3LjcuMi00MC44LTYyLjl2LTMzLjJoMTUuNVpNMjI4LjcsNTE1LjF2LTMzLjVzNDAuOS02Mi44LDQwLjktNjIuOGgxNy41djI5LjdsLTQzLDY2LjZoLTE1LjRaIi8+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzM3LjcsNDk1LjlsLTE4LjksMTkuMi0xMS4zLTExLjZ2LTQ4LjZsMTUuMS0xNS4xLDE1LjEsMTUuMXY0MVpNMzA3LjUsNTg2LjNsMTUuMSwxNS4xLDE1LjEtMTUuMXYtNDFsLTE4LjktMTguOS0xMS4zLDExLjN2NDguNlpNNDE1LjYsNDMzLjhsLTE1LjEsMTUuM2gtNTdsLTE1LjEtMTUuMywxNS4xLTE1aDU3bDE1LjEsMTVaTTM0My41LDYyMi40bC0xNS4xLTE1LjEsMTUuMS0xNS4xaDU3bDE1LjEsMTUuMS0xNS4xLDE1LjFoLTU3Wk00MzYuMyw1MDMuNWwtMTEuMywxMS42LTE4LjktMTkuMnYtNDFsMTUuMS0xNS4xLDE1LjEsMTUuMXY0OC42Wk00MzYuMyw1ODYuM2wtMTUuMSwxNS4xLTE1LjEtMTUuMXYtNDFsMTguOS0xOC45LDExLjMsMTEuM3Y0OC42WiIvPgogIDwvZz4KPC9zdmc+';

function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escAttr(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function generatePreviewHtml({ id, campaignName, clientName, banners, zuuviUrl }) {
  const generatedAtFormatted = new Date().toLocaleString('da-DK', {
    timeZone: 'Europe/Copenhagen',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });

  const validBanners = banners.filter(b => b.html && b.html.length > 100).length;

  // Build banner items
  const bannerItems = banners.map((b, idx) => {
    const hasHtml = b.html && b.html.length > 100;
    const w = b.width || 300;
    const h = b.height || 250;
    // Only scale if banner hits container edge — responsive
    const scale = 1;
    const displayW = w;
    const displayH = h;

    let content = '';
    if (hasHtml) {
      content = `<iframe class="banner-iframe" srcdoc="${escAttr(b.html)}" width="${w}" height="${h}" scrolling="no" frameborder="0" allowtransparency="true" allow="autoplay" data-banner-index="${idx}" data-width="${w}" data-height="${h}"></iframe>`;
    } else {
      content = `<div class="banner-placeholder" style="width:${w}px;height:${h}px;"><span>⚠️ Content unavailable</span></div>`;
    }

    return `
      <div class="banner-item" id="banner-${idx}" data-index="${idx}">
        <div class="banner-meta">
          <div class="banner-label">
            <span class="format-chip">${escHtml(b.label)}</span>
            <span class="format-pixels">${w} × ${h} px</span>

          </div>
          <div class="banner-actions">
            <button class="btn-icon" title="Replay" onclick="replayBanner(${idx})">↺ Replay</button>
          </div>
        </div>
        <div class="banner-wrapper" style="max-width:${w}px;">
          <div class="banner-scale-container" style="width:${w}px;height:${h}px;">
            ${content}
          </div>
        </div>
      </div>`;
  }).join('\n');

  // Sidebar nav
  const sidebarNav = banners.map((b, idx) => {
    const w = b.width || 0;
    const h = b.height || 0;
    return `<button class="nav-item" onclick="scrollToBanner(${idx})" title="${escHtml(b.label)}">
        <span class="nav-size">${escHtml(b.label)}</span>
        <span class="nav-px">${w}×${h}</span>
      </button>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="da">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(campaignName)} — XO Studio</title>
  <link rel="icon" type="image/png" href="${XO_LOGO_BASE64}">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0c1a28; --surface: #142233; --surface2: #1a2d40; --surface3: #213548;
      --border: #2a2a2a; --border2: #333; --text: #e8e8e8; --text-2: #aaa; --text-3: #666;
      --accent: #FF5800; --accent-2: #FF7A33; --accent-dim: #331500;
      --header-h: 64px; --sidebar-w: 200px;
      --font: system-ui, -apple-system, 'Inter', 'Segoe UI', sans-serif;
      --mono: 'SF Mono', 'Fira Code', ui-monospace, monospace;
      --radius: 6px; --radius-lg: 10px;
    }
    html { scroll-behavior: smooth; }
    body { font-family: var(--font); background: var(--bg); color: var(--text); min-height: 100vh; }

    .header {
      position: fixed; top: 0; left: 0; right: 0; height: var(--header-h);
      background: var(--surface); border-bottom: 1px solid var(--border);
      display: flex; align-items: center; padding: 0 24px; gap: 20px; z-index: 1000;
    }
    .header-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; flex-shrink: 0; }
    .logo-img { height: 28px; width: auto; }
    .logo-divider { width: 1px; height: 24px; background: var(--border2); }
    .logo-sub { font-size: 13px; color: var(--text-2); font-weight: 500; letter-spacing: -0.2px; }
    .header-divider { width: 1px; height: 28px; background: var(--border2); flex-shrink: 0; }
    .header-campaign { flex: 1; min-width: 0; }
    .campaign-name { font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .campaign-meta { font-size: 11px; color: var(--text-3); margin-top: 2px; }
    .campaign-meta span + span::before { content: " · "; }
    .header-stats { display: flex; gap: 12px; flex-shrink: 0; }
    .stat-pill {
      display: flex; align-items: center; gap: 6px; background: var(--surface2);
      border: 1px solid var(--border); border-radius: 20px; padding: 4px 12px;
      font-size: 12px; font-weight: 500; color: var(--text-2);
    }
    .stat-pill .count { color: var(--accent); font-weight: 700; }

    .layout { display: flex; margin-top: var(--header-h); min-height: calc(100vh - var(--header-h)); }
    .sidebar {
      width: var(--sidebar-w); background: var(--surface); border-right: 1px solid var(--border);
      position: fixed; top: var(--header-h); left: 0; bottom: 0; overflow-y: auto; padding: 16px 0;
    }
    .sidebar-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-3); padding: 0 16px; margin-bottom: 8px; }
    .nav-item {
      display: flex; flex-direction: column; width: 100%; padding: 8px 16px;
      background: transparent; border: none; border-left: 2px solid transparent;
      cursor: pointer; text-align: left; transition: all 0.15s; gap: 2px; color: var(--text);
    }
    .nav-item:hover { background: var(--surface2); border-left-color: var(--border2); }
    .nav-item.active { background: var(--accent-dim); border-left-color: var(--accent); }
    .nav-size { font-size: 12px; font-weight: 600; font-family: var(--mono); }
    .nav-px { font-size: 10px; color: var(--text-3); font-family: var(--mono); }

    .main-content { margin-left: var(--sidebar-w); flex: 1; padding: 40px 48px; }
    .banners-list { display: flex; flex-direction: column; gap: 48px; }
    .banner-item { scroll-margin-top: calc(var(--header-h) + 24px); }
    .banner-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
    .banner-label { display: flex; align-items: center; gap: 10px; }
    .format-chip { font-family: var(--mono); font-size: 13px; font-weight: 700; background: var(--surface2); border: 1px solid var(--border2); padding: 4px 10px; border-radius: 4px; }
    .format-pixels { font-size: 12px; color: var(--text-3); font-family: var(--mono); }

    .banner-actions { display: flex; gap: 8px; }
    .btn-icon { font-size: 11px; font-weight: 500; padding: 5px 12px; border-radius: var(--radius); border: 1px solid var(--border2); background: var(--surface2); color: var(--text-2); cursor: pointer; }
    .btn-icon:hover { background: var(--surface3); color: var(--text); }
    .banner-wrapper { position: relative; background: #0d0d0d; border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; max-width: 100%; }
    @media (max-width: 1200px) { .banner-wrapper { transform-origin: top left; } }
    .banner-scale-container { display: block; }
    .banner-iframe { display: block; border: none; background: transparent; }
    .banner-placeholder { display: flex; align-items: center; justify-content: center; background: var(--surface2); color: var(--text-3); font-size: 13px; }

    .playback-bar {
      position: fixed; bottom: 0; left: var(--sidebar-w); right: 0; height: 52px;
      background: var(--surface); border-top: 1px solid var(--border);
      display: flex; align-items: center; padding: 0 24px; gap: 16px; z-index: 999;
    }
    .playback-btn { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--border2); background: var(--surface2); color: var(--text); font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .playback-btn:hover { border-color: var(--accent); }
    .playback-btn.active { background: var(--accent); border-color: var(--accent); }
    .playback-sep { width: 1px; height: 20px; background: var(--border); }
    .playback-info { font-size: 11px; color: var(--text-3); }
    .playback-info strong { color: var(--text-2); }
    .footer-spacer { height: 72px; }

    .shared-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--accent-dim); border: 1px solid var(--accent); border-radius: 20px; padding: 4px 14px; font-size: 11px; color: var(--accent-2); font-weight: 600; }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

    @media (max-width: 900px) {
      :root { --sidebar-w: 0px; }
      .sidebar { display: none; }
      .main-content { padding: 24px 20px; }
      .playback-bar { left: 0; }
    }
  </style>
</head>
<body>
<header class="header">
  <a href="https://xo.dk" target="_blank" class="header-logo" style="text-decoration:none;">  
    <img src="${XO_LOGO_BASE64}" alt="XO" class="logo-img">
    <div class="logo-divider"></div>
    <span class="logo-sub">Studio</span>
  </a>
  <div class="header-divider"></div>
  <div class="header-campaign">
    <div class="campaign-name">${escHtml(campaignName)}</div>
    <div class="campaign-meta">
      ${clientName ? `<span>${escHtml(clientName)}</span>` : ''}
      <span>Generated ${escHtml(generatedAtFormatted)}</span>
    </div>
  </div>
  <div class="header-stats">
    <a href="https://xo.dk" target="_blank" class="shared-badge" style="text-decoration:none;">🔗 Delt fra XO</a>
    <div class="stat-pill"><span>Formats</span><span class="count">${banners.length}</span></div>
    <div class="stat-pill"><span>Live</span><span class="count">${validBanners}</span></div>
  </div>
</header>

<div class="layout">
  <nav class="sidebar">
    <div class="sidebar-label">Formats</div>
    ${sidebarNav}
  </nav>
  <main class="main-content">
    <div class="banners-list">
      ${bannerItems || '<p style="color:var(--text-3);padding:40px 0;">No banners found.</p>'}
    </div>
    <div class="footer-spacer"></div>
  </main>
</div>

<div class="playback-bar">
  <button class="playback-btn active" onclick="replayAll()">↺</button>
  <div class="playback-sep"></div>
  <div class="playback-info">
    <strong>${banners.length}</strong> formats · <strong>${validBanners}</strong> live

  </div>
</div>

<script>
  const navItems = document.querySelectorAll('.nav-item');
  const bannerEls = document.querySelectorAll('.banner-item');
  function scrollToBanner(i) { document.getElementById('banner-'+i)?.scrollIntoView({behavior:'smooth',block:'start'}); setActive(i); }
  function setActive(i) { navItems.forEach((n,j)=>n.classList.toggle('active',j===i)); }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) { const i=parseInt(e.target.dataset.index); if(!isNaN(i)) setActive(i); }});
  }, { rootMargin: '-20% 0px -60% 0px' });
  bannerEls.forEach(el => obs.observe(el));
  function replayAll() {
    document.querySelectorAll('.banner-iframe').forEach(f => { const s=f.getAttribute('srcdoc'); if(s){f.srcdoc='';setTimeout(()=>f.srcdoc=s,50);} });
  }
  function replayBanner(i) {
    const f=document.querySelector('.banner-iframe[data-banner-index="'+i+'"]'); if(!f)return;
    const s=f.getAttribute('srcdoc'); if(s){f.srcdoc='';setTimeout(()=>f.srcdoc=s,50);}
  }
  if(navItems.length>0) setActive(0);
</script>
</body>
</html>`;
}

module.exports = { generatePreviewHtml };
