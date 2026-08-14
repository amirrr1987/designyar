---
name: ux-flow-compose
description: >
  Orchestrates all UX Flow project skills in the correct order with extreme full-safe
  TypeScript — when to load which skill, typed boundaries across Vue/Pinia/antdv/VueUse/
  WebLLM/Vite tooling, mandatory use of each npm package’s official interfaces (e.g.
  ButtonProps), and a no-any checklist. Use when starting features, combining stack skills,
  full safe type, type-safe architecture, package interfaces, or composing ux-flow modules.
---

# UX Flow — compose all skills (full-safe TS)

Master skill for this repo. **Do not invent parallel stacks.** Load sibling skills by phase, keep every boundary typed, and never weaken types to “make it work.”

## Role (always)

You are a **full-safe TypeScript** Vue engineer for UX Flow:

1. No `any`, no `as any`, no bare `as unknown as T` without a validated narrow.
2. Prefer inference + generics + exported library types (`ButtonProps`, `FormInstance`, `MLCEngineInterface`, …).
3. Honor `noUncheckedIndexedAccess` — index access is `T | undefined`; handle it.
4. Product rules from [ux-flow](../ux-flow/SKILL.md): no custom CSS, Persian RTL, cmd confirmation, client-only.
5. Before coding UI, read [ant-design-vue](../ant-design-vue/SKILL.md) (named imports + `<Button>`).

Also obey project rule `.cursor/rules/full-safe-type-ts.mdc`.

## Package interfaces mandate (every npm skill)

Each skill under `.cursor/skills/` that documents an **npm package** must drive code that **fully uses that package’s TypeScript surface** — props, return types, config types, event payloads, generics. Do not invent parallel interfaces.

| Rule | Detail |
|------|--------|
| Prefer package types | `import type { ButtonProps, MenuProps } from 'ant-design-vue'` — not `interface MyBtn { type?: string }` |
| Annotate boundaries | Variables, `defineProps` wrappers, store fields, and config objects that mirror a library API must use the library type |
| Exhaust props typing | When building prop objects / `v-bind` spreads / theme configs, type them as `XxxProps` / `ThemeConfig` / package config |
| Generics | Use package generics (`useStorage<T>`, `TableColumnsType<Row>`, `RouteRecordRaw`, …) |
| Tooling configs | Config files use package helpers + types (`defineConfig` from `vite` / `eslint`, not untyped plain objects when a typed helper exists) |
| Discover types | If unsure of the export name, check the package’s `.d.ts` / docs — still prefer official names over local clones |

Canonical UI example (antdv):

```ts
import type {
  ButtonProps,
  MenuProps,
  FormInstance,
  TableColumnsType,
  ThemeConfig,
} from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'

const buttonProps: ButtonProps = { type: 'primary', htmlType: 'submit' }
const theme: ThemeConfig = { token: { colorPrimary: '#1677ff' } }
const columns: TableColumnsType<Persona> = [{ title: 'نام', dataIndex: 'name', key: 'name' }]
```

Anti-pattern:

```ts
// ❌ reinventing antdv
interface MyButtonProps {
  type?: 'primary' | 'default'
  loading?: boolean
}
```

When editing any npm-package skill, keep a **Package interfaces (mandatory)** section listing the key exported types and showing typed usage.

## Skill load map (principled order)

### A. Product / workflow

| When | Read |
|------|------|
| Any feature, phase, module plan | [ux-flow](../ux-flow/SKILL.md) |
| Combining skills / typed architecture | **this skill** |
| End of each phase (version + CHANGELOG) | [keep-a-changelog](../keep-a-changelog/SKILL.md) |

### B. App runtime (feature code)

| Concern | Skill |
|---------|--------|
| SFC / Composition API | [vue](../vue/SKILL.md) |
| Routes / Menu sync | [vue-router](../vue-router/SKILL.md) |
| Stores | [pinia](../pinia/SKILL.md) |
| LocalStorage / browser utils | [vueuse-core](../vueuse-core/SKILL.md) |
| UI components | [ant-design-vue](../ant-design-vue/SKILL.md) |
| Icons | [ant-design-icons-vue](../ant-design-icons-vue/SKILL.md) |
| Color ramps | [ant-design-colors](../ant-design-colors/SKILL.md) |
| Utility classes | [tailwindcss](../tailwindcss/SKILL.md) |
| AI SDK core | [ai](../ai/SKILL.md) |
| Groq provider | [ai-sdk-groq](../ai-sdk-groq/SKILL.md) |
| AI Vue composables | [ai-sdk-vue](../ai-sdk-vue/SKILL.md) |

### C. Tooling (config / scripts / CI quality)

