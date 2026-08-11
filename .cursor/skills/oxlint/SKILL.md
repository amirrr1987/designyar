---
name: oxlint
description: >
  Guides oxlint fast linting for UX Flow — lint:oxlint script, .oxlintrc.json, and pairing
  with ESLint via eslint-plugin-oxlint. Use when running oxlint, fixing oxlint findings, or
  editing oxlint config.
---

# oxlint (UX Flow)

Package: `oxlint` ~1.74. Fast first-pass linter.

## Script

```json
"lint:oxlint": "oxlint . --fix"
```

Part of `npm run lint` via [npm-run-all2](../npm-run-all2/SKILL.md). Confirm with user before running.

## Config

Root `.oxlintrc.json` is the source of truth. [eslint-plugin-oxlint](../eslint-plugin-oxlint/SKILL.md) reads it to disable overlapping ESLint rules.

## Rules

1. Prefer fixing oxlint issues when reported — keep `--fix` in the script unless user disables auto-fix.
2. Keep `.oxlintrc.json` and ESLint plugin in sync.
3. Vue/template-heavy rules may still need ESLint — do not remove `lint:eslint`.
4. Scope is project root (`.`); respect ignore patterns in config.

## Checklist

- [ ] `lint:oxlint` works
- [ ] `.oxlintrc.json` present and referenced by ESLint plugin
- [ ] Combined `lint` script still runs both tools
