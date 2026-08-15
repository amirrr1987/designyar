---
name: ux-flow
description: >
  Builds the UX Flow Design Thinking helper (ui-ux-ai) client-side app — Vue 3, Pinia,
  Vue Router, VueUse, WebLLM, Persian RTL UI. Use when working on UX Flow, Design Thinking
  phases (Empathize, Define, Ideate, Prototype, Test), WebLLM, LocalStorage persistence,
  project setup phases, or when the user mentions UX Flow / دیزاین یار.
---

# UX Flow — project workflow

Client-only Vue app for Design Thinking. Package name: `ui-ux-ai`.

Stack skills (read as needed): [vue](../vue/SKILL.md) · [ant-design-vue](../ant-design-vue/SKILL.md) · [ant-design-icons-vue](../ant-design-icons-vue/SKILL.md) · [ant-design-colors](../ant-design-colors/SKILL.md) · [tailwindcss](../tailwindcss/SKILL.md) · [vueuse-core](../vueuse-core/SKILL.md) · [pinia](../pinia/SKILL.md) · [vue-router](../vue-router/SKILL.md) · [ai](../ai/SKILL.md) · [ai-sdk-groq](../ai-sdk-groq/SKILL.md) · [ai-sdk-vue](../ai-sdk-vue/SKILL.md).

**Compose / full-safe TS:** start with [ux-flow-compose](../ux-flow-compose/SKILL.md) (skill load map + typing contracts). Project role rule: `.cursor/rules/full-safe-type-ts.mdc`.

Tooling skills: [vite](../vite/SKILL.md) · [vitejs-plugin-vue](../vitejs-plugin-vue/SKILL.md) · [tailwindcss-vite](../tailwindcss-vite/SKILL.md) · [vite-plugin-vue-devtools](../vite-plugin-vue-devtools/SKILL.md) · [typescript](../typescript/SKILL.md) · [vue-tsc](../vue-tsc/SKILL.md) · [vue-tsconfig](../vue-tsconfig/SKILL.md) · [tsconfig-node24](../tsconfig-node24/SKILL.md) · [types-node](../types-node/SKILL.md) · [eslint](../eslint/SKILL.md) · [eslint-plugin-vue](../eslint-plugin-vue/SKILL.md) · [vue-eslint-config-typescript](../vue-eslint-config-typescript/SKILL.md) · [vue-eslint-parser](../vue-eslint-parser/SKILL.md) · [eslint-config-prettier](../eslint-config-prettier/SKILL.md) · [eslint-plugin-oxlint](../eslint-plugin-oxlint/SKILL.md) · [oxlint](../oxlint/SKILL.md) · [oxfmt](../oxfmt/SKILL.md) · [npm-run-all2](../npm-run-all2/SKILL.md) · [jiti](../jiti/SKILL.md).

**Phase end:** always run [keep-a-changelog](../keep-a-changelog/SKILL.md) — SemVer `package.json` + Keep a Changelog `CHANGELOG.md`.

## Critical behavior

1. **No SFC `<style>`** — antdv components + Tailwind utilities ([tailwindcss](../tailwindcss/SKILL.md); skip Preflight).
2. **Command confirmation** — before any terminal command (`npm`, `pnpm`, git network, etc.), show the exact command and **wait** for user `✅` / confirmation. Do not run it first.
3. **Step-by-step** — finish one module/phase before the next; announce what you build; ask before continuing.
4. **No backend** — browser only; LocalStorage + WebLLM.
5. **Persian UI** + RTL everywhere user-facing.
6. **TypeScript** + Composition API + `<script setup>` for all Vue/TS files.

### Workflow loop

```
1. Announce what you're about to build
2. If terminal needed → show command → WAIT for confirmation
3. After confirmation → continue
4. Show / write the file
5. When the phase is complete → keep-a-changelog (version + CHANGELOG)
6. Ask to proceed to the next step / phase
```

## Tech stack (installed)

From `package.json` — do **not** re-scaffold with `npm create` unless the user asks:

| Package | Role |
|---------|------|
| `vue` | UI framework |
| `ant-design-vue` | UI components only |
| `@ant-design/icons-vue` | Icons |
| `@ant-design/colors` | Color scales |
| `@vueuse/core` | Composables / `useStorage` |
| `pinia` | State |
| `vue-router` | Routes |
| `tailwindcss` | Utility classes (v4 CSS-first) |
| `@tailwindcss/vite` | Vite plugin for Tailwind |
| `ai` | Vercel AI SDK core |
| `@ai-sdk/groq` | Groq provider |
| `@ai-sdk/vue` | `useChat` / Vue composables |

Phase 0 = configure existing project files, not a new Vite app.

## Target `src/` structure

```
src/
├── components/
│   ├── layout/          # AppHeader, AppSider, AppLayout
│   ├── empathize/       # PersonaBuilder, PersonaCard, EmpathyMap, ResearchNotes, CompetitorTable
│   ├── define/          # ProblemStatement, POVBuilder, HMWQuestions
│   ├── ideate/          # BrainstormBoard, UserflowCanvas, SitemapTree, CardSorting
│   ├── prototype/       # WireframeBuilder, ColorPalette, TypographyScale, GridConfigurator, ComponentLibrary
│   ├── test/            # ContrastChecker, WCAGChecklist, HeuristicEval, UsabilityReport
│   └── shared/          # AIPanel, StepProgress, ProjectDashboard
├── views/               # Home, Empathize, Define, Ideate, Prototype, Test
├── stores/              # project, persona, designSystem, ai
├── composables/         # useWebLLM, useContrast, useWCAG, useGrid, useLocalStorage, usePersona
├── utils/               # contrast, wcag-rules, grid-calculator, persona-templates, spacing-scale
├── constants/           # design-thinking-steps, wcag-checklist, heuristic-rules, color-presets
├── router/index.ts
├── App.vue
└── main.ts
```

