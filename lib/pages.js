/**
 * Page templates — inline HTML for the web platform UI
 * All pages use XO dark theme branding
 */

const XO_LOGO_BASE64 = 'data:image/png;base64,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';

function escHtml(s) { return s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : ''; }

function shell(title, body, { user } = {}) {
  return `<!DOCTYPE html>
<html lang="da">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escHtml(title)} — XO Preview</title>
<link rel="icon" type="image/png" href="${XO_LOGO_BASE64}">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0a; --surface: #111; --surface2: #191919; --surface3: #222;
    --border: #2a2a2a; --border2: #333; --text: #e8e8e8; --text-2: #aaa; --text-3: #666;
    --accent: #FF6B00; --accent-2: #FF8533; --accent-dim: #3a1800;
    --font: system-ui, -apple-system, 'Inter', 'Segoe UI', sans-serif;
    --mono: 'SF Mono', 'Fira Code', ui-monospace, monospace;
    --radius: 8px;
  }
  body { font-family: var(--font); background: var(--bg); color: var(--text); min-height: 100vh; }
  a { color: var(--accent); text-decoration: none; }
  a:hover { color: var(--accent-2); }

  .topbar {
    height: 56px; background: var(--surface); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 24px; gap: 16px;
  }
  .topbar-logo { display: flex; align-items: center; gap: 10px; }
  .topbar-logo img { height: 24px; }
  .topbar-logo span { font-size: 13px; color: var(--text-2); font-weight: 500; }
  .topbar-spacer { flex: 1; }
  .topbar-user { font-size: 12px; color: var(--text-3); }
  .topbar-user a { color: var(--text-3); margin-left: 8px; }
  .topbar-user a:hover { color: var(--accent); }

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
<div class="topbar">
  <a href="/" class="topbar-logo">
    <img src="${XO_LOGO_BASE64}" alt="XO">
    <span>Preview Platform</span>
  </a>
  <div class="topbar-spacer"></div>
  ${user ? `<div class="topbar-user">${escHtml(user.name || user.email)} · <a href="/logout">Log ud</a></div>` : ''}
</div>
${body}
</body>
</html>`;
}

