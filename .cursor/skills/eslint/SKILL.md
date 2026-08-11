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

## Package interfaces (mandatory)

Use ESLint flat-config types from the package — prefer `defineConfig` / `Linter.Config` over untyped config arrays. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

| Need | Package type / API |
|------|---------------------|
| Flat config | `Linter.Config`, `defineConfig` from `eslint/config` when available |
| Ignores | `globalIgnores` from `eslint/config` |
| Compose with Vue TS | `defineConfigWithVueTs` from `@vue/eslint-config-typescript` |

```ts
import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import type { Linter } from 'eslint'

const extra: Linter.Config = {
  name: 'app/files-to-lint',
  files: ['**/*.{vue,ts,mts,tsx}'],
}
```

## Rules

1. Fix with `npm run lint:eslint` (or project package manager equivalent) after user confirms.
2. Do not introduce legacy `.eslintrc.*` — stay on flat config.
3. Ignore `dist`, `dist-ssr`, `coverage`.
4. Formatting belongs to [oxfmt](../oxfmt/SKILL.md), not ESLint style rules.
5. Type config pieces with `Linter.Config` / official helpers.

## Checklist

- [ ] Flat `eslint.config.ts`
- [ ] Cache enabled in script
- [ ] Ignores build outputs
- [ ] Config uses ESLint / Vue-TS package types & helpers
