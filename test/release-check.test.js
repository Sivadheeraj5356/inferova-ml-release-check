import test from "node:test";
import assert from "node:assert/strict";
import { checkMlRelease } from "../src/release-check.js";

const readyRelease = {
  productSurface: "parse",
  dataContract: "PDF in, structured JSON fields out; customer owns source documents and extracted data.",
  evalMetric: "Field extraction accuracy at 95% on the labeled review set.",
  latencyBudget: "P95 under 3 seconds for a 10-page document.",
  costBudget: "Under 2 USD per 1,000 pages at the current model tier.",
  rollbackPlan: "Disable the new extractor route and restore the prior parser within one deployment.",
  reviewer: "Document operations reviewer"
};

test("accepts a complete Inferova Parse release plan", () => {
  const report = checkMlRelease(readyRelease);
  assert.equal(report.ready, true);
  assert.equal(report.score, "9/9");
});

test("rejects an unknown product surface", () => {
  const report = checkMlRelease({ ...readyRelease, productSurface: "unknown-product" });
  assert.equal(report.checks.find((check) => check.id === "known-surface").passed, false);
});

test("rejects a missing data contract", () => {
  const report = checkMlRelease({ ...readyRelease, dataContract: "" });
  assert.equal(report.checks.find((check) => check.id === "dataContract").passed, false);
});

test("requires a measurable quality or budget target", () => {
  const report = checkMlRelease({
    ...readyRelease,
    evalMetric: "good extraction quality",
    latencyBudget: "fast enough",
    costBudget: "low cost"
  });
  assert.equal(report.checks.find((check) => check.id === "measurable-budgets").passed, false);
});

test("requires a rollback plan", () => {
  const report = checkMlRelease({ ...readyRelease, rollbackPlan: "later" });
  assert.equal(report.checks.find((check) => check.id === "rollbackPlan").passed, false);
});

test("requires a human reviewer", () => {
  const report = checkMlRelease({ ...readyRelease, reviewer: "TBD" });
  assert.equal(report.checks.find((check) => check.id === "reviewer").passed, false);
});
