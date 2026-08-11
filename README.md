# دیزاین‌یار (UX Flow)

اپلیکیشن کلاینت‌ساید برای کمک به فرآیند Design Thinking — Vue 3، Pinia، Ant Design Vue (RTL فارسی)، VueUse و WebLLM.

## راه‌اندازی

```sh
pnpm install
pnpm dev
```

## کیفیت

```sh
pnpm run type-check
pnpm run lint
pnpm run format
pnpm build
```

`pnpm build` خروجی استاتیک را در `dist/` می‌سازد (همراه type-check).

## استقرار استاتیک (SPA)

اپ فقط فرانت است؛ backend ندارد. برای مسیرهای Vue Router باید همه درخواست‌ها به `index.html` برگردند.

### Vercel

فایل `vercel.json` در ریشه پروژه rewrite به `index.html` دارد. کافی است ریپو را به Vercel وصل کنید.

### Netlify

فایل `public/_redirects` با قانون SPA در بیلد به `dist/` کپی می‌شود.

### GitHub Pages

1. اگر سایت روی ساب‌مسیر است (مثلاً `username.github.io/designyar/`) در `vite.config.ts` مقدار `base: '/designyar/'` را تنظیم کنید.
2. بعد از `pnpm build`، محتویات `dist/` را به branch `gh-pages` بفرستید (یا از Action استفاده کنید).
3. برای fallback، یک `404.html` کپی از `index.html` در `dist/` رایج است، یا از Actionهای SPA استفاده کنید.

## یادداشت WebLLM

مدل‌ها داخل مرورگر دانلود/اجرا می‌شوند؛ برای دمو روی شبکهٔ کند اولین بارگذاری زمان‌بر است. HTTPS برای WebGPU/WASM در پروداکشن توصیه می‌شود.
