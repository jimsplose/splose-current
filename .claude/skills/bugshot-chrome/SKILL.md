---
name: bugshot-chrome
description: Capture a UI bug from any live URL using Claude in Chrome and inject it directly into Claude Code context with zero manual steps. No Playwright, no Chromium, no Python setup required. Trigger when the user says anything like "let me show you the bug", "I want to point at the issue", "capture what's broken on staging", "show you the UI problem", "screenshot the issue", "drag and select the problem", "bugshot this page", or any variation of wanting to visually show a UI problem on a running site. Uses the Claude in Chrome extension's MCP tools to navigate, inject a selection overlay, and capture a structured bug report with screenshot. Works best on localhost and staging sites.
---

# Bugshot Chrome

Capture UI bugs from any live URL using Claude in Chrome. No Playwright, no Chromium, no Python.

The user drags to select the broken area, describes the issue, and hits Send. You receive a structured report and screenshot, then start fixing.

---

## Requirements

- The **Claude in Chrome** extension must be installed, connected, and active.
- Works best on **localhost** and internal staging URLs (sites without strict Content Security Policy headers).
- No Python, no Playwright, no Chromium install needed.

> **CSP note:** This skill injects the overlay via `javascript_tool`, which runs in the page's JavaScript context. Sites with strict CSP headers may block the injection. Localhost and most staging environments do not have this restriction.

---

## How to use this skill

Follow these steps exactly. Do not skip steps or combine tool calls.

### Step 0: Ask the user — fix now or log for later?

Use AskUserQuestion:

> **How would you like to handle bugs?**
> 1. **Fix one now** — Capture a bug and fix it immediately with the 5-iteration verification loop
> 2. **Log many** — Capture multiple bugs, save them to `docs/fidelity-gaps.md` for fixing in a later session

### Step 1: Determine the URL

If the user has not provided a URL, default to `http://localhost:3000`. Ask which page to open if unclear.

### Step 2: Navigate to the URL

Use the `mcp__claude-in-chrome__navigate` tool to open the page. Wait for navigation to complete.

### Step 3: Inject the overlay (fast path)

Inject a single script tag that loads the overlay from localhost. Do NOT read the overlay.js file — it's served as a static asset:

```
mcp__claude-in-chrome__javascript_tool
code: "const s = document.createElement('script'); s.src = '/scripts/bugshot-overlay.js'; document.head.appendChild(s);"
```

This loads instantly from the dev server. No file reading needed.

**Fallback (non-localhost sites):** If the page is not on localhost, read `.claude/skills/bugshot-chrome/scripts/overlay.js` and inject the full contents inline.

### Step 4: Tell the user what to do

Say:

> "The Bugshot overlay is active. Here's how to use it:
>
> 1. Click **Capture** in the floating bar at the top
> 2. **Drag** to select the broken area (purple selection box)
> 3. **Describe the issue** in the panel that slides up
> 4. **Set the severity** (Low / Medium / High / Critical)
> 5. Hit **Cmd+Enter** or click **Done**
>
> Let me know once you've submitted."

### Step 5: Wait for the user to confirm

Do **not** poll. Wait for the user to say they are done (e.g. "done", "sent", "captured it", "ready").

### Step 6: Read the capture result

```
mcp__claude-in-chrome__javascript_tool
code: "JSON.stringify(window.__uiCaptureResult)"
```

Parse the JSON. The `data` field contains:

| Field         | Description                                  |
|---------------|----------------------------------------------|
| `url`         | The page URL                                 |
| `title`       | The page title                               |
| `description` | The user's issue description                 |
| `severity`    | `low`, `medium`, `high`, or `critical`       |
| `region`      | Selection coordinates and dimensions         |
| `timestamp`   | ISO timestamp of the capture                 |
| `viewport`    | Browser viewport width and height            |
| `scrollX`     | Horizontal scroll offset                     |
| `scrollY`     | Vertical scroll offset                       |

If `data` is `null`, the user clicked close. Let them know no capture was recorded.

### Step 7: Hide overlay and take screenshot

```
mcp__claude-in-chrome__javascript_tool
code: "document.getElementById('__uc_root').style.display = 'none'"
```

Then zoom into the captured region for a precise screenshot:

```
mcp__claude-in-chrome__computer
action: "zoom"
region: [viewX, viewY, viewX + width, viewY + height]
```

Also take a full-page screenshot for context.

### Step 8: Branch based on mode

#### Mode: Fix one now

Present the bug report, then immediately run the **5-iteration verification loop** from `docs/fix-gaps-workflow.md` Step 4:

```
FOR iteration = 1 to 5:
  1. Invoke /impeccable:frontend-design for design-informed analysis
  2. Analyse the screenshot and issue description
  3. Identify root cause (don't just guess CSS values)
  4. Make the fix
  5. Navigate back to the page, take screenshot
  6. Zoom into the fixed zone and compare against the pre-fix screenshot
  7. Check: hierarchy, proportion, weight, spacing
  8. IF all checks pass → PASS, exit loop
  9. IF mismatch → document what's wrong, continue to next iteration

IF 5 iterations exhausted → revert all changes, report what was tried
```

**After fix passes:** Take a final screenshot showing the result and present it to the user. Commit and push.

#### Mode: Log many

Present the bug report, then add it to `docs/fidelity-gaps.md` as a new gap entry:

```markdown
- [ ] **Bugshot: [description]** — [url], region [width]x[height] at ([pageX],[pageY]). Severity: [severity]. ([timestamp])
```

Then re-show the overlay for the next capture:

```
mcp__claude-in-chrome__javascript_tool
code: "document.getElementById('__uc_root').style.display = ''; window.__uiCaptureResult.done = false; window.__uiCaptureResult.data = null; document.getElementById('__uc_panel').classList.remove('open'); document.getElementById('__uc_sel').style.display = 'none'; document.getElementById('__uc_dim').classList.remove('capturing', 'active'); document.getElementById('__uc_bar').classList.remove('capturing'); document.getElementById('__uc_ta').value = ''; document.getElementById('__uc_bar_hint').textContent = 'Browse the page, then capture'; document.getElementById('__uc_bar_hint').classList.remove('pulse'); document.getElementById('__uc_bar_capture').textContent = 'Capture'; document.getElementById('__uc_bar_capture').classList.remove('active');"
```

Repeat from Step 4. When the user says they're done logging, commit the updated fidelity-gaps.md.

---

## Sizing guidance

When fixing visual sizing issues, use **arbitrary Tailwind values** for precise control:

```
h-[30px]  ← exact pixels, not limited to 4px jumps
w-[120px]
text-[15px]
gap-[6px]
```

Never guess between coarse steps like h-7 (28px) vs h-8 (32px) when the correct value is h-[30px].

---

## Troubleshooting

**"Claude in Chrome tools not available"** — The extension must be installed and connected.

**"Overlay did not appear"** — The page may have CSP blocking inline scripts. Try localhost.

**"Result is null"** — The user may have clicked close instead of Done.

---

## Files

```
.claude/skills/bugshot-chrome/
  SKILL.md            # This file
  README.md           # Usage overview
  scripts/
    overlay.js        # Selection overlay UI (injected into the page)
```
