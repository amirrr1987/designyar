# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.39.1] - 2026-08-15

### Changed

- DT-aligned AI extraContext for challenge, persona, research notes, proto-checklist, feedback, brainstorm (`dt-ai-prompts.ts`)

### Chore

- Ignore `*.pdf` local reference booklets in `.gitignore`

## [0.39.0] - 2026-08-15

### Added

- Challenge Definition form (define) with HMW handoff
- Mini Persona fields: loves / fears / dailyJobs
- Research notes as interview sheet (who / question / answer / insight)
- Prototype checklist micro-form before wireframe
- Test feedback form: I like / I wish / I give
- Brainstorm structured selection + selected idea mark

### Changed

- Form registry hints aligned with DT booklet mindsets

## [0.38.2] - 2026-08-15

### Changed

- AI assist preview opens in a Modal (Accept / Reject) instead of an inline card block

## [0.38.1] - 2026-08-15

### Fixed

- AI form assist: omit null optional fields (e.g. `nextActions: null`) so Zod schemas match; report schema preprocesses partial actions; one retry on schema/JSON mismatch

## [0.38.0] - 2026-08-15

### Added

- Test report soft loop: next-action links from contrast / WCAG / weak heuristics
- Light handoff: copy Markdown + download JSON (with palette tokens)
- Report AI can suggest structured nextActions (Accept/Reject)
- Shared `FormPulseHeader` for micro-form pulse summaries

### Changed

- Contrast + WCAG forms polished (live preview, progress cards)
- Empathize / Define / Ideate bare forms: pulse header + Card rows (simplicity kept)

## [0.37.0] - 2026-08-15

### Changed

- Prototype Colors: remove live WCAG contrast Alert; tip points to Test → Contrast
- Heuristics form: Nielsen-10 pulse checks with Rate, live mood board, weak-spot tags

## [0.36.2] - 2026-08-15

### Added

- Theory mode: each scheme hue shows a small light→dark shade strip (Paletton-style rectangles)

## [0.36.1] - 2026-08-15

### Changed

- Theory mode: switching scheme or seed live-rebuilds the palette; only the main (seed) color is editable (derived hues + text/bg are read-only)

## [0.36.0] - 2026-08-15

### Changed

- Theory color schemes aligned with Paletton: Monochromatic / Adjacent / Triad / Tetrad (with quaternary for 4-color)

## [0.35.1] - 2026-08-15

### Added

- Full Design System catalog (30+) for palette starters with Vue-recommended group + searchable Select

## [0.35.0] - 2026-08-15

### Changed

- Colors form: three modes — custom (label/value), color theory (mono/duotone/tricolor), design system (Ant / Material by framework)
- AI palette schema matches new enums; Persian harmony labels normalized; text & background always separate

### Removed

- Legacy multi-harmony wheel modes (complementary/analogous/triadic jargon) from the primary UI

## [0.34.0] - 2026-08-15

### Added

- Soft product-type palette starters (Accept/Reject only)
- Color presets via propose → Accept
- Advanced roles: Surface / Muted text / Border (collapsed)
- Primary ramp hover/active hints; next-step tip for type & spacing

## [0.33.0] - 2026-08-15

### Added

- Semantic color palette roles (Primary / Accent / Background / Text) inside Prototype colors form
- Harmony propose → Accept/Reject (Mono, Primary+Accent, Complementary, Analogous, Triadic)
- Inline WCAG AA contrast check for text on background

### Changed

- Prototype state: `colors[]` → `palette` object (legacy array migrated on load)

## [0.32.0] - 2026-08-15

### Added

- Prototype studio: live previews for colors, type scale, grid, spacing, and wireframe blocks
- Wireframe as composable page blocks (header/hero/content/cta/…) with visual sketch
- Color presets via `@ant-design/colors` + native color picker

### Changed

- Prototype forms redesigned as visual micro-studio (not bare number fields)

## [0.31.4] - 2026-08-15

### Fixed

- AI responses: enforce Persian-only text and reject/retry on Cyrillic (Russian) characters

### Changed

- Empathize & Define: multi-item forms (personas, empathy maps, research notes, problem statements, POVs) per Design Thinking practice
- Snapshot import: migrate legacy single-item define/empathize shapes via normalize

## [0.31.3] - 2026-08-15

### Added

