import type { DesignStepKey, ExperienceMode } from '@/types/project'

export type { ExperienceMode }

export interface GlossaryTerm {
  term: string
  meaning: string
}

export interface PhaseJuniorGuide {
  /** One sentence: what to do first on this page. */
  startHere: string
  /** Short ordered checklist (2–4 items). */
  checklist: readonly string[]
  /** When the junior can move on. */
  doneWhen: string
  /** Persian explanations for jargon on this phase. */
  terms: readonly GlossaryTerm[]
}

export const PHASE_JUNIOR_GUIDES = {
  empathize: {
    startHere: 'اول یادداشت تحقیق را بنویسید؛ بعد یک پرسونا بسازید.',
    checklist: [
      'یادداشت تحقیق: کاربر چه می‌گوید و چه مشکلی دارد؟',
      'یک پرسونا از روی یادداشت بسازید',
      'اختیاری: نقشه همدلی و جدول رقبا',
    ],
    doneWhen: 'حداقل یک پرسونا و یادداشت تحقیق دارید.',
    terms: [
      { term: 'پرسونا', meaning: 'شخصیت فرضی یک کاربر واقعی — نام، هدف، درد.' },
      {
        term: 'نقشه همدلی',
        meaning: 'چه می‌گوید / فکر می‌کند / می‌کند / احساس می‌کند.',
      },
    ],
  },
  define: {
    startHere: 'مسئله را در سه قسمت پر کنید؛ جملهٔ نهایی را بخوانید.',
    checklist: [
      'بیان مسئله را کامل کنید',
      'دیدگاه کاربر را از مسئله بسازید',
      '۲–۳ سوال «چگونه می‌توانیم…» بنویسید',
    ],
    doneWhen: 'مسئله + دیدگاه + حداقل یک سوال دارید.',
    terms: [
      {
        term: 'دیدگاه کاربر (POV)',
        meaning: 'جملهٔ «کاربر X به Y نیاز دارد چون Z».',
      },
      {
        term: 'چگونه می‌توانیم (HMW)',
        meaning: 'سوال باز برای ایده‌پردازی، نه راه‌حل آماده.',
      },
    ],
  },
  ideate: {
    startHere: 'اول ایده‌ها را روی تخته بنویسید؛ بعد جریان کاربر را بکشید.',
    checklist: [
      'چند ایده از روی سوالات «چگونه می‌توانیم…» بنویسید',
      'جریان کاربر را برای بهترین ایده بسازید',
      'اختیاری: نقشه سایت و مرتب‌سازی کارت',
    ],
    doneWhen: 'حداقل چند ایده و یک جریان کاربر دارید.',
    terms: [
      { term: 'جریان کاربر', meaning: 'مراحل پشت‌سرهم که کاربر طی می‌کند.' },
      { term: 'نقشه سایت', meaning: 'ساختار صفحات و بخش‌های محصول.' },
    ],
  },
  prototype: {
    startHere: 'رنگ اصلی را انتخاب کنید؛ بعد بلوک‌های وایرفریم را بچینید.',
    checklist: [
      'رنگ اصلی و تاکیدی را انتخاب کنید',
      'چیدمان وایرفریم صفحه را مشخص کنید',
      'اختیاری: تایپ، فاصله، گرید، میکروکپی',
    ],
    doneWhen: 'پالت رنگ و وایرفریم اولیه آماده است.',
    terms: [
      { term: 'وایرفریم', meaning: 'اسکلت صفحه بدون جزئیات بصری نهایی.' },
      { term: 'میکروکپی', meaning: 'متن‌های کوتاه UI مثل دکمه و پیام خطا.' },
    ],
  },
  test: {
    startHere: 'کنتراست رنگ‌ها را چک کنید؛ بعد چک‌لیست دسترسی‌پذیری را مرور کنید.',
    checklist: [
      'کنتراست متن و پس‌زمینه را بسنجید',
      'موارد مهم چک‌لیست دسترسی را علامت بزنید',
      'خلاصه یافته‌ها را در گزارش بنویسید',
    ],
    doneWhen: 'کنتراست و بخشی از چک‌لیست + خلاصه گزارش دارید.',
    terms: [
      {
        term: 'دسترسی‌پذیری (WCAG)',
        meaning: 'قوانین خوانایی و استفاده برای همه کاربران.',
      },
      {
        term: 'هیوریستیک',
        meaning: 'قوانین سرانگشتی کاربردپذیری (مثل بازخورد سیستم).',
      },
    ],
  },
} as const satisfies Record<DesignStepKey, PhaseJuniorGuide>

export function getPhaseJuniorGuide(key: DesignStepKey): PhaseJuniorGuide {
  return PHASE_JUNIOR_GUIDES[key]
}

/** Default tab when opening a phase in junior mode. */
export const JUNIOR_DEFAULT_TAB = {
  empathize: 'notes',
  ideate: 'brainstorm',
  prototype: 'color',
  test: 'contrast',
} as const

/** Tabs shown by default in junior mode (rest behind «ابزارهای بیشتر»). */
export const JUNIOR_ESSENTIAL_TABS = {
  empathize: ['notes', 'personas'] as const,
  ideate: ['brainstorm', 'userflow'] as const,
  prototype: ['color', 'wireframe', 'type'] as const,
  test: ['contrast', 'wcag', 'report'] as const,
} as const
