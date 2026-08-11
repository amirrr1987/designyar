---
name: vue-eslint-config-typescript
description: >
  Guides @vue/eslint-config-typescript flat config helpers for UX Flow — defineConfigWithVueTs
  and vueTsConfigs in eslint.config.ts. Use when editing ESLint TypeScript+Vue setup or
  @vue/eslint-config-typescript.
---

# @vue/eslint-config-typescript (UX Flow)

Package: `@vue/eslint-config-typescript` ^14. Vue + TS ESLint flat-config helpers.

## Project wiring

[`eslint.config.ts`](../../../eslint.config.ts):

```ts
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'

export default defineConfigWithVueTs(
  { name: 'app/files-to-lint', files: ['**/*.{vue,ts,mts,tsx}'] },
  vueTsConfigs.recommended,
  // …other configs
)
```

## Package interfaces (mandatory)

Use the package helpers as the typed surface — `defineConfigWithVueTs` and `vueTsConfigs` — do not hand-roll equivalent parser options. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

```ts
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
```

Prefer calling `defineConfigWithVueTs(...)` so the returned flat configs stay aligned with the package’s expected `Linter.Config` shapes.

## Rules

1. Prefer `defineConfigWithVueTs` over hand-rolling parserOptions for `.vue` + TS.
2. Keep `vueTsConfigs.recommended` unless the user asks for stricter/looser.
3. Script languages: default TS-only; use `configureVueProject({ scriptLangs: [...] })` only if needed.
4. Works with [eslint](../eslint/SKILL.md), [eslint-plugin-vue](../eslint-plugin-vue/SKILL.md), [vue-eslint-parser](../vue-eslint-parser/SKILL.md).

## Checklist

- [ ] Config uses `defineConfigWithVueTs`
- [ ] `vueTsConfigs.recommended` applied
- [ ] Files globs cover `vue` + `ts`
- [ ] No hand-rolled twin of this package’s Vue+TS ESLint setup
