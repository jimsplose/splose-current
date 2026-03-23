// ============================================================
// SPLOSE STYLE RECORDER v2
// ============================================================
// Paste this entire script into your browser's DevTools console
// while on acme.splose.com. Then navigate through the app.
// The recorder captures CSS, DOM structure, and screenshots
// on every page you visit. Click "Stop & Export" when done.
//
// v2 changes: auto-saves every 25 pages, split export
// (data + screenshots separate), Save Progress button,
// smaller screenshots, and chunked export to avoid timeouts.
// ============================================================

(function () {
  'use strict';

  // Prevent double-initialisation
  if (window.__sploseRecorder) {
    console.warn('Splose Style Recorder is already running.');
    return;
  }
  window.__sploseRecorder = true;

  // ── Config ─────────────────────────────────────────────────
  const AUTO_SAVE_EVERY = 25;       // Auto-export data every N pages
  const SCREENSHOT_SCALE = 0.35;    // Lower = smaller files (was 0.5)
  const SCREENSHOT_QUALITY = 0.45;  // JPEG quality (was 0.6)
  const SCREENSHOT_MAX_H = 5000;    // Max screenshot height in px (was 8000)
  const BATCH_SIZE = 25;            // Screenshots per batch file

  // ── State ──────────────────────────────────────────────────
  const captures = [];          // Array of page capture objects (no screenshots)
  const screenshots = [];       // Array of { route, screenshot } kept separate
  const seenRoutes = new Set(); // Deduplicate routes
  let isRecording = true;
  let captureCount = 0;
  let batchNumber = 0;          // How many auto-save batches exported
  let lastAutoSaveAt = 0;       // captureCount at last auto-save

  // ── Inject html2canvas from CDN ────────────────────────────
  function loadHtml2Canvas() {
    return new Promise((resolve, reject) => {
      if (window.html2canvas) return resolve();
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      s.onload = resolve;
      s.onerror = () => reject(new Error('Failed to load html2canvas'));
      document.head.appendChild(s);
    });
  }

  // ── Floating UI Panel ──────────────────────────────────────
  const panel = document.createElement('div');
  panel.id = 'splose-recorder-panel';
  panel.innerHTML = `
    <style>
      #splose-recorder-panel {
        position: fixed; bottom: 12px; left: 12px; z-index: 999999;
        background: #1a1a2e; color: #e0e0e0; font-family: system-ui, sans-serif;
        font-size: 13px; border-radius: 10px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        border: 1px solid #333;
        transition: all 0.25s ease;
        overflow: hidden;
      }
      /* Expanded state */
      #splose-recorder-panel.sr-expanded {
        padding: 14px 18px; min-width: 260px;
      }
      /* Minimised state */
      #splose-recorder-panel.sr-minimised {
        padding: 0; min-width: auto; width: auto;
        border-radius: 50%;
      }
      #splose-recorder-panel .sr-body {
        display: block;
      }
      #splose-recorder-panel.sr-minimised .sr-body {
        display: none;
      }
      /* Header row with title + minimise/expand toggle */
      #splose-recorder-panel .sr-header {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 8px;
      }
      #splose-recorder-panel.sr-minimised .sr-header {
        display: none;
      }
      #splose-recorder-panel .sr-header h3 {
        margin: 0; font-size: 14px; color: #7ec8e3;
      }
      #splose-recorder-panel .sr-btn-toggle {
        background: none; border: none; color: #888; cursor: pointer;
        font-size: 16px; padding: 0 0 0 8px; line-height: 1;
        width: auto; margin: 0;
      }
      #splose-recorder-panel .sr-btn-toggle:hover { color: #e0e0e0; }
      /* Minimised pill button */
      #splose-recorder-panel .sr-mini-btn {
        display: none; align-items: center; justify-content: center;
        width: 44px; height: 44px; cursor: pointer;
        background: none; border: none; padding: 0;
      }
      #splose-recorder-panel.sr-minimised .sr-mini-btn {
        display: flex;
      }
      #splose-recorder-panel .sr-mini-dot {
        width: 12px; height: 12px; border-radius: 50%;
        background: #4caf50; animation: sr-pulse 1.2s infinite;
      }
      #splose-recorder-panel .sr-mini-count {
        color: #7ec8e3; font-size: 11px; font-weight: 700;
        margin-left: 4px;
      }
      /* Status row */
      #splose-recorder-panel .sr-status {
        margin-bottom: 6px; line-height: 1.5;
      }
      #splose-recorder-panel .sr-dot {
        display: inline-block; width: 8px; height: 8px;
        border-radius: 50%; background: #4caf50; margin-right: 6px;
        animation: sr-pulse 1.2s infinite;
      }
      @keyframes sr-pulse {
        0%, 100% { opacity: 1; } 50% { opacity: 0.3; }
      }
      #splose-recorder-panel .sr-stats {
        font-size: 11px; color: #999; margin-bottom: 8px;
      }
      #splose-recorder-panel button.sr-action-btn {
        display: block; width: 100%; padding: 8px 0; margin-top: 5px;
        border: none; border-radius: 6px; cursor: pointer;
        font-size: 13px; font-weight: 600;
      }
      #splose-recorder-panel .sr-btn-capture {
        background: #2196f3; color: #fff;
      }
      #splose-recorder-panel .sr-btn-capture:hover { background: #1976d2; }
      #splose-recorder-panel .sr-btn-save {
        background: #4caf50; color: #fff;
      }
      #splose-recorder-panel .sr-btn-save:hover { background: #388e3c; }
      #splose-recorder-panel .sr-btn-stop {
        background: #e53935; color: #fff;
      }
      #splose-recorder-panel .sr-btn-stop:hover { background: #c62828; }
      #splose-recorder-panel .sr-btn-stop:disabled,
      #splose-recorder-panel .sr-btn-save:disabled {
        background: #555; cursor: wait;
      }
      #splose-recorder-panel .sr-log {
        max-height: 100px; overflow-y: auto; font-size: 11px;
        background: #111; border-radius: 4px; padding: 6px;
        margin-top: 8px; color: #aaa;
      }
      #splose-recorder-panel .sr-progress {
        width: 100%; height: 3px; background: #333;
        border-radius: 2px; margin-top: 6px; overflow: hidden;
        display: none;
      }
      #splose-recorder-panel .sr-progress-bar {
        height: 100%; background: #7ec8e3; width: 0%;
        transition: width 0.3s;
      }
    </style>
    <!-- Minimised view: just a dot + count -->
    <button class="sr-mini-btn" id="sr-mini-btn" title="Expand recorder">
      <span class="sr-mini-dot" id="sr-mini-dot"></span>
      <span class="sr-mini-count" id="sr-mini-count">0</span>
    </button>
    <!-- Expanded view -->
    <div class="sr-header">
      <h3>Style Recorder</h3>
      <button class="sr-btn-toggle" id="sr-btn-minimise" title="Minimise">&#x2212;</button>
    </div>
    <div class="sr-body">
      <div class="sr-status">
        <span class="sr-dot" id="sr-dot"></span>
        <span id="sr-status-text">Recording...</span>
      </div>
      <div><strong>Pages captured:</strong> <span id="sr-count">0</span></div>
      <div class="sr-stats" id="sr-stats">Auto-saves every ${AUTO_SAVE_EVERY} pages</div>
      <div class="sr-progress" id="sr-progress">
        <div class="sr-progress-bar" id="sr-progress-bar"></div>
      </div>
      <button class="sr-action-btn sr-btn-capture" id="sr-btn-capture">Capture This Page Now</button>
      <button class="sr-action-btn sr-btn-save" id="sr-btn-save">Save Progress Now</button>
      <button class="sr-action-btn sr-btn-stop" id="sr-btn-stop">Stop &amp; Export All</button>
      <div class="sr-log" id="sr-log"></div>
    </div>
  `;
  document.body.appendChild(panel);

  // Start expanded, then auto-minimise after first capture
  panel.classList.add('sr-expanded');

  const countEl = document.getElementById('sr-count');
  const miniCountEl = document.getElementById('sr-mini-count');
  const logEl = document.getElementById('sr-log');
  const statusText = document.getElementById('sr-status-text');
  const dotEl = document.getElementById('sr-dot');
  const statsEl = document.getElementById('sr-stats');
  const progressEl = document.getElementById('sr-progress');
  const progressBar = document.getElementById('sr-progress-bar');

  // ── Minimise / Expand toggle ───────────────────────────────
  function minimisePanel() {
    panel.classList.remove('sr-expanded');
    panel.classList.add('sr-minimised');
  }
  function expandPanel() {
    panel.classList.remove('sr-minimised');
    panel.classList.add('sr-expanded');
  }

  document.getElementById('sr-btn-minimise').addEventListener('click', minimisePanel);
  document.getElementById('sr-mini-btn').addEventListener('click', expandPanel);

  function log(msg) {
    const t = new Date().toLocaleTimeString();
    logEl.innerHTML = `<div>[${t}] ${msg}</div>` + logEl.innerHTML;
    console.log(`[StyleRecorder] ${msg}`);
  }

  function updateStats() {
    const nextAutoSave = AUTO_SAVE_EVERY - (captureCount - lastAutoSaveAt);
    statsEl.textContent = `Auto-save in ${nextAutoSave} pages | ${screenshots.length} screenshots buffered`;
  }

  // ── Download helper (with retry) ───────────────────────────
  function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Delay revoke to give browser time to start the download
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    const sizeMB = (blob.size / 1024 / 1024).toFixed(1);
    log(`Downloaded ${filename} (${sizeMB} MB)`);
    return sizeMB;
  }

  // ── Export data only (no screenshots) ──────────────────────
  function exportDataOnly(label) {
    log(`Exporting data (${label})...`);
    const data = {
      exportedAt: new Date().toISOString(),
      baseUrl: window.location.origin,
      totalPages: captures.length,
      exportLabel: label,
      captures: captures,
    };
    // Use minimal whitespace to reduce size
    const jsonStr = JSON.stringify(data);
    downloadFile(jsonStr, `splose-data-${label}.json`);
  }

  // ── Export screenshots in batches ──────────────────────────
  function exportScreenshotBatch(batch, batchLabel) {
    log(`Exporting screenshot batch ${batchLabel} (${batch.length} images)...`);
    const data = {
      exportedAt: new Date().toISOString(),
      batchLabel: batchLabel,
      totalInBatch: batch.length,
      screenshots: batch,
    };
    const jsonStr = JSON.stringify(data);
    downloadFile(jsonStr, `splose-screenshots-${batchLabel}.json`);
  }

  // ── Auto-save: export current data + screenshot batch ──────
  function autoSave() {
    batchNumber++;
    const label = `batch-${String(batchNumber).padStart(2, '0')}`;

    // Export the data file (always the full set so far)
    exportDataOnly(label);

    // Export any unsaved screenshots as a batch
    const unsaved = screenshots.slice(lastAutoSaveAt);
    if (unsaved.length > 0) {
      exportScreenshotBatch(unsaved, label);
    }

    lastAutoSaveAt = captureCount;
    log(`Auto-saved at ${captureCount} pages`);
  }

  // ── Extract all CSS ────────────────────────────────────────
  function extractCSS() {
    const result = { stylesheets: [], inlineStyles: [], cssVariables: {} };

    // External stylesheets
    for (const sheet of document.styleSheets) {
      try {
        const href = sheet.href || '(inline)';
        const rules = [];
        for (const rule of sheet.cssRules) {
          rules.push(rule.cssText);
        }
        result.stylesheets.push({ href, rules });
      } catch (e) {
        // CORS-blocked stylesheet - record the URL so we can fetch it
        if (sheet.href) {
          result.stylesheets.push({ href: sheet.href, rules: [], blocked: true });
        }
      }
    }

    // Inline <style> tags
    document.querySelectorAll('style').forEach((el, i) => {
      result.inlineStyles.push({ index: i, content: el.textContent });
    });

    // CSS custom properties from :root
    const rootStyles = getComputedStyle(document.documentElement);
    const allProps = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText === ':root' || rule.selectorText === ':root, :host') {
            for (let i = 0; i < rule.style.length; i++) {
              const prop = rule.style[i];
              if (prop.startsWith('--')) {
                allProps.push(prop);
              }
            }
          }
        }
      } catch (e) { /* skip CORS */ }
    }
    // Also grab computed custom properties
    for (const prop of allProps) {
      result.cssVariables[prop] = rootStyles.getPropertyValue(prop).trim();
    }

    return result;
  }

  // ── Extract computed styles for key UI elements ────────────
  function extractComputedStyles() {
    const selectors = [
      // Layout
      'body', 'main', 'nav', 'header', 'footer', 'aside',
      '[role="navigation"]', '[role="main"]', '[role="banner"]',
      // Common UI components
      'button', 'a', 'input', 'select', 'textarea', 'label',
      'table', 'th', 'td', 'tr',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span',
      // Cards, modals, dialogs
      '[class*="card"]', '[class*="Card"]',
      '[class*="modal"]', '[class*="Modal"]',
      '[class*="dialog"]', '[class*="Dialog"]',
      '[class*="drawer"]', '[class*="Drawer"]',
      '[class*="sidebar"]', '[class*="Sidebar"]',
      '[class*="toolbar"]', '[class*="Toolbar"]',
      '[class*="tab"]', '[class*="Tab"]',
      '[class*="badge"]', '[class*="Badge"]',
      '[class*="chip"]', '[class*="Chip"]',
      '[class*="avatar"]', '[class*="Avatar"]',
      '[class*="menu"]', '[class*="Menu"]',
      '[class*="dropdown"]', '[class*="Dropdown"]',
      '[class*="tooltip"]', '[class*="Tooltip"]',
      '[class*="alert"]', '[class*="Alert"]',
      '[class*="toast"]', '[class*="Toast"]',
      '[class*="form"]', '[class*="Form"]',
      '[class*="list"]', '[class*="List"]',
      // Ant Design / common React UI libraries
      '[class*="ant-"]',
      '[class*="MuiButton"]', '[class*="MuiPaper"]',
      '[class*="chakra-"]',
    ];

    const props = [
      'color', 'backgroundColor', 'fontSize', 'fontFamily', 'fontWeight',
      'lineHeight', 'letterSpacing', 'textTransform',
      'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
      'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
      'border', 'borderRadius', 'borderColor', 'borderWidth',
      'boxShadow', 'opacity',
      'display', 'flexDirection', 'alignItems', 'justifyContent', 'gap',
      'width', 'height', 'maxWidth', 'minHeight',
      'position', 'top', 'right', 'bottom', 'left',
      'overflow', 'zIndex', 'cursor', 'transition',
      'backgroundImage', 'backgroundSize',
    ];

    const elements = [];

    for (const selector of selectors) {
      try {
        const els = document.querySelectorAll(selector);
        els.forEach((el, i) => {
          if (i > 4) return; // Limit to 5 per selector to keep size manageable
          const computed = getComputedStyle(el);
          const styles = {};
          for (const p of props) {
            styles[p] = computed[p];
          }
          elements.push({
            selector,
            tagName: el.tagName.toLowerCase(),
            className: el.className ? String(el.className).substring(0, 300) : '',
            id: el.id || '',
            textPreview: (el.textContent || '').trim().substring(0, 80),
            computedStyles: styles,
          });
        });
      } catch (e) { /* skip invalid selectors */ }
    }

    return elements;
  }

  // ── Capture DOM structure (simplified) ─────────────────────
  function captureDOM() {
    function simplify(el, depth) {
      if (depth > 8) return null; // Limit depth
      const node = {
        tag: el.tagName ? el.tagName.toLowerCase() : '#text',
        className: el.className ? String(el.className).substring(0, 200) : undefined,
        id: el.id || undefined,
        role: el.getAttribute ? el.getAttribute('role') || undefined : undefined,
        children: [],
      };

      // Only include structural elements, skip deep leaf nodes
      if (el.children && el.children.length > 0) {
        for (let i = 0; i < Math.min(el.children.length, 30); i++) {
          const child = simplify(el.children[i], depth + 1);
          if (child) node.children.push(child);
        }
      } else {
        const text = (el.textContent || '').trim();
        if (text) node.text = text.substring(0, 60);
      }

      return node;
    }

    return simplify(document.body, 0);
  }

  // ── Take screenshot ────────────────────────────────────────
  async function takeScreenshot() {
    try {
      if (!window.html2canvas) {
        return null;
      }
      const canvas = await html2canvas(document.body, {
        scale: SCREENSHOT_SCALE,
        useCORS: true,
        logging: false,
        width: window.innerWidth,
        height: Math.min(document.body.scrollHeight, SCREENSHOT_MAX_H),
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      });
      return canvas.toDataURL('image/jpeg', SCREENSHOT_QUALITY);
    } catch (e) {
      log('Screenshot failed: ' + e.message);
      return null;
    }
  }

  // ── Capture the current page ───────────────────────────────
  async function capturePage(source) {
    const route = window.location.pathname + window.location.search;

    if (seenRoutes.has(route)) {
      log(`Skipping duplicate: ${route}`);
      return;
    }

    if (!isRecording) return;

    seenRoutes.add(route);
    log(`Capturing: ${route} (${source})`);
    statusText.textContent = `Capturing ${route}...`;

    // Wait a beat for any animations/loading to settle
    await new Promise(r => setTimeout(r, 1500));

    // Take screenshot separately so it goes into the screenshots array
    const screenshotData = await takeScreenshot();

    const pageData = {
      url: window.location.href,
      route: route,
      title: document.title,
      timestamp: new Date().toISOString(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        scrollHeight: document.body.scrollHeight,
      },
      css: extractCSS(),
      computedStyles: extractComputedStyles(),
      domStructure: captureDOM(),
      // Screenshots stored separately to keep data export small
      hasScreenshot: !!screenshotData,
      // Capture any <link> tags (fonts, icons, etc.)
      linkedResources: Array.from(document.querySelectorAll('link[rel]')).map(l => ({
        rel: l.rel,
        href: l.href,
        type: l.type || '',
      })),
      // Capture meta viewport and theme-color
      meta: {
        viewport: document.querySelector('meta[name="viewport"]')?.content || '',
        themeColor: document.querySelector('meta[name="theme-color"]')?.content || '',
      },
    };

    captures.push(pageData);

    // Store screenshot separately
    if (screenshotData) {
      screenshots.push({ route, screenshot: screenshotData });
    }

    captureCount++;
    countEl.textContent = captureCount;
    miniCountEl.textContent = captureCount;
    statusText.textContent = 'Recording...';
    log(`Captured ${route} (${captures.length} total)`);
    updateStats();

    // Auto-minimise after the first capture so it stays out of the way
    if (captureCount === 1) {
      setTimeout(minimisePanel, 1500);
    }

    // Auto-save every N pages
    if (captureCount - lastAutoSaveAt >= AUTO_SAVE_EVERY) {
      log(`Auto-save triggered at ${captureCount} pages...`);
      autoSave();
    }
  }

  // ── Watch for SPA navigation ───────────────────────────────
  let lastPath = window.location.pathname;

  // Override pushState / replaceState to detect SPA route changes
  const origPushState = history.pushState;
  const origReplaceState = history.replaceState;

  history.pushState = function () {
    origPushState.apply(this, arguments);
    onRouteChange('pushState');
  };

  history.replaceState = function () {
    origReplaceState.apply(this, arguments);
    onRouteChange('replaceState');
  };

  window.addEventListener('popstate', () => onRouteChange('popstate'));

  // Also use a MutationObserver as a fallback for framework-level routing
  let routeCheckTimeout;
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== lastPath) {
      clearTimeout(routeCheckTimeout);
      routeCheckTimeout = setTimeout(() => onRouteChange('mutation'), 800);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  function onRouteChange(source) {
    const newPath = window.location.pathname;
    if (newPath !== lastPath) {
      lastPath = newPath;
      // Delay to let the page render
      setTimeout(() => capturePage(source), 2000);
    }
  }

  // ── Manual capture button ──────────────────────────────────
  document.getElementById('sr-btn-capture').addEventListener('click', () => {
    // Force capture even if already seen (remove from seen set)
    const route = window.location.pathname + window.location.search;
    seenRoutes.delete(route);
    capturePage('manual');
  });

  // ── Save Progress button ───────────────────────────────────
  document.getElementById('sr-btn-save').addEventListener('click', () => {
    if (captures.length === 0) {
      log('Nothing to save yet!');
      return;
    }
    autoSave();
    statusText.textContent = `Saved! (${captureCount} pages)`;
    setTimeout(() => { statusText.textContent = 'Recording...'; }, 2000);
  });

  // ── Stop & Export All ──────────────────────────────────────
  document.getElementById('sr-btn-stop').addEventListener('click', async () => {
    expandPanel(); // Make sure the panel is visible for export status
    isRecording = false;
    dotEl.style.background = '#e53935';
    dotEl.style.animation = 'none';
    document.getElementById('sr-mini-dot').style.background = '#e53935';
    document.getElementById('sr-mini-dot').style.animation = 'none';
    document.getElementById('sr-btn-stop').disabled = true;
    document.getElementById('sr-btn-save').disabled = true;

    // Restore original history methods
    history.pushState = origPushState;
    history.replaceState = origReplaceState;
    observer.disconnect();

    // ── Step 1: Export the data file (no screenshots) ────────
    statusText.textContent = 'Exporting data...';
    progressEl.style.display = 'block';
    progressBar.style.width = '10%';
    log(`Final export: ${captures.length} pages, ${screenshots.length} screenshots`);

    // Small delay to let the UI update
    await new Promise(r => setTimeout(r, 100));

    exportDataOnly('final');
    progressBar.style.width = '30%';

    // ── Step 2: Export screenshots in batches ─────────────────
    if (screenshots.length > 0) {
      const totalBatches = Math.ceil(screenshots.length / BATCH_SIZE);
      log(`Exporting ${screenshots.length} screenshots in ${totalBatches} batch(es)...`);

      for (let i = 0; i < screenshots.length; i += BATCH_SIZE) {
        const batchIdx = Math.floor(i / BATCH_SIZE) + 1;
        const batch = screenshots.slice(i, i + BATCH_SIZE);

        statusText.textContent = `Exporting screenshots ${batchIdx}/${totalBatches}...`;
        const pct = 30 + (70 * (batchIdx / totalBatches));
        progressBar.style.width = `${pct}%`;

        // Yield to browser between batches so it doesn't freeze
        await new Promise(r => setTimeout(r, 500));

        exportScreenshotBatch(batch, `final-${String(batchIdx).padStart(2, '0')}-of-${String(totalBatches).padStart(2, '0')}`);
      }
    }

    progressBar.style.width = '100%';
    statusText.textContent = `Done! ${captures.length} pages exported`;
    log('Export complete! You can close this tab now.');
    log('Files downloaded:');
    log('  - splose-data-final.json (CSS + DOM data)');
    if (screenshots.length > 0) {
      const totalBatches = Math.ceil(screenshots.length / BATCH_SIZE);
      for (let i = 1; i <= totalBatches; i++) {
        log(`  - splose-screenshots-final-${String(i).padStart(2, '0')}-of-${String(totalBatches).padStart(2, '0')}.json`);
      }
    }
  });

  // ── Initialise ─────────────────────────────────────────────
  async function init() {
    log('Loading html2canvas...');
    try {
      await loadHtml2Canvas();
      log('html2canvas loaded successfully');
    } catch (e) {
      log('html2canvas failed to load - screenshots will be skipped');
    }

    log('Recorder v2 ready! Navigate through the app.');
    log(`Auto-saves every ${AUTO_SAVE_EVERY} pages.`);
    log('Click "Save Progress Now" to save at any time.');
    log('Click "Stop & Export All" when finished.');

    // Capture the current page immediately
    await capturePage('initial');
  }

  init();
})();
