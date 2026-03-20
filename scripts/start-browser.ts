/**
 * Persistent Browser Server
 *
 * Launches a headless Chromium instance and keeps it alive for reuse by
 * screenshot-capture.ts. Saves the WebSocket endpoint to a file so other
 * scripts can connect without cold-starting a new browser each time.
 *
 * Usage:
 *   npx tsx scripts/start-browser.ts [--width=1440] [--height=900]
 *
 * The browser stays alive until this process is killed (Ctrl+C or SIGTERM).
 * screenshot-capture.ts auto-detects the running browser via the endpoint file.
 *
 * Saves ~3-5s per screenshot capture by eliminating Chromium cold start.
 */

import puppeteer from "puppeteer";
import fs from "fs";

export const WS_ENDPOINT_FILE = "/tmp/chrome-ws-endpoint.txt";

function parseArgs(args: string[]) {
  let width = 1440;
  let height = 900;

  for (const arg of args) {
    if (arg.startsWith("--width=")) {
      width = parseInt(arg.split("=")[1]);
    } else if (arg.startsWith("--height=")) {
      height = parseInt(arg.split("=")[1]);
    }
  }

  return { width, height };
}

async function startBrowser() {
  const { width, height } = parseArgs(process.argv.slice(2));

  // Clean up stale endpoint file
  if (fs.existsSync(WS_ENDPOINT_FILE)) {
    fs.unlinkSync(WS_ENDPOINT_FILE);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: {
      width,
      height,
      deviceScaleFactor: 1,
    },
  });

  const wsEndpoint = browser.wsEndpoint();
  fs.writeFileSync(WS_ENDPOINT_FILE, wsEndpoint);

  console.log(`Browser started (${width}x${height})`);
  console.log(`WS endpoint: ${wsEndpoint}`);
  console.log(`Endpoint saved to ${WS_ENDPOINT_FILE}`);
  console.log(`\nScreenshot captures will auto-connect. Press Ctrl+C to stop.`);

  const cleanup = async () => {
    console.log("\nShutting down browser...");
    try {
      fs.unlinkSync(WS_ENDPOINT_FILE);
    } catch {
      // Already deleted
    }
    await browser.close();
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  // Also clean up if browser crashes
  browser.on("disconnected", () => {
    console.log("Browser disconnected unexpectedly.");
    try {
      fs.unlinkSync(WS_ENDPOINT_FILE);
    } catch {
      // Already deleted
    }
    process.exit(1);
  });
}

startBrowser().catch((err) => {
  console.error("Failed to start browser:", err.message);
  process.exit(2);
});
