# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- تایپ‌های دامنه و type guardها: `Project`، `DesignStepKey`، `Persona`، `DesignSystem` (palette / typography / grid / spacing) در `src/types/`
- ثابت‌های پنج مرحله دیزاین تینکینگ با عنوان فارسی، route، آیکون، رنگ و helperهای `getStepByKey` / `getStepByRoute` در `src/constants/design-thinking-steps.ts`
- قانون Cursor برای اجرای دستی دستورات ترمینال توسط کاربر (بدون اجرای خودکار shell)
- بوت‌استرپ RTL فارسی: `index.html` با `lang=fa` / `dir=rtl`، `ant-design-vue/dist/reset.css` در `main.ts`، و `ConfigProvider` با `fa_IR` در `App.vue`
- شش مسیر lazy-load (`/` + پنج مرحله) با `RouteMeta` تایپ‌شده و viewهای placeholder بر پایه `Card`

### Changed

- حذف scaffold و `<style>` از `App.vue`؛ فقط `ConfigProvider` + `RouterView`
- عنوان صفحه به «دیزاین‌یار»

## [0.0.0] - 2026-08-11

### Added

- اسکلت اولیه Vite + Vue 3 + TypeScript + Pinia + Vue Router و وابستگی‌های Ant Design Vue / VueUse / WebLLM
