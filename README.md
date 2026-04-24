# XO Preview & Hosting Platform

Internal XO 360 tool for campaign preview generation and banner hosting. Lets XO employees create shareable previews of Zuuvi campaigns and host banner creatives on cdn.xo.dk for Google Campaign Manager 360 delivery.

## Features

### Preview
- 🔗 Paste a Zuuvi campaign URL → get a shareable XO-branded preview page
- 🎬 Live animated HTML5 banners with replay controls
- 🎨 Customisable themes per client
- 📱 Responsive, mobile-friendly layout
- 🔐 Public shareable links (no login required for viewers)

### Hosting
- 📦 Upload Zuuvi "Google Ad Manager Display" ZIP exports
- ☁️ Automatic upload to Cloudflare R2 → served via cdn.xo.dk
- 🏷️ Google Ad Manager iframe tags generated per format
- 🔗 Persistent CDN URLs — replace creatives without changing tags
- 📄 **Get Tags** — download `.txt` with all iframe tags (GAM-ready)
- 📦 **Get Index Tags** — download `.zip` with per-format `index.html` files (CM360-ready)
- 📊 Impressions, requests and MB served per format (Cloudflare analytics)
- 🔄 Replace individual formats or full campaigns without breaking existing tags

## Quick Start

```bash
npm install
npx playwright install chromium
cp .env.example .env
# Edit .env with your settings
node server.js
```

Open http://localhost:3000

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `BASE_URL` | Public URL | `http://localhost:3000` |
| `SESSION_SECRET` | Session cookie secret | Dev default |
| `USER_1..20` | Users as `email:password:name` | Dev defaults |
| `NODE_ENV` | Environment | `development` |
| `R2_ACCOUNT_ID` | Cloudflare R2 account ID | — |
| `R2_ACCESS_KEY_ID` | R2 access key | — |
| `R2_SECRET_ACCESS_KEY` | R2 secret key | — |
| `R2_BUCKET` | R2 bucket name | — |
| `CDN_BASE_URL` | Public CDN URL (e.g. https://cdn.xo.dk) | — |
| `CF_ZONE_ID` | Cloudflare zone ID (for analytics) | — |
| `CF_API_TOKEN` | Cloudflare API token (for analytics) | — |

## Tech Stack

- Express.js
- SQLite (better-sqlite3)
- Playwright (Chromium) — for preview generation
- adm-zip — for ZIP processing and package generation
- AWS SDK v3 — for Cloudflare R2 (S3-compatible)
- Inline HTML templates (no template engine dependency)

## How It Works

### Preview flow
1. User pastes a Zuuvi campaign preview URL
2. Playwright opens the URL in headless Chrome
3. Banner iframes are extracted (with smart filtering)
4. An XO-branded HTML page is generated with live banners
5. The preview gets a shareable public URL

### Hosting flow
1. User uploads a Zuuvi "Google Ad Manager Display" ZIP export
2. Platform extracts per-format ZIPs and uploads to Cloudflare R2
3. Each format gets a permanent CDN URL and a GAM iframe tag
4. Tags and URLs can be copied directly from the detail page
5. "Get Tags" downloads a formatted `.txt` ready for GAM trafficking
6. "Get Index Tags" downloads a `.zip` with CM360-ready `index.html` files per format

## License

Private — XO 360 Graphics internal tool.