## Phases (build order)

### Phase 0 — Project setup
- Wire `reset.css`, Pinia, router, RTL/`lang=fa`
- `ConfigProvider` + named antdv imports (antdv skill)
- Router for 5 Design Thinking steps + home
- Pinia store shells + VueUse readiness

### Phase 1 — Layout & navigation
- `Layout` / sider / header
- `Menu` for 5 steps
- `Steps` progress
- RTL

### Phase 2 — Empathize (همدلی)
- Persona form (`Form`, `Input`, `Select`, `InputNumber`)
- Templates, empathy map (`Card` + `Row`/`Col`), research notes, competitor `Table`

### Phase 3 — Define (تعریف مسئله)
- Problem statement, POV, HMW list (`List` + `Input`)

### Phase 4 — Ideate (ایده‌پردازی)
- Brainstorm (`Card` + `Tag`), userflow, sitemap `Tree`, card sorting (`Transfer` / VueUse DnD)

### Phase 5 — Prototype (پروتوتایپ)
- Color palette, typography scale (`Slider`), grid calculator, spacing (8pt), component checklist

### Phase 6 — Test (تست)
- Contrast checker, WCAG checklist, heuristic eval (`Rate` + `Form`), usability report

### Phase 7 — WebLLM
- `composables/useWebLLM.ts` + `AIPanel`
- Features: persona suggestions, note analysis, UX tips, microcopy, summaries

### Phase 8 — Persistence & export
- `useStorage` for all modules
- JSON export/import
- Auto-save

## Design Thinking steps

```ts
// constants/design-thinking-steps.ts
export const DESIGN_THINKING_STEPS = [
  { key: 'empathize', title: 'همدلی', icon: 'HeartOutlined', description: 'درک کاربر و نیازهای او', route: '/empathize', color: '#f5222d' },
  { key: 'define', title: 'تعریف مسئله', icon: 'AimOutlined', description: 'تعریف دقیق مسئله و دیدگاه کاربر', route: '/define', color: '#fa8c16' },
  { key: 'ideate', title: 'ایده‌پردازی', icon: 'BulbOutlined', description: 'تولید ایده و طراحی معماری اطلاعات', route: '/ideate', color: '#fadb14' },
  { key: 'prototype', title: 'پروتوتایپ', icon: 'ExperimentOutlined', description: 'ساخت نمونه اولیه و دیزاین سیستم', route: '/prototype', color: '#52c41a' },
  { key: 'test', title: 'تست', icon: 'CheckCircleOutlined', description: 'ارزیابی و تست کاربردپذیری', route: '/test', color: '#1890ff' },
]
```

Map icon string names to components from `@ant-design/icons-vue`.

## Persistence (VueUse)

Use `useStorage` from `@vueuse/core` for **all** persistence:

```ts
import { useStorage } from '@vueuse/core'

const personas = useStorage('ux-flow-personas', [])
const project = useStorage('ux-flow-project', {
  name: '',
  currentStep: 1,
  createdAt: new Date().toISOString(),
})
```

Prefer Pinia stores that wrap `useStorage` so UI and AI share one source of truth.

## WebLLM skeleton

```ts
// composables/useWebLLM.ts
import { ref } from 'vue'
import * as webllm from '@mlc-ai/web-llm'

export function useWebLLM() {
  const isLoading = ref(false)
  const isReady = ref(false)
  const progress = ref(0)
  const response = ref('')
  const error = ref('')
  const selectedModel = ref('Llama-3.1-8B-Instruct-q4f32_1-MLC')

  async function initModel(modelId?: string) {
    isLoading.value = true
    try {
      const engine = await webllm.CreateMLCEngine(modelId || selectedModel.value, {
        initProgressCallback: (report) => {
          progress.value = Math.round(report.progress * 100)
        },
      })
      isReady.value = true
      return engine
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, isReady, progress, response, error, initModel, selectedModel }
}
```

Prefer smaller models (e.g. SmolLM / Phi) when demos must load quickly; keep the list configurable.

## Success criteria

- [ ] Runs entirely in the browser
- [ ] Only antdv for UI (no custom CSS)
- [ ] RTL Persian interface
- [ ] Data in LocalStorage
- [ ] Five Design Thinking stages + navigation
- [ ] WebLLM assistance panel
- [ ] Static deployable (Vercel / Netlify / GitHub Pages)
- [ ] Responsive via `Row` / `Col`

## Reminders

1. Always ask before terminal commands
2. Never write custom CSS — antdv props only
3. Build one component / file at a time (unless user asks for a batch)
4. Test each phase before moving on
5. Persian copy; TypeScript; `<script setup>`
6. End of each phase → [keep-a-changelog](../keep-a-changelog/SKILL.md) (SemVer + CHANGELOG)
