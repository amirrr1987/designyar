---
name: vite
description: >
  Guides Vite 8 for UX Flow — dev/build/preview scripts, defineConfig, @ alias, Vue plugins.
  Use when editing vite.config.ts, running the dev server, building, or vite package.
---

# vite (UX Flow)

Package: `vite` ^8.1. Bundler and dev server for the Vue SPA.

## Scripts

```json
"dev": "vite",
"build-only": "vite build",
"preview": "vite preview",
"build": "run-p type-check \"build-only {@}\" --"
```

Confirm commands with the user before running (UX Flow).

## Project wiring

[`vite.config.ts`](../../../vite.config.ts):

```ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
```

## Package interfaces (mandatory)

Use Vite’s typed config API — do not leave `vite.config.ts` as an untyped object literal when `defineConfig` / `UserConfig` exist. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

| Need | Package type / API |
|------|---------------------|
| Config | `defineConfig`, `UserConfig`, `UserConfigFn` |
| Env | `ImportMetaEnv` / `ImportMeta` (app), Vite client types |
| Plugins | plugin return types from `@vitejs/plugin-vue` etc. |

```ts
import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const config: UserConfig = {
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
}

export default defineConfig(config)
```

## Rules

1. Keep `@` → `./src` alias in sync with `tsconfig.app.json` paths.
2. Always include [vitejs-plugin-vue](../vitejs-plugin-vue/SKILL.md).
3. Static deploy: default SPA build output `dist/` — no SSR required for MVP.
4. Client-only app — do not add a Vite SSR setup unless asked.
5. Related: [vite-plugin-vue-devtools](../vite-plugin-vue-devtools/SKILL.md).
6. Prefer `defineConfig` so options are checked against Vite’s `UserConfig`.

## Checklist

- [ ] `dev` / `build-only` / `preview` intact
- [ ] `@` alias works in imports
- [ ] Vue plugin registered
- [ ] Config typed via `defineConfig` / `UserConfig`