- Home resume progress (phase/form + overall bar)
- In-phase form step dots with jump
- Scrollable wider shell (`max-w-3xl`) for wizard readability

## [0.31.2] - 2026-08-15

### Added

- Done screen (`/done`) after last Test form
- Clickable Design Thinking steps to jump phases
- First/last form nav labels («خانه» / «پایان»)

## [0.31.1] - 2026-08-15

### Changed

- UX Writer: Persian microcopy without jargon (hints, home, AI assist labels)
- Accessibility: aria-labels on nav/AI actions, soft-skip guidance, live regions for AI preview/errors

## [0.31.0] - 2026-08-15

### Added

- **Micro-form wizard:** Design Thinking as one-job forms (Empathize → Test) with prev/next
- **AiFormAssist** on every form — improve/complete via `ai` + `@ai-sdk/groq` + Zod; Accept/Reject
- Form registry, WizardChrome, StepProgress; Home project name + JSON export/import (client backup until backend)
- Cursor contract: `designyar-product` rule, ux-flow skill aligned to micro-forms

### Changed

- Rebuilt `src/` around micro-forms; kept `App.vue`, `AppLayout.vue`, `configProvider.store.ts`
- LocalStorage keys moved to `designyar:*` (previous keys not migrated)

### Removed

- SoftGate / PhaseShell dashboard flow and legacy multi-tool phase UIs

## [0.30.0] - 2026-08-11

### Added

- **Release readiness (R9):** `netlify.toml` SPA fallback alongside `vercel.json` / `public/_redirects`
- README refresh — product path, npm/pnpm commands, deploy table

### Changed

- Vite: Vue DevTools plugin only in `development` mode
- Rebuild R0–R8 closed; this release is the ship-ready polish gate

## [0.29.0] - 2026-08-11

### Added

- **Rebuild R8 — Persistence & synthesis:** export format **v6** with required `contrastCheck`; `roundTripDocument` helper
- `ExportImportCard` shared header + synthesis I/O; import hydrates Pinia without full page reload
- Junior synthesis: manual notes, coverage soft, Persian section labels, copy full context

### Changed

- `fa.synthesis` / `fa.exportIo`; synthesis page DoD + export card
- Rebuild track R0–R8 complete for junior-first Design Thinking coach

## [0.28.0] - 2026-08-11

### Added

- **Rebuild R7 — AI polish:** `fa.ai` copy; junior drawer is one-assist (locked action, no chains/coverage cockpit)
- Streaming via `AiProvider` / `completeAssist`; apply CTA elevated when structured payload ready
- History collapsed for junior (`AiHistoryList` embedded mode)

### Changed

- `useGroq` thin facade over ai store; Groq provider streams deltas
- `AiSectionAssist` quieter in junior (no secondary + jargon caption)

## [0.27.0] - 2026-08-11

### Added

- **Rebuild R6 — Test:** `fa.testTools` for contrast / WCAG / report + optional heuristics
- Persisted `contrastCheck` on test slice; completion `test.contrast` requires a saved check
- Manual usability report notes (TextArea) + contextual tab tags / AI

### Changed

- Junior WCAG labels hide raw criterion IDs; heuristics behind «ابزارهای بیشتر» with info alert
- Export/import carries optional `contrastCheck`

## [0.26.0] - 2026-08-11

### Added

- **Rebuild R5 — Prototype:** `fa.prototypeTools` for color / wireframe / type + optional tools
- Color presets from `@ant-design/colors`; wireframe progress toward 2 blocks
- Contextual primary AI + tab tags from completion engine

### Changed

- Junior: quieter typography (font field hidden); critique AI only in full mode on wireframe
- Grid, spacing, checklist, microcopy marked اختیاری with info alerts

## [0.25.0] - 2026-08-11

### Added

- **Rebuild R4 — Ideate:** `fa.ideateTools` for brainstorm / userflow / optional IA tools
- Junior progress toward 3 ideas and 2 flow steps with Progress bars
- Contextual primary AI + tab tags (کار فعلی / انجام شد) from completion

### Changed

- Brainstorm: quieter form (tags hidden in junior); Userflow: Persian glossary + goal hints
- Sitemap & card sort marked اختیاری with info alerts

## [0.24.0] - 2026-08-11

### Added

- **Rebuild R3 — Define stack:** `fa.defineTools` for problem / POV / HMW
- Numbered stack with «کار فعلی» / «انجام شد» tags from completion engine
- Contextual primary AI + smooth scroll to active Define step (junior)

