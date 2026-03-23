// ============================================================
// RESCUE v2 - Direct chunked export (bypasses original export)
// ============================================================
// Use this if rescue-session.js reported a large size and
// nothing actually downloaded. This one serialises each page
// individually and streams them into a Blob, avoiding the
// single massive JSON.stringify call entirely.
// ============================================================

(function () {
  'use strict';

  console.log('[RESCUE-v2] Starting direct chunked export...');

  // Step 1: Find the captures array via the original export button's closure.
  // We intercept JSON.stringify to grab a REFERENCE to the captures array
  // without serialising it, then we process it ourselves in chunks.

  const origStringify = JSON.stringify;
  let capturesRef = null;

  JSON.stringify = function (obj) {
    if (obj && Array.isArray(obj.captures) && obj.captures.length > 0 && obj.captures[0].css) {
      capturesRef = obj.captures;
      console.log(`[RESCUE-v2] Found captures array: ${capturesRef.length} pages`);
      // Return a tiny string so the original export doesn't hang
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

  // Step 3: Wait a tick, then do our own chunked export
  setTimeout(function () {
    JSON.stringify = origStringify; // Restore immediately

    if (!capturesRef || capturesRef.length === 0) {
      console.error('[RESCUE-v2] Could not find captures data. The recorder closure may be gone.');
      console.log('[RESCUE-v2] If you refreshed the page, the data is lost.');
      return;
    }

    console.log(`[RESCUE-v2] Exporting ${capturesRef.length} pages in chunks (no screenshots)...`);

    // Build JSON manually in chunks to avoid a single massive string
    const chunks = [];
    const header = origStringify({
      exportedAt: new Date().toISOString(),
      baseUrl: window.location.origin,
      totalPages: capturesRef.length,
      note: 'Rescued chunked export - screenshots stripped',
    });

    // Start the JSON: replace the closing } with ,"captures":[
    chunks.push(header.slice(0, -1) + ',"captures":[');

    let exported = 0;
    for (let i = 0; i < capturesRef.length; i++) {
      const page = capturesRef[i];

      // Build a clean copy without screenshot
      const clean = {};
      for (const key in page) {
        if (key !== 'screenshot') {
          clean[key] = page[key];
        }
      }
      clean.hasScreenshot = false;

      try {
        const pageJson = origStringify(clean);
        if (i > 0) chunks.push(',');
        chunks.push(pageJson);
        exported++;

        if (exported % 25 === 0) {
          console.log(`[RESCUE-v2] Serialised ${exported}/${capturesRef.length} pages...`);
        }
      } catch (e) {
        console.warn(`[RESCUE-v2] Skipped page ${i} (${page.route || '?'}): ${e.message}`);
      }
    }

    chunks.push(']}');

    console.log(`[RESCUE-v2] Creating blob from ${exported} pages...`);

    // Create blob from chunks (avoids building one giant string)
    const blob = new Blob(chunks, { type: 'application/json' });
    const sizeMB = (blob.size / 1024 / 1024).toFixed(1);
    console.log(`[RESCUE-v2] Blob size: ${sizeMB} MB`);

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'splose-styles-rescued.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);

    console.log(`[RESCUE-v2] Done! Downloaded splose-styles-rescued.json (${sizeMB} MB, ${exported} pages)`);
    console.log('[RESCUE-v2] This file works with the processing script.');

  }, 1500);
})();