// ── Login page ────────────────────────────────────────────────────────────────
function login({ error }) {
  return shell('Login', `
<div class="container" style="max-width:400px;margin-top:80px;">
  <div style="text-align:center;margin-bottom:32px;">
    <img src="${XO_LOGO_BASE64}" alt="XO" style="height:40px;margin-bottom:16px;">
    <h2 style="font-size:20px;font-weight:700;">XO Preview Platform</h2>
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
</div>`);
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function dashboard({ previews }, ctx) {
  const rows = previews.map(p => {
    const date = new Date(p.created_at + 'Z').toLocaleString('da-DK', {
      timeZone: 'Europe/Copenhagen', day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });

    const statusBadge = p.status === 'ready'
      ? `<span style="color:#2ecc71;font-size:11px;">● Klar</span>`
      : p.status === 'error'
        ? `<span style="color:#e74c3c;font-size:11px;">● Fejl</span>`
        : `<span style="color:var(--accent);font-size:11px;">⏳ Genererer...</span>`;

    const link = p.status === 'ready'
      ? `<a href="/preview/${escHtml(p.id)}" target="_blank" class="btn btn-secondary btn-sm">🔗 Åbn preview</a>`
      : p.status === 'generating'
        ? `<a href="/generating/${escHtml(p.id)}" class="btn btn-secondary btn-sm">⏳ Status</a>`
        : '';

    const copyBtn = p.status === 'ready'
      ? `<button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText(location.origin+'/preview/${escHtml(p.id)}').then(()=>this.textContent='✅ Kopieret').catch(()=>{})">📋 Kopiér link</button>`
      : '';

    return `
    <div class="card" style="display:flex;align-items:center;gap:16px;margin-bottom:12px;">
      <div style="flex:1;min-width:0;">
        <div style="font-weight:600;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(p.name)}</div>
        <div style="font-size:11px;color:var(--text-3);margin-top:2px;">${date} · ${escHtml(p.created_by || '')} · ${p.banner_count || 0} bannere ${statusBadge}</div>
      </div>
      <div style="display:flex;gap:8px;flex-shrink:0;">
        ${link}
        ${copyBtn}
        <form method="POST" action="/delete/${escHtml(p.id)}" onsubmit="return confirm('Slet dette preview?')" style="margin:0;">
          <button type="submit" class="btn btn-danger btn-sm">🗑</button>
        </form>
      </div>
    </div>`;
  }).join('');

  const empty = previews.length === 0
    ? `<div style="text-align:center;padding:60px 0;color:var(--text-3);">
        <div style="font-size:48px;margin-bottom:16px;">📋</div>
        <p>Ingen previews endnu</p>
        <p style="font-size:13px;margin-top:4px;">Opret dit første preview herunder</p>
      </div>`
    : '';

  return shell('Dashboard', `
<div class="container">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;">
    <div>
      <h1 style="font-size:22px;font-weight:700;">Previews</h1>
      <p style="font-size:13px;color:var(--text-3);margin-top:4px;">${previews.length} preview${previews.length !== 1 ? 's' : ''} oprettet</p>
    </div>
    <a href="/new" class="btn btn-primary">+ Nyt Preview</a>
  </div>
  ${empty}
  ${rows}
</div>`, ctx);
}

// ── New preview ───────────────────────────────────────────────────────────────
function newPreview({ error }, ctx) {
  return shell('Nyt Preview', `
<div class="container" style="max-width:600px;">
  <a href="/" style="font-size:13px;color:var(--text-3);display:inline-block;margin-bottom:24px;">← Tilbage til dashboard</a>
  <h1 style="font-size:22px;font-weight:700;margin-bottom:24px;">Nyt Preview</h1>
  ${error ? `<div class="error-msg">${escHtml(error)}</div>` : ''}
  <form method="POST" action="/new" class="card" style="display:flex;flex-direction:column;gap:20px;">
    <div>
      <label class="label" for="name">Campaign navn (valgfrit)</label>
      <input class="input" type="text" id="name" name="name" placeholder="F.eks. FitnessX Spring 2024">
    </div>
    <div>
      <label class="label" for="url">Zuuvi Campaign URL</label>
      <input class="input" type="url" id="url" name="url" placeholder="https://studio.zuuvi.com/preview/campaign/..." required autofocus>
      <p style="font-size:11px;color:var(--text-3);margin-top:6px;">Indsæt preview-linket fra Zuuvi Studio</p>
    </div>
    <button type="submit" class="btn btn-primary" style="align-self:flex-start;">🚀 Generer Preview</button>
  </form>
</div>`, ctx);
}

// ── Generating (loading) ──────────────────────────────────────────────────────
function generating({ preview }, ctx) {
  return shell('Genererer...', `
<div class="container" style="max-width:500px;text-align:center;margin-top:80px;">
  <div style="font-size:64px;margin-bottom:24px;" class="spinner-emoji">⏳</div>
  <h2 style="font-size:18px;font-weight:600;margin-bottom:8px;">Genererer preview...</h2>
  <p style="font-size:13px;color:var(--text-3);margin-bottom:4px;">${escHtml(preview.name)}</p>
  <p style="font-size:12px;color:var(--text-3);">Playwright henter bannere fra Zuuvi. Det tager typisk 15-30 sekunder.</p>
  <div style="margin-top:32px;">
    <div class="progress-bar"><div class="progress-fill"></div></div>
  </div>
  <style>
    .spinner-emoji { animation: pulse 1.5s ease-in-out infinite; }
    @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
    .progress-bar { width: 200px; height: 3px; background: var(--border); border-radius: 2px; margin: 0 auto; overflow: hidden; }
    .progress-fill { width: 40%; height: 100%; background: var(--accent); border-radius: 2px; animation: progress 2s ease-in-out infinite; }
    @keyframes progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(350%); } }
  </style>
  <script>
    (function poll() {
      fetch('/api/status/${escHtml(preview.id)}')
        .then(r => r.json())
        .then(d => {
          if (d.status === 'ready') { window.location.href = '/preview/${escHtml(preview.id)}'; }
          else if (d.status === 'error') { window.location.reload(); }
          else { setTimeout(poll, 2000); }
        })
        .catch(() => setTimeout(poll, 3000));
    })();
  </script>
</div>`, ctx);
}

// ── Error page ────────────────────────────────────────────────────────────────
function error({ message }, ctx) {
  return shell('Fejl', `
<div class="container" style="max-width:500px;text-align:center;margin-top:80px;">
  <div style="font-size:48px;margin-bottom:16px;">❌</div>
  <h2 style="font-size:18px;font-weight:600;margin-bottom:8px;">Noget gik galt</h2>
  <p style="font-size:13px;color:var(--text-3);margin-bottom:24px;">${escHtml(message)}</p>
  <a href="/" class="btn btn-secondary">← Tilbage til dashboard</a>
</div>`, ctx);
}

module.exports = { login, dashboard, new: newPreview, generating, error };
