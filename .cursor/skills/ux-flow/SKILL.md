---
name: ux-flow
description: >
  Builds Designyar (دیزاین یار) — Design Thinking as simple one-job micro-forms
  with per-form AI improve/complete (Groq). Vue 3, Pinia, Vue Router, VueUse,
  AI SDK. Use for UX Flow / دیزاین یار / Empathize–Test / AI form assist.
---

# Designyar (دیزاین یار) — product workflow

Client-only Vue SPA (`ui-ux-ai`). Design Thinking → **فرم‌های ساده، مرحله‌ای، تک‌کاره**؛ در هر فرم دکمه **بهبود / تکمیل با AI**.

Stack skills: [vue](../vue/SKILL.md) · [ant-design-vue](../ant-design-vue/SKILL.md) · [ant-design-icons-vue](../ant-design-icons-vue/SKILL.md) · [ant-design-colors](../ant-design-colors/SKILL.md) · [tailwindcss](../tailwindcss/SKILL.md) · [vueuse-core](../vueuse-core/SKILL.md) · [pinia](../pinia/SKILL.md) · [vue-router](../vue-router/SKILL.md) · [zod](../zod/SKILL.md) · [ai](../ai/SKILL.md) · [ai-sdk-groq](../ai-sdk-groq/SKILL.md) · [ai-sdk-vue](../ai-sdk-vue/SKILL.md) · [groq-sdk](../groq-sdk/SKILL.md) (legacy `src/ai/` only).

**Compose / full-safe TS:** [ux-flow-compose](../ux-flow-compose/SKILL.md). Rule: `.cursor/rules/full-safe-type-ts.mdc`.

**Phase end:** [keep-a-changelog](../keep-a-changelog/SKILL.md).

## Product principles

1. **One job per screen** — هر micro-form فقط یک کار اصلی.
2. **Progressive disclosure** — جزئیات پیشرفته در مرحلهٔ بعد یا مخفی.
3. **Soft guidance** — راهنمایی بله؛ قفل سخت خیر (بدون SoftGate / shell پیچیده).
4. **AI = assist** — پیشنهاد می‌دهد؛ کاربر Accept / Edit / Reject می‌کند.
5. **Persian UX writing** — کوتاه، روشن؛ jargon انگلیسی فقط وقتی لازم.
6. **WCAG-oriented** — label، keyboard، contrast؛ [wcag-antdv](../wcag-antdv/SKILL.md) + [persian-rtl](../persian-rtl/SKILL.md).

## Out of scope (PO confirmed)

| Area | Status |
|------|--------|
| Native mobile (RN/Flutter/…) | ❌ نه — فقط responsive وب |
| Backend / auth server / sync API | ❌ نه — LocalStorage + Groq کلاینت |
| WebLLM / Next.js `app/api/chat` | ❌ استفاده نمی‌شود |
| SoftGate / PhaseShell / dashboard شلوغ | ❌ نه — wizard تک‌کاره |
| DevOps سروری فراتر از static SPA | ❌ نه — `vercel.json` rewrite کافی است |

## Critical behavior

1. **No SFC `<style>`** — antdv + Tailwind utilities ([tailwindcss](../tailwindcss/SKILL.md)).
2. **Command confirmation** — show command → wait ✅ (agent never runs Shell).
3. **Step-by-step** — یک فاز/micro-phase؛ اعلام کن؛ قبل از بعدی بپرس.
4. **No backend** — browser only; LocalStorage + Groq client.
5. **Persian UI** + RTL.
6. **TypeScript** + Composition API + `<script setup>`.

### Workflow loop

```
1. Announce micro-phase
2. If terminal needed → show command → WAIT ✅
3. Types first → store → form view → AiFormAssist
4. When micro-phase done → ask before next
5. Phase close → keep-a-changelog
```

## Tech stack (installed)

Do **not** re-scaffold unless asked. See `package.json`.

| Package | Role |
|---------|------|
| `vue` | UI |
| `ant-design-vue` | Components |
| `@ant-design/icons-vue` | Icons |
| `@ant-design/colors` | Color scales |
| `@vueuse/core` | `useStorage` + utils |
| `pinia` | State |
| `vue-router` | Routes (wizard steps) |
| `tailwindcss` / `@tailwindcss/vite` | Utilities |
| `ai` / `@ai-sdk/groq` / `@ai-sdk/vue` | AI (canonical) |
| `zod` | Schemas / AI structured output |
| `groq-sdk` | Legacy only in `src/ai/` |

## Keep / rebuild

**Keep (do not rewrite casually):**

- `src/App.vue`
- `src/components/layout/AppLayout.vue` — فقط layout + `RouterView`؛ بدون SoftGate
- `src/stores/configProvider.store.ts`

**Rebuild target:** بقیهٔ `src/` از صفر روی مدل micro-form (مرحله‌ای).

## Target `src/` structure