| Concern | Skill |
|---------|--------|
| Dev server / build | [vite](../vite/SKILL.md) |
| Vue SFC plugin | [vitejs-plugin-vue](../vitejs-plugin-vue/SKILL.md) |
| Tailwind Vite plugin | [tailwindcss-vite](../tailwindcss-vite/SKILL.md) |
| DevTools plugin | [vite-plugin-vue-devtools](../vite-plugin-vue-devtools/SKILL.md) |
| TS compiler | [typescript](../typescript/SKILL.md) |
| SFC typecheck | [vue-tsc](../vue-tsc/SKILL.md) |
| App tsconfig | [vue-tsconfig](../vue-tsconfig/SKILL.md) |
| Node tsconfig | [tsconfig-node24](../tsconfig-node24/SKILL.md) |
| Node types | [types-node](../types-node/SKILL.md) |
| ESLint | [eslint](../eslint/SKILL.md) |
| Vue ESLint | [eslint-plugin-vue](../eslint-plugin-vue/SKILL.md) |
| Vue+TS ESLint | [vue-eslint-config-typescript](../vue-eslint-config-typescript/SKILL.md) |
| Vue parser | [vue-eslint-parser](../vue-eslint-parser/SKILL.md) |
| Prettier skip | [eslint-config-prettier](../eslint-config-prettier/SKILL.md) |
| Oxlint bridge | [eslint-plugin-oxlint](../eslint-plugin-oxlint/SKILL.md) |
| Oxlint | [oxlint](../oxlint/SKILL.md) |
| Format | [oxfmt](../oxfmt/SKILL.md) |
| Script runners | [npm-run-all2](../npm-run-all2/SKILL.md) |
| TS config loader | [jiti](../jiti/SKILL.md) |

Load **only** skills relevant to the current task after the product + typing baseline.

## Feature workflow (compose)

```
1. Announce module (ux-flow phase)
2. If terminal needed → show command → WAIT for ✅
3. Read domain skills (vue + pinia + antdv + …)
4. Define types FIRST (models, props, store state, API shapes)
5. Implement with named antdv imports / PascalCase tags
6. Persist via useStorage inside Pinia (typed generics)
7. Run type-check mindset: code must pass vue-tsc --build
8. End of work → load phase-wrap-up-commit (phase status + commit message text)
9. Phase done → load keep-a-changelog (SemVer + CHANGELOG.md)
10. Ask before next file/phase
```
## Full-safe type contracts

### Forbidden

```ts
// ❌
const x: any = …
const y = data as any
function f(p: any) {}
JSON.parse(text) // without generic + validate
route.params.id // used as string without narrow
personas.value[0].name // without checking [0] under noUncheckedIndexedAccess
```

### Required patterns

```ts
// ✅ Props / emits
interface PersonaCardProps {
  persona: Persona
}
const props = defineProps<PersonaCardProps>()
const emit = defineEmits<{ remove: [id: string] }>()

// ✅ Refs
const loading = ref(false)
const persona = ref<Persona | null>(null)

// ✅ Pinia + VueUse
const personas = useStorage<Persona[]>('ux-flow-personas', [])

// ✅ antdv types
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import type { TableColumnsType } from 'ant-design-vue'
const formRef = ref<FormInstance>()
const columns: TableColumnsType<Persona> = [/* … */]

// ✅ Router
const id = computed(() => {
  const raw = route.params.id
  return typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : undefined
})

// ✅ JSON
function parseProject(text: string): Project | null {
  try {
    const data: unknown = JSON.parse(text)
    return isProject(data) ? data : null
  } catch {
    return null
  }
}

// ✅ Errors
catch (e: unknown) {
  error.value = e instanceof Error ? e.message : String(e)
}

// ✅ Indexed access
const first = personas.value[0]
if (!first) return
```

### Domain type ownership

| Layer | Owns |
|-------|------|
| `src/types/` or next to feature | Domain interfaces (`Persona`, `Project`, …) |
| Pinia store | State + actions typed against domain |
| View / component | `defineProps` / `defineEmits` only |
| composables | Generic inputs/outputs; no untyped returns |
| utils | Pure functions with explicit signatures + type guards |

More examples: [type-safe-patterns.md](type-safe-patterns.md). Full npm-interface policy: [package-interfaces.md](package-interfaces.md).

## Quality gate (mental CI)

Before calling a step done:

- [ ] Relevant skills from the map were applied
- [ ] No `any` / unsafe assertions
- [ ] `noUncheckedIndexedAccess` handled
- [ ] Package interfaces used (see [package-interfaces.md](package-interfaces.md)) — no hand-rolled twins of antdv/Vue/Pinia/…
- [ ] antdv named imports + PascalCase
- [ ] No `<style>` — Tailwind utilities only via [tailwindcss](../tailwindcss/SKILL.md)
- [ ] Persistence typed via `useStorage<T>`
- [ ] Would pass `vue-tsc --build`, `lint`, `oxfmt` (ask before running)
- [ ] Phase end: [keep-a-changelog](../keep-a-changelog/SKILL.md) applied if closing a phase

## Anti-patterns

- Loading every skill into context when only fixing a button
- Global `app.use(Antd)` + `a-*` tags (forbidden here)
- Hand-rolled props/config that duplicate npm package types
- Hand-rolled `localStorage` instead of VueUse
- `groq-sdk` / WebLLM / Next.js `app/api/chat` instead of `ai` + `@ai-sdk/groq`
- Disabling strictness in tsconfig to silence errors
