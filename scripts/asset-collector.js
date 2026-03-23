/**
 * SPLOSE ASSET COLLECTOR v2 (ZIP)
 *
 * Paste this into the Chrome DevTools console while logged into acme.splose.com.
 * Browse through the app -- the script automatically scans each page for image
 * assets (logos, SVGs, background images, favicons). When you're done browsing,
 * click "Download ZIP" to get a single splose-assets.zip file.
 *
 * The floating panel in the bottom-left shows progress and lets you:
 *   - See how many unique assets have been found
 *   - Preview what's been collected
 *   - Trigger a manual re-scan of the current page
 *   - Download everything as one zip
 */

(async () => {
  // ── Load JSZip from CDN first ──────────────────────────────────────────
  if (typeof JSZip === 'undefined') {
    console.log('%c[Asset Collector] Loading JSZip...', 'color: #a78bfa;');
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
      s.onload = resolve;
      s.onerror = () => reject(new Error('Failed to load JSZip from CDN'));
      document.head.appendChild(s);
    });
    console.log('%c[Asset Collector] JSZip loaded.', 'color: #22c55e;');
  }

  // ── State ────────────────────────────────────────────────────────────────
  const collected = new Map(); // key = cleaned URL or hash, value = { blob, filename, category, sourceUrl, foundOn }
  let scanCount = 0;
  let isMinimised = false;

  // ── Categorisation rules ─────────────────────────────────────────────────
  function categorise(url, el) {
    const u = url.toLowerCase();
    const alt = (el?.alt || '').toLowerCase();

    // Brand / logo
    if (u.includes('logo') || alt.includes('logo') || u.includes('splose') && (u.includes('.svg') || u.includes('.png'))) {
      return 'brand';
    }
    // Favicon
    if (u.includes('favicon') || u.includes('icon') && u.includes('.ico')) {
      return 'brand';
    }
    // Integration logos
    const integrations = ['stripe', 'xero', 'ndis', 'medicare', 'google-maps', 'intercom', 'halaxy', 'tyro', 'telehealth', 'zoom', 'healthkit', 'proda', 'dva'];
    for (const name of integrations) {
      if (u.includes(name) || alt.includes(name)) return 'integrations';
    }
    // Background / decorative images
    if (u.includes('background') || u.includes('bg-') || u.includes('unlock') || u.includes('sparkle') || u.includes('hero')) {
      return 'backgrounds';
    }
    // AI-related imagery
    if (u.includes('ai') && (u.includes('.png') || u.includes('.svg') || u.includes('.jpg'))) {
      return 'backgrounds';
    }
    return 'other';
  }

  // ── Filename from URL ────────────────────────────────────────────────────
  function filenameFromUrl(url) {
    try {
      const pathname = new URL(url, location.origin).pathname;
      let name = pathname.split('/').pop() || 'asset';
      name = name.split('?')[0].split('#')[0];
      if (!name.includes('.')) name += '.png';
      return name;
    } catch {
      return `asset-${Date.now()}.png`;
    }
  }

  // ── Fetch helpers ────────────────────────────────────────────────────────
  async function fetchAsBlob(url) {
    try {
      const resp = await fetch(url, { credentials: 'include', mode: 'cors' });
      if (!resp.ok) return null;
      return await resp.blob();
    } catch {
      return null;
    }
  }

  function imgToBlob(imgEl) {
    return new Promise((resolve) => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = imgEl.naturalWidth || imgEl.width;
        canvas.height = imgEl.naturalHeight || imgEl.height;
        if (canvas.width === 0 || canvas.height === 0) { resolve(null); return; }
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imgEl, 0, 0);
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      } catch {
        resolve(null);
      }
    });
  }

  function svgToBlob(svgEl) {
    try {
      const clone = svgEl.cloneNode(true);
      if (!clone.getAttribute('xmlns')) {
        clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      }
      const str = new XMLSerializer().serializeToString(clone);
      return new Blob([str], { type: 'image/svg+xml' });
    } catch {
      return null;
    }
  }

  function dedupeKey(url) {
    try {
      const u = new URL(url, location.origin);
      return u.origin + u.pathname;
    } catch {
      return url;
    }
  }

  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }

  // ── Scan the current page ────────────────────────────────────────────────
  async function scanPage() {
    const pagePath = location.pathname;
    let foundThisScan = 0;

    // 1. <img> elements
    const imgs = document.querySelectorAll('img[src]');
    for (const img of imgs) {
      const src = img.src;
      if (!src || src.startsWith('data:image/gif') || src.startsWith('data:image/svg+xml;utf8,<svg')) continue;
      if ((img.naturalWidth || img.width) <= 2 && (img.naturalHeight || img.height) <= 2) continue;

      const key = src.startsWith('data:') ? `data-img-${hashCode(src.substring(0, 200))}` : dedupeKey(src);
      if (collected.has(key)) continue;

      const category = categorise(src, img);
      let blob = await fetchAsBlob(src);
      if (!blob) blob = await imgToBlob(img);
      if (!blob) continue;

      const filename = src.startsWith('data:')
        ? `inline-image-${collected.size}.png`
        : filenameFromUrl(src);

      collected.set(key, { blob, filename, category, sourceUrl: src, foundOn: pagePath });
      foundThisScan++;
    }

    // 2. <link rel="icon"> / <link rel="shortcut icon">
    const icons = document.querySelectorAll('link[rel*="icon"]');
    for (const link of icons) {
      const href = link.href;
      if (!href) continue;
      const key = dedupeKey(href);
      if (collected.has(key)) continue;

      const blob = await fetchAsBlob(href);
      if (!blob) continue;

      collected.set(key, { blob, filename: filenameFromUrl(href), category: 'brand', sourceUrl: href, foundOn: pagePath });
      foundThisScan++;
    }

    // 3. CSS background-image on visible elements
    const allEls = document.querySelectorAll('*');
    for (const el of allEls) {
      const bg = getComputedStyle(el).backgroundImage;
      if (!bg || bg === 'none') continue;
      const urlMatch = bg.match(/url\(["']?(.+?)["']?\)/);
      if (!urlMatch) continue;
      const bgUrl = urlMatch[1];
      if (bgUrl.startsWith('data:') && bgUrl.length < 200) continue;

      const key = bgUrl.startsWith('data:') ? `data-bg-${hashCode(bgUrl.substring(0, 200))}` : dedupeKey(bgUrl);
      if (collected.has(key)) continue;

      const category = categorise(bgUrl, el);
      const blob = await fetchAsBlob(bgUrl);
      if (!blob) continue;

      const filename = bgUrl.startsWith('data:')
        ? `bg-image-${collected.size}.png`
        : filenameFromUrl(bgUrl);

      collected.set(key, { blob, filename, category, sourceUrl: bgUrl, foundOn: pagePath });
      foundThisScan++;
    }

    // 4. Inline <svg> elements that look like logos (not tiny icons)
    const svgs = document.querySelectorAll('svg');
    for (const svg of svgs) {
      const rect = svg.getBoundingClientRect();
      if (rect.width < 24 || rect.height < 24) continue;
      if (svg.closest('.anticon') && rect.width < 40) continue;

      const serialised = new XMLSerializer().serializeToString(svg);
      const hash = hashCode(serialised);
      const key = `inline-svg-${hash}`;
      if (collected.has(key)) continue;

      const category = categorise(serialised.toLowerCase(), svg);
      if (category === 'other' && rect.width < 60 && rect.height < 60) continue;

      const blob = svgToBlob(svg);
      if (!blob) continue;

      const parentClass = (svg.closest('[class]')?.className || '').toString().replace(/\s+/g, '-').substring(0, 40);
      const sizeSuffix = `${Math.round(rect.width)}x${Math.round(rect.height)}`;

      collected.set(key, {
        blob,
        filename: `svg-${parentClass || 'inline'}-${sizeSuffix}.svg`,
        category,
        sourceUrl: `inline-svg on ${pagePath}`,
        foundOn: pagePath,
      });
      foundThisScan++;
    }

    scanCount++;
    updateUI(foundThisScan);
  }

  // ── Download as ZIP ──────────────────────────────────────────────────────
  async function downloadZip() {
    if (collected.size === 0) {
      alert('No assets collected yet. Browse some pages first!');
      return;
    }

    const statusEl = panel.querySelector('#ac-status');
    const btnEl = panel.querySelector('#ac-btn-download');
    btnEl.disabled = true;
    btnEl.textContent = 'Zipping...';
    statusEl.textContent = 'Building zip file...';

    const zip = new JSZip();
    const manifest = [];
    const usedPaths = {};

    for (const [key, asset] of collected) {
      const folder = asset.category;
      let filename = asset.filename;

      // Deduplicate filenames within the same folder
      const fullPath = `${folder}/${filename}`;
      if (usedPaths[fullPath]) {
        const ext = filename.includes('.') ? '.' + filename.split('.').pop() : '';
        const base = filename.includes('.') ? filename.substring(0, filename.lastIndexOf('.')) : filename;
        usedPaths[fullPath]++;
        filename = `${base}-${usedPaths[fullPath]}${ext}`;
      } else {
        usedPaths[fullPath] = 1;
      }

      zip.folder(folder).file(filename, asset.blob);
      manifest.push({
        path: `${folder}/${filename}`,
        category: asset.category,
        sourceUrl: asset.sourceUrl,
        foundOn: asset.foundOn,
        sizeKB: Math.round(asset.blob.size / 1024),
      });
    }

    zip.file('asset-manifest.json', JSON.stringify(manifest, null, 2));

    statusEl.textContent = 'Compressing...';

    const zipBlob = await zip.generateAsync(
      { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
      (meta) => {
        const pct = Math.round(meta.percent);
        if (pct % 10 < 2) statusEl.textContent = `Compressing... ${pct}%`;
      }
    );

    // Download the single zip
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'splose-assets.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);

    const sizeMB = (zipBlob.size / 1024 / 1024).toFixed(1);
    statusEl.textContent = `Downloaded splose-assets.zip (${sizeMB} MB, ${collected.size} files)`;
    btnEl.disabled = false;
    btnEl.textContent = 'Download ZIP';

    console.log(`%c[Asset Collector] Downloaded splose-assets.zip (${sizeMB} MB, ${collected.size} files)`, 'color: #22c55e; font-weight: bold;');
  }

  // ── UI Panel ─────────────────────────────────────────────────────────────
  const panel = document.createElement('div');
  panel.id = 'asset-collector-panel';
  panel.innerHTML = `
    <style>
      #asset-collector-panel {
        position: fixed; bottom: 12px; left: 12px; z-index: 999999;
        background: #1a1a2e; color: #eee; border-radius: 10px;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 13px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        min-width: 280px; overflow: hidden;
        transition: all 0.2s ease;
      }
      #ac-header {
        display: flex; justify-content: space-between; align-items: center;
        padding: 10px 14px; background: #16213e; cursor: pointer;
        border-radius: 10px 10px 0 0; user-select: none;
      }
      #ac-header h3 { margin: 0; font-size: 13px; font-weight: 600; }
      #ac-body { padding: 12px 14px; }
      #ac-body.hidden { display: none; }
      #ac-stats { margin-bottom: 10px; line-height: 1.6; }
      #ac-stats .count { color: #a78bfa; font-weight: 700; font-size: 18px; }
      #ac-stats .breakdown { color: #999; font-size: 11px; }
      #ac-status { color: #8b8b8b; font-size: 11px; margin-bottom: 8px; min-height: 16px; }
      #ac-buttons { display: flex; gap: 8px; }
      #ac-buttons button {
        flex: 1; padding: 8px 12px; border: none; border-radius: 6px;
        font-size: 12px; font-weight: 600; cursor: pointer;
        transition: background 0.15s;
      }
      #ac-buttons button:disabled { opacity: 0.5; cursor: not-allowed; }
      #ac-btn-scan { background: #2d2d5e; color: #a78bfa; }
      #ac-btn-scan:hover:not(:disabled) { background: #3d3d7e; }
      #ac-btn-download { background: #7c3aed; color: #fff; }
      #ac-btn-download:hover:not(:disabled) { background: #6d28d9; }
      #ac-btn-preview { background: #2d2d5e; color: #a78bfa; }
      #ac-btn-preview:hover:not(:disabled) { background: #3d3d7e; }
      #ac-minimise { background: none; border: none; color: #999; cursor: pointer;
        font-size: 16px; padding: 0 4px; }
      #ac-minimise:hover { color: #fff; }
    </style>
    <div id="ac-header">
      <h3>Asset Collector v2</h3>
      <button id="ac-minimise">\u2014</button>
    </div>
    <div id="ac-body">
      <div id="ac-stats">
        <span class="count">0</span> unique assets found<br>
        <span class="breakdown" id="ac-breakdown"></span>
      </div>
      <div id="ac-status">Scanning automatically as you browse...</div>
      <div id="ac-buttons">
        <button id="ac-btn-scan">Re-scan</button>
        <button id="ac-btn-preview">Preview</button>
        <button id="ac-btn-download">Download ZIP</button>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  // ── UI interactions ──────────────────────────────────────────────────────
  panel.querySelector('#ac-header').addEventListener('click', () => {
    isMinimised = !isMinimised;
    panel.querySelector('#ac-body').classList.toggle('hidden', isMinimised);
    panel.querySelector('#ac-minimise').textContent = isMinimised ? '+' : '\u2014';
  });

  panel.querySelector('#ac-btn-scan').addEventListener('click', () => {
    panel.querySelector('#ac-status').textContent = 'Scanning...';
    scanPage().then(() => {
      panel.querySelector('#ac-status').textContent = 'Manual scan complete.';
    });
  });

  panel.querySelector('#ac-btn-download').addEventListener('click', downloadZip);

  panel.querySelector('#ac-btn-preview').addEventListener('click', showPreview);

  function updateUI(foundThisScan = 0) {
    const countEl = panel.querySelector('.count');
    const breakdownEl = panel.querySelector('#ac-breakdown');
    const statusEl = panel.querySelector('#ac-status');

    countEl.textContent = collected.size;

    const cats = {};
    for (const asset of collected.values()) {
      cats[asset.category] = (cats[asset.category] || 0) + 1;
    }
    const parts = Object.entries(cats).map(([k, v]) => `${k}: ${v}`);
    breakdownEl.textContent = parts.join('  \u00b7  ');

    if (foundThisScan > 0) {
      statusEl.textContent = `+${foundThisScan} new from this page (scan #${scanCount})`;
    }
  }

  // ── Preview modal ────────────────────────────────────────────────────────
  function showPreview() {
    const existing = document.getElementById('ac-preview-modal');
    if (existing) { existing.remove(); return; }

    const modal = document.createElement('div');
    modal.id = 'ac-preview-modal';
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999999;
      background: rgba(0,0,0,0.85); overflow-y: auto; padding: 40px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #eee;
    `;

    let html = `<div style="max-width: 900px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h2 style="margin: 0; font-size: 20px;">Collected Assets (${collected.size})</h2>
        <button onclick="this.closest('#ac-preview-modal').remove()" style="background: #333; color: #fff; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; font-size: 13px;">Close</button>
      </div>`;

    const groups = {};
    for (const [key, asset] of collected) {
      if (!groups[asset.category]) groups[asset.category] = [];
      groups[asset.category].push({ key, ...asset });
    }

    for (const [cat, assets] of Object.entries(groups).sort()) {
      html += `<h3 style="color: #a78bfa; margin: 20px 0 12px; font-size: 15px; text-transform: capitalize;">${cat} (${assets.length})</h3>`;
      html += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px;">`;
      for (const asset of assets) {
        const objUrl = URL.createObjectURL(asset.blob);
        const name = asset.filename.split('/').pop();
        const sizeKB = Math.round(asset.blob.size / 1024);
        html += `
          <div style="background: #222; border-radius: 8px; padding: 10px; text-align: center;">
            <div style="height: 80px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; background: #fff; border-radius: 4px;">
              <img src="${objUrl}" style="max-width: 100%; max-height: 80px; object-fit: contain;" onerror="this.parentElement.innerHTML='<span style=color:#666>Preview N/A</span>'">
            </div>
            <div style="font-size: 11px; color: #ccc; word-break: break-all; line-height: 1.3;">${name}</div>
            <div style="font-size: 10px; color: #666; margin-top: 2px;">${sizeKB} KB \u00b7 ${asset.foundOn}</div>
          </div>`;
      }
      html += `</div>`;
    }

    html += `</div>`;
    modal.innerHTML = html;
    document.body.appendChild(modal);
  }

  // ── Auto-scan on navigation (SPA) ───────────────────────────────────────
  let lastPath = location.pathname;

  const origPush = history.pushState;
  const origReplace = history.replaceState;
  history.pushState = function () {
    origPush.apply(this, arguments);
    onNavChange();
  };
  history.replaceState = function () {
    origReplace.apply(this, arguments);
    onNavChange();
  };
  window.addEventListener('popstate', onNavChange);

  function onNavChange() {
    const newPath = location.pathname;
    if (newPath !== lastPath) {
      lastPath = newPath;
      setTimeout(() => scanPage(), 1500);
    }
  }

  // Watch for DOM changes that add new images (lazy loading, modals)
  const observer = new MutationObserver((mutations) => {
    let hasNewImages = false;
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeName === 'IMG' || (node.querySelector && node.querySelector('img, svg'))) {
          hasNewImages = true;
          break;
        }
      }
      if (hasNewImages) break;
    }
    if (hasNewImages) {
      clearTimeout(observer._timer);
      observer._timer = setTimeout(() => scanPage(), 2000);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // ── Initial scan ─────────────────────────────────────────────────────────
  console.log('%c[Asset Collector v2] Started! Browse the app, then click Download ZIP when done.', 'color: #a78bfa; font-weight: bold;');
  scanPage();
})();
