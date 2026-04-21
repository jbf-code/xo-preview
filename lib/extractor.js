/**
 * Banner extractor — uses Playwright to extract banners from Zuuvi campaign URLs
 * Filters out false iframes (cookie consent, HubSpot, tracking, etc.)
 */
const { chromium } = require('playwright');

// Domains that are NOT banners — blacklist approach
const BLOCKED_DOMAINS = [
  'cookieinformation.com',
  'cookiebot.com',
  'cookieconsent',
  'hubspot.com',
  'hs-scripts.com',
  'hs-analytics.com',
  'hsforms.com',
  'google.com/recaptcha',
  'googletagmanager.com',
  'google-analytics.com',
  'doubleclick.net',
  'facebook.com',
  'facebook.net',
  'hotjar.com',
  'intercom.io',
  'crisp.chat',
  'drift.com',
  'zendesk.com',
  'tawk.to',
  'livechat.com',
  'onetrust.com',
  'trustarc.com',
  'consensu.org',
  'privacy-center',
  'cookie-consent',
  'cookielaw.org',
];

function isBlockedSrc(src) {
  if (!src) return false;
  const lower = src.toLowerCase();
  return BLOCKED_DOMAINS.some(domain => lower.includes(domain));
}

/**
 * Determine if an iframe is likely a Zuuvi banner
 */
function isBannerIframe(info) {
  // Blocked external domain
  if (info.src && isBlockedSrc(info.src)) return false;

  // Must have some content or srcdoc
  if (!info.hasSrcdoc && !info.src) return false;

  // Zero-size iframes are hidden/tracking
  if (info.renderedWidth <= 1 || info.renderedHeight <= 1) return false;

  // Very small iframes are likely tracking pixels
  if (info.renderedWidth < 10 && info.renderedHeight < 10) return false;

  // If it has srcdoc, it's likely a Zuuvi inline banner
  if (info.hasSrcdoc) return true;

  // Check for zuuvi-related class/id
  const classId = `${info.className} ${info.id} ${info.parentClass}`.toLowerCase();
  if (classId.includes('zuuvi') || classId.includes('banner') || classId.includes('creative') || classId.includes('preview')) {
    return true;
  }

  // If src is about:blank or about:srcdoc, likely inline content
  if (info.src && (info.src.startsWith('about:') || info.src.startsWith('data:'))) return true;

  // If rendered at reasonable banner dimensions (>= 50px in both)
  if (info.renderedWidth >= 50 && info.renderedHeight >= 50) return true;

  return false;
}

const https = require('https');
const http = require('http');

/**
 * Download a URL and return as base64 data URI
 */
function fetchAsBase64(url, mimeType) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { timeout: 10000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchAsBase64(res.headers.location, mimeType).then(resolve);
      }
      if (res.statusCode !== 200) { resolve(null); return; }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        const ct = mimeType || res.headers['content-type'] || 'application/octet-stream';
        resolve(`data:${ct.split(';')[0]};base64,${buf.toString('base64')}`);
      });
      res.on('error', () => resolve(null));
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

/**
 * Download and inline external scripts (zuuviapi, gsap) as inline <script> blocks
 */
async function embedScripts(html) {
  if (!html) return html;
  const scriptRegex = /<script[^>]*src=["']?(https?:\/\/[^"'\s>]+)["']?[^>]*><\/script>/gi;
  let m;
  const scripts = [];
  while ((m = scriptRegex.exec(html)) !== null) {
    scripts.push({ full: m[0], url: m[1] });
  }
  if (scripts.length === 0) return html;
  
  let result = html;
  for (const script of scripts) {
    try {
      const content = await fetchAsText(script.url);
      if (content && content.length > 50) {
        result = result.replace(script.full, `<script>${content}</script>`);
        console.log(`[extractor] Inlined script: ${script.url.slice(-60)}`);
      }
    } catch (e) { /* keep original */ }
  }
  return result;
}

