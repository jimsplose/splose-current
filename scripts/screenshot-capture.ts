/**
 * Screenshot Capture Tool (Puppeteer)
 *
 * Takes a screenshot at a specified viewport width using Puppeteer's bundled Chromium.
 * Puppeteer auto-installs Chromium via `npm install` — no separate browser download step.
 *
 * Supports connecting to a persistent browser started by start-browser.ts,
 * which eliminates the ~3-5s Chromium cold start per capture.
 *
 * Usage:
 *   npx tsx scripts/screenshot-capture.ts <url> <output.png> [--width=1440] [--height=900] [--full-page] [--wait=500]
 *
 * Options:
 *   --wait=<ms>     Wait after page load for rendering (default: 500ms)
 *   --full-page     Capture full scrollable page
 *   --no-reuse      Force launch a new browser (ignore persistent browser)
 *
 * Persistent browser (recommended for batch work):
 *   1. Start: npx tsx scripts/start-browser.ts &
 *   2. Captures auto-connect via /tmp/chrome-ws-endpoint.txt
 *   3. Saves ~3-5s per capture
 *
 * Examples:
 *   npx tsx scripts/screenshot-capture.ts http://localhost:3000/calendar /tmp/calendar.png
 *   npx tsx scripts/screenshot-capture.ts http://localhost:3000/settings /tmp/settings.png --width=1024 --full-page
 */

import puppeteer, { Browser } from "puppeteer";
import fs from "fs";

const WS_ENDPOINT_FILE = "/tmp/chrome-ws-endpoint.txt";

interface CaptureOptions {
  url: string;
  output: string;
  width: number;
  height: number;
  fullPage: boolean;
  waitMs: number;
  noReuse: boolean;
}

function parseArgs(args: string[]): CaptureOptions {
  const positional: string[] = [];
  let width = 1440;
  let height = 900;
  let fullPage = false;
  let waitMs = 500;
  let noReuse = false;

  for (const arg of args) {
    if (arg.startsWith("--width=")) {
      width = parseInt(arg.split("=")[1]);
    } else if (arg.startsWith("--height=")) {
      height = parseInt(arg.split("=")[1]);
    } else if (arg === "--full-page") {
      fullPage = true;
    } else if (arg.startsWith("--wait=")) {
      waitMs = parseInt(arg.split("=")[1]);
    } else if (arg === "--no-reuse") {
      noReuse = true;
    } else {
      positional.push(arg);
    }
  }

  if (positional.length < 2) {
    console.error(
      "Usage: npx tsx scripts/screenshot-capture.ts <url> <output.png> [--width=1440] [--height=900] [--full-page] [--wait=500]"
    );
    process.exit(2);
  }

  return {
    url: positional[0],
    output: positional[1],
    width,
    height,
    fullPage,
    waitMs,
    noReuse,
  };
}

/**
 * Try to connect to a persistent browser started by start-browser.ts.
 * Returns null if no persistent browser is available.
 */
async function connectToPersistentBrowser(): Promise<Browser | null> {
  if (!fs.existsSync(WS_ENDPOINT_FILE)) {
    return null;
  }

  const wsEndpoint = fs.readFileSync(WS_ENDPOINT_FILE, "utf-8").trim();
  if (!wsEndpoint) {
    return null;
  }

  try {
    const browser = await puppeteer.connect({ browserWSEndpoint: wsEndpoint });
    console.log("Connected to persistent browser");
    return browser;
  } catch {
    // Persistent browser died — clean up stale endpoint file
    console.log("Persistent browser unavailable, launching new instance...");
    try {
      fs.unlinkSync(WS_ENDPOINT_FILE);
    } catch {
      // Already deleted
    }
    return null;
  }
}

async function capture(options: CaptureOptions): Promise<void> {
  let browser: Browser;
  let isPersistent = false;

  // Try persistent browser first (unless --no-reuse)
  if (!options.noReuse) {
    const persistent = await connectToPersistentBrowser();
    if (persistent) {
      browser = persistent;
      isPersistent = true;
    } else {
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        defaultViewport: {
          width: options.width,
          height: options.height,
          deviceScaleFactor: 1,
        },
      });
    }
  } else {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: {
        width: options.width,
        height: options.height,
        deviceScaleFactor: 1,
      },
    });
  }

  const page = await browser.newPage();

  // Set viewport explicitly (needed when connecting to persistent browser)
  await page.setViewport({
    width: options.width,
    height: options.height,
    deviceScaleFactor: 1,
  });

  console.log(`Navigating to ${options.url}...`);
  await page.goto(options.url, { waitUntil: "networkidle0" });

  if (options.waitMs > 0) {
    console.log(`Waiting ${options.waitMs}ms for rendering...`);
    await new Promise((resolve) => setTimeout(resolve, options.waitMs));
  }

  console.log(
    `Capturing screenshot (${options.width}x${options.height})...`
  );
  await page.screenshot({
    path: options.output,
    fullPage: options.fullPage,
  });

  // Close page but keep persistent browser alive
  await page.close();

  if (isPersistent) {
    browser.disconnect();
  } else {
    await browser.close();
  }

  console.log(`Screenshot saved to ${options.output}`);
}

const options = parseArgs(process.argv.slice(2));
capture(options).catch((err) => {
  console.error("Screenshot capture failed:", err.message);
  console.error(
    "\nPuppeteer bundles Chromium automatically. If missing, run:\n  npm install puppeteer\n"
  );
  process.exit(2);
});
