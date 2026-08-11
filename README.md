# دیزاین‌یار (`ui-ux-ai`)

اپلیکیشن **کلاینت‌ساید** فارسی RTL برای کمک به جونیور UI/UX در مسیر Design Thinking — یک کار در هر لحظه، AI اختیاری (Groq)، خروجی پروژهٔ منسجم.

**Stack:** Vue 3.5 · Pinia 4 · Vue Router 5 · ant-design-vue 4 · VueUse · Vite 8 · TypeScript strict

## راه‌اندازی

```sh
# pnpm (قفل پروژه)
pnpm install
cp .env.example .env.local
pnpm dev

# یا npm
npm install
cp .env.example .env.local
npm run dev
```

در `.env.local` مقدار `VITE_GROQ_API_KEY` را از [Groq Console](https://console.groq.com/keys) بگذارید.

## کیفیت (قبل از PR / استقرار)

```sh
pnpm run type-check   # یا: npm run type-check
pnpm run lint
pnpm run format
pnpm build            # type-check موازی + vite build → dist/
```

## استقرار استاتیک (SPA)

اپ backend ندارد. برای Vue Router باید همه مسیرها به `index.html` برگردند.

| میزبان | فایل |
|--------|------|
| Vercel | `vercel.json` (rewrite) |
| Netlify | `netlify.toml` + `public/_redirects` |
| GitHub Pages | بعد از build، `dist/`؛ برای ساب‌مسیر `base` در `vite.config.ts` را تنظیم کنید |

## مسیر محصول

1. **خانه** — نام و شرح پروژه  
2. **همدلی → تعریف → ایده‌پردازی → پروتوتایپ → تست** — با حالت ساده (جونیور) یا حرفه‌ای  
3. **جمع‌بندی** — یادداشت / تحلیل AI + **خروجی / ورود JSON** (فرمت v6)

داده در LocalStorage با سند واحد `ux-flow:v1` ذخیره می‌شود.

## یادداشت Groq AI

مدل پیش‌فرض `groq/compound-mini` است. کلید در باندل فرانت دیده می‌شود — فقط برای ابزار داخلی/دمو؛ برای پروداکشن عمومی پروکسی سرور-side توصیه می‌شود.
