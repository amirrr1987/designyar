# UX Flow — Implementation Plan (Cursor)

> Source: `chat-جلسه اول و توضیحات.txt` (engineered prompt) + project skills/rules.  
> Package: `ui-ux-ai` · Client-only · Persian RTL · Ant Design Vue only · Full-safe TypeScript

---

## 0. How Cursor must execute this plan

### 0.1 Mandatory skills / role (load before coding)

| Priority | Path | Purpose |
|----------|------|---------|
| 1 | `.cursor/skills/ux-flow-compose/SKILL.md` | Compose all skills + full-safe TS |
| 2 | `.cursor/rules/full-safe-type-ts.mdc` | Always-on typing role |
| 3 | `.cursor/skills/ux-flow/SKILL.md` | Product workflow & phases |
| 4 | Domain skills as needed | `ant-design-vue`, `vue`, `pinia`, … |

### 0.2 Hard product rules

1. **No custom CSS** — no `<style>` blocks, no custom classes, no external CSS libs. Only antdv props + `Space` / `Row` / `Col` / `Divider`. Exception: `:style` for dynamic color only.
2. **antdv imports** — `import { Button, Form, … } from 'ant-design-vue'` and PascalCase tags (`<Button>`). **Never** `a-button` / full `app.use(Antd)`.
3. **Full-safe TS** — no `any`, no `as any`, type guards for `unknown`, handle `noUncheckedIndexedAccess`.
4. **Command confirmation** — before any terminal command, show exact command and **wait for user ✅**.
5. **One micro-phase at a time** — announce → implement file(s) → ask “ادامه بدم؟ ✅”.
6. **No backend** — LocalStorage (`useStorage`) + WebLLM only.
7. **Persian UI** + `dir=rtl` / `lang=fa`.

### 0.3 Per-file ritual

```
1. Announce: «حالا [Phase X.Y.Z] — فایل path را می‌سازم»
2. Types first (interfaces / guards)
3. Write complete typed code
4. Confirm: no <style>, named antdv imports, Persian copy
5. Ask: «ادامه به ریزفاز بعدی؟ ✅»
```

### 0.4 Current baseline (do NOT re-scaffold)

- Vite + Vue 3 + TS + Pinia + Router already present.
- Dependencies in `package.json` already installed.
- `src/App.vue` is still scaffold (has `<style scoped>` — remove in Phase 0).
- Skills already created under `.cursor/skills/`.

**Phase 0 = configure existing app**, not `npm create vite`.

### 0.5 Quality gate after each major phase

Ask user before running:

```bash
npm run type-check
npm run lint
npm run format
```

Phase is done only when types are clean and UI is Persian RTL with antdv-only.

---

## Target tree

```
src/
├── types/                    # domain types + type guards (full-safe)
├── constants/
├── utils/
├── composables/
├── stores/
├── router/
├── components/
│   ├── layout/
│   ├── empathize/
│   ├── define/
│   ├── ideate/
│   ├── prototype/
│   ├── test/
│   └── shared/
├── views/
├── App.vue
└── main.ts
```

---

# Phase 0 — Project foundation

**Goal:** App boots with RTL, ConfigProvider, router shells, typed stores, zero custom CSS.  
**Skills:** `ux-flow-compose`, `vue`, `vite`, `ant-design-vue`, `pinia`, `vue-router`, `vueuse-core`, `typescript`

### 0.1 Types foundation

#### 0.1.1 Domain types file
- Create `src/types/project.ts` — `Project`, `DesignStepKey`, guards `isProject`
- Create `src/types/persona.ts` — `Persona`, `isPersona`
- Create `src/types/design-system.ts` — palette/typography/grid shapes
- Create `src/types/index.ts` — re-exports

#### 0.1.2 Design Thinking constants
- Create `src/constants/design-thinking-steps.ts` with `as const satisfies`
- Keys: empathize | define | ideate | prototype | test
- Persian titles, routes, icon name strings, colors
- Export helper `getStepByRoute` / `getStepByKey` (exhaustive)

### 0.2 App bootstrap

#### 0.2.1 `index.html`
- `<html lang="fa" dir="rtl">`

