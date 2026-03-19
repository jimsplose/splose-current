/**
 * Pixel Diff Tool
 *
 * Compares a current screenshot against a reference screenshot and produces:
 * 1. A diff image highlighting mismatched pixels
 * 2. A mismatch percentage
 * 3. Pass/fail based on configurable threshold
 *
 * Usage:
 *   npx tsx scripts/pixel-diff.ts <reference.png> <current.png> [--threshold=5] [--output=/tmp/diff.png]
 *
 * Exit codes:
 *   0 = pass (mismatch % <= threshold)
 *   1 = fail (mismatch % > threshold)
 *   2 = error (missing files, dimension mismatch, etc.)
 */

import fs from "fs";
import path from "path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

interface DiffResult {
  mismatchPercentage: number;
  mismatchPixels: number;
  totalPixels: number;
  diffImagePath: string | null;
  pass: boolean;
  threshold: number;
  referenceSize: { width: number; height: number };
  currentSize: { width: number; height: number };
}

function parseArgs(args: string[]): {
  referencePath: string;
  currentPath: string;
  threshold: number;
  outputPath: string;
} {
  const positional: string[] = [];
  let threshold = 5;
  let outputPath = "/tmp/pixel-diff-output.png";

  for (const arg of args) {
    if (arg.startsWith("--threshold=")) {
      threshold = parseFloat(arg.split("=")[1]);
    } else if (arg.startsWith("--output=")) {
      outputPath = arg.split("=")[1];
    } else {
      positional.push(arg);
    }
  }

  if (positional.length < 2) {
    console.error(
      "Usage: npx tsx scripts/pixel-diff.ts <reference.png> <current.png> [--threshold=5] [--output=/tmp/diff.png]"
    );
    process.exit(2);
  }

  return {
    referencePath: positional[0],
    currentPath: positional[1],
    threshold,
    outputPath,
  };
}

function readPNG(filePath: string): PNG {
  const buffer = fs.readFileSync(filePath);
  return PNG.sync.read(buffer);
}

/**
 * Resize an image to target dimensions using nearest-neighbor sampling.
 * This is intentionally simple — we resize the current screenshot to match
 * the reference dimensions so pixelmatch can compare them.
 */
function resizePNG(
  img: PNG,
  targetWidth: number,
  targetHeight: number
): PNG {
  const resized = new PNG({ width: targetWidth, height: targetHeight });
  const xRatio = img.width / targetWidth;
  const yRatio = img.height / targetHeight;

  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const srcX = Math.floor(x * xRatio);
      const srcY = Math.floor(y * yRatio);
      const srcIdx = (srcY * img.width + srcX) * 4;
      const dstIdx = (y * targetWidth + x) * 4;
      resized.data[dstIdx] = img.data[srcIdx];
      resized.data[dstIdx + 1] = img.data[srcIdx + 1];
      resized.data[dstIdx + 2] = img.data[srcIdx + 2];
      resized.data[dstIdx + 3] = img.data[srcIdx + 3];
    }
  }

  return resized;
}

function runDiff(
  referencePath: string,
  currentPath: string,
  threshold: number,
  outputPath: string
): DiffResult {
  if (!fs.existsSync(referencePath)) {
    console.error(`Reference file not found: ${referencePath}`);
    process.exit(2);
  }
  if (!fs.existsSync(currentPath)) {
    console.error(`Current screenshot not found: ${currentPath}`);
    process.exit(2);
  }

  const reference = readPNG(referencePath);
  let current = readPNG(currentPath);

  const refSize = { width: reference.width, height: reference.height };
  const curSize = { width: current.width, height: current.height };

  // Resize current to match reference if dimensions differ
  if (current.width !== reference.width || current.height !== reference.height) {
    console.log(
      `Dimension mismatch: reference=${reference.width}x${reference.height}, current=${current.width}x${current.height}`
    );
    console.log(`Resizing current screenshot to match reference dimensions...`);
    current = resizePNG(current, reference.width, reference.height);
  }

  const { width, height } = reference;
  const totalPixels = width * height;
  const diff = new PNG({ width, height });

  const mismatchPixels = pixelmatch(
    reference.data,
    current.data,
    diff.data,
    width,
    height,
    {
      threshold: 0.1, // per-pixel color distance threshold (0-1)
      alpha: 0.1, // blend factor for unchanged pixels in diff image
      diffColor: [255, 0, 0], // red for mismatched pixels
      diffColorAlt: [0, 255, 0], // green for anti-aliased mismatches
      includeAA: true, // include anti-aliased pixel differences
    }
  );

  const mismatchPercentage = (mismatchPixels / totalPixels) * 100;
  const pass = mismatchPercentage <= threshold;

  // Write diff image
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(outputPath, PNG.sync.write(diff));

  return {
    mismatchPercentage,
    mismatchPixels,
    totalPixels,
    diffImagePath: outputPath,
    pass,
    threshold,
    referenceSize: refSize,
    currentSize: curSize,
  };
}

// Main
const { referencePath, currentPath, threshold, outputPath } = parseArgs(
  process.argv.slice(2)
);

const result = runDiff(referencePath, currentPath, threshold, outputPath);

console.log(`\n--- Pixel Diff Results ---`);
console.log(`Reference:  ${referencePath}`);
console.log(`Current:    ${currentPath}`);
console.log(`Ref size:   ${result.referenceSize.width}x${result.referenceSize.height}`);
console.log(`Cur size:   ${result.currentSize.width}x${result.currentSize.height}`);
console.log(`Mismatch:   ${result.mismatchPercentage.toFixed(2)}% (${result.mismatchPixels} / ${result.totalPixels} pixels)`);
console.log(`Threshold:  ${result.threshold}%`);
console.log(`Result:     ${result.pass ? "PASS" : "FAIL"}`);
console.log(`Diff image: ${result.diffImagePath}`);

process.exit(result.pass ? 0 : 1);