### Changed

- Problem / POV / HMW forms — Persian-first labels; HMW/POV jargon only in full mode gloss
- Define view remains tab-free (Problem → POV → HMW stack)

## [0.23.0] - 2026-08-11

### Added

- **Rebuild R2 — Empathize polish:** `fa.empathizeTools` copy for notes / persona / empathy / competitors
- Persona quick-add from templates + avatar color presets (`@ant-design/colors`)
- Contextual primary AI on Empathize (notes vs persona) driven by `nextJob`

### Changed

- Research notes: structured placeholder, quieter AI (analyze only when content exists in junior)
- Empathy map & competitors: explicit اختیاری alerts; Persian-first quadrant labels
- Persona form: junior hides jargon secondary AI and hex input

## [0.22.0] - 2026-08-11

### Added

- **Rebuild R1 — One Job shell:** `PhaseShell`, `PrimaryTaskCard`, `SoftGateModal`
- Soft gate in junior mode (Sider + Prev/Next) with Skip / go recommended
- Home: single completion-driven CTA; step overview collapsed
- Default tabs align with completion `nextJob`

### Changed

- Removed top `StepProgress` dual-nav; Sider is the only primary spine
- Phase views wrap tools in `PhaseShell` (badge + primary task + collapsed AI + footer)
- Dashboard progress uses `domain/completion` (no divergent stats)

## [0.21.0] - 2026-08-11

### Added

- **Rebuild R0 — foundation:** single document persistence `ux-flow:v1` + `schemaVersion`
- **`src/content/fa.ts`** — Persian copy / glossary / DoD / job labels (single source)
- **`src/domain/completion.ts`** — pure completion engine (`nextJob`, phase %, soft-gate helper)
- **`src/domain/migrate.ts`** — legacy multi-key → v1 document migration
- **Domain stores:** `empathize`, `prototype`, `test`, `meta` + `persistence` (sole `useStorage`)
- **`AiProvider` interface** + Groq provider (`src/ai/`) for swappable AI runtime
- Export format **v5** reading/writing the document

### Changed

- All domain `useStorage` calls outside Pinia removed — components/composables use stores
- `Project` includes `schemaVersion`; package remains `ui-ux-ai` / brand دیزاین‌یار

### Removed

- Scattered LocalStorage keys as runtime source of truth (kept as legacy migrate map only)

## [0.20.0] - 2026-08-11

### Added

- **حالت ساده (جونیور)** — پیش‌فرض؛ سوییچ در هدر برای حالت حرفه‌ای
- **`experienceMode`** روی پروژه (`junior` | `full`) با persist و سازگاری import قدیمی
- **`PhaseJuniorGuide`** — راهنمای «از اینجا شروع کن» + چک‌لیست + واژه‌نامه هر مرحله
- **`PhaseAiActions`** — یک اکشن AI اصلی؛ بقیه پشت «ابزارهای بیشتر AI»
- **`junior-guide` constants** — تب‌های ضروری، تب پیش‌فرض هم‌راستا با مربی

### Changed

- مراحل Empathize / Ideate / Prototype / Test — در حالت ساده فقط ابزارهای ضروری؛ بقیه پشت دکمه
- برچسب‌های فارسی ساده‌تر (دیدگاه کاربر، چگونه می‌توانیم، دسترسی‌پذیری، متن UI)
- خانه — onboarding سه‌مرحله‌ای برای جونیور + پیشنهاد مسیر ترتیبی
- سایدبار شماره‌گذاری‌شده؛ Steps بدون توضیحات شلوغ در حالت ساده
- پیشرفت Prototype/Test واقعی‌تر (وایرفریم + گزارش)
- متن مربی فاز — اختیاری‌ها مشخص و jargon کمتر

## [0.19.0] - 2026-08-11

### Added

- **صفحه «جمع‌بندی پروژه»** (`/synthesis`) — آخرین آیتم منو؛ نمای تحلیل‌شده همه آیتم‌های Design Thinking
- **`ProjectSynthesisPanel.vue`** — Collapse مرحله‌به‌مرحله + پوشش context + تحلیل AI ذخیره‌شده
- **`analyze-project`** — اکشن AI برای تحلیل جامع کل پروژه با اعمال در جمع‌بندی
- **`project-synthesis-sections.ts`** — ساخت بخش‌های ساخت‌یافته از context
- export/import نسخه **4** با `projectSynthesis`