#### 0.2.2 `main.ts`
- `import 'ant-design-vue/dist/reset.css'`
- `createPinia()` + `router` (already)
- Set `document.documentElement.lang/dir` if needed
- **No** `app.use(Antd)`

#### 0.2.3 `App.vue`
- Remove scaffold + **delete `<style>`**
- Wrap with `ConfigProvider` (`fa_IR`, `direction="rtl"`)
- `<RouterView />` only (layout comes in Phase 1)

### 0.3 Router

#### 0.3.1 Route table
- Update `src/router/index.ts`
- Routes: `/`, `/empathize`, `/define`, `/ideate`, `/prototype`, `/test`
- Lazy `() => import('@/views/…')`
- `meta: { title: string, step?: number }` typed via module augmentation if needed

#### 0.3.2 Placeholder views
- Create thin views: `HomeView`, `EmpathizeView`, `DefineView`, `IdeateView`, `PrototypeView`, `TestView`
- Each: `Card` + Persian title only (filled later)

### 0.4 Pinia shells + persistence keys

#### 0.4.1 `stores/project.ts`
- `useStorage<Project>('ux-flow-project', default)`
- Actions: `setName`, `setStep`, sync from route later

#### 0.4.2 `stores/persona.ts`
- `useStorage<Persona[]>('ux-flow-personas', [])`
- CRUD typed actions

#### 0.4.3 `stores/designSystem.ts`
- `useStorage` with typed default design system

#### 0.4.4 `stores/ai.ts`
- Model id preference via `useStorage`; engine stays runtime (Phase 7)

### 0.5 Smoke check
- Manual: app opens, RTL, routes navigate, no console type errors
- Ask to run `type-check` ✅

**Exit criteria:** ConfigProvider RTL, 6 routes, 4 stores typed, no `<style>` in App.

---

# Phase 1 — Layout & navigation

**Goal:** Persistent shell with sider Menu + Steps + Header.  
**Skills:** `ant-design-vue`, `ant-design-icons-vue`, `vue-router`

### 1.1 Layout components

#### 1.1.1 `AppHeader.vue`
- `Layout.Header` + project name from store (`Input` or `Typography` via antdv)
- Optional export shortcut button (wired Phase 8)

#### 1.1.2 `AppSider.vue`
- `Layout.Sider` + `Menu` / `MenuItem`
- Icons from `@ant-design/icons-vue` via explicit map
- `selectedKeys` from `useRoute`
- `router.push` on select

#### 1.1.3 `AppLayout.vue`
- `Layout` + sider + header + `Layout.Content` + `RouterView`
- `Row`/`Col` responsive if needed (antdv props only)

### 1.2 Shared progress

#### 1.2.1 `StepProgress.vue`
- `Steps` / `Steps.Step` bound to `DESIGN_THINKING_STEPS`
- `v-model:activeKey` or current step from route/store

#### 1.2.2 Wire into layout or Home
- Show progress under header or above content

### 1.3 Home dashboard shell

#### 1.3.1 `ProjectDashboard.vue` (minimal)
- Project name form field
- Cards linking to 5 steps (`Card` + `Button`)

#### 1.3.2 `HomeView.vue`
- Compose dashboard + progress

### 1.4 Integrate layout

#### 1.4.1 `App.vue`
- `ConfigProvider` → `AppLayout` → outlet

**Exit criteria:** Navigate all 5 stages from Menu; Steps highlight; Persian labels; typed icon map.

---

# Phase 2 — Empathize (همدلی)

**Goal:** Personas, empathy map, notes, competitors — persisted.  
**Skills:** `ant-design-vue`, `pinia`, `vueuse-core`, `vue`

### 2.1 Data layer

#### 2.1.1 Expand `Persona` type
- Fields: id, name, role, age, goals, pains, bio, avatarColor?, createdAt

#### 2.1.2 `utils/persona-templates.ts`
- Typed template list + `createPersonaFromTemplate(): Persona`

#### 2.1.3 `composables/usePersona.ts`
- Helpers wrapping persona store (optional thin API)

### 2.2 Persona UI

#### 2.2.1 `PersonaBuilder.vue`
- `Form` + `FormItem` + `Input` + `Select` + `InputNumber` + `Textarea`
- Typed `rules: { [K in keyof PersonaForm]?: Rule[] }`
- Submit → store.add
- Template `Select` to preload

