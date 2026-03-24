# Bugshot Chrome

Capture UI bugs from any live URL using **Claude in Chrome** instead of Playwright and Chromium. No Python, no browser install, no setup scripts.

Adapted from [grootan/bugshot](https://github.com/grootan/bugshot) (MIT licence).

## How it works

1. You tell Claude about a UI issue on a URL
2. Claude navigates to the page using the Claude in Chrome extension
3. Claude injects a selection overlay via JavaScript
4. You drag to select the broken area and describe the issue
5. Claude reads the structured report and takes a screenshot, then starts fixing

## Requirements

- **Claude Code** with the **Claude in Chrome** extension installed and connected
- Works best on **localhost** and staging sites (no strict Content Security Policy)
- No Python, Playwright, or Chromium needed

## Install

Copy the `bugshot-chrome` folder into your Claude Code skills directory:

```
.claude/skills/bugshot-chrome/
├── SKILL.md
├── README.md
└── scripts/
    └── overlay.js
```

Or if you use a custom skills path, place it there.

## Usage

In Claude Code, say something like:

- "bugshot the issue on localhost:3000"
- "show you the bug on my dev server"
- "capture what's broken on staging"

Claude opens the URL in your actual Chrome browser, injects the capture overlay, and waits for you to select and describe the issue.

### Capture flow

1. Click **Capture** in the floating bar
2. **Drag** to select the broken area
3. **Describe the issue** in the panel that slides up
4. **Set severity** (Low / Medium / High / Critical)
5. Hit **Cmd+Enter** (or Ctrl+Enter) or click **Done**
6. Tell Claude you are done

Claude reads the report, takes a clean screenshot, and starts fixing.

## Differences from the original Bugshot

| Feature | Original (Playwright) | This version (Claude in Chrome) |
|---|---|---|
| Browser | Launches separate Chromium | Uses your existing Chrome |
| Setup | `python3 install.py` + Playwright + Chromium | None |
| CSP bypass | Yes (CDP injection) | No (runs in page JS context) |
| Best for | Any site including strict CSP | Localhost and staging |
| Dependencies | Python 3, Playwright | Claude in Chrome extension |
| Polling | Automatic (Python script blocks) | Manual (tell Claude when done) |

## Licence

MIT (same as original)
