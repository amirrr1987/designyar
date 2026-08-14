---
name: vite-plugin-vue-devtools
description: >
  Guides vite-plugin-vue-devtools for UX Flow local development. Use when enabling/disabling
  Vue DevTools in Vite, debugging SFCs, or vite-plugin-vue-devtools.
---

# vite-plugin-vue-devtools (UX Flow)

Package: `vite-plugin-vue-devtools` ^8.1. Dev-only Vue DevTools integration for Vite.

## Project wiring

[`vite.config.ts`](../../../vite.config.ts):

```ts
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
})
```

## Package interfaces (mandatory)

Use the plugin’s typed factory — register via official default export; do not invent a local plugin options interface unless the package exports one. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

```ts
import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
} satisfies UserConfig)
```

## Rules

1. Keep for **local `vite` dev** — it should not affect production bundle meaningfully; do not rely on it in prod code.
2. Register **after** `vue()` (and after `tailwindcss()` when present — see [tailwindcss-vite](../tailwindcss-vite/SKILL.md)).
3. If DevTools cause issues, remove/comment `vueDevTools()` only after user confirmation.
4. Not a substitute for Pinia/Vue Router debugging knowledge — complements them.

## Checklist

- [ ] Plugin imported and registered in dev config
- [ ] Placed after `@vitejs/plugin-vue`
- [ ] Vite config still typed (`defineConfig` / `UserConfig`)
- [ ] No app runtime imports of the plugin from `src/`
