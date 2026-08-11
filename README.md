# دیزاین‌یار (UX Flow)

اپلیکیشن کلاینت‌ساید برای کمک به فرآیند Design Thinking — Vue 3، Pinia، Ant Design Vue (RTL فارسی)، VueUse و Groq Cloud.

## راه‌اندازی

```sh
pnpm install
cp .env.example .env.local   # سپس VITE_GROQ_API_KEY را از https://console.groq.com/keys پر کنید
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

## شروع پروژه

در صفحه **خانه** عنوان و **شرح پروژه** را بنویسید — AI در همه مراحل Design Thinking از این متن context می‌گیرد. دکمه «بهبود شرح با AI» پیشنهاد بازنویسی می‌دهد.

## یادداشت Groq AI

کلید API از [Groq Console](https://console.groq.com/keys) در `.env.local` با نام `VITE_GROQ_API_KEY` قرار می‌گیرد. مدل پیش‌فرض `groq/compound-mini` است (جست‌وجوی وب و ابزارهای compound).

**هشدار:** کلید در باندل فرانت قرار می‌گیرد — فقط برای ابزار داخلی/دمو مناسب است؛ برای پروداکشن عمومی بهتر است پروکسی سرور-side داشته باشید.
