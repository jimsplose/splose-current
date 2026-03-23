// ============================================================
// RESCUE STALLED RECORDER SESSION
// ============================================================
// Paste this into the SAME console tab where the recorder is
// running. It intercepts JSON.stringify to strip screenshots,
// re-enables the export button, and triggers it.
// ============================================================

(function () {
  'use strict';

  console.log('[RESCUE] Starting rescue...');

  // Step 1: Override JSON.stringify to strip screenshots
  const origStringify = JSON.stringify;
  let interceptCount = 0;

  JSON.stringify = function (obj, replacer, space) {
    // Detect our captures export object (has .captures array with .css property)
    if (obj && Array.isArray(obj.captures) && obj.captures.length > 0 && obj.captures[0].css) {
      interceptCount++;
      console.log(`[RESCUE] Intercepted captures export (${obj.captures.length} pages). Stripping screenshots...`);

      const lightObj = {
        ...obj,
        rescuedAt: new Date().toISOString(),
        note: 'Rescued export - screenshots stripped to avoid timeout',
        captures: obj.captures.map(function (c) {
          // Remove screenshot field entirely to save memory
          const copy = {};
          for (const key in c) {
            if (key !== 'screenshot') {
              copy[key] = c[key];
            }
          }
          copy.hasScreenshot = false;
          return copy;
        }),
      };

      console.log(`[RESCUE] Stripped screenshots from ${obj.captures.length} pages`);
      // Use minimal whitespace (no pretty-printing) to reduce size further
      return origStringify.call(JSON, lightObj);
    }

    // For the "light" export that the v1 script also tries, just let it through
    return origStringify.apply(JSON, arguments);
  };

  console.log('[RESCUE] JSON.stringify override installed');

  // Step 2: Re-enable the stop button (it may have been disabled by the first attempt)
  const stopBtn = document.getElementById('sr-btn-stop');
  if (stopBtn) {
    stopBtn.disabled = false;
    stopBtn.textContent = 'RESCUE: Export Data (No Screenshots)';
    stopBtn.style.background = '#ff9800';
    console.log('[RESCUE] Stop button re-enabled. Click it now, or wait 2 seconds for auto-click...');

    // Step 3: Auto-click after a short delay
    setTimeout(function () {
      console.log('[RESCUE] Auto-clicking export button...');
      stopBtn.click();
    }, 2000);
  } else {
    // No stop button found - the panel may have been removed or never created
    // Try to find the captures array through other means
    console.log('[RESCUE] No stop button found. Trying alternative rescue...');

    // Alternative: create a fresh export button
    const rescueBtn = document.createElement('button');
    rescueBtn.textContent = 'RESCUE: Click to export data';
    rescueBtn.style.cssText = 'position:fixed;bottom:60px;left:12px;z-index:999999;padding:12px 20px;background:#ff9800;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.3);';
    document.body.appendChild(rescueBtn);

    rescueBtn.addEventListener('click', function () {
      rescueBtn.textContent = 'Searching for data...';
      rescueBtn.disabled = true;

      // Last resort: try to find captures data by scanning JS heap via
      // Performance API or by checking common locations
      console.log('[RESCUE] Button approach - the captures are likely in a closure.');
      console.log('[RESCUE] Try scrolling up in this console to find log entries from [StyleRecorder].');
      console.log('[RESCUE] If you can see those, the tab still has the data in memory.');
      console.log('[RESCUE] Try refreshing the recorder script (paste it again) - it will start fresh though.');

      rescueBtn.textContent = 'See console for instructions';
    });

    console.log('[RESCUE] Created rescue button in bottom-left corner');
  }

  // Step 4: Restore JSON.stringify after export completes (wait 30 seconds)
  setTimeout(function () {
    JSON.stringify = origStringify;
    console.log('[RESCUE] JSON.stringify restored to original');
    if (interceptCount === 0) {
      console.log('[RESCUE] WARNING: No export was intercepted. The data may not have been exported.');
      console.log('[RESCUE] Try clicking the orange export button manually.');
    } else {
      console.log(`[RESCUE] Success! Intercepted ${interceptCount} export(s). Check your downloads folder.`);
    }
  }, 30000);

  console.log('[RESCUE] Ready. The export will auto-trigger in 2 seconds...');
  console.log('[RESCUE] The downloaded file will be called splose-styles-full.json (but without screenshots)');
})();
