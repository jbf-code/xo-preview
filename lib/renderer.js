/**
 * Generate the XO-branded preview HTML that gets served as the public preview page
 */
const { sharedHeader, getSharedHeaderCSS, XO_LOGO_BASE64, escHtml } = require('./pages');

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

  const statsHtml = `
    <div class="stat-pill">Formats <span class="count">${banners.length}</span></div>
    <div class="stat-pill">Live <span class="count">${validBanners}</span></div>
    <a href="https://xo.dk" target="_blank" class="shared-badge">Delt fra XO</a>`;

  const headerHtml = sharedHeader({
    title: campaignName,
    user: null, // Public page, no user
    showNav: false,
    stats: statsHtml,
  });


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
      --header-h: 70px; --sidebar-w: 200px;
      --font: system-ui, -apple-system, 'Inter', 'Segoe UI', sans-serif;
      --mono: 'SF Mono', 'Fira Code', ui-monospace, monospace;
      --radius: 8px;
    }
    html { scroll-behavior: smooth; }
    body { font-family: var(--font); background: var(--bg); color: var(--text); min-height: 100vh; }

    ${getSharedHeaderCSS()}

    .topbar { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; }

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
    .banner-wrapper { position: relative; background: #0d0d0d; border: 1px solid var(--border); border-radius: 0; overflow: hidden; max-width: 100%; }
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
${headerHtml}
<div class="layout">
  <aside class="sidebar">
    <div class="sidebar-label">Formats</div>
    <nav class="sidebar-nav">${sidebarNav}</nav>
  </aside>
  <main class="main-content">
    <div class="banners-list">${bannerItems}</div>
    <div class="footer-spacer"></div>
  </main>
</div>
<div class="playback-bar">
  <button id="play-all-btn" class="playback-btn" onclick="playAllBanners()" title="Play all">▶</button>
  <div class="playback-sep"></div>
  <div class="playback-info">
    Viser <strong>${banners.length}</strong> formater. <a href="${escHtml(zuuviUrl)}" target="_blank" style="color:var(--text-3);text-decoration:underline;">Se originalt Zuuvi link</a>
  </div>
</div>

<script>
  let activeBanner = -1;
  const bannerCount = ${banners.length};
  const navItems = document.querySelectorAll('.nav-item');

  function setActive(index) {
    if (activeBanner > -1) navItems[activeBanner].classList.remove('active');
    if (index > -1) navItems[index].classList.add('active');
    activeBanner = index;
  }

  function scrollToBanner(index) {
    const bannerEl = document.getElementById('banner-' + index);
    if (bannerEl) bannerEl.scrollIntoView();
  }
  
  function replayBanner(index) {
    const banner = document.querySelector(\`[data-banner-index="\${index}"]\`);
    if (banner) {
      banner.srcdoc = banner.srcdoc;
    }
  }

  function playAllBanners() {
    const btn = document.getElementById('play-all-btn');
    btn.classList.toggle('active');
    if (btn.classList.contains('active')) {
      btn.textContent = '■';
      banners.forEach((_, i) => replayBanner(i));
    } else {
      btn.textContent = '▶';
    }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const index = parseInt(entry.target.dataset.index, 10);
      if (entry.isIntersecting) {
        setActive(index);
      }
    });
  }, { rootMargin: '-100px 0px -50% 0px', threshold: 0.1 });

  document.querySelectorAll('.banner-item').forEach(el => observer.observe(el));
</script>
</body>
</html>`;
}

module.exports = { generatePreviewHtml };