### Changed

- منوی کناری — آیتم «جمع‌بندی» بعد از فاز Test
- پوشش context AI — شامل تحلیل جامع ذخیره‌شده

## [0.18.0] - 2026-08-11

### Added

- **`AiSectionAssist.vue`** — الگوی مشترک AI در هر بخش فرم با hint بخش + «AI از کل داده پروژه context می‌گیرد»
- **`ai-context-coverage.ts`** — نمایش پوشش context پروژه در پنل AI
- AI در بخش‌های قبلاً بدون کمک: Persona، Design System (رنگ/تایپ/گرید/فاصله/چک‌لیست)، WCAG، ContrastChecker، ارزیابی اکتشافی

### Changed

- **`AiAssistButton`** — prop اختیاری `section` برای hint بخش جاری
- **`ai` store** — `openPanel(action, sectionHint?)` و مصرف hint در prompt
- همه فرم‌ها و viewها — `section` روی دکمه‌های AI برای context دقیق‌تر

## [0.17.0] - 2026-08-11

### Added

- **`suggest-wireframe-blocks`** — اعمال چیدمان بلوک وایرفریم از userflow/IA
- **`suggest-competitors`** — پیشنهاد و اعمال رقبا از شرح پروژه
- زنجیره **Prototype** (wireframe → microcopy)
- **`hmwTopSummary`** — HMWهای دارای رأی در context Ideate

### Changed

- `WireframeBuilder` و `constants/wireframe-blocks.ts` — منبع مشترک بلوک‌ها
- Phase Coach: راهنمای رقبا (Empathize) و wireframe (Prototype)

## [0.16.0] - 2026-08-11

### Added

- **تاریخچه اعمال AI** — audit log با before/after diff در پنل AI
- ذخیره تا ۴۰ رکورد اعمال (اکشن، زنجیره، خلاصه، diff)
- export/import شامل `aiHistory`

## [0.15.0] - 2026-08-11

### Added

- **`test-to-ideas`** — بازخورد Test به Ideate (ایده patch با tag `test-fix`)
- **بانک میکروکپی** — ذخیره و مدیریت میکروکپی‌های AI در Prototype
- اکشن `microcopy` با اعمال مستقیم در بانک
- **چک‌لیست کامپوننت** در context AI (`review-design-system`, `wireframe-critique`, `microcopy`)
- export/import نسخه **3** با `microcopyBank`

### Changed

- دکمه میکروکپی از Define به Prototype منتقل شد
- Phase Coach: راهنمای میکروکپی در Prototype و بازخورد حلقه‌ای Test

## [0.14.0] - 2026-08-11

### Added

- **Phase Coach** در StepProgress — راهنمای گام بعدی با دکمه AI
- اکشن‌های `suggest-sitemap` و `suggest-card-sort` با اعمال مستقیم
- اکشن **`test-to-hmw`** — بازخورد Test به Define (سوالات HMW)
- زنجیره **Ideate کامل** (ایده → userflow → sitemap → card sort)
- context `testSummary` برای promptهای Test

## [0.13.0] - 2026-08-11

### Added

- **آمادگی context** در پنل AI (درصد + checklist ✓/○)
- **زنجیره‌های AI**: Define کامل (مسئله→POV→HMW) و Empathize (یادداشت→پرسونا→empathy)
- اکشن `seed-research-notes` با اعمال در یادداشت تحقیق
- اکشن `synthesize-empathy` با اعمال در نقشه همدلی
- `AiChainButton` و اجرای خودکار زنجیره با apply بین مراحل

## [0.12.0] - 2026-08-11

### Added

- **شرح پروژه** (عنوان + توضیح) در صفحه خانه — محور context برای AI و همه مراحل
- اکشن `improve-project-brief` با اعمال مستقیم در پروژه
- اعمال مستقیم **بیان مسئله** و **POV** از AI (`refine-problem`, `refine-pov`)
- ذخیره **خلاصه تست** در گزارش usability (`summarize-test` → اعمال)
- کلید `usabilityReportSummary` در export/import (نسخه export 2)

### Removed

- `useWebLLM` و وابستگی `@mlc-ai/web-llm` (جایگزین: Groq Cloud)

