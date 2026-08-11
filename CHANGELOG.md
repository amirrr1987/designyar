# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
