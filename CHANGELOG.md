# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- composable `useWebLLM` و استور AI با وضعیت بارگذاری/پاسخ (مدل کوچک پیش‌فرض)
- پنل AI در Drawer هدر (`AIPanel.vue`)
- اکشن‌های تایپ‌شده و prompt فارسی در `utils/ai-prompts.ts` + جمع‌آوری context

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
