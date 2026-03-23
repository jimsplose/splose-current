// ============================================================
// RESCUE v3 - Ultra-lean export with CSS deduplication
// ============================================================
// The 463 MB file is huge because every page capture contains
// a full copy of ALL CSS rules + inline styles. This version
// extracts CSS once, then exports each page with only the
// unique bits (route, computed styles, DOM structure).
// ============================================================

(function () {
  'use strict';

  console.log('[RESCUE-v3] Starting ultra-lean export...');

  const origStringify = JSON.stringify;
  let capturesRef = null;

  // Step 1: Intercept JSON.stringify to grab the captures reference
  JSON.stringify = function (obj) {
    if (obj && Array.isArray(obj.captures) && obj.captures.length > 0 && obj.captures[0].css) {
      capturesRef = obj.captures;
      console.log(`[RESCUE-v3] Found captures array: ${capturesRef.length} pages`);
      return origStringify({ rescued: true, pages: capturesRef.length });
    }
    return origStringify.apply(JSON, arguments);
  };

  // Step 2: Trigger the original export to grab the reference
  const stopBtn = document.getElementById('sr-btn-stop');
  if (stopBtn) {
    stopBtn.disabled = false;
    stopBtn.click();
  }

  // Step 3: Wait, then do our own lean export
  setTimeout(function () {
    JSON.stringify = origStringify;

    if (!capturesRef || capturesRef.length === 0) {
      console.error('[RESCUE-v3] Could not find captures. Do not refresh the page!');
      return;
    }

    const totalPages = capturesRef.length;
    console.log(`[RESCUE-v3] Processing ${totalPages} pages...`);

    // ── Phase 1: Extract CSS ONCE (from the first page that has it) ──
    console.log('[RESCUE-v3] Phase 1: Extracting shared CSS (one copy only)...');

    let sharedCSS = null;
    for (const page of capturesRef) {
      if (page.css && (page.css.stylesheets || page.css.inlineStyles)) {
        sharedCSS = {
          stylesheets: (page.css.stylesheets || []).map(function (s) {
            return {
              href: s.href || '(inline)',
              blocked: s.blocked || false,
              // Keep only first 500 rules per sheet to limit size
              rules: (s.rules || []).slice(0, 500),
              totalRules: (s.rules || []).length,
            };
          }),
          // Only keep unique inline styles (deduplicate by content hash)
          inlineStyles: [],
          cssVariables: page.css.cssVariables || {},
        };

        // Deduplicate inline styles
        const seenHashes = new Set();
        for (const style of (page.css.inlineStyles || [])) {
          const content = (style.content || '').trim();
          // Use first 200 chars as a quick hash
          const hash = content.substring(0, 200);
          if (!seenHashes.has(hash) && content.length > 0) {
            seenHashes.add(hash);
            // Cap each inline style at 50KB
            sharedCSS.inlineStyles.push({
              index: style.index,
              content: content.substring(0, 50000),
              fullLength: content.length,
            });
          }
        }
        break;
      }
    }

    if (sharedCSS) {
      const cssSize = origStringify(sharedCSS).length;
      console.log(`[RESCUE-v3] Shared CSS: ${(cssSize / 1024 / 1024).toFixed(1)} MB (${sharedCSS.stylesheets.length} sheets, ${sharedCSS.inlineStyles.length} inline blocks, ${Object.keys(sharedCSS.cssVariables).length} variables)`);
    }

    // ── Phase 2: Export lean page data (no CSS, no screenshots) ──
    console.log('[RESCUE-v3] Phase 2: Building lean page captures...');

    const chunks = [];

    // Header
    const header = origStringify({
      exportedAt: new Date().toISOString(),
      baseUrl: window.location.origin,
      totalPages: totalPages,
      format: 'rescue-v3-lean',
      note: 'CSS extracted once into sharedCSS. Per-page captures contain only computed styles, DOM, and metadata.',
      sharedCSS: sharedCSS,
    });

    // Replace closing } with ,"captures":[
    chunks.push(header.slice(0, -1) + ',"captures":[');

    let exported = 0;
    let skipped = 0;

    for (let i = 0; i < totalPages; i++) {
      const page = capturesRef[i];

      // Build a minimal page object
      const lean = {
        url: page.url || '',
        route: page.route || '',
        title: page.title || '',
        timestamp: page.timestamp || '',
        viewport: page.viewport || {},
        // Computed styles: keep but limit to 3 per selector
        computedStyles: (page.computedStyles || []).slice(0, 100).map(function (el) {
          return {
            selector: el.selector || '',
            tagName: el.tagName || '',
            className: (el.className || '').substring(0, 150),
            textPreview: (el.textPreview || '').substring(0, 50),
            computedStyles: el.computedStyles || {},
          };
        }),
        // DOM structure: keep but limit depth
        domStructure: page.domStructure || null,
        // Linked resources (only from first page since they repeat)
        linkedResources: i === 0 ? (page.linkedResources || []) : undefined,
        meta: page.meta || {},
        // Explicitly exclude css and screenshot
      };

      try {
        const pageJson = origStringify(lean);
        if (i > 0) chunks.push(',');
        chunks.push(pageJson);
        exported++;

        if (exported % 25 === 0) {
          console.log(`[RESCUE-v3] Serialised ${exported}/${totalPages} pages...`);
        }
      } catch (e) {
        console.warn(`[RESCUE-v3] Skipped page ${i} (${page.route || '?'}): ${e.message}`);
        skipped++;
      }
    }

    chunks.push(']}');

    console.log(`[RESCUE-v3] Creating blob (${exported} pages, ${skipped} skipped)...`);

    const blob = new Blob(chunks, { type: 'application/json' });
    const sizeMB = (blob.size / 1024 / 1024).toFixed(1);
    console.log(`[RESCUE-v3] Final size: ${sizeMB} MB`);

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'splose-styles-rescued-lean.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);

    console.log(`[RESCUE-v3] Done! Downloaded splose-styles-rescued-lean.json (${sizeMB} MB)`);

  }, 1500);
})();
