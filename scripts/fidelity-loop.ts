/**
 * Fidelity Convergence Tracker
 *
 * Runs pixel-diff after each iteration and tracks convergence.
 * Used by agents during the screenshot verification loop to decide
 * whether to continue iterating or stop.
 *
 * Usage:
 *   npx tsx scripts/fidelity-loop.ts <reference.png> <current.png> [--iteration=1] [--history=/tmp/convergence.json] [--threshold=5]
 *
 * Outputs:
 *   - Mismatch % for this iteration
 *   - Convergence decision: CONTINUE, CONVERGED, or PLATEAU
 *   - Updated history file for next iteration
 *
 * Decision logic:
 *   - CONVERGED: mismatch % <= threshold → stop, you're done
 *   - PLATEAU: mismatch % didn't decrease by >0.5pp for 2 consecutive iterations → stop, needs different approach
 *   - MAX_ITERATIONS: iteration >= 10 → stop regardless
 *   - CONTINUE: still improving → keep going
 */

import fs from "fs";
import { execSync } from "child_process";
import path from "path";

interface IterationRecord {
  iteration: number;
  mismatchPercentage: number;
  timestamp: string;
}

interface ConvergenceHistory {
  referencePath: string;
  records: IterationRecord[];
  decision: "CONTINUE" | "CONVERGED" | "PLATEAU" | "MAX_ITERATIONS";
}

const MAX_ITERATIONS = 10;
const MIN_IMPROVEMENT = 0.5; // Must improve by at least 0.5 percentage points
const PLATEAU_WINDOW = 2; // Stop after 2 iterations without meaningful improvement

function parseArgs(args: string[]) {
  const positional: string[] = [];
  let iteration = 1;
  let historyPath = "/tmp/convergence.json";
  let threshold = 5;

  for (const arg of args) {
    if (arg.startsWith("--iteration=")) {
      iteration = parseInt(arg.split("=")[1]);
    } else if (arg.startsWith("--history=")) {
      historyPath = arg.split("=")[1];
    } else if (arg.startsWith("--threshold=")) {
      threshold = parseFloat(arg.split("=")[1]);
    } else {
      positional.push(arg);
    }
  }

  if (positional.length < 2) {
    console.error(
      "Usage: npx tsx scripts/fidelity-loop.ts <reference.png> <current.png> [--iteration=1] [--history=/tmp/convergence.json] [--threshold=5]"
    );
    process.exit(2);
  }

  return {
    referencePath: positional[0],
    currentPath: positional[1],
    iteration,
    historyPath,
    threshold,
  };
}

function loadHistory(historyPath: string): ConvergenceHistory | null {
  if (fs.existsSync(historyPath)) {
    return JSON.parse(fs.readFileSync(historyPath, "utf-8"));
  }
  return null;
}

function runPixelDiff(
  referencePath: string,
  currentPath: string,
  iteration: number
): number {
  const diffOutput = `/tmp/diff-iteration-${iteration}.png`;
  const scriptPath = path.join(__dirname, "pixel-diff.ts");

  try {
    const output = execSync(
      `npx tsx ${scriptPath} "${referencePath}" "${currentPath}" --threshold=100 --output="${diffOutput}"`,
      { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
    );

    // Extract mismatch percentage from output
    const match = output.match(/Mismatch:\s+([\d.]+)%/);
    if (match) {
      return parseFloat(match[1]);
    }
    console.error("Could not parse mismatch percentage from pixel-diff output");
    process.exit(2);
  } catch (err: unknown) {
    // pixel-diff exits 1 on fail (mismatch > threshold), but we set threshold=100 so it should always pass
    const error = err as { stdout?: string; stderr?: string };
    const stdout = error.stdout || "";
    const match = stdout.match(/Mismatch:\s+([\d.]+)%/);
    if (match) {
      return parseFloat(match[1]);
    }
    console.error("pixel-diff failed:", error.stderr);
    process.exit(2);
  }
  return 100; // unreachable, satisfies TypeScript
}

function decide(
  records: IterationRecord[],
  threshold: number,
  currentIteration: number
): "CONTINUE" | "CONVERGED" | "PLATEAU" | "MAX_ITERATIONS" {
  const latest = records[records.length - 1];

  // Check convergence
  if (latest.mismatchPercentage <= threshold) {
    return "CONVERGED";
  }

  // Check max iterations
  if (currentIteration >= MAX_ITERATIONS) {
    return "MAX_ITERATIONS";
  }

  // Check plateau (need at least PLATEAU_WINDOW + 1 records)
  if (records.length >= PLATEAU_WINDOW + 1) {
    const recentRecords = records.slice(-PLATEAU_WINDOW - 1);
    let plateauCount = 0;

    for (let i = 1; i < recentRecords.length; i++) {
      const improvement =
        recentRecords[i - 1].mismatchPercentage -
        recentRecords[i].mismatchPercentage;
      if (improvement < MIN_IMPROVEMENT) {
        plateauCount++;
      }
    }

    if (plateauCount >= PLATEAU_WINDOW) {
      return "PLATEAU";
    }
  }

  return "CONTINUE";
}

// Main
const { referencePath, currentPath, iteration, historyPath, threshold } =
  parseArgs(process.argv.slice(2));

const mismatchPercentage = runPixelDiff(referencePath, currentPath, iteration);

// Load or create history
let history = loadHistory(historyPath) || {
  referencePath,
  records: [],
  decision: "CONTINUE" as const,
};

// Add this iteration
const record: IterationRecord = {
  iteration,
  mismatchPercentage,
  timestamp: new Date().toISOString(),
};
history.records.push(record);

// Decide
const decision = decide(history.records, threshold, iteration);
history.decision = decision;

// Save history
fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));

// Output
console.log(`\n--- Convergence Tracker (Iteration ${iteration}) ---`);
console.log(`Mismatch: ${mismatchPercentage.toFixed(2)}%`);
console.log(`Threshold: ${threshold}%`);

if (history.records.length > 1) {
  const prev = history.records[history.records.length - 2];
  const improvement = prev.mismatchPercentage - mismatchPercentage;
  console.log(
    `Improvement: ${improvement > 0 ? "+" : ""}${improvement.toFixed(2)}pp (from ${prev.mismatchPercentage.toFixed(2)}%)`
  );
}

console.log(`\nHistory:`);
for (const r of history.records) {
  console.log(`  Iteration ${r.iteration}: ${r.mismatchPercentage.toFixed(2)}%`);
}

console.log(`\nDecision: ${decision}`);
switch (decision) {
  case "CONVERGED":
    console.log(`  Mismatch is below ${threshold}% threshold. Done!`);
    break;
  case "PLATEAU":
    console.log(
      `  No meaningful improvement for ${PLATEAU_WINDOW} consecutive iterations.`
    );
    console.log(
      `  Remaining diff likely needs a different approach (structural change, missing component, etc.).`
    );
    break;
  case "MAX_ITERATIONS":
    console.log(`  Reached maximum of ${MAX_ITERATIONS} iterations.`);
    break;
  case "CONTINUE":
    console.log(`  Still improving — continue iterating.`);
    break;
}

// Exit 0 for CONVERGED, 1 for everything else
process.exit(decision === "CONVERGED" ? 0 : 1);
