/**
 * Generate the XO-branded preview HTML that gets served as the public preview page
 */

// XO logo as base64 (extracted from xo.dk)
const XO_LOGO_BASE64 = 'data:image/png;base64,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';

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
    const maxDisplayWidth = 500;
    const scale = w > maxDisplayWidth ? maxDisplayWidth / w : 1;
    const displayW = Math.round(w * scale);
    const displayH = Math.round(h * scale);
    const scalePercent = Math.round(scale * 100);

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
            ${scale < 1 ? `<span class="scale-chip">Scaled ${scalePercent}%</span>` : ''}
          </div>
          <div class="banner-actions">
            <button class="btn-icon" title="Replay" onclick="replayBanner(${idx})">↺ Replay</button>
          </div>
        </div>
        <div class="banner-wrapper" style="width:${displayW}px;height:${displayH}px;">
          <div class="banner-scale-container" style="width:${w}px;height:${h}px;transform:scale(${scale.toFixed(4)});transform-origin:top left;">
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
  <title>${escHtml(campaignName)} — XO Preview</title>
  <link rel="icon" type="image/png" href="${XO_LOGO_BASE64}">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0a0a0a; --surface: #111; --surface2: #191919; --surface3: #222;
      --border: #2a2a2a; --border2: #333; --text: #e8e8e8; --text-2: #aaa; --text-3: #666;
      --accent: #FF6B00; --accent-2: #FF8533; --accent-dim: #3a1800;
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
    .scale-chip { font-size: 10px; color: var(--text-3); background: var(--surface3); border: 1px solid var(--border); padding: 2px 8px; border-radius: 10px; }
    .banner-actions { display: flex; gap: 8px; }
    .btn-icon { font-size: 11px; font-weight: 500; padding: 5px 12px; border-radius: var(--radius); border: 1px solid var(--border2); background: var(--surface2); color: var(--text-2); cursor: pointer; }
    .btn-icon:hover { background: var(--surface3); color: var(--text); }
    .banner-wrapper { position: relative; background: #0d0d0d; border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
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
  <div class="header-logo">
    <img src="${XO_LOGO_BASE64}" alt="XO" class="logo-img">
    <div class="logo-divider"></div>
    <span class="logo-sub">Campaign Preview</span>
  </div>
  <div class="header-divider"></div>
  <div class="header-campaign">
    <div class="campaign-name">${escHtml(campaignName)}</div>
    <div class="campaign-meta">
      ${clientName ? `<span>${escHtml(clientName)}</span>` : ''}
      <span>Generated ${escHtml(generatedAtFormatted)}</span>
    </div>
  </div>
  <div class="header-stats">
    <div class="shared-badge">🔗 Delt fra XO 360</div>
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
    · <a href="${escHtml(zuuviUrl)}" target="_blank" style="color:var(--accent);text-decoration:none;font-size:11px;">View in Zuuvi →</a>
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
