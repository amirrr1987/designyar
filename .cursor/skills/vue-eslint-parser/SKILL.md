---
name: vue-eslint-parser
description: >
  Guides vue-eslint-parser for parsing Vue SFCs in ESLint for UX Flow. Use when debugging
  ESLint parse errors in .vue files, template parser options, or vue-eslint-parser.
---

# vue-eslint-parser (UX Flow)

Package: `vue-eslint-parser` ^10.4. Parses `.vue` SFCs so ESLint can lint template + script.

## Project wiring

Pulled in transitively via `@vue/eslint-config-typescript` / `eslint-plugin-vue`. Keep it listed in `devDependencies` so versions stay compatible with ESLint 10 + `eslint-plugin-vue` ~10.

Do **not** hand-set `parser: 'vue-eslint-parser'` unless leaving `defineConfigWithVueTs` — the Vue TS helper configures this.

## Package interfaces (mandatory)

Parser package is consumed via `@vue/eslint-config-typescript` — prefer that helper’s wiring over a local `parserOptions` twin. If you must set parser explicitly, use the package string/import the package documents. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

## Rules

1. Align major with `eslint-plugin-vue` (both ~10.x here).
2. Script language is TypeScript; keep parserOptions compatible (handled by Vue ESLint TS config).
3. Parse failures in `.vue` → check SFC structure / lang attributes before changing parser package.
4. Related: [eslint-plugin-vue](../eslint-plugin-vue/SKILL.md), [vue-eslint-config-typescript](../vue-eslint-config-typescript/SKILL.md).

## Checklist

- [ ] Version compatible with eslint-plugin-vue
- [ ] `.vue` files lint without parser crashes
- [ ] Prefer Vue TS helper over manual parser wiring
