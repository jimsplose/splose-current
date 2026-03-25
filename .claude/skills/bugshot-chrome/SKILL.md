---
name: bugshot-chrome
description: Capture a UI bug from any live URL using Claude in Chrome and inject it directly into Claude Code context with zero manual steps. No Playwright, no Chromium, no Python setup required. Trigger when the user says anything like "let me show you the bug", "I want to point at the issue", "capture what's broken on staging", "show you the UI problem", "screenshot the issue", "drag and select the problem", "bugshot this page", or any variation of wanting to visually show a UI problem on a running site. Uses the Claude in Chrome extension's MCP tools to navigate, inject a selection overlay, and capture a structured bug report with screenshot. Works best on localhost and staging sites.
---

# Bugshot Chrome

Capture UI bugs from any live URL using Claude in Chrome. No Playwright, no Chromium, no Python.

The user drags to select the broken area, describes the issue, and hits Log & Next. Captures accumulate in a queue — the user can rapid-fire multiple bugs without waiting for Claude between each one.

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
> 2. **Log many** — Rapid-fire capture multiple bugs, then batch-save to `docs/fidelity-gaps.md`

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
> 5. Hit **Cmd+Enter** or click **Log & Next**
>
> The overlay auto-resets after each capture — keep going! Navigate to other pages too.
> The counter badge in the bar tracks how many you've logged.
> Say **done logging** when you're finished."

### Step 5: Wait for the user to say they're done

Do **not** poll or read results between captures. The overlay handles queuing automatically — each capture pushes to `window.__uiCaptureQueue` and auto-resets after a 1.2s confirmation flash.

Wait for the user to say "done logging", "done", "finished", "that's all", etc.

**When ANY message arrives while the overlay is active, ALWAYS try reading the queue first** — the user may have captured bugs and then commented on something else.

### Step 6: Read the capture queue

```
mcp__claude-in-chrome__javascript_tool
code: "JSON.stringify(window.__uiCaptureQueue)"
```

Parse the returned JSON array. Each entry contains:

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

If the array is empty, the user closed the overlay without capturing anything. Let them know.

**Legacy compat:** `window.__uiCaptureResult` still holds the most recent single capture for backwards compatibility with "fix one now" mode.

### Step 7: Hide overlay and take screenshots

```
mcp__claude-in-chrome__javascript_tool
code: "document.getElementById('__uc_root').style.display = 'none'"
```

For "fix one now" mode, zoom into the captured region:

```
mcp__claude-in-chrome__computer
action: "zoom"
region: [viewX, viewY, viewX + width, viewY + height]
```

Also take a full-page screenshot for context.

### Step 8: Branch based on mode

#### Mode: Fix one now

Read the first (and only) entry from `window.__uiCaptureQueue[0]`.

Present the bug report, then **measure before fixing** (see `docs/fix-gaps-workflow.md` Step 0):

1. Read `splose-style-reference/` for exact production CSS values for the affected element
2. Measure current rendered values with `javascript_tool` + `getBoundingClientRect()`/`getComputedStyle()`
3. Calculate the exact delta between current and target

Then run the **5-iteration verification loop**:

```
FOR iteration = 1 to 5:
  1. Apply the fix using exact values from style reference (arbitrary Tailwind: h-[34px], px-[15px])
  2. Navigate back to the page, take screenshot
  3. Zoom into the fixed zone and compare against the pre-fix screenshot
  4. Check against style reference values
  5. IF all checks pass → PASS, exit loop
  6. IF mismatch → adjust in 2px increments max, continue to next iteration

IF 5 iterations exhausted → revert all changes, report what was tried
```

**After fix passes:** Take a final screenshot showing the result and present it to the user. Commit and push.

#### Mode: Log many

**Batch-process the entire queue in one go.** For each entry in the array, add a gap entry to `docs/fidelity-gaps.md`:

```markdown
- [ ] **Bugshot: [description]** — [url], region [width]x[height] at ([pageX],[pageY]). Severity: [severity]. ([timestamp])
```

Group entries under the appropriate existing section in fidelity-gaps.md based on the URL/page, or create a new Bugshot group if needed.

Present a summary to the user showing how many bugs were logged, then commit.

---

## Overlay UI states

The overlay auto-manages its own state. Here's the flow for reference:

| State | Bar hint | CTA button | Bar capture button | Count badge |
|---|---|---|---|---|
| Fresh | "Browse the page, then capture" | (panel hidden) | "Capture" | hidden |
| Capturing | "Drag to select the problem area" | (panel hidden) | "Cancel" | visible if >0 |
| Describing | "Describe the issue below" | "Log & Next ⌘↵" | — | visible if >0 |
| Flash (1.2s) | "Logged! N captured" | "Logged! (N)" disabled | — | updates |
| Ready again | "N captured — click Capture for more" | (panel hidden) | "Capture" | visible |

The overlay resets itself after each capture. **Claude does NOT need to call any reset function between captures.**

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

## API reference

| Global | Type | Description |
|---|---|---|
| `window.__uiCaptureQueue` | Array | All captures accumulated this session |
| `window.__uiCaptureResult` | Object | Legacy single-capture result (`{ done, data }`) |
| `window.__uiCaptureReset()` | Function | Manual reset (rarely needed — overlay auto-resets) |
| `window.__uiCaptureReady` | Boolean | Guard flag to prevent double-injection |

---

## Troubleshooting

**"Claude in Chrome tools not available"** — The extension must be installed and connected.

**"Overlay did not appear"** — The page may have CSP blocking inline scripts. Try localhost.

**"Queue is empty"** — The user may have clicked close (X) instead of using Log & Next.

**"Overlay didn't reset after capture"** — Clear and re-inject: `window.__uiCaptureReady = false; document.getElementById('__uc_root').remove();` then re-inject the script tag.

---

## Files

```
.claude/skills/bugshot-chrome/
  SKILL.md            # This file
  README.md           # Usage overview
  scripts/
    overlay.js        # Selection overlay UI (injected into the page)
```