#### 2.2.2 `PersonaCard.vue`
- `Card` + `Descriptions` / `Tag` + delete `Popconfirm` + `Button`

#### 2.2.3 List on Empathize view
- `Row`/`Col` grid of cards + builder in `Card` or `Drawer`

### 2.3 Empathy map

#### 2.3.1 Types for quadrants
- Says / Thinks / Does / Feels — `Record` or interface

#### 2.3.2 `EmpathyMap.vue`
- 2×2 `Row`/`Col` + `Card` + `Textarea` each
- Persist on persona or separate `useStorage` key `ux-flow-empathy-maps`

### 2.4 Research notes

#### 2.4.1 `ResearchNotes.vue`
- `Textarea` + auto-save via store/`useStorage('ux-flow-research-notes')`
- `Alert` hint for AI later

### 2.5 Competitors

#### 2.5.1 Types + store slice or storage
- `CompetitorRow { id, name, strength, weakness, url? }`

#### 2.5.2 `CompetitorTable.vue`
- `Table` with `TableColumnsType<CompetitorRow>`
- Add row form + delete

### 2.6 View composition

#### 2.6.1 `EmpathizeView.vue`
- `Tabs` or stacked `Card`s: Personas | Empathy | Notes | Competitors

**Exit criteria:** Full CRUD personas; maps/notes/competitors persist; vue-tsc clean.

---

# Phase 3 — Define (تعریف مسئله)

**Goal:** Problem statement, POV, HMW list.  
**Skills:** `ant-design-vue`, `pinia`, `vueuse-core`

### 3.1 Types & storage

#### 3.1.1 `types/define.ts`
- `ProblemStatement`, `POV`, `HMWItem`

#### 3.1.2 Persist
- Keys: `ux-flow-problem`, `ux-flow-pov`, `ux-flow-hmw` (or one define store)

### 3.2 Problem statement

#### 3.2.1 `ProblemStatement.vue`
- Guided `Form` (template fields: user, need, insight)
- Preview `Alert` / `Card` of assembled Persian sentence

### 3.3 POV

#### 3.3.1 `POVBuilder.vue`
- Form: user + need + insight → POV sentence
- Link optional persona `Select` from persona store

### 3.4 HMW

#### 3.4.1 `HMWQuestions.vue`
- `List` + `Input` + add/remove
- Optional vote `Tag` / count

### 3.5 View

#### 3.5.1 `DefineView.vue`
- Compose three sections with `Divider` / `Space`

**Exit criteria:** Define artifacts saved; linked to personas when selected.

---

# Phase 4 — Ideate (ایده‌پردازی)

**Goal:** Brainstorm, userflow, sitemap, card sorting.  
**Skills:** `ant-design-vue`, `vueuse-core`

### 4.1 Types & storage

#### 4.1.1 Idea / flow / sitemap / sort types
- Discriminated unions where useful (`IdeaCard`, `FlowNode`, `SitemapNode`)

### 4.2 Brainstorm

#### 4.2.1 `BrainstormBoard.vue`
- Grid of `Card` + `Tag` votes
- Add idea `Modal` + `Form`
- Persist `ux-flow-ideas`

### 4.3 Userflow

#### 4.3.1 `UserflowCanvas.vue`
- Prefer `Tree` or ordered `Card` list with `Select` for step type (start/action/decision/end)
- No custom canvas CSS — antdv structure only
- Persist nodes/edges as typed arrays

### 4.4 Sitemap

#### 4.4.1 `SitemapTree.vue`
- `Tree` with editable titles (`Input` in tree title slot if needed)
- Add child / delete with `Popconfirm`

### 4.5 Card sorting

#### 4.5.1 `CardSorting.vue`
- Prefer `Transfer` (typed keys) OR VueUse sortable if already justified
- Categories as `Select` / multiple lists with `List`
- Persist results

### 4.6 View

#### 4.6.1 `IdeateView.vue`
- `Tabs`: Brainstorm | Userflow | Sitemap | Card sort

**Exit criteria:** All four tools usable offline; typed persistence.

---

# Phase 5 — Prototype (پروتوتایپ)

