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

## Package interfaces (mandatory)

Use the plugin’s options type when customizing — do not pass untyped option bags. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

```ts
import vue, { type Options as VuePluginOptions } from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const vueOptions: VuePluginOptions = {
  script: { defineModel: true },
}

export default defineConfig({
  plugins: [vue(vueOptions)],
})
```

If the installed version exports options under a different name, use that official export — never a local clone.

## Rules

1. Always include `vue()` for this Vue SPA — without it SFCs will not build.
2. Default options are enough for `<script setup lang="ts">`; only add `script.defineModel` / reactivityTransform if explicitly needed — and type them.
3. Pair with [vite](../vite/SKILL.md) and [vue](../vue/SKILL.md).
4. Do not replace with legacy `vue-loader` / webpack.

## Checklist

- [ ] `vue()` registered in `vite.config.ts`
- [ ] Options typed with the plugin’s exported options type when non-default
- [ ] Works with `@` alias and TypeScript SFCs
- [ ] No conflicting Vue compilers
