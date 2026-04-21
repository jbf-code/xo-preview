/**
 * Cloudflare R2 integration for ad asset hosting
 * Uses AWS SDK v3 (S3-compatible)
 */
const { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const mime = require('./mime');

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'ad-assets-prod';
const CDN_BASE_URL = process.env.CDN_BASE_URL || '';

let s3Client = null;

function getClient() {
  if (s3Client) return s3Client;
  if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT) {
    throw new Error('R2 credentials not configured (R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT)');
  }
  s3Client = new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
  return s3Client;
}

/**
 * Upload a file to R2
 * @param {string} key - Object key (path in bucket)
 * @param {Buffer} body - File content
 * @param {string} contentType - MIME type
 * @returns {string} Public URL
 */
async function uploadFile(key, body, contentType) {
  const client = getClient();
  await client.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  return `${CDN_BASE_URL}/${key}`;
}

/**
 * Upload an entire banner package (extracted from ZIP)
 * @param {string} campaignId - Unique campaign/hosting ID
 * @param {string} formatName - e.g. "300x250"
 * @param {Object[]} files - Array of { name, buffer } from ZIP extraction
 * @returns {{ urls: Object, indexUrl: string }}
 */
async function uploadBannerPackage(campaignId, formatName, files) {
  const prefix = `hosted/${campaignId}/${formatName}`;
  const urls = {};

  for (const file of files) {
    const key = `${prefix}/${file.name}`;
    const contentType = mime.lookup(file.name);
    const url = await uploadFile(key, file.buffer, contentType);
    urls[file.name] = url;
  }

  const indexUrl = `${CDN_BASE_URL}/${prefix}/index.html`;
  return { urls, indexUrl, prefix };
}

/**
 * Delete all objects under a prefix
 */
async function deletePrefix(prefix) {
  const client = getClient();
  const listResult = await client.send(new ListObjectsV2Command({
    Bucket: R2_BUCKET_NAME,
    Prefix: prefix,
  }));
  
  if (listResult.Contents && listResult.Contents.length > 0) {
    await client.send(new DeleteObjectsCommand({
      Bucket: R2_BUCKET_NAME,
      Delete: {
        Objects: listResult.Contents.map(o => ({ Key: o.Key })),
      },
    }));
  }
}

/**
 * Check if R2 is configured
 */
function isConfigured() {
  return !!(R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_ENDPOINT);
}

module.exports = { uploadFile, uploadBannerPackage, deletePrefix, isConfigured, CDN_BASE_URL };
