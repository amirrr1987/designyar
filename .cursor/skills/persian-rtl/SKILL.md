---
name: persian-rtl
description: >
  Persian RTL UI conventions for UX Flow — ConfigProvider direction, fa_IR locale,
  Vazirmatn, logical Tailwind, antdv layout. Use when building or fixing Persian
  user-facing UI, RTL bugs, or direction issues.
---

# Persian RTL (UX Flow)

## Must

1. `ConfigProvider` with RTL + `fa_IR` (see app `main` / layout)
2. All user-visible strings in Persian
3. Tailwind logical properties: `ms-*` `me-*` `ps-*` `pe-*` `start-*` `end-*` `text-start` / `text-end`
4. Font: Vazirmatn via `src/assets/css/main.css` `@theme` — do not add Inter/Roboto/Arial stacks for UI
5. Icons from `@ant-design/icons-vue` — not emoji as icons

## Must not

- `ml-*` / `mr-*` / `left-*` / `right-*` for layout spacing/alignment
- SFC `<style>` to “force” RTL
- English-only empty states in product UI

## antdv

```ts
import { ConfigProvider } from 'ant-design-vue'
import faIR from 'ant-design-vue/es/locale/fa_IR'
```

Prefer antdv `Space` / `Row` / `Col` with RTL-aware layout; verify with Browser MCP (`/rtl-qa`).

## Checklist

- [ ] RTL direction on shell
- [ ] Persian copy
- [ ] Logical utilities only
- [ ] No `<style>` hacks
