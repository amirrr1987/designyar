---
name: npm-run-all2
description: >
  Guides npm-run-all2 (run-p / run-s) for UX Flow package scripts — parallel build+type-check
  and sequential lint. Use when editing npm scripts, run-p, run-s, or npm-run-all2.
---

# npm-run-all2 (UX Flow)

Package: `npm-run-all2` ^9. Provides `run-p` (parallel) and `run-s` (sequential).

## Project scripts

From [`package.json`](../../../package.json):

```json
"build": "run-p type-check \"build-only {@}\" --",
"lint": "run-s \"lint:*\""
```

- **build**: runs `type-check` (`vue-tsc --build`) and `build-only` (`vite build`) **in parallel**.
- **lint**: runs `lint:oxlint` then `lint:eslint` **in sequence**.

## Rules

1. Use `run-p` when tasks are independent (type-check ∥ vite build).
2. Use `run-s` when order matters (oxlint before eslint is fine either way; sequential keeps output readable).
3. Preserve `"build-only {@}"` argument forwarding pattern when editing build script.
4. Before running scripts, follow UX Flow command confirmation.

## Checklist

- [ ] `build` still type-checks and bundles
- [ ] `lint` still expands `lint:*`
- [ ] No replaced with brittle `&&` chains unless user asks
