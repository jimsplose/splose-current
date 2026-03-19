/**
 * Screenshot Capture Tool (Puppeteer)
 *
 * Takes a screenshot at a specified viewport width using Puppeteer's bundled Chromium.
 * Puppeteer auto-installs Chromium via `npm install` — no separate browser download step.
 *
 * Usage:
 *   npx tsx scripts/screenshot-capture.ts <url> <output.png> [--width=1440] [--height=900] [--full-page] [--wait=3000]
 *
 * Examples:
 *   npx tsx scripts/screenshot-capture.ts http://localhost:3000/calendar /tmp/calendar.png
 *   npx tsx scripts/screenshot-capture.ts http://localhost:3000/settings /tmp/settings.png --width=1024 --full-page
 */

import puppeteer from "puppeteer";

interface CaptureOptions {
  url: string;
  output: string;
  width: number;
  height: number;
  fullPage: boolean;
  waitMs: number;
}

function parseArgs(args: string[]): CaptureOptions {
  const positional: string[] = [];
  let width = 1440;
  let height = 900;
  let fullPage = false;
  let waitMs = 3000;

  for (const arg of args) {
    if (arg.startsWith("--width=")) {
      width = parseInt(arg.split("=")[1]);
    } else if (arg.startsWith("--height=")) {
      height = parseInt(arg.split("=")[1]);
    } else if (arg === "--full-page") {
      fullPage = true;
    } else if (arg.startsWith("--wait=")) {
      waitMs = parseInt(arg.split("=")[1]);
    } else {
      positional.push(arg);
    }
  }

  if (positional.length < 2) {
    console.error(
      "Usage: npx tsx scripts/screenshot-capture.ts <url> <output.png> [--width=1440] [--height=900] [--full-page] [--wait=3000]"
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
  };
}

async function capture(options: CaptureOptions): Promise<void> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: {
      width: options.width,
      height: options.height,
      deviceScaleFactor: 1, // Consistent 1x scale for diffing
    },
  });

  const page = await browser.newPage();

  console.log(`Navigating to ${options.url}...`);
  await page.goto(options.url, { waitUntil: "networkidle0" });

  if (options.waitMs > 0) {
    console.log(`Waiting ${options.waitMs}ms for animations/rendering...`);
    await new Promise((resolve) => setTimeout(resolve, options.waitMs));
  }

  console.log(
    `Capturing screenshot (${options.width}x${options.height})...`
  );
  await page.screenshot({
    path: options.output,
    fullPage: options.fullPage,
  });

  await browser.close();
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
