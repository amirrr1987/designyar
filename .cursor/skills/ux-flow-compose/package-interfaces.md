# Package interfaces mandate

Companion to [SKILL.md](SKILL.md). Applies to **every** UX Flow skill that documents an npm package, and to **design skills** when they emit code into this app.

## Principle

Use the package’s **official TypeScript exports** completely at every boundary. Domain types (`Persona`, `Project`) stay in the app; library props/config/events come from the package.

## What “complete” means

1. **Props / options objects** — typed as `XxxProps`, `XxxOptions`, or the package’s config type.
2. **Refs holding library instances** — `ref<FormInstance>()`, `ref<Groq | null>()` only in legacy `src/ai/`, not `ref<any>()`.
3. **Generics** — `useStorage<T>`, `TableColumnsType<Row>`, `RouteLocationNormalized`, etc.
4. **Events / callbacks** — use package handler argument types when exporting or wrapping them.
5. **Config entrypoints** — `defineConfig(...)` from Vite/ESLint/etc.; annotate with `UserConfig` / package types when not inferred.
6. **No twin interfaces** — do not copy a subset of package props into a local `interface` unless extending via `extends` / intersection for *domain* extras only.

## Extending (allowed)

```ts
import type { ButtonProps } from 'ant-design-vue'

/** Domain wrapper — still based on the package */
export interface SaveButtonProps extends /* or Pick<> */ ButtonProps {
  personaId: string
}
```

## Design skills → this repo (mandatory remap)

Skills like `ui-styling`, `design-system`, `ui-ux-pro-max`, `brand`, `design`, `slides`, `banner-design` may mention shadcn/ui, Tailwind, CSS variables, or Chart.js.

| Upstream suggestion | UX Flow implementation |
|---------------------|------------------------|
| shadcn `Button` / Tailwind classes | `ant-design-vue` `<Button>` + `ButtonProps` |
| CSS variables / Tailwind theme | `ThemeConfig` + `@ant-design/colors` ramps |
| Radix / shadcn Dialog | antdv `Modal` / `Drawer` + `ModalProps` |
| Custom `<style>` in SFC / shadcn / Radix | **Forbidden** in `src/` — antdv props + [tailwindcss](../tailwindcss/SKILL.md) utilities only |
| Standalone HTML slides/banners | OK as **artifacts outside app runtime**; do not import into Vue SFCs as CSS systems |

When a design skill produces **in-app UI**, also open [ant-design-vue](../ant-design-vue/SKILL.md) and type every boundary with package interfaces.

## Skill author checklist

Every npm-package `SKILL.md` must include:

- [ ] Section **Package interfaces (mandatory)**
- [ ] Table or list of primary exported types
- [ ] At least one typed code sample using those exports
- [ ] Checklist item: “uses package interfaces (no hand-rolled twins)”

Every design skill used in this repo must include:

- [ ] Section **UX Flow override** (or equivalent) remapping to antdv / package interfaces
- [ ] Explicit ban on shadcn / Tailwind / custom CSS inside `src/`
