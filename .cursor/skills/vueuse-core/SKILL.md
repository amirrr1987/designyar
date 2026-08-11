---
name: vueuse-core
description: >
  Guides @vueuse/core in this UX Flow project — useStorage for LocalStorage persistence,
  and other composables (useDebounceFn, useDropZone, etc.) without custom utilities.
  Use when working with VueUse, useStorage, LocalStorage, auto-save, drag-and-drop,
  or @vueuse/core.
---

# @vueuse/core (UX Flow)

Package: `@vueuse/core` ^14. **All persistence** goes through VueUse — especially `useStorage`. See [ux-flow](../ux-flow/SKILL.md) and [pinia](../pinia/SKILL.md).

## Persistence (required pattern)

```ts
import { useStorage } from '@vueuse/core'

const personas = useStorage('ux-flow-personas', [] as Persona[])
const project = useStorage('ux-flow-project', {
  name: '',
  currentStep: 1,
  createdAt: new Date().toISOString(),
})
const designSystem = useStorage('ux-flow-design-system', defaultDesignSystem)
```

### Keys convention

Prefix all keys with `ux-flow-`:

| Key | Data |
|-----|------|
| `ux-flow-project` | Project meta / current step |
| `ux-flow-personas` | Empathize personas |
| `ux-flow-design-system` | Prototype tokens |
| `ux-flow-ai-prefs` | Model id / AI prefs (optional) |

Prefer wrapping `useStorage` refs inside Pinia stores so views share one source of truth.

## Other composables to prefer

| Need | Use |
|------|-----|
| Debounced save / input | `useDebounceFn`, `watchDebounced` |
| Clipboard export JSON | `useClipboard` |
| Dark/LTR only if ever needed | Prefer antdv `ConfigProvider`; avoid inventing theme CSS |
| Card sorting / DnD | `useSortable` / pointer helpers if present; else antdv `Transfer` |
| Online / mounted guards | `useOnline`, `useMounted` |

```ts
import { useStorage, useDebounceFn, useClipboard } from '@vueuse/core'
```

## Export / import helpers

```ts
import { useClipboard } from '@vueuse/core'

const { copy, isSupported } = useClipboard()

async function exportProjectJson(data: unknown) {
  const text = JSON.stringify(data, null, 2)
  // download via Blob + anchor, or copy()
  await copy(text)
}
```

File download can use a temporary `<a download>` without custom CSS.

## Rules

1. Do not write a hand-rolled `localStorage` wrapper — use `useStorage`.
2. Type generic defaults: `useStorage<T>(key, defaultValue)`.
3. Auto-save is free with `useStorage` (reactive write-through).
4. Keep SSR assumptions off — this app is client-only Vite SPA.

## Checklist

- [ ] Persistence via `useStorage`
- [ ] Keys prefixed `ux-flow-`
- [ ] Prefer VueUse over custom composables for common browser APIs
- [ ] Works with Pinia stores
