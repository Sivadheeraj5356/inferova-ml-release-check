const PRODUCT_SURFACES = new Set(["parse", "hariyaalee", "sonics", "llm-studio"]);
const REQUIRED_FIELDS = [
  ["productSurface", "The release names the product surface it changes"],
  ["dataContract", "The release defines input, output, and ownership expectations"],
  ["evalMetric", "The release defines a measurable quality metric"],
  ["latencyBudget", "The release defines a latency budget"],
  ["costBudget", "The release defines a cost budget"],
  ["rollbackPlan", "The release defines a rollback path"],
  ["reviewer", "The release names the human reviewer"]
];

export function checkMlRelease(release) {
  const checks = REQUIRED_FIELDS.map(([field, label]) => ({
    id: field,
    label,
    passed: field === "productSurface" ? typeof release[field] === "string" && release[field].trim().length > 0 : typeof release[field] === "string" && release[field].trim().length >= 8,
    fix: `Add a specific ${field} entry before release.`
  }));

  checks.push({
    id: "known-surface",
    label: "The product surface is one of Inferova Parse, Hariyaalee, Sonics, or LLM Studio",
    passed: PRODUCT_SURFACES.has(String(release.productSurface || "").toLowerCase()),
    fix: "Use parse, hariyaalee, sonics, or llm-studio."
  });

  const metricText = `${release.evalMetric || ""} ${release.latencyBudget || ""} ${release.costBudget || ""}`;
  checks.push({
    id: "measurable-budgets",
    label: "Quality, latency, or cost has a numeric target",
    passed: /\d/.test(metricText),
    fix: "Add a numeric target to evaluation, latency, or cost."
  });

  const passed = checks.filter((check) => check.passed).length;
  return {
    ready: passed === checks.length,
    score: `${passed}/${checks.length}`,
    checks
  };
}
