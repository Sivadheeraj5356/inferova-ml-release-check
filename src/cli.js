#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { checkMlRelease } from "./release-check.js";

const [releasePath] = process.argv.slice(2);
if (!releasePath) {
  console.error("Usage: npm run check -- <release-plan.json>");
  process.exit(1);
}

const release = JSON.parse(await readFile(releasePath, "utf8"));
const report = checkMlRelease(release);
console.log(`ML release readiness: ${report.score} (${report.ready ? "ready" : "needs work"})`);
for (const check of report.checks) {
  console.log(`${check.passed ? "PASS" : "FAIL"} ${check.id}: ${check.label}`);
  if (!check.passed) console.log(`  Next: ${check.fix}`);
}
