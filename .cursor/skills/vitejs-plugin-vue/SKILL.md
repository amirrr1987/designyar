---
name: vitejs-plugin-vue
description: >
  Guides @vitejs/plugin-vue for Vue SFC support in Vite 8 for UX Flow. Use when editing
  vite.config.ts plugins, .vue compilation, script setup, or @vitejs/plugin-vue.
---

# @vitejs/plugin-vue (UX Flow)

Package: `@vitejs/plugin-vue` ^6. Enables `.vue` SFC compilation in Vite.

## Project wiring

[`vite.config.ts`](../../../vite.config.ts):

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
})
```

Keep `vue()` before optional tooling plugins like Vue DevTools.

## Rules

1. Always include `vue()` for this Vue SPA — without it SFCs will not build.
2. Default options are enough for `<script setup lang="ts">`; only add `script.defineModel` / reactivityTransform if explicitly needed.
3. Pair with [vite](../vite/SKILL.md) and [vue](../vue/SKILL.md).
4. Do not replace with legacy `vue-loader` / webpack.

## Checklist

- [ ] `vue()` registered in `vite.config.ts`
- [ ] Works with `@` alias and TypeScript SFCs
- [ ] No conflicting Vue compilers