### Changed

- `Project` شامل `briefTitle` و `briefDescription` با migrate سازگار با داده قدیمی

## [0.11.0] - 2026-08-11

### Added

- ۶ اکشن AI جدید: تحلیل رقبا، تولید HMW، طوفان ایده، پیشنهاد جریان کاربر، بازبینی Design System، نقد وایرفریم
- Context غنی از empathy map، رقبا، HMW، userflow، sitemap، card sort، design tokens و WCAG/هیوریستیک
- parse JSON و «اعمال مستقیم» برای پرسونا، HMW، ایده و مراحل userflow
- دکمه‌های AI در Ideate/Prototype و کنار فرم‌های ResearchNotes، HMW، Brainstorm، Wireframe، Competitors
- هشدار context خالی، کپی/تکرار/پاک پاسخ در پنل AI

### Changed

- اکشن‌ها در Select پنل AI بر اساس فاز Design Thinking گروه‌بندی شدند

## [0.10.0] - 2026-08-11

### Added

- یکپارچه‌سازی Groq Cloud (`groq-sdk`) با مدل پیش‌فرض `groq/compound-mini`
- composable `useGroq` با استریم پاسخ و ابزارهای compound (web_search، code_interpreter، visit_website)
- پیکربندی کلید API از `.env.local` با `VITE_GROQ_API_KEY` و فایل `.env.example`

### Changed

- پنل AI از WebLLM به Groq Cloud منتقل شد (بدون بارگذاری مدل محلی)

## [0.9.1] - 2026-08-11

### Added

- پیکربندی SPA fallback برای Netlify (`public/_redirects`) و Vercel (`vercel.json`)
- راهنمای استقرار استاتیک در `README.md`

## [0.9.0] - 2026-08-11

### Added

- فهرست کلیدهای LocalStorage در `constants/storage-keys.ts`
- خروجی JSON پروژه (`utils/project-export.ts`) و دکمه «خروجی JSON» در هدر
- ورود JSON با اعتبارسنجی و hydrate در `utils/project-import.ts`
- یکپارچه‌سازی کلیدها روی `STORAGE_KEYS`؛ تأیید useStorage برای ماژول‌ها (localStorage خام فقط در import/export)
- داشبورد خانه با آمار پیشرفت واقعی مراحل؛ بدون `<style>` باقی‌مانده

## [0.8.0] - 2026-08-11

### Added

- composable `useWebLLM` و استور AI با وضعیت بارگذاری/پاسخ (مدل کوچک پیش‌فرض)
- پنل AI در Drawer هدر (`AIPanel.vue`)
- اکشن‌های تایپ‌شده و prompt فارسی در `utils/ai-prompts.ts` + جمع‌آوری context
- دکمه‌های `AiAssistButton` روی Empathize / Define / Test با preset اکشن

### Fixed

- سازگاری `Select` مدل AI با نوع `SelectValue` آنتدیزاین

## [0.7.0] - 2026-08-11

### Added

- موتور کنتراست WCAG (`utils/contrast.ts`)، `useContrast` و `ContrastChecker.vue`
- چک‌لیست WCAG با persistence در `WCAGChecklist.vue` / `useWCAG`
- ارزیابی ۱۰ اصل نیلسن با Rate/یادداشت در `HeuristicEval.vue`
- گزارش کاربردپذیری تجمیعی در `UsabilityReport.vue`
- ترکیب TestView با Tabs: کنتراست | WCAG | هیوریستیک | گزارش

## [0.6.0] - 2026-08-11

### Added

- تکمیل دیزاین‌سیستم با رمپ پیش‌فرض `@ant-design/colors` و `generatePrimaryFromSeed`
- پیش‌نمایش و ذخیره پالت رنگ در `ColorPalette.vue`
- مقیاس تایپوگرافی با Slider/InputNumber در `TypographyScale.vue`
- ماشین‌حساب گرید + `GridConfigurator.vue` و composable `useGrid`
- مقیاس فاصله ۸pt و نمایش توکن‌ها در `SpacingScale.vue`
- وایر فریم بلوکی و چک‌لیست کامپوننت در `WireframeBuilder` / `ComponentLibrary`
- ترکیب PrototypeView با Tabs ابزارهای دیزاین‌سیستم

### Fixed

- سازگاری Slider تایپوگرافی با نوع `Value` آنتدیزاین و حذف import بلااستفاده