**Goal:** Design system tools — color, type, grid, spacing, component checklist.  
**Skills:** `ant-design-vue`, `ant-design-colors`, `pinia`

### 5.1 Design system store completion

#### 5.1.1 Defaults from `@ant-design/colors`
- Primary ramp via `blue` or `generate(hex)`
- Persist in `designSystem` store

### 5.2 Color palette

#### 5.2.1 `ColorPalette.vue`
- Seed `Input` + generate ramp
- Preview `Tag`s with `:style="{ backgroundColor }"` only
- Save to store

### 5.3 Typography

#### 5.3.1 `TypographyScale.vue`
- `Slider` / `InputNumber` for base size & ratio
- Preview with antdv `Typography` / `Title` / `Paragraph` if available, else `Card` text
- Persist scale steps as numbers[]

### 5.4 Grid

#### 5.4.1 `utils/grid-calculator.ts`
- Pure typed functions (columns, gutter, margins)

#### 5.4.2 `composables/useGrid.ts`
- Wrap calculator

#### 5.4.3 `GridConfigurator.vue`
- `InputNumber` controls + preview via `Row`/`Col` demo

### 5.5 Spacing

#### 5.5.1 `utils/spacing-scale.ts`
- 8pt scale typed const

#### 5.5.2 Display in prototype view
- `Descriptions` or `List` of tokens (no custom CSS boxes beyond antdv)

### 5.6 Wireframe & component checklist

#### 5.6.1 `WireframeBuilder.vue`
- Block list as `Card`s representing sections (header/nav/content/form) — structural only
- Persist selected blocks

#### 5.6.2 `ComponentLibrary.vue`
- Checklist of antdv components used in project (`Checkbox` group + progress)

### 5.7 View

#### 5.7.1 `PrototypeView.vue`
- `Tabs` for Color | Type | Grid | Spacing | Wireframe | Checklist

**Exit criteria:** Design tokens in storage; previews without custom CSS.

---

# Phase 6 — Test (تست)

**Goal:** Contrast, WCAG, heuristics, usability report.  
**Skills:** `ant-design-vue`, utils composables

### 6.1 Contrast engine

#### 6.1.1 `utils/contrast.ts`
- Relative luminance + ratio — pure functions, fully typed
- Return `{ ratio: number; level: 'AAA' | 'AA' | 'fail' }`

#### 6.1.2 `composables/useContrast.ts`
- Reactive wrappers

#### 6.1.3 `ContrastChecker.vue`
- FG/BG inputs + live `:style` preview swatches
- Show `Statistic` / `Tag` for level
- Optional pull colors from designSystem store

### 6.2 WCAG checklist

#### 6.2.1 `constants/wcag-checklist.ts`
- Typed items `{ id, level, text, help? }`

#### 6.2.2 `composables/useWCAG.ts`
- Checked ids in `useStorage`

#### 6.2.3 `WCAGChecklist.vue`
- `Checkbox` group + `Progress`

### 6.3 Heuristics

#### 6.3.1 `constants/heuristic-rules.ts`
- Nielsen 10 — Persian labels

#### 6.3.2 `HeuristicEval.vue`
- Per-rule `Rate` + `Textarea` notes
- Persist evaluations

### 6.4 Usability report

#### 6.4.1 `UsabilityReport.vue`
- Aggregate contrast summary + WCAG progress + heuristic averages
- `Result` / `Descriptions` + copy/export hook (Phase 8)

### 6.5 View

#### 6.5.1 `TestView.vue`
- Compose four tools

**Exit criteria:** Real contrast math; checklists persist; report readable in Persian.

---

# Phase 7 — AI (WebLLM)

**Goal:** In-browser LLM assist panel.  
**Skills:** `web-llm`, `ant-design-vue`, `pinia`

### 7.1 Engine composable

#### 7.1.1 `composables/useWebLLM.ts`
- Typed `MLCEngineInterface | null`
- Models list; default **small** model for first load
- `initModel`, `chat` with `unknown` error handling
- Progress 0–100

#### 7.1.2 Wire `stores/ai.ts`
- selectedModel, lastResponse, isReady flags (engine itself not persisted)

### 7.2 AI Panel UI

