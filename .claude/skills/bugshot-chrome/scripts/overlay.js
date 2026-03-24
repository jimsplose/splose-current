(function() {
  if (window.__uiCaptureReady) return;
  window.__uiCaptureReady = true;

  // State
  let drag = null, committed = null, capturing = false;
  const result = { done: false, data: null };
  window.__uiCaptureResult = result;

  // Wait for body to exist before injecting UI
  function init() {
    if (document.getElementById('__uc_root')) return;

    // CSS
    const Z = 2147483640;
    const style = document.createElement('style');
    style.textContent = `
      #__uc_root * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      #__uc_bar {
        position: fixed; top: 8px; left: 50%; transform: translateX(-50%); z-index: ${Z};
        height: 34px; background: rgba(13,13,26,.92);
        border: 1px solid rgba(124,58,237,.4);
        border-radius: 20px;
        display: flex; align-items: center; gap: 8px; padding: 0 6px 0 12px;
        box-shadow: 0 2px 20px rgba(0,0,0,.6);
        backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        pointer-events: auto;
      }
      #__uc_bar.capturing { border-color: rgba(168,85,247,.7); box-shadow: 0 2px 20px rgba(168,85,247,.4); }
      #__uc_bar_logo { font-size: 14px; }
      #__uc_bar_title { font-size: 12px; font-weight: 700; color: #e2e8f0; }
      #__uc_bar_hint { font-size:11px; color:#7c3aed; }
      #__uc_bar_hint.pulse { animation: __uc_pulse 2s infinite; }
      @keyframes __uc_pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      #__uc_bar_capture {
        padding: 3px 10px; border-radius: 12px;
        background: linear-gradient(135deg,#7c3aed,#5b21b6);
        border: none; color: #fff; font-size: 11px; font-weight: 700;
        cursor: pointer; font-family: inherit; transition: opacity .15s;
      }
      #__uc_bar_capture:hover { opacity: .85; }
      #__uc_bar_capture.active {
        background: rgba(255,255,255,.08);
        color: #a78bfa;
        border: 1px solid rgba(167,139,250,.3);
      }
      #__uc_bar_close {
        width:22px; height:22px; border-radius:50%;
        background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1);
        color:#94a3b8; font-size:11px; cursor:pointer;
        display:flex; align-items:center; justify-content:center;
        transition:all .15s;
      }
      #__uc_bar_close:hover { background:rgba(239,68,68,.2); color:#f87171; }
      #__uc_dim {
        position: fixed; top:0; left:0; right:0; bottom:0; z-index:${Z-1};
        cursor: crosshair; background: rgba(0,0,0,0);
        pointer-events: none; display: none;
        transition: background .2s;
      }
      #__uc_dim.capturing { display: block; pointer-events: auto; }
      #__uc_dim.active { background: rgba(0,0,0,.5); }
      #__uc_chH { position:fixed; height:1px; left:0; right:0; z-index:${Z+2}; background:rgba(167,139,250,.45); pointer-events:none; display:none; }
      #__uc_chV { position:fixed; width:1px;  top:0; bottom:0; z-index:${Z+2}; background:rgba(167,139,250,.45); pointer-events:none; display:none; }
      #__uc_sel {
        position:fixed; z-index:${Z+3};
        border:2px solid #a855f7;
        box-shadow: 0 0 0 9999px rgba(0,0,0,.5), 0 0 16px rgba(168,85,247,.4);
        border-radius:3px; display:none; pointer-events:none;
      }
      #__uc_badge {
        position:fixed; z-index:${Z+4};
        background:#1e1333; border:1px solid #4c1d95;
        color:#c4b5fd; font-size:11px; font-weight:700;
        padding:3px 8px; border-radius:4px; pointer-events:none;
        display:none; font-family: monospace;
      }
      #__uc_panel {
        position:fixed; bottom:-280px; left:50%; transform:translateX(-50%);
        width:min(500px, 94vw); z-index:${Z+5};
        background: #0d0d1a;
        border:1px solid rgba(167,139,250,.3);
        border-radius:16px 16px 0 0;
        padding:8px 20px 22px;
        box-shadow: 0 -12px 50px rgba(109,40,217,.3);
        transition: bottom .35s cubic-bezier(.32,1.1,.4,1);
      }
      #__uc_panel.open { bottom:0; }
      #__uc_handle { width:38px; height:4px; border-radius:2px; background:rgba(167,139,250,.25); margin:10px auto 14px; }
      #__uc_ptitle { font-size:14px; font-weight:700; color:#e2e8f0; margin-bottom:10px; display:flex; align-items:center; gap:8px; }
      #__uc_chip { font-size:11px; font-weight:600; background:rgba(109,40,217,.25); color:#a78bfa; border:1px solid rgba(109,40,217,.5); border-radius:4px; padding:2px 8px; font-family:monospace; }
      #__uc_ta {
        width:100%; background:rgba(255,255,255,.04); border:1px solid rgba(167,139,250,.25);
        border-radius:10px; padding:10px 12px; color:#e2e8f0; font-size:13px;
        line-height:1.6; resize:none; height:84px; font-family:inherit;
        transition:border-color .2s;
      }
      #__uc_ta:focus { outline:none; border-color:rgba(167,139,250,.7); }
      #__uc_ta::placeholder { color:#4c3a6e; }
      #__uc_row { display:flex; gap:8px; margin-top:10px; align-items:center; }
      #__uc_sev {
        background:rgba(255,255,255,.04); border:1px solid rgba(167,139,250,.25);
        border-radius:8px; color:#a78bfa; font-size:12px; padding:8px 10px;
        cursor:pointer; min-width:120px; font-family:inherit;
      }
      #__uc_retake {
        padding:9px 14px; background:rgba(255,255,255,.05);
        border:1px solid rgba(255,255,255,.1); border-radius:8px;
        color:#64748b; font-size:12px; font-weight:600; cursor:pointer;
        font-family:inherit; transition:all .15s;
      }
      #__uc_retake:hover { background:rgba(255,255,255,.09); color:#94a3b8; }
      #__uc_send {
        flex:1; padding:10px 14px;
        background:linear-gradient(135deg,#7c3aed,#5b21b6);
        border:none; border-radius:8px; color:#fff;
        font-size:13px; font-weight:700; cursor:pointer;
        display:flex; align-items:center; justify-content:center; gap:7px;
        font-family:inherit; box-shadow:0 4px 16px rgba(109,40,217,.4);
        transition:opacity .2s;
      }
      #__uc_send:hover { opacity:.88; }
      #__uc_send:disabled { opacity:.4; cursor:not-allowed; }
      #__uc_shortcut {
        font-size:10px; color:rgba(255,255,255,.35);
        background:rgba(255,255,255,.07); border-radius:3px; padding:1px 5px;
      }
    `;
    document.head.appendChild(style);

    // DOM
    const root = document.createElement('div');
    root.id = '__uc_root';
    root.innerHTML = `
      <div id="__uc_bar">
        <div id="__uc_bar_logo">📐</div>
        <div id="__uc_bar_title">Bugshot</div>
        <div id="__uc_bar_hint">Browse the page, then capture</div>
        <button id="__uc_bar_capture">Capture</button>
        <div id="__uc_bar_close" title="End session">✕</div>
      </div>
      <div id="__uc_dim"></div>
      <div id="__uc_chH"></div>
      <div id="__uc_chV"></div>
      <div id="__uc_sel"></div>
      <div id="__uc_badge"></div>
      <div id="__uc_panel">
        <div id="__uc_handle"></div>
        <div id="__uc_ptitle">🐛 Describe the issue <span id="__uc_chip"></span></div>
        <textarea id="__uc_ta" placeholder="e.g. Nav bar overlaps content on scroll. z-index looks wrong."></textarea>
        <div id="__uc_row">
          <select id="__uc_sev">
            <option value="low">🟢 Low</option>
            <option value="medium" selected>🟡 Medium</option>
            <option value="high">🔴 High</option>
            <option value="critical">🚨 Critical</option>
          </select>
          <button id="__uc_retake">✕ Retake</button>
          <button id="__uc_send">⚡ Done <span id="__uc_shortcut">⌘↵</span></button>
        </div>
      </div>
    `;
    document.body.appendChild(root);

    const bar    = document.getElementById('__uc_bar');
    const dim    = document.getElementById('__uc_dim');
    const sel    = document.getElementById('__uc_sel');
    const chH    = document.getElementById('__uc_chH');
    const chV    = document.getElementById('__uc_chV');
    const badge  = document.getElementById('__uc_badge');
    const panel  = document.getElementById('__uc_panel');
    const chip   = document.getElementById('__uc_chip');
    const ta     = document.getElementById('__uc_ta');
    const sevEl  = document.getElementById('__uc_sev');
    const btnSend= document.getElementById('__uc_send');
    const btnRet = document.getElementById('__uc_retake');
    const hint   = document.getElementById('__uc_bar_hint');
    const btnCap = document.getElementById('__uc_bar_capture');
    const closeB = document.getElementById('__uc_bar_close');

    // Capture mode toggle
    function enterCaptureMode() {
      capturing = true;
      dim.classList.add('capturing');
      bar.classList.add('capturing');
      btnCap.textContent = 'Cancel';
      btnCap.classList.add('active');
      hint.textContent = 'Drag to select the problem area';
      hint.classList.add('pulse');
    }

    function exitCaptureMode() {
      capturing = false;
      dim.classList.remove('capturing', 'active');
      bar.classList.remove('capturing');
      btnCap.textContent = 'Capture';
      btnCap.classList.remove('active');
      hint.textContent = 'Browse the page, then capture';
      hint.classList.remove('pulse');
      sel.style.display = 'none';
      chH.style.display = chV.style.display = 'none';
      badge.style.display = 'none';
      drag = null;
      committed = null;
    }

    btnCap.addEventListener('click', () => {
      if (capturing) exitCaptureMode();
      else enterCaptureMode();
    });

    // Crosshairs
    dim.addEventListener('mousemove', e => {
      if (drag) return;
      chH.style.display='block'; chH.style.top  = e.clientY+'px';
      chV.style.display='block'; chV.style.left = e.clientX+'px';
    });
    dim.addEventListener('mouseleave', () => { chH.style.display=chV.style.display='none'; });

    // Drag
    dim.addEventListener('mousedown', e => {
      e.preventDefault();
      drag = { x0: e.clientX, y0: e.clientY };
      dim.classList.add('active');
      chH.style.display = chV.style.display = 'none';
    });

    document.addEventListener('mousemove', e => {
      if (!drag) return;
      updateSel(drag.x0, drag.y0, e.clientX, e.clientY);
      badge.style.display='block';
      badge.style.left=(e.clientX+10)+'px';
      badge.style.top =(e.clientY+10)+'px';
      const w=Math.abs(e.clientX-drag.x0), h=Math.abs(e.clientY-drag.y0);
      badge.textContent=`${Math.round(w)} × ${Math.round(h)}`;
    });

    document.addEventListener('mouseup', e => {
      if (!drag) return;
      const w=Math.abs(e.clientX-drag.x0), h=Math.abs(e.clientY-drag.y0);
      badge.style.display='none';
      if (w<20||h<20) { drag=null; sel.style.display='none'; dim.classList.remove('active'); return; }
      committed = {
        viewX: Math.min(drag.x0,e.clientX), viewY: Math.min(drag.y0,e.clientY),
        width: Math.round(w), height: Math.round(h),
        pageX: Math.round(Math.min(drag.x0,e.clientX)+window.scrollX),
        pageY: Math.round(Math.min(drag.y0,e.clientY)+window.scrollY),
      };
      drag = null;
      chip.textContent = `${committed.width} × ${committed.height} px`;
      hint.textContent = 'Describe the issue below';
      hint.classList.remove('pulse');
      panel.classList.add('open');
      setTimeout(()=>ta.focus(), 360);
    });

    function updateSel(x0,y0,x1,y1) {
      const x=Math.min(x0,x1), y=Math.min(y0,y1), w=Math.abs(x1-x0), h=Math.abs(y1-y0);
      sel.style.cssText=`display:block;left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
    }

    // Panel
    function resetPanel() {
      panel.classList.remove('open');
      exitCaptureMode();
      ta.value='';
      btnSend.disabled=false;
      btnSend.innerHTML='⚡ Done <span id="__uc_shortcut" style="font-size:10px;color:rgba(255,255,255,.35);background:rgba(255,255,255,.07);border-radius:3px;padding:1px 5px">⌘↵</span>';
    }

    btnRet.addEventListener('click', resetPanel);
    closeB.addEventListener('click', () => { result.done=true; result.data=null; });

    // Send
    btnSend.addEventListener('click', send);
    document.addEventListener('keydown', e => {
      if (e.key==='Escape') { if (panel.classList.contains('open')) resetPanel(); else if (capturing) exitCaptureMode(); }
      if ((e.metaKey||e.ctrlKey) && e.key==='Enter' && committed) send();
      if ((e.altKey||e.ctrlKey) && e.key==='c' && !committed && !e.shiftKey) {
        e.preventDefault();
        if (capturing) exitCaptureMode(); else enterCaptureMode();
      }
    });

    function send() {
      const desc = ta.value.trim();
      if (!desc) { ta.style.borderColor='#ef4444'; ta.focus(); setTimeout(()=>ta.style.borderColor='',1500); return; }
      btnSend.disabled=true;
      btnSend.innerHTML='✅ Captured! Return to Claude Code.';
      result.done = true;
      result.data = {
        url:         location.href,
        title:       document.title,
        description: desc,
        severity:    sevEl.value,
        region:      committed,
        timestamp:   new Date().toISOString(),
        viewport:    { width: window.innerWidth, height: window.innerHeight },
        scrollX:     window.scrollX,
        scrollY:     window.scrollY,
      };
    }
  } // end init()

  // Boot: try now, DOMContentLoaded, and poll as fallback
  if (document.body) { init(); }
  else {
    document.addEventListener('DOMContentLoaded', init);
    const _poll = setInterval(() => { if (document.body) { clearInterval(_poll); init(); } }, 50);
  }
})();
