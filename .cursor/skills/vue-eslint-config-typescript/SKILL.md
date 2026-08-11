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

## Rules

1. Prefer `defineConfigWithVueTs` over hand-rolling parserOptions for `.vue` + TS.
2. Keep `vueTsConfigs.recommended` unless the user asks for stricter/looser.
3. Script languages: default TS-only; use `configureVueProject({ scriptLangs: [...] })` only if needed.
4. Works with [eslint](../eslint/SKILL.md), [eslint-plugin-vue](../eslint-plugin-vue/SKILL.md), [vue-eslint-parser](../vue-eslint-parser/SKILL.md).

## Checklist

- [ ] Config uses `defineConfigWithVueTs`
- [ ] `vueTsConfigs.recommended` applied
- [ ] Files globs cover `vue` + `ts`
