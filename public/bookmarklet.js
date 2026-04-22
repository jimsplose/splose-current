"use strict";(()=>{(function(){var g="https://splose-current.vercel.app";if(document.getElementById("__splose_bookmarklet__"))return;var s=document.createElement("style");s.textContent=`
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
  `,document.head.appendChild(s);var o=document.createElement("div");o.id="__splose_bm_panel__",o.innerHTML=`
    <h3>Splose Capture</h3>
    <div class="bm-url">${location.href}</div>
    <div class="bm-mode-row">
      <button class="bm-mode active" data-mode="region">\u{1F4F7} Region</button>
      <button class="bm-mode" data-mode="page">\u{1F4C4} Page</button>
      <button class="bm-mode" data-mode="workflow">\u{1F517} Workflow</button>
    </div>
    <div id="__bm_body__"></div>
    <div class="bm-actions">
      <button class="bm-cancel" id="__bm_close__">\u2715 Close</button>
      <button class="bm-submit" id="__bm_action__">Submit</button>
    </div>
  `,document.body.appendChild(o);var d="region",_="bug";function p(){var t=document.getElementById("__bm_body__");if(t)if(d==="region"){t.innerHTML=`
        <div class="bm-intent-row">
          ${["bug","missing","remove"].map(function(n){return'<button class="bm-intent'+(n===_?" active":"")+'" data-intent="'+n+'">'+n+"</button>"}).join("")}
        </div>
        <textarea id="__bm_desc__" rows="3" placeholder="What's wrong here?"></textarea>
      `,t.querySelectorAll(".bm-intent").forEach(function(n){n.addEventListener("click",function(r){_=r.target.dataset.intent||"bug",p()})});var e=document.getElementById("__bm_action__");e&&(e.textContent="\u2B06 Submit issue",e.className="bm-submit")}else if(d==="page"){t.innerHTML='<textarea id="__bm_desc__" rows="3" placeholder="What is this page?"></textarea>';var e=document.getElementById("__bm_action__");e&&(e.textContent="\u2B06 Submit page",e.className="bm-submit green")}else{t.innerHTML='<input id="__bm_wf_name__" placeholder="Workflow name\u2026" /><p style="font-size:10px;color:rgba(255,255,255,0.4);margin:0 0 8px">Starts a session badge for multi-step capture</p>';var e=document.getElementById("__bm_action__");e&&(e.textContent="Start session \u2192",e.className="bm-submit green")}}p(),o.querySelectorAll(".bm-mode").forEach(function(t){t.addEventListener("click",function(e){o.querySelectorAll(".bm-mode").forEach(function(n){n.classList.remove("active")}),e.target.classList.add("active"),d=e.target.dataset.mode||"region",p()})}),document.getElementById("__bm_close__").addEventListener("click",function(){o.remove(),s.remove()});function m(t){var e=document.createElement("div");e.className="bm-toast",e.textContent=t,document.body.appendChild(e),setTimeout(function(){e.remove()},3e3)}function u(t,e){if(e=e||0,e>4)return"";for(var n=["nav","main","section","form","h1","h2","h3","button","input","label","a","footer","header"],r=[],l=Array.from(t.children).slice(0,20),a=0;a<l.length;a++){var b=l[a],i=b.tagName.toLowerCase();if(["script","style","svg"].indexOf(i)===-1)if(n.indexOf(i)!==-1){var c=u(b,e+1);r.push("  ".repeat(e)+i+(c?` > [
`+c+`
`+"  ".repeat(e)+"]":""))}else{var c=u(b,e+1);c&&r.push(c)}}return r.join(`
`)}document.getElementById("__bm_action__").addEventListener("click",function(){var t=document.getElementById("__bm_desc__"),e=t?t.value.trim():"",n=document.getElementById("__bm_wf_name__"),r=n?n.value.trim():"";if(d==="region"){if(!e){alert("Add a description first.");return}var l="["+_+"] "+e.slice(0,72),a="**Intent:** "+_+`
**Page:** `+location.href+`
**Source:** production
**Description:** `+e;fetch(g+"/api/issues",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:l,body:a,labels:[_]})}).then(function(i){return i.json()}).then(function(i){m("Issue #"+i.number+" created"),setTimeout(function(){o.remove(),s.remove()},3e3)}).catch(function(){m("Error creating issue")})}else if(d==="page"){if(!e){alert("Add a description first.");return}var b=u(document.body,0),l="[new-page] "+e.slice(0,72),a=`**Intent:** new-page
**URL:** `+location.href+`
**Title:** `+document.title+`
**Viewport:** `+window.innerWidth+"\xD7"+window.innerHeight+`
**Description:** `+e+`

### DOM Outline
`+b+`

Screenshot: capture manually (bookmarklet)`;fetch(g+"/api/issues",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:l,body:a,labels:["new-page"]})}).then(function(f){return f.json()}).then(function(f){m("Issue #"+f.number+" created"),setTimeout(function(){o.remove(),s.remove()},3e3)}).catch(function(){m("Error creating issue")})}else{if(!r){alert("Enter a workflow name.");return}m('Workflow session "'+r+'" started in app \u2014 use Page Capture > Workflow in DevNavigator'),setTimeout(function(){o.remove(),s.remove()},3e3)}})})();})();