function fetchAsText(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { timeout: 10000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchAsText(res.headers.location).then(resolve);
      }
      if (res.statusCode !== 200) { resolve(null); return; }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      res.on('error', () => resolve(null));
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

/**
 * Embed all external font URLs in HTML as base64 data URIs
 */
async function embedFonts(html) {
  if (!html) return html;
  // Find all url() references in @font-face blocks that point to external fonts
  const fontUrlRegex = /url\(['"]?(https?:\/\/[^)'">]+\.(?:woff2?|ttf|otf|eot)(?:\?[^)'">]*)?)['"]?\)/gi;
  const matches = [];
  let m;
  while ((m = fontUrlRegex.exec(html)) !== null) {
    matches.push({ full: m[0], url: m[1] });
  }
  if (matches.length === 0) return html;
  
  console.log(`[extractor] Embedding ${matches.length} font(s) as base64...`);
  const seen = new Map();
  for (const match of matches) {
    if (seen.has(match.url)) continue;
    const dataUri = await fetchAsBase64(match.url);
    seen.set(match.url, dataUri);
  }
  
  let result = html;
  for (const [url, dataUri] of seen) {
    if (dataUri) {
      result = result.split(url).join(dataUri);
    }
  }
  return result;
}

async function extractBanners(zuuviUrl) {
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  } catch (e) {
    throw new Error(`Failed to launch browser: ${e.message}`);
  }

  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();

    // Navigate
    try {
      await page.goto(zuuviUrl, { waitUntil: 'networkidle', timeout: 45000 });
    } catch (e) {
      // networkidle timeout is ok, page may have persistent connections
      console.warn(`[extractor] networkidle timeout (continuing): ${e.message.slice(0, 80)}`);
    }

    // Wait for banners to render
    await page.waitForTimeout(5000);

    // Extract metadata
    const metadata = await page.evaluate(() => {
      const title = document.title || '';
      const headerTexts = [];
      document.querySelectorAll('header *, [class*="header"] *, [class*="nav"] *, [class*="title"] *').forEach(el => {
        const t = el.innerText?.trim();
        if (t && t.length > 2 && t.length < 200 && el.children.length === 0) {
          headerTexts.push(t);
        }
      });
      return { pageTitle: title, headerTexts: [...new Set(headerTexts)].slice(0, 10) };
    });

    // Discover iframes
    const iframeInfo = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('iframe')).map((el, i) => {
        const rect = el.getBoundingClientRect();
        const parent = el.parentElement;

        // Find format label (e.g. "1:1", "9:16", "Story") + dimension label from ancestors
        const findLabels = (container) => {
          if (!container) return { formatName: null, dimLabel: null };
          // Get all leaf-node text spans near this container
          const spans = Array.from(container.querySelectorAll('span, p, div, h3, h4')).filter(s => {
            const t = s.innerText?.trim();
            return t && t.length > 0 && t.length < 60 && s.children.length === 0;
          }).map(s => s.innerText.trim());
          
          let formatName = null;
          let dimLabel = null;
          
          for (const t of spans) {
            // Ratio label: "1:1", "4:5", "9:16", "16:9"
            if (!formatName && /^\d+:\d+$/.test(t)) formatName = t;
            // Named format: "Story", "Feed", "Square" etc
            if (!formatName && /^(Story|Feed|Post|Square|Landscape|Portrait|Banner|Header|Skyscraper|Leaderboard|Half\s*Page|Billboard|Interstitial)$/i.test(t)) formatName = t;
            // Dimension: "1200x1200"
            if (!dimLabel && /^\d{2,4}x\d{2,4}$/.test(t)) dimLabel = t;
          }
          
          // Fallback: search in full text
          if (!dimLabel) {
            const allText = container.innerText || '';
            const dimMatch = allText.match(/\b(\d{2,4})\s*[x×]\s*(\d{2,4})\b/i);
            if (dimMatch) dimLabel = `${dimMatch[1]}x${dimMatch[2]}`;
          }
          
          return { formatName, dimLabel };
        };

        let formatName = null;
        let dimLabel = null;
        let ancestor = parent;
        for (let j = 0; j < 6 && ancestor; j++) {
          const found = findLabels(ancestor);
          if (!formatName && found.formatName) formatName = found.formatName;
          if (!dimLabel && found.dimLabel) dimLabel = found.dimLabel;
          if (formatName && dimLabel) break;
          ancestor = ancestor.parentElement;
        }

        const w = Math.round(rect.width || parseInt(el.getAttribute('width')) || 0);
        const h = Math.round(rect.height || parseInt(el.getAttribute('height')) || 0);
        
        // Build label: "1:1 (1200x1200)" or "Story (1080x1920)" or just "1200x1200"
        let label = null;
        if (formatName && dimLabel) {
          label = `${formatName} (${dimLabel})`;
        } else if (formatName) {
          label = w && h ? `${formatName} (${w}x${h})` : formatName;
        } else if (dimLabel) {
          label = dimLabel;
        } else if (w && h) {
          label = `${w}x${h}`;
        }

        // Check if iframe content has zuuvi-template-id meta tag
        let hasZuuviMeta = false;
        try {
          const doc = el.contentDocument;
          if (doc) {
            hasZuuviMeta = !!doc.querySelector('meta[name="zuuvi-template-id"]') ||
                           !!doc.querySelector('[class*="zuuvi"]') ||
                           !!doc.querySelector('.banner');
          }
        } catch (e) { /* cross-origin */ }

        return {
          index: i,
          label: label || `banner-${i}`,
          renderedWidth: w,
          renderedHeight: h,
          attrWidth: parseInt(el.getAttribute('width')) || 0,
          attrHeight: parseInt(el.getAttribute('height')) || 0,
          hasSrcdoc: !!el.getAttribute('srcdoc'),
          src: (el.getAttribute('src') || el.src || '').slice(0, 500),
          id: el.id || '',
          className: (el.className || '').slice(0, 200),
          parentClass: (parent?.className || '').slice(0, 200),
          hasZuuviMeta,
        };
      });
    });

    // Filter to only banner iframes
    const bannerIframes = iframeInfo.filter(isBannerIframe);
    console.log(`[extractor] Found ${iframeInfo.length} iframes, ${bannerIframes.length} are banners`);

    // Get srcdoc content
    const srcdocData = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('iframe')).map((el, i) => ({
        index: i,
        srcdoc: el.getAttribute('srcdoc') || null,
      }));
    });

    // Extract HTML from each banner iframe
    const frames = page.frames();
    const banners = [];

    for (const info of bannerIframes) {
      let html = null;

      // Try srcdoc first
      if (srcdocData[info.index]?.srcdoc) {
        html = srcdocData[info.index].srcdoc;
      }

      // Try Playwright frame content
      if (!html) {
        const frameIndex = info.index + 1;
        const frame = frames[frameIndex];
        if (frame) {
          try {
            await frame.waitForLoadState('domcontentloaded', { timeout: 5000 }).catch(() => {});
            const frameHtml = await frame.content();
            if (frameHtml && frameHtml.length > 100 && !frameHtml.includes('<html><head></head><body></body></html>')) {
              html = frameHtml;
            }
          } catch (e) { /* ignore */ }
        }
      }

      // Try evaluate on frame
      if (!html && frames[info.index + 1]) {
        try {
          html = await frames[info.index + 1].evaluate(() => document.documentElement.outerHTML);
          if (html && html.length < 200) html = null;
        } catch (e) { /* ignore */ }
      }

      // Additional validation: check extracted HTML for banner markers
      if (html) {
        const lower = html.toLowerCase();
        // If HTML contains cookie/consent/hubspot content, skip it
        if (BLOCKED_DOMAINS.some(d => lower.includes(d)) && !lower.includes('zuuvi')) {
          console.log(`[extractor] Skipping iframe ${info.index} — contains blocked domain content`);
          continue;
        }
      }

      // Parse dimensions
      let origWidth = info.attrWidth || info.renderedWidth;
      let origHeight = info.attrHeight || info.renderedHeight;

      if (html) {
        const adSizeMatch = html.match(/<meta[^>]*name=["']?ad\.size["']?[^>]*content=["']?width=(\d+),\s*height=(\d+)/i);
        if (adSizeMatch) {
          origWidth = parseInt(adSizeMatch[1]);
          origHeight = parseInt(adSizeMatch[2]);
        }
      }

      const labelDimMatch = info.label.match(/^(\d+)[x×_](\d+)$/i);
      if (labelDimMatch) {
        origWidth = parseInt(labelDimMatch[1]);
        origHeight = parseInt(labelDimMatch[2]);
      }

      // Embed external scripts and fonts as inline/base64
      let embeddedHtml = html || '';
      if (embeddedHtml) {
        embeddedHtml = await embedScripts(embeddedHtml);
        embeddedHtml = await embedFonts(embeddedHtml);
      }

      banners.push({
        index: info.index,
        label: info.label,
        width: origWidth,
        height: origHeight,
        html: embeddedHtml,
      });
    }

    // Parse campaign name from metadata
    let campaignName = 'Campaign Preview';
    let clientName = '';

    const titleParts = metadata.pageTitle.split(/[|–—-]/).map(s => s.trim()).filter(Boolean);
    if (titleParts.length >= 2) {
      campaignName = titleParts[0];
      clientName = titleParts[1];
    } else if (titleParts.length === 1) {
      campaignName = titleParts[0];
    }

    const nameTexts = metadata.headerTexts.filter(t =>
      !/\d+x\d+/i.test(t) && !/saved|updated/i.test(t) && t.length > 3 && t.length < 100
    );
    if (nameTexts.length > 0) {
      campaignName = nameTexts[0];
      if (nameTexts.length > 1) clientName = nameTexts[1];
    }

    return { campaignName, clientName, banners };
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { extractBanners };
