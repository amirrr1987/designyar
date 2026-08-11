---
name: eslint
description: >
  Guides ESLint 10 flat config and npm run lint:eslint for UX Flow. Use when running or
  fixing ESLint, editing eslint.config.ts, or eslint package usage.
---

# eslint (UX Flow)

Package: `eslint` ^10. Flat config only (`eslint.config.ts`).

## Scripts

```json
"lint:eslint": "eslint . --fix --cache",
"lint": "run-s \"lint:*\""
```

Before running, follow UX Flow **command confirmation** — show the command and wait for `✅`.

## Project wiring

[`eslint.config.ts`](../../../eslint.config.ts) composes:

- `eslint/config` → `globalIgnores`
- `@vue/eslint-config-typescript`
- `eslint-plugin-vue` essential
- `eslint-plugin-oxlint` (disable overlapping rules)
- `eslint-config-prettier/flat` (skip formatting rules)

## Rules

1. Fix with `npm run lint:eslint` (or project package manager equivalent) after user confirms.
2. Do not introduce legacy `.eslintrc.*` — stay on flat config.
3. Ignore `dist`, `dist-ssr`, `coverage`.
4. Formatting belongs to [oxfmt](../oxfmt/SKILL.md), not ESLint style rules.

## Checklist

- [ ] Flat `eslint.config.ts`
- [ ] Cache enabled in script
- [ ] Ignores build outputs