#### 7.2.1 `AIPanel.vue`
- Model `Select` + load `Button` + `Progress` / `Spin`
- Prompt `Textarea` + send `Button`
- Response in `Card` / `Alert`
- Error `Alert`
- Mount in layout `Drawer` or shared region

### 7.3 Feature prompts (Persian system prompts)

#### 7.3.1 Persona suggestions — context from persona store
#### 7.3.2 Analyze research notes
#### 7.3.3 Suggest UX improvements (define/ideate context)
#### 7.3.4 Microcopy generator
#### 7.3.5 Summarize findings (test report)

Each as typed action enum + prompt builder function (no `any`).

### 7.4 Integration points

#### 7.4.1 Buttons on Empathize / Define / Test to open panel with preset action

**Exit criteria:** Model loads (or clear Persian error); at least 3 AI actions work offline.

---

# Phase 8 — Persistence hardening & export

**Goal:** Single project JSON import/export; verify all keys.  
**Skills:** `vueuse-core`, `pinia`, `ant-design-vue`

### 8.1 Inventory

#### 8.1.1 Document all `ux-flow-*` keys in `src/constants/storage-keys.ts` as `as const`

### 8.2 Export

#### 8.2.1 `utils/project-export.ts`
- Build `UxFlowExport` interface aggregating all modules
- `isUxFlowExport` type guard
- Download via Blob + temporary `<a>` (no CSS)

#### 8.2.2 Header/Dashboard `Button` «خروجی JSON»

### 8.3 Import

#### 8.3.1 File `Input` / upload via antdv `Upload` or hidden file input
- Parse → guard → hydrate stores
- `message.success` / error

### 8.4 Auto-save audit

#### 8.4.1 Confirm every module uses `useStorage` (no raw localStorage)
#### 8.4.2 Optional `useDebounceFn` only if needed for large writes

### 8.5 Final polish

#### 8.5.1 Empty states (`Empty`) on all lists
#### 8.5.2 Confirm delete (`Popconfirm`) everywhere destructive
#### 8.5.3 Remove any leftover `<style>` project-wide
#### 8.5.4 Home dashboard shows real completion stats

**Exit criteria:** Round-trip import/export; success criteria checklist green.

---

# Phase 9 — Release readiness (optional micro-phase pack)

### 9.1 Static deploy
#### 9.1.1 Verify `vite build` (after ✅)
#### 9.1.2 Notes for Vercel/Netlify/GH Pages SPA fallback

### 9.2 Quality
#### 9.2.1 `type-check` + `lint` + `format` (after ✅)
#### 9.2.2 Manual RTL pass on mobile width (antdv grid)

---

## Success criteria (ship checklist)

- [ ] Runs entirely in the browser (no server)
- [ ] ONLY Ant Design Vue for UI (no custom CSS)
- [ ] Named imports + PascalCase components
- [ ] RTL Persian interface
- [ ] All data in LocalStorage via `useStorage`
- [ ] 5 Design Thinking stages + navigation
- [ ] WebLLM AI panel
- [ ] JSON export/import
- [ ] Responsive `Row`/`Col`
- [ ] Full-safe TS (`vue-tsc --build` clean)
- [ ] Static-deployable `dist/`

---

## Cursor session starter (copy)

```
طبق plan.md از Phase 0.1.1 شروع کن.
Skills: ux-flow-compose + ux-flow + ant-design-vue + full-safe-type-ts rule.
قبل از هر دستور ترمینال فرمان را بگو و منتظر ✅ بمان.
هر ریزریزفاز را جدا بساز و بعدش تایید بخواه.
```

---

## Progress tracker

| Phase | Status | Notes |
|-------|--------|-------|
| 0 Foundation | ☑ | 0.1.0 |
| 1 Layout | ☑ | 0.2.0 |
| 2 Empathize | ☑ | 0.3.0 |
| 3 Define | ☑ | 0.4.0 |
| 4 Ideate | ☑ | 0.5.0 |
| 5 Prototype | ☑ | 0.6.0 |
| 6 Test | ☑ | 0.7.0 |
| 7 WebLLM | ☑ | 0.8.0 |
| 8 Export | ☑ | 0.9.0 |
| 9 Release | ☐ | |
