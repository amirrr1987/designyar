import type { DesignThinkingStepKey } from '@/constants/design-thinking-steps'

export interface MicroFormMeta {
  key: string
  title: string
  hint: string
  aiImproveLabel: string
  aiCompleteLabel: string
}

export const FORM_REGISTRY: Record<DesignThinkingStepKey, readonly MicroFormMeta[]> = {
  empathize: [
    {
      key: 'research-goal',
      title: 'هدف پژوهش',
      hint: 'یک جمله بنویس: چه چیزی را دربارهٔ کاربر می‌خواهی بفهمی؟',
      aiImproveLabel: 'بهبود با AI',
      aiCompleteLabel: 'تکمیل با AI',
    },
    {
      key: 'persona',
      title: 'پرسونا',
      hint: 'یک کاربر نماینده با نقش، هدف و درد تعریف کن.',
      aiImproveLabel: 'بهبود با AI',
      aiCompleteLabel: 'تکمیل با AI',
    },
    {
      key: 'empathy-map',
      title: 'نقشه همدلی',
      hint: 'بگو کاربر چه می‌گوید، فکر می‌کند، می‌کند و احساس می‌کند.',
      aiImproveLabel: 'بهبود با AI',
      aiCompleteLabel: 'تکمیل با AI',
    },
    {
      key: 'research-notes',
      title: 'یادداشت پژوهش',
      hint: 'نکات کلیدی مصاحبه یا مشاهده را کوتاه بنویس.',
      aiImproveLabel: 'بهبود با AI',
      aiCompleteLabel: 'تکمیل با AI',
    },
    {
      key: 'competitors',
      title: 'رقبا',
      hint: 'حداقل یک رقیب با نقطه قوت و ضعف ثبت کن.',
      aiImproveLabel: 'بهبود با AI',
      aiCompleteLabel: 'تکمیل با AI',
    },
  ],
  define: [
    {
      key: 'problem',
      title: 'بیانیه مسئله',
      hint: 'مسئله را از دید کاربر در یک پاراگراف کوتاه بنویس.',
      aiImproveLabel: 'بهبود با AI',
      aiCompleteLabel: 'تکمیل با AI',
    },
    {
      key: 'pov',
      title: 'نقطه نظر (POV)',
      hint: 'کاربر + نیاز + بینش را در یک جمله جمع کن.',
      aiImproveLabel: 'بهبود با AI',
      aiCompleteLabel: 'تکمیل با AI',
    },
    {
      key: 'hmw',
      title: 'سؤالات HMW',
      hint: 'چند سؤال «چطور می‌توانیم…» بنویس.',
      aiImproveLabel: 'بهبود با AI',
      aiCompleteLabel: 'تکمیل با AI',
    },
  ],
  ideate: [
    {
      key: 'brainstorm',
      title: 'طوفان فکری',
      hint: 'ایده‌ها را کوتاه و بدون سانسور فهرست کن.',
      aiImproveLabel: 'بهبود با AI',
      aiCompleteLabel: 'تکمیل با AI',
    },
    {
      key: 'userflow',
      title: 'جریان کاربر',
      hint: 'مراحل اصلی مسیر کاربر را پشت سر هم بنویس.',
      aiImproveLabel: 'بهبود با AI',
      aiCompleteLabel: 'تکمیل با AI',
    },
    {
      key: 'sitemap',
      title: 'سایت‌مپ',
      hint: 'ساختار صفحات را به‌صورت فهرست سلسله‌مراتبی بنویس.',
      aiImproveLabel: 'بهبود با AI',
      aiCompleteLabel: 'تکمیل با AI',
    },
    {
      key: 'card-sort',
      title: 'کارت‌سورت',
      hint: 'گروه‌ها و آیتم‌های هر گروه را مشخص کن.',
      aiImproveLabel: 'بهبود با AI',
      aiCompleteLabel: 'تکمیل با AI',
    },
  ],
  prototype: [
    {
      key: 'colors',
      title: 'پالت رنگ',
      hint: 'رنگ‌های اصلی را به‌صورت هگز وارد کن.',
      aiImproveLabel: 'بهبود با AI',
      aiCompleteLabel: 'تکمیل با AI',
    },
    {
      key: 'typography',
      title: 'تایپوگرافی',
      hint: 'اندازه پایه و مقیاس تایپ را تنظیم کن.',
      aiImproveLabel: 'بهبود با AI',
      aiCompleteLabel: 'تکمیل با AI',
    },
    {
      key: 'grid',
      title: 'گرید',
      hint: 'تعداد ستون و فاصلهٔ گاتر را مشخص کن.',
      aiImproveLabel: 'بهبود با AI',
      aiCompleteLabel: 'تکمیل با AI',
    },
    {
      key: 'spacing',
      title: 'فاصله‌گذاری',
      hint: 'پایهٔ ۸ نقطه‌ای فاصله را انتخاب کن.',
      aiImproveLabel: 'بهبود با AI',
      aiCompleteLabel: 'تکمیل با AI',
    },
    {
      key: 'wireframe',
      title: 'وایرفریم',
      hint: 'بلوک‌های صفحه و اولویت محتوا را یادداشت کن.',
      aiImproveLabel: 'بهبود با AI',
      aiCompleteLabel: 'تکمیل با AI',
    },
  ],
  test: [
    {
      key: 'contrast',
      title: 'کنتراست',
      hint: 'رنگ متن و پس‌زمینه را برای بررسی نسبت کنتراست وارد کن.',
      aiImproveLabel: 'بهبود با AI',
      aiCompleteLabel: 'تکمیل با AI',
    },
    {
      key: 'wcag',
      title: 'چک‌لیست WCAG',
      hint: 'موارد پایه دسترس‌پذیری را علامت بزن.',
      aiImproveLabel: 'بهبود با AI',
      aiCompleteLabel: 'تکمیل با AI',
    },
    {
      key: 'heuristics',
      title: 'ارزیابی هیوریستیک',
      hint: 'چند اصل نیلسن را امتیاز بده و یادداشت بگذار.',
      aiImproveLabel: 'بهبود با AI',
      aiCompleteLabel: 'تکمیل با AI',
    },
    {
      key: 'report',
      title: 'گزارش کاربردپذیری',
      hint: 'یافته‌ها و پیشنهادهای بعدی را خلاصه کن.',
      aiImproveLabel: 'بهبود با AI',
      aiCompleteLabel: 'تکمیل با AI',
    },
  ],
} as const

export function getFormsForPhase(phase: DesignThinkingStepKey): readonly MicroFormMeta[] {
  return FORM_REGISTRY[phase]
}

export function getFormMeta(
  phase: DesignThinkingStepKey,
  formKey: string,
): MicroFormMeta | undefined {
  return FORM_REGISTRY[phase].find((form) => form.key === formKey)
}

export function getDefaultFormKey(phase: DesignThinkingStepKey): string {
  const first = FORM_REGISTRY[phase][0]
  return first?.key ?? ''
}