```
src/
├── components/
│   ├── layout/           # AppLayout (kept), AppHeader, AppSider (minimal)
│   ├── forms/            # one folder per DT phase
│   │   ├── empathize/    # PersonaForm, EmpathyMapForm, …
│   │   ├── define/
│   │   ├── ideate/
│   │   ├── prototype/
│   │   └── test/
│   └── shared/           # AiFormAssist, FormStepNav, StepProgress
├── ai/                   # migrate to AI SDK; legacy groq-sdk until touched
├── views/                # thin route shells → host current micro-form
├── stores/               # project, phase stores, ai prefs; + configProvider (kept)
├── composables/          # useAiFormAssist, …
├── utils/                # prompts, parsers, a11y helpers
├── constants/            # design-thinking-steps, form registry
├── types/                # domain first
├── router/index.ts
├── App.vue               # kept
└── main.ts
```

**Forbidden product patterns:** SoftGateModal، PhaseShell قفل‌کننده، داشبورد شلوغ چندوظیفه، `AIPanel` سراسری بدون اتصال به فرم.

## Micro-form contract

هر micro-form:

| Element | Rule |
|---------|------|
| Title | یک خط — کار فعلی |
| Hint | یک جمله UX Writer |
| Fields | حداقل ضروری |
| Primary CTA | ذخیره / بعدی |
| AI CTA | «بهبود با AI» یا «تکمیل با AI» |
| AI preview | Accept / Edit / Reject — بدون overwrite خاموش |

## Design Thinking steps

```ts
// constants/design-thinking-steps.ts
export const DESIGN_THINKING_STEPS = [
  { key: 'empathize', title: 'همدلی', icon: 'HeartOutlined', description: 'درک کاربر و نیازهای او', route: '/empathize', color: '#f5222d' },
  { key: 'define', title: 'تعریف مسئله', icon: 'AimOutlined', description: 'تعریف دقیق مسئله و دیدگاه کاربر', route: '/define', color: '#fa8c16' },
  { key: 'ideate', title: 'ایده‌پردازی', icon: 'BulbOutlined', description: 'تولید ایده و معماری اطلاعات', route: '/ideate', color: '#fadb14' },
  { key: 'prototype', title: 'پروتوتایپ', icon: 'ExperimentOutlined', description: 'نمونه اولیه و دیزاین سیستم', route: '/prototype', color: '#52c41a' },
  { key: 'test', title: 'تست', icon: 'CheckCircleOutlined', description: 'ارزیابی کاربردپذیری', route: '/test', color: '#1890ff' },
] as const
```

Map icon names → `@ant-design/icons-vue`.

### Suggested micro-forms (build order inside each phase)

| Phase | Micro-forms (one job each) |
|-------|----------------------------|
| Empathize | هدف پژوهش → پرسونا → نقشه همدلی → یادداشت → رقبا |
| Define | بیانیه مسئله → POV → HMW |
| Ideate | طوفان فکری → جریان کاربر → سایت‌مپ → کارت‌سورت |
| Prototype | رنگ → تایپ → گرید → فاصله → وایرفریم/چک‌لیست |
| Test | کنتراست → WCAG → هیوریستیک → گزارش |

## Build phases (agent order)

### Phase 0 — Foundation
- `main.ts`, router shell, reset/fonts, Pinia
- Keep App / AppLayout / configProvider
- Form registry + empty routes

### Phase 1 — Layout & wizard chrome
- Minimal header/sider یا step indicator
- `FormStepNav` + `StepProgress`
- RTL

### Phase 2–6 — Empathize → Test
- Types → store (`useStorage`) → one micro-form at a time → AiFormAssist

### Phase 7 — AI assist (Groq)
- Shared `AiFormAssist` + composable: [ai](../ai/SKILL.md) + [ai-sdk-groq](../ai-sdk-groq/SKILL.md)
- Structured output: [zod](../zod/SKILL.md)
- Per-form prompts in `utils/ai-prompts.ts`

### Phase 8 — Persistence & export
- Typed snapshot export/import + auto-save via stores

## Persistence

```ts
import { useStorage } from '@vueuse/core'

const personas = useStorage<Persona[]>('ux-flow-personas', [])
```

Prefer Pinia wrapping `useStorage` so UI و AI یک منبع حقیقت دارند.

## AI assist (canonical)

```ts
import { streamText } from 'ai'
import { createGroq } from '@ai-sdk/groq'

const groq = createGroq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
})
```

- Input: پروژه + دادهٔ همان فرم + فاز
- Output: Zod schema هم‌شکل state فرم
- Errors: پیام فارسی؛ بدون WebLLM

Legacy `src/ai/groq-provider.ts` — تا مهاجرت؛ call site جدید ممنوع.

## Success criteria

- [ ] Browser-only SPA
- [ ] antdv + Tailwind؛ بدون `<style>`
- [ ] RTL فارسی
- [ ] LocalStorage
- [ ] پنج فاز DT به‌صورت micro-form
- [ ] AI improve/complete روی هر فرم با Accept
- [ ] Static deploy
- [ ] Responsive (`Row`/`Col` + Tailwind)

## Reminders

1. Ask before terminal commands
2. One micro-form / file batch per approval
3. Types first
4. Phase end → changelog
5. Chat با کاربر فارسی؛ کد انگلیسی
