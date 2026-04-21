/**
 * Cloudflare Analytics Engine integration
 * Queries CDN request stats from the cdn-xo-dk Worker
 */

const CF_ACCOUNT_ID = '444d8f7fa3f67ab1a69d0adc123535f1';
const CF_ANALYTICS_TOKEN = process.env.CF_ANALYTICS_TOKEN || '';
const DATASET = 'cdn_requests';

async function query(sql) {
  if (!CF_ANALYTICS_TOKEN) return null;
  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/analytics_engine/sql`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${CF_ANALYTICS_TOKEN}` },
        body: sql,
      }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('[analytics] Query error:', err.message);
    return null;
  }
}

/**
 * Get stats per campaign (total requests + bytes served)
 * Returns: { campaignId: { requests, mb_served } }
 */
async function getCampaignStats() {
  const result = await query(`
    SELECT 
      blob1 AS campaign_id,
      SUM(_sample_interval) AS requests,
      SUM(_sample_interval * double1) / 1048576 AS mb_served
    FROM ${DATASET}
    WHERE timestamp >= NOW() - INTERVAL '90' DAY
    GROUP BY campaign_id
  `);
  if (!result || !result.data) return {};
  const stats = {};
  for (const row of result.data) {
    stats[row.campaign_id] = {
      requests: parseInt(row.requests) || 0,
      mb_served: parseFloat(row.mb_served) || 0,
    };
  }
  return stats;
}

/**
 * Get stats per format for a specific campaign
 * Returns: [{ format, requests, mb_served }]
 */
async function getFormatStats(campaignId) {
  const result = await query(`
    SELECT 
      blob2 AS format,
      SUM(_sample_interval) AS requests,
      SUM(_sample_interval * double1) / 1048576 AS mb_served
    FROM ${DATASET}
    WHERE timestamp >= NOW() - INTERVAL '90' DAY
      AND blob1 = '${campaignId}'
    GROUP BY format
    ORDER BY requests DESC
  `);
  if (!result || !result.data) return [];
  return result.data.map(row => ({
    format: row.format,
    requests: parseInt(row.requests) || 0,
    mb_served: parseFloat(row.mb_served) || 0,
  }));
}

module.exports = { query, getCampaignStats, getFormatStats };
