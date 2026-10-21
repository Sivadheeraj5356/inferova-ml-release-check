# Inferova ML Release Check

A dependency-free Node.js checker for enterprise ML release plans.

Inferova's AI work spans document intelligence, agriculture computer vision, voice AI, and LLM deployment. This project makes the production handoff explicit before code ships: name the product surface, data contract, measurable evaluation, latency and cost budgets, rollback path, and human reviewer.

## Run

```bash
npm test
npm run check
```

The document-AI example is synthetic and contains no customer or personal data.

## Output

The CLI prints `PASS` or `FAIL` for each release requirement. A failed item identifies the missing release information; it does not invent evaluation results.
