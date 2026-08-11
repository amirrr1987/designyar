# Package interfaces mandate

Companion to [SKILL.md](SKILL.md). Applies to **every** UX Flow skill that documents an npm package.

## Principle

Use the package’s **official TypeScript exports** completely at every boundary. Domain types (`Persona`, `Project`) stay in the app; library props/config/events come from the package.

## What “complete” means

1. **Props / options objects** — typed as `XxxProps`, `XxxOptions`, or the package’s config type.
2. **Refs holding library instances** — `ref<FormInstance>()`, `ref<MLCEngineInterface | null>()`, not `ref<any>()`.
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

## Skill author checklist

Every npm-package `SKILL.md` must include:

- [ ] Section **Package interfaces (mandatory)**
- [ ] Table or list of primary exported types
- [ ] At least one typed code sample using those exports
- [ ] Checklist item: “uses package interfaces (no hand-rolled twins)”
