---
name: tailwindcss
description: >
  Guides Tailwind CSS v4 utility classes for UX Flow Vue — CSS-first @theme, no
  tailwind.config.js, RTL logical properties, coexistence with ant-design-vue (skip
  Preflight). Use when writing class utilities, @import "tailwindcss", @theme tokens,
  or the tailwindcss package.
---

# tailwindcss (UX Flow)

Package: `tailwindcss` ^4.3. Engine is CSS-first. Pair with [@tailwindcss/vite](../tailwindcss-vite/SKILL.md). Components stay [ant-design-vue](../ant-design-vue/SKILL.md).

## Project wiring

Entry CSS (create if missing): [`src/assets/css/main.css`](../../../src/assets/css/main.css)

**Skip Preflight** so antdv `reset.css` is not overwritten:

```css
@layer theme, base, components, utilities;

@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);
```

Do **not** use `@import "tailwindcss";` here — that pulls Preflight and fights antdv.

[`src/main.ts`](../../../src/main.ts) — Tailwind **after** antdv reset:

```ts
import 'ant-design-vue/dist/reset.css'
import '@/assets/css/main.css'
```

No `tailwind.config.js` / PostCSS file. Confirm install commands with the user before running.

## Package interfaces (mandatory)

v4 is CSS-first. Use official JS exports only when writing a plugin — never a local clone of v3 `TailwindConfig`. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

| Need | Official export |
|------|-----------------|
| JS plugin | default + `PluginWithConfig` from `tailwindcss/plugin` |
| Theme / sources | CSS `@theme`, `@source` — not a typed JS config object |

```ts
import plugin from 'tailwindcss/plugin'
import type { PluginWithConfig } from 'tailwindcss/plugin'

const examplePlugin: PluginWithConfig = plugin(({ addVariant }) => {
  addVariant('hocus', ['&:hover', '&:focus'])
})
```

Prefer `@theme` / `@utility` in CSS over JS plugins unless the user asks.

## Rules

1. **No SFC `<style>`** — utilities on `class` only.
2. **antdv first** for Button, Form, Layout, Table, … — Tailwind is layout/spacing/type extras, not a second component kit.
3. Do not target `.ant-*` with utilities to restyle internals.
4. RTL: `ms-*` `me-*` `ps-*` `pe-*` `start-*` `end-*` `text-start` / `text-end`. Never `ml-*`/`mr-*`/`left-*`/`right-*` for layout.
5. Prefer antdv `Space` / `Row`/`Col` when they already solve the layout; utilities when they do not.
6. Tokens in `@theme` (map Ant palettes from [@ant-design/colors](../ant-design-colors/SKILL.md) when needed):

```css
@theme {
  --color-primary: #1677ff;
  --font-sans: "Vazirmatn", system-ui, sans-serif;
}
```

7. Dynamic runtime colors still use Vue `CSSProperties` + `:style` (contrast/palette) — not concatenating arbitrary class strings from untrusted input.

## Vue usage

```vue
<script setup lang="ts">
import { Button, Space } from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'

const primaryBtn: ButtonProps = { type: 'primary' }
</script>

<template>
  <Space class="w-full flex-wrap" :size="16">
    <Button v-bind="primaryBtn">ذخیره</Button>
  </Space>
</template>
```

## Old patterns (do not use)

- v3 `@tailwind base/components/utilities`
- `tailwind.config.js` + `content: []`
- `postcss.config` + `autoprefixer` for Tailwind (Vite plugin owns the pipeline)
- `cn()` / shadcn unless the user explicitly adds that stack

## Checklist

- [ ] Entry CSS imports theme + utilities only (no Preflight)
- [ ] Imported from `main.ts` after antdv reset
- [ ] RTL logical properties
- [ ] No `<style>` blocks / no `.ant-*` overrides
- [ ] Plugin JS uses `PluginWithConfig` (no hand-rolled twins)
- [ ] Uses package interfaces (no v3 `Config` clone)
