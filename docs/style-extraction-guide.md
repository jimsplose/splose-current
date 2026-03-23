# Splose Style Extraction Guide

A two-step process to capture the real Splose app's CSS, DOM structure, and screenshots, then process them into organised reference material for the prototype.

## What You Get

After running both steps you will have a `splose-style-reference/` folder containing:

- **design-tokens/** -- colours, typography, spacing, shadows, borders, CSS variables
- **components/** -- computed styles grouped by type (buttons, inputs, cards, tables, navigation, modals, etc.)
- **screenshots/** -- a JPG screenshot of every page you visited
- **page-structures/** -- simplified DOM tree of every page
- **raw/** -- all CSS rules concatenated plus a stylesheet index
- **summary.md** -- a single overview document linking everything together

## Step 1: Record the App in Your Browser

**Time needed:** 15-30 minutes depending on how many pages you visit.

### 1.1 Open the app

Go to [acme.splose.com](https://acme.splose.com) in Chrome and log in as normal.

### 1.2 Open DevTools

Press `Cmd + Option + J` (Mac) or `Ctrl + Shift + J` (Windows/Linux) to open the browser console.

### 1.3 Paste the recorder script

Open the file `scripts/style-recorder.js` from this project, copy the entire contents, and paste it into the console. Press Enter.

You will see a small dark panel appear in the top-right corner of the screen that says **"Splose Style Recorder -- Recording..."**.

> **Note:** Chrome may ask you to type `allow pasting` before it lets you paste into the console. Just type that and press Enter, then paste the script.

### 1.4 Navigate through the app

Simply click through the app as you normally would. The recorder automatically captures each new page you visit. You will see the "Pages captured" counter go up.

**Tips for thorough coverage:**

- Visit every main section (dashboard, calendar, clients, settings, invoices, etc.)
- Open at least one example of each type of detail page (a specific client, a specific appointment, etc.)
- Open modals and drawers where possible (the "Capture This Page Now" button is useful here)
- Scroll down on long pages before navigating away -- this helps the screenshot capture the full page
- Check different states where you can (empty states, filled forms, etc.)

### 1.5 Use "Capture This Page Now" for tricky content

If you open a modal, dropdown, or popover that does not change the URL, click the **"Capture This Page Now"** button on the recorder panel. This forces a manual capture of whatever is currently on screen.

### 1.6 Stop and export

When you have visited all the pages you want, click **"Stop & Export"**. Your browser will download a file called `splose-styles-full.json`.

If the file is very large (over 50 MB), it will also download a lighter version without screenshots called `splose-styles-no-screenshots.json`.

### 1.7 Move the JSON file

Move the downloaded `splose-styles-full.json` file into this project's root folder (`splose-current/`).

## Step 2: Process the Capture

### 2.1 Open a terminal

If you are not comfortable with the terminal, you can ask Claude to run this for you in Cowork. Just say:

> "Process the splose-styles-full.json file using the processing script"

### 2.2 Run the processing script

From the `splose-current/` folder, run:

```bash
python3 scripts/process-style-capture.py splose-styles-full.json splose-style-reference
```

This will create the `splose-style-reference/` folder with all the organised output.

### 2.3 Review the output

Start with `splose-style-reference/summary.md` for an overview, then browse the subfolders.

## Step 3: Use the Reference Material

### For Claude (prototype building)

When working with Claude on the prototype, point it to the reference folder:

> "Use the style reference in splose-style-reference/ to match the real Splose app's styling. Start with the CSS variables, then match colours, typography, and component styles."

### For visual comparison

Open the screenshots in `splose-style-reference/screenshots/` alongside the prototype to compare visually.

## Troubleshooting

**"Allow pasting" message in Chrome console**
Type `allow pasting` and press Enter, then paste the script again.

**Screenshots are blank or broken**
Some pages with complex canvas elements or iframes may not screenshot properly. The CSS and DOM data will still be captured correctly.

**Very large export file**
If the JSON is too large to process, use the `splose-styles-no-screenshots.json` version instead. You can always re-run with screenshots on fewer pages.

**html2canvas failed to load**
This means the CDN was blocked. Screenshots will be skipped but all CSS/DOM data will still be captured.
