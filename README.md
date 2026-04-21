# XO Preview Platform

XO-branded Zuuvi campaign preview generator. Lets XO employees create shareable, branded previews of Zuuvi campaign banners.

## Features

- 🔐 Simple email/password login
- 🎨 Dark-themed XO branding
- 🚀 One-click banner extraction from Zuuvi
- 🔗 Public shareable preview links (no login required)
- 📱 Responsive design
- 🎬 Live animated HTML5 banners with replay controls

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

## Deploy to Railway

```bash
railway up
```

Or connect the GitHub repo for auto-deploy.

## Tech Stack

- Express.js
- SQLite (better-sqlite3)
- Playwright (Chromium)
- Inline HTML templates (no template engine dependency)

## How It Works

1. User pastes a Zuuvi campaign preview URL
2. Playwright opens the URL in headless Chrome
3. Banner iframes are extracted (with smart filtering for cookie/tracking iframes)
4. An XO-branded HTML page is generated with live banners
5. The preview gets a shareable public URL

## License

Private — XO 360 Graphics internal tool.
