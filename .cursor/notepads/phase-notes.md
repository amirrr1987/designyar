# بازسازی Designyar — یادداشت فاز

## وضعیت

**v0.31.0** — micro-form + AI در هر فرم落地 شد.

JSON export/import = بکاپ کلاینت تا وقتی backend بیاید.

## انجام‌شده

- [x] Phase 0–8 اسکلت محصول (فرم‌ها + AI + persistence + export)
- [x] type-check fix (`useAiFormAssist` safeParse)
- [x] SemVer `0.31.0` + CHANGELOG

## بعدی (پیشنهاد)

- [ ] polish UX Writer / a11y
- [ ] commit در صورت تأیید کاربر
- [ ] بعداً: sync/auth با backend به‌جای/کنار JSON

## فایل‌های کلیدی

- `src/constants/form-registry.ts`
- `src/composables/useMicroFormAi.ts`
- `CHANGELOG.md`
