/**
 * ASSET COLLECTOR RESCUE -- ZIP DOWNLOAD
 *
 * Paste this into the same console tab where asset-collector.js is running.
 * It grabs the collected assets already in memory and packages them into a
 * single .zip file using JSZip (loaded from CDN).
 *
 * Output: splose-assets.zip with folder structure:
 *   brand/
 *   integrations/
 *   backgrounds/
 *   other/
 *   asset-manifest.json
 */

(async () => {
  // ── Check the collector is still running ─────────────────────────────────
  if (typeof collected === 'undefined' || !(collected instanceof Map)) {
    // The collector wrapped everything in an IIFE, so `collected` is not on
    // window. We need to find it. Let's check if the panel exists.
    console.error('[Rescue] Cannot find collected assets map. Trying alternative access...');
  }

  // ── Load JSZip from CDN ──────────────────────────────────────────────────
  if (typeof JSZip === 'undefined') {
    console.log('[Rescue] Loading JSZip from CDN...');
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    console.log('[Rescue] JSZip loaded.');
  }

  // ── Expose the collected map ─────────────────────────────────────────────
  // The original script runs in an IIFE so `collected` is scoped. We need to
  // re-scan the page to build our own collection, OR the user can patch it.
  // Easiest: re-collect from the DOM right now + any object URLs the preview
  // panel created. But the safest route is to patch the original script.
  //
  // PLAN B: We'll re-run the scan logic ourselves and build a fresh map.

  console.log('[Rescue] Scanning page for all image assets...');

  const assets = new Map();

  function dedupeKey(url) {
    try { const u = new URL(url, location.origin); return u.origin + u.pathname; }
    catch { return url; }
  }

  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }

  function categorise(url, el) {
    const u = url.toLowerCase();
    const alt = (el?.alt || '').toLowerCase();
    if (u.includes('logo') || alt.includes('logo') || (u.includes('splose') && (u.endsWith('.svg') || u.endsWith('.png')))) return 'brand';
    if (u.includes('favicon') || (u.includes('icon') && u.includes('.ico'))) return 'brand';
    const integrations = ['stripe', 'xero', 'ndis', 'medicare', 'google-maps', 'intercom', 'halaxy', 'tyro', 'telehealth', 'zoom', 'healthkit', 'proda', 'dva'];
    for (const name of integrations) { if (u.includes(name) || alt.includes(name)) return 'integrations'; }
    if (u.includes('background') || u.includes('bg-') || u.includes('unlock') || u.includes('sparkle') || u.includes('hero')) return 'backgrounds';
    if (u.includes('ai') && (u.endsWith('.png') || u.endsWith('.svg') || u.endsWith('.jpg'))) return 'backgrounds';
    return 'other';
  }

  function filenameFromUrl(url, category) {
    try {
      const pathname = new URL(url, location.origin).pathname;
      let name = pathname.split('/').pop() || 'asset';
      name = name.split('?')[0].split('#')[0];
      if (!name.includes('.')) name += '.png';
      return name;
    } catch { return `asset-${Date.now()}.png`; }
  }

  async function fetchAsBlob(url) {
    try {
      const resp = await fetch(url, { credentials: 'include', mode: 'cors' });
      if (!resp.ok) return null;
      return await resp.blob();
    } catch { return null; }
  }

  function svgToBlob(svgEl) {
    try {
      const clone = svgEl.cloneNode(true);
      if (!clone.getAttribute('xmlns')) clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      const str = new XMLSerializer().serializeToString(clone);
      return new Blob([str], { type: 'image/svg+xml' });
    } catch { return null; }
  }

  // Scan <img> elements
  const imgs = document.querySelectorAll('img[src]');
  for (const img of imgs) {
    const src = img.src;
    if (!src || src.startsWith('data:image/gif')) continue;
    if ((img.naturalWidth || img.width) <= 2 && (img.naturalHeight || img.height) <= 2) continue;
    const key = src.startsWith('data:') ? `data-img-${hashCode(src.substring(0, 200))}` : dedupeKey(src);
    if (assets.has(key)) continue;
    const category = categorise(src, img);
    const blob = await fetchAsBlob(src);
    if (!blob) continue;
    const filename = src.startsWith('data:') ? `inline-image-${assets.size}.png` : filenameFromUrl(src, category);
    assets.set(key, { blob, filename, category, sourceUrl: src });
  }

  // Scan <link rel="icon">
  const icons = document.querySelectorAll('link[rel*="icon"]');
  for (const link of icons) {
    if (!link.href) continue;
    const key = dedupeKey(link.href);
    if (assets.has(key)) continue;
    const blob = await fetchAsBlob(link.href);
    if (!blob) continue;
    assets.set(key, { blob, filename: filenameFromUrl(link.href, 'brand'), category: 'brand', sourceUrl: link.href });
  }

  // Scan CSS background-image
  const allEls = document.querySelectorAll('*');
  for (const el of allEls) {
    const bg = getComputedStyle(el).backgroundImage;
    if (!bg || bg === 'none') continue;
    const urlMatch = bg.match(/url\(["']?(.+?)["']?\)/);
    if (!urlMatch) continue;
    const bgUrl = urlMatch[1];
    if (bgUrl.startsWith('data:') && bgUrl.length < 200) continue;
    const key = bgUrl.startsWith('data:') ? `data-bg-${hashCode(bgUrl.substring(0, 200))}` : dedupeKey(bgUrl);
    if (assets.has(key)) continue;
    const category = categorise(bgUrl, el);
    const blob = await fetchAsBlob(bgUrl);
    if (!blob) continue;
    assets.set(key, { blob, filename: bgUrl.startsWith('data:') ? `bg-image-${assets.size}.png` : filenameFromUrl(bgUrl, category), category, sourceUrl: bgUrl });
  }

  // Scan inline SVGs (logos only, skip small icons)
  const svgs = document.querySelectorAll('svg');
  for (const svg of svgs) {
    const rect = svg.getBoundingClientRect();
    if (rect.width < 24 || rect.height < 24) continue;
    if (svg.closest('.anticon') && rect.width < 40) continue;
    const serialised = new XMLSerializer().serializeToString(svg);
    const hash = hashCode(serialised);
    const key = `inline-svg-${hash}`;
    if (assets.has(key)) continue;
    const category = categorise(serialised.toLowerCase(), svg);
    if (category === 'other' && rect.width < 60 && rect.height < 60) continue;
    const blob = svgToBlob(svg);
    if (!blob) continue;
    const parentClass = (svg.closest('[class]')?.className || '').toString().replace(/\s+/g, '-').substring(0, 40);
    const sizeSuffix = `${Math.round(rect.width)}x${Math.round(rect.height)}`;
    assets.set(key, { blob, filename: `svg-${parentClass || 'inline'}-${sizeSuffix}.svg`, category, sourceUrl: `inline-svg` });
  }

  console.log(`[Rescue] Found ${assets.size} assets on current page. Building zip...`);

  if (assets.size === 0) {
    alert('No assets found on this page. Make sure you are on the Splose app (not a blank tab).');
    return;
  }

  // ── Build the zip ────────────────────────────────────────────────────────
  const zip = new JSZip();
  const manifest = [];

  // Track duplicate filenames within each folder
  const usedNames = {};

  for (const [key, asset] of assets) {
    const folder = asset.category;
    let filename = asset.filename;

    // Deduplicate filenames within the same folder
    const fullPath = `${folder}/${filename}`;
    if (usedNames[fullPath]) {
      const ext = filename.includes('.') ? '.' + filename.split('.').pop() : '';
      const base = filename.includes('.') ? filename.substring(0, filename.lastIndexOf('.')) : filename;
      usedNames[fullPath]++;
      filename = `${base}-${usedNames[fullPath]}${ext}`;
    } else {
      usedNames[fullPath] = 1;
    }

    zip.folder(folder).file(filename, asset.blob);

    manifest.push({
      path: `${folder}/${filename}`,
      category: asset.category,
      sourceUrl: asset.sourceUrl,
      sizeKB: Math.round(asset.blob.size / 1024),
    });
  }

  // Add manifest
  zip.file('asset-manifest.json', JSON.stringify(manifest, null, 2));

  // ── Generate and download ────────────────────────────────────────────────
  console.log('[Rescue] Compressing zip...');
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  }, (meta) => {
    if (meta.percent % 20 < 1) {
      console.log(`[Rescue] Zip progress: ${Math.round(meta.percent)}%`);
    }
  });

  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'splose-assets.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);

  const sizeMB = (zipBlob.size / 1024 / 1024).toFixed(1);
  console.log(`%c[Rescue] Done! Downloaded splose-assets.zip (${sizeMB} MB, ${assets.size} files)`, 'color: #22c55e; font-weight: bold;');
})();