## [0.5.0] - 2026-08-11

### Added

- تایپ‌ها و استور Ideate: ایده‌ها، userflow، sitemap، card sort با کلیدهای `ux-flow-*`
- بورد ایده‌پردازی با Modal/رأی در `BrainstormBoard.vue`
- بوم جریان کاربر به‌صورت لیست گام‌های typed در `UserflowCanvas.vue`
- درخت نقشه سایت قابل ویرایش در `SitemapTree.vue`
- مرتب‌سازی کارت‌ها با دسته‌بندی در `CardSorting.vue`
- ترکیب IdeateView با Tabs: طوفان فکری | جریان کاربر | نقشه سایت | مرتب‌سازی

## [0.4.0] - 2026-08-11

### Added

- تایپ‌ها و استور Define: `ProblemStatement` / `POV` / `HMWItem` با کلیدهای `ux-flow-problem`، `ux-flow-pov`، `ux-flow-hmw`
- فرم بیان مسئله با پیش‌نمایش جمله فارسی در `ProblemStatement.vue`
- سازنده POV با اتصال اختیاری به پرسونا در `POVBuilder.vue`
- لیست سوالات How Might We با رأی و حذف در `HMWQuestions.vue`
- ترکیب DefineView: بیان مسئله + POV + HMW

## [0.3.0] - 2026-08-11

### Added

- قالب‌های پرسونا در `utils/persona-templates.ts` و composable `usePersona`
- UI پرسونا: `PersonaBuilder`، `PersonaCard` و لیست در `EmpathizeView`
- نقشه همدلی ۲×۲ با ذخیره `ux-flow-empathy-maps` در `EmpathyMap.vue`
- یادداشت تحقیق با auto-save در `ResearchNotes.vue` (`ux-flow-research-notes`)
- جدول رقبا با CRUD و `TableColumnsType` در `CompetitorTable.vue` (`ux-flow-competitors`)
- ترکیب Empathize با Tabs: پرسونا | نقشه همدلی | یادداشت | رقبا

### Fixed

- سازگاری سن پرسونا با `InputNumber` (`undefined` به‌جای `null` در فرم)

## [0.2.0] - 2026-08-11

### Added

- لایه Layout: `AppHeader` (نام پروژه)، `AppSider` (منوی خانه + ۵ مرحله با آیکون)، `AppLayout`
- نگاشت تایپ‌شده آیکون‌های مراحل در `constants/step-icons.ts`
- `StepProgress` با antdv `Steps` همگام با route/store؛ نمایش بالای محتوا در `AppLayout`
- `ProjectDashboard` با نام پروژه و کارت لینک به پنج مرحله؛ اتصال در `HomeView`
- یکپارچه‌سازی `App.vue`: `ConfigProvider` → `AppLayout` → outlet

## [0.1.0] - 2026-08-11

### Added

- تایپ‌های دامنه و type guardها: `Project`، `DesignStepKey`، `Persona`، `DesignSystem` (palette / typography / grid / spacing) در `src/types/`
- ثابت‌های پنج مرحله دیزاین تینکینگ با عنوان فارسی، route، آیکون، رنگ و helperهای `getStepByKey` / `getStepByRoute` در `src/constants/design-thinking-steps.ts`
- قانون Cursor برای اجرای دستی دستورات ترمینال توسط کاربر (بدون اجرای خودکار shell)
- بوت‌استرپ RTL فارسی: `index.html` با `lang=fa` / `dir=rtl`، `ant-design-vue/dist/reset.css` در `main.ts`، و `ConfigProvider` با `fa_IR` در `App.vue`
- شش مسیر lazy-load (`/` + پنج مرحله) با `RouteMeta` تایپ‌شده و viewهای placeholder بر پایه `Card`
- استورهای Pinia با `useStorage`: `project`، `persona`، `designSystem`، `ai` (کلیدهای `ux-flow-*`)

### Changed

- حذف scaffold و `<style>` از `App.vue`؛ فقط `ConfigProvider` + `RouterView`
- عنوان صفحه به «دیزاین‌یار»
- حذف استور نمونه `counter`

## [0.0.0] - 2026-08-11

### Added

- اسکلت اولیه Vite + Vue 3 + TypeScript + Pinia + Vue Router و وابستگی‌های Ant Design Vue / VueUse / WebLLM
