---
name: tailwindcss-vite
description: >
  Guides @tailwindcss/vite v4 for UX Flow Vite 8 — register the plugin, PluginOptions,
  no PostCSS. Use when editing vite.config.ts plugins, @tailwindcss/vite, Tailwind Vite
  integration, or Lightning CSS optimize.
---

# @tailwindcss/vite (UX Flow)

Package: `@tailwindcss/vite` ^4.3. Official Vite plugin for Tailwind CSS v4. CSS rules: [tailwindcss](../tailwindcss/SKILL.md). Bundler: [vite](../vite/SKILL.md).

## Project wiring

[`vite.config.ts`](../../../vite.config.ts):

```ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), tailwindcss(), vueDevTools()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
```

Order: `vue()` → `tailwindcss()` → `vueDevTools()`. Do not add `postcss.config.*` or `autoprefixer` for Tailwind.

## Package interfaces (mandatory)

Use the plugin’s exported options type — do not invent a local options interface. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

| Need | Package type / API |
|------|---------------------|
| Factory | default export `tailwindcss` |
| Options | `PluginOptions` from `@tailwindcss/vite` |
| Vite config | `defineConfig` / `UserConfig` from `vite` |

```ts
import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import type { PluginOptions } from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'

const tailwindOptions: PluginOptions = {
  optimize: true,
}

const config: UserConfig = {
  plugins: [vue(), tailwindcss(tailwindOptions), vueDevTools()],
}

export default defineConfig(config)
```

Default `tailwindcss()` (no options) is enough. Set `PluginOptions` only when changing Lightning CSS:

- `optimize: false` — never minify/optimize
- `optimize: { minify: false }` — Lightning CSS on, minify off
- omit / `optimize: true` — production follows `NODE_ENV`

If the installed version exports options under a different name, use that official export.

## Rules

1. Always register this plugin when `tailwindcss` is a dependency — CSS `@import` alone will not scan Vue SFCs correctly.
2. Never import `@tailwindcss/vite` from `src/` (config-only).
3. Do not duplicate Tailwind via Vite `css.postcss.plugins`.
4. Entry CSS still required — see [tailwindcss](../tailwindcss/SKILL.md).
5. Confirm `pnpm add` / Vite restarts with the user before running.

## Checklist

- [ ] `tailwindcss()` in `vite.config.ts` after `vue()`
- [ ] Options typed as `PluginOptions` when non-default
- [ ] Config still `defineConfig` / `UserConfig`
- [ ] No PostCSS Tailwind pipeline
- [ ] No app runtime import of the plugin
- [ ] Uses package interfaces (no hand-rolled twins)
