// scripts/bookmarklet-src/widget.js
// Self-contained bookmarklet widget — no React, no Next.js, vanilla JS only.
// Posted to: SPLOSE_API_BASE/api/issues

(function () {
  var API_BASE = 'https://splose-current.vercel.app';
  if (document.getElementById('__splose_bookmarklet__')) return;

  // ── Styles ──────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = `
    #__splose_bookmarklet__ { all: initial; }
    #__splose_bm_panel__ {
      position: fixed; bottom: 20px; right: 20px; z-index: 2147483647;
      background: rgba(17,24,39,0.97); border: 1px solid rgba(255,255,255,0.15);
      border-radius: 10px; padding: 14px; width: 300px; color: #fff;
      font: 12px/1.5 -apple-system,sans-serif; box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    #__splose_bm_panel__ h3 { margin: 0 0 10px; font-size: 12px; font-weight: 600; }
    #__splose_bm_panel__ .bm-mode-row { display: flex; gap: 6px; margin-bottom: 10px; }
    #__splose_bm_panel__ .bm-mode { flex:1; padding:5px; border-radius:4px; border:1px solid rgba(255,255,255,0.2); background:none; color:rgba(255,255,255,0.6); cursor:pointer; font-size:10px; }
    #__splose_bm_panel__ .bm-mode.active { background:rgba(6,95,70,0.4); border-color:#065f46; color:#6ee7b7; }
    #__splose_bm_panel__ textarea, #__splose_bm_panel__ input { width:100%; background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.15); border-radius:4px; color:#fff; font-size:11px; padding:6px; box-sizing:border-box; margin-bottom:8px; font-family:inherit; }
    #__splose_bm_panel__ .bm-actions { display:flex; justify-content:flex-end; gap:6px; }
    #__splose_bm_panel__ button.bm-cancel { background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.15); border-radius:4px; color:rgba(255,255,255,0.6); font-size:10px; padding:5px 10px; cursor:pointer; }
    #__splose_bm_panel__ button.bm-submit { background:#7c3aed; border:none; border-radius:4px; color:#fff; font-size:10px; padding:5px 10px; cursor:pointer; }
    #__splose_bm_panel__ button.bm-submit.green { background:#065f46; color:#6ee7b7; }
    #__splose_bm_panel__ .bm-intent-row { display:flex; gap:4px; margin-bottom:8px; }
    #__splose_bm_panel__ .bm-intent { flex:1; padding:3px; border-radius:4px; border:1px solid rgba(255,255,255,0.15); background:none; color:rgba(255,255,255,0.5); font-size:10px; cursor:pointer; }
    #__splose_bm_panel__ .bm-intent.active { background:rgba(124,58,237,0.3); border-color:#7c3aed; color:#e9d5ff; }
    #__splose_bm_panel__ .bm-url { font-size:9px; color:rgba(255,255,255,0.4); margin-bottom:8px; word-break:break-all; }
    #__splose_bm_panel__ .bm-toast { position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:#059669; color:#fff; font-size:11px; padding:8px 16px; border-radius:6px; z-index:2147483647; }
  `;
  document.head.appendChild(style);

  // ── Panel ────────────────────────────────────────────────────────────
  var panel = document.createElement('div');
  panel.id = '__splose_bm_panel__';
  panel.innerHTML = `
    <h3>Splose Capture</h3>
    <div class="bm-url">${location.href}</div>
    <div class="bm-mode-row">
      <button class="bm-mode active" data-mode="region">📷 Region</button>
      <button class="bm-mode" data-mode="page">📄 Page</button>
      <button class="bm-mode" data-mode="workflow">🔗 Workflow</button>
    </div>
    <div id="__bm_body__"></div>
    <div class="bm-actions">
      <button class="bm-cancel" id="__bm_close__">✕ Close</button>
      <button class="bm-submit" id="__bm_action__">Submit</button>
    </div>
  `;
  document.body.appendChild(panel);

  var currentMode = 'region';
  var currentIntent = 'bug';

  function renderBody() {
    var body = document.getElementById('__bm_body__');
    if (!body) return;
    if (currentMode === 'region') {
      body.innerHTML = `
        <div class="bm-intent-row">
          ${['bug','missing','remove'].map(function(i) { return '<button class="bm-intent' + (i===currentIntent?' active':'') + '" data-intent="' + i + '">' + i + '</button>'; }).join('')}
        </div>
        <textarea id="__bm_desc__" rows="3" placeholder="What's wrong here?"></textarea>
      `;
      body.querySelectorAll('.bm-intent').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          currentIntent = e.target.dataset.intent || 'bug';
          renderBody();
        });
      });
      var action = document.getElementById('__bm_action__');
      if (action) { action.textContent = '⬆ Submit issue'; action.className = 'bm-submit'; }
    } else if (currentMode === 'page') {
      body.innerHTML = `<textarea id="__bm_desc__" rows="3" placeholder="What is this page?"></textarea>`;
      var action = document.getElementById('__bm_action__');
      if (action) { action.textContent = '⬆ Submit page'; action.className = 'bm-submit green'; }
    } else {
      body.innerHTML = `<input id="__bm_wf_name__" placeholder="Workflow name…" /><p style="font-size:10px;color:rgba(255,255,255,0.4);margin:0 0 8px">Starts a session badge for multi-step capture</p>`;
      var action = document.getElementById('__bm_action__');
      if (action) { action.textContent = 'Start session →'; action.className = 'bm-submit green'; }
    }
  }

  renderBody();

  panel.querySelectorAll('.bm-mode').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      panel.querySelectorAll('.bm-mode').forEach(function(b) { b.classList.remove('active'); });
      e.target.classList.add('active');
      currentMode = e.target.dataset.mode || 'region';
      renderBody();
    });
  });

  document.getElementById('__bm_close__').addEventListener('click', function() {
    panel.remove();
    style.remove();
  });

  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'bm-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function() { t.remove(); }, 3000);
  }

  function buildDomOutlineSimple(root, depth) {
    depth = depth || 0;
    if (depth > 4) return '';
    var SEMANTIC = ['nav','main','section','form','h1','h2','h3','button','input','label','a','footer','header'];
    var lines = [];
    var children = Array.from(root.children).slice(0, 20);
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      var tag = child.tagName.toLowerCase();
      if (['script','style','svg'].indexOf(tag) !== -1) continue;
      if (SEMANTIC.indexOf(tag) !== -1) {
        var inner = buildDomOutlineSimple(child, depth+1);
        lines.push('  '.repeat(depth) + tag + (inner ? ' > [\n' + inner + '\n' + '  '.repeat(depth) + ']' : ''));
      } else {
        var inner = buildDomOutlineSimple(child, depth+1);
        if (inner) lines.push(inner);
      }
    }
    return lines.join('\n');
  }

  document.getElementById('__bm_action__').addEventListener('click', function() {
    var descEl = document.getElementById('__bm_desc__');
    var desc = descEl ? descEl.value.trim() : '';
    var wfEl = document.getElementById('__bm_wf_name__');
    var wfName = wfEl ? wfEl.value.trim() : '';

    if (currentMode === 'region') {
      if (!desc) { alert('Add a description first.'); return; }
      var title = '[' + currentIntent + '] ' + desc.slice(0, 72);
      var body = '**Intent:** ' + currentIntent + '\n**Page:** ' + location.href + '\n**Source:** production\n**Description:** ' + desc;
      fetch(API_BASE + '/api/issues', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title: title, body: body, labels:[currentIntent] }) })
        .then(function(res) { return res.json(); })
        .then(function(issue) {
          toast('Issue #' + issue.number + ' created');
          setTimeout(function() { panel.remove(); style.remove(); }, 3000);
        })
        .catch(function() { toast('Error creating issue'); });

    } else if (currentMode === 'page') {
      if (!desc) { alert('Add a description first.'); return; }
      var domOutline = buildDomOutlineSimple(document.body, 0);
      var title = '[new-page] ' + desc.slice(0, 72);
      var body = '**Intent:** new-page\n**URL:** ' + location.href + '\n**Title:** ' + document.title + '\n**Viewport:** ' + window.innerWidth + '×' + window.innerHeight + '\n**Description:** ' + desc + '\n\n### DOM Outline\n' + domOutline + '\n\nScreenshot: capture manually (bookmarklet)';
      fetch(API_BASE + '/api/issues', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title: title, body: body, labels:['new-page'] }) })
        .then(function(res) { return res.json(); })
        .then(function(issue) {
          toast('Issue #' + issue.number + ' created');
          setTimeout(function() { panel.remove(); style.remove(); }, 3000);
        })
        .catch(function() { toast('Error creating issue'); });

    } else {
      if (!wfName) { alert('Enter a workflow name.'); return; }
      toast('Workflow session "' + wfName + '" started in app — use Page Capture > Workflow in DevNavigator');
      setTimeout(function() { panel.remove(); style.remove(); }, 3000);
    }
  });
})();
