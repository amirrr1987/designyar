---
name: eslint-plugin-oxlint
description: >
  Guides eslint-plugin-oxlint for UX Flow — disables ESLint rules already covered by oxlint
  via .oxlintrc.json. Use when syncing ESLint with oxlint or eslint-plugin-oxlint.
---

# eslint-plugin-oxlint (UX Flow)

Package: `eslint-plugin-oxlint` ~1.73. Prevents double-linting the same checks in ESLint and oxlint.

## Project wiring

[`eslint.config.ts`](../../../eslint.config.ts):

```ts
import pluginOxlint from 'eslint-plugin-oxlint'

export default defineConfigWithVueTs(
  // …
  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
)
```

Requires a root `.oxlintrc.json` that matches [oxlint](../oxlint/SKILL.md).

## Package interfaces (mandatory)

Use `buildFromOxlintConfigFile` from the package — do not manually mirror oxlint disables in ESLint. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

```ts
import pluginOxlint from 'eslint-plugin-oxlint'

...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json')
```

## Rules

1. Keep ESLint ↔ oxlint in sync through this plugin — do not manually duplicate rule disables.
2. Run both via `npm run lint` (`lint:oxlint` then `lint:eslint`).
3. When changing `.oxlintrc.json`, leave the `buildFromOxlintConfigFile` call in place.
4. oxlint is the fast first pass; ESLint covers Vue/TS-specific rules oxlint does not.

## Checklist

- [ ] Plugin loads from `.oxlintrc.json` via official API
- [ ] No redundant overlapping rule noise
- [ ] Both linters still run in `lint` script
