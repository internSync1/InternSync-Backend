/*
 Merge Pexels images into opportunities CSV
 - Reads pexels_images.csv (Category,Image URL)
 - Reads opportunities_with_categories_v2.csv
 - For each row, if banner_image_url is empty, set one deterministically from the images of its categories
 - Also writes category_image_urls (JSON array) containing all candidate images for matched categories
 - Writes back to opportunities_with_categories_v2.csv (after creating a timestamped backup)
*/

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const PEXELS_CSV = path.resolve(__dirname, '../pexels_images.csv');
const OPP_CSV = path.resolve(__dirname, '../opportunities_with_categories_v2.csv');

function normalizeCategory(s) {
  return String(s || '').trim().toLowerCase();
}

// Parse arrays that may be JSON (double-quoted) or python-like (single-quoted), or comma-separated strings
function parseFlexibleArray(field) {
  if (field == null) return [];
  let s = String(field).trim();
  // Strip outer quotes if present
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  if (s.startsWith('[') && s.endsWith(']')) {
    // Try strict JSON first
    try { return JSON.parse(s); } catch (_) {}
    // Replace single quotes with double quotes and try again
    try { return JSON.parse(s.replace(/'/g, '"')); } catch (_) {}
    // Fallback: split by commas and strip quotes/spaces
    const inner = s.slice(1, -1);
    return inner.split(',').map(x => x.replace(/^\s*["']?|["']?\s*$/g, '').trim()).filter(Boolean);
  }
  if (!s) return [];
  return s.split(',').map(x => x.replace(/^\s*["']?|["']?\s*$/g, '').trim()).filter(Boolean);
}

function csvEscape(value) {
  if (value === null || value === undefined) return '';
  let s = String(value);
  if (s.includes('"')) s = s.replace(/"/g, '""');
  if (/[",\n\r]/.test(s)) s = '"' + s + '"';
  return s;
}

function hashString(str) {
  // Simple deterministic hash for seeding selection
  let h = 0;
  const s = String(str);
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

async function loadPexelsMap() {
  return new Promise((resolve, reject) => {
    const map = new Map(); // key: normalized category -> [urls]
    fs.createReadStream(PEXELS_CSV)
      .pipe(csv())
      .on('data', (row) => {
        const cat = normalizeCategory(row['Category'] || row['category']);
        const url = row['Image URL'] || row['image_url'] || row['url'];
        if (!cat || !url) return;
        if (!map.has(cat)) map.set(cat, []);
        map.get(cat).push(String(url).trim());
      })
      .on('end', () => {
        resolve(map);
      })
      .on('error', reject);
  });
}

async function readOpportunities() {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(OPP_CSV)
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

function writeCsv(filePath, rows, extraHeaders = []) {
  if (!rows.length) return;
  const headerSet = new Set(Object.keys(rows[0]));
  extraHeaders.forEach(h => headerSet.add(h));
  const headers = Array.from(headerSet);

  const lines = [];
  lines.push(headers.map(csvEscape).join(','));
  for (const r of rows) {
    const line = headers.map(h => csvEscape(r[h] ?? ''));
    lines.push(line.join(','));
  }
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}

async function main() {
  console.log('Merging Pexels images into opportunities CSV...');
  const pexelsMap = await loadPexelsMap();

  // Precompute union of all images for fallback
  const allImages = Array.from(pexelsMap.values()).flat();

  const rows = await readOpportunities();
  if (!rows.length) {
    console.log('No rows found in opportunities CSV');
    return;
  }

  const backup = OPP_CSV + '.backup.' + Date.now();
  fs.copyFileSync(OPP_CSV, backup);
  console.log('Backup created at:', backup);

  for (const row of rows) {
    const categoriesRaw = row['categories'] || row['category'] || '';
    const cats = parseFlexibleArray(categoriesRaw).map(normalizeCategory);

    const candidateSet = new Set();
    for (const c of cats) {
      const imgs = pexelsMap.get(c);
      if (imgs && imgs.length) imgs.forEach(u => candidateSet.add(u));
    }

    const candidates = candidateSet.size ? Array.from(candidateSet) : allImages;

    // Compose a stable key similar to the import script for deterministic pick
    const keyBase = `${(row['title']||'').toLowerCase().trim()}|${(row['organization']||row['company']||'').toLowerCase().trim()}|${(row['url']||'').toLowerCase().trim()}`;
    const idx = candidates.length ? hashString(keyBase) % candidates.length : -1;

    if (!row['banner_image_url'] || String(row['banner_image_url']).trim() === '') {
      row['banner_image_url'] = idx >= 0 ? candidates[idx] : '';
    }

    // Store the candidate pool (can be useful later for UI variations)
    row['category_image_urls'] = JSON.stringify(candidates);
  }

  writeCsv(OPP_CSV, rows, ['banner_image_url', 'category_image_urls']);
  console.log('Updated CSV written to', OPP_CSV);
}

main().catch((e) => {
  console.error('Failed to merge banners:', e);
  process.exit(1);
});
