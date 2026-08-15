import type { DesignThinkingStepKey } from '@/constants/design-thinking-steps'

export interface MicroFormMeta {
  key: string
  title: string
  hint: string
  aiImproveLabel: string
  aiCompleteLabel: string
}

const AI_IMPROVE = 'بهبود با هوش مصنوعی'
const AI_COMPLETE = 'تکمیل با هوش مصنوعی'

export const FORM_REGISTRY: Record<DesignThinkingStepKey, readonly MicroFormMeta[]> = {
  empathize: [
    {
      key: 'research-goal',
      title: 'هدف پژوهش',
      hint: 'در یک جمله بنویس می‌خواهی دربارهٔ کاربر چه چیزی را بفهمی.',
      aiImproveLabel: AI_IMPROVE,
      aiCompleteLabel: AI_COMPLETE,
    },
    {
      key: 'persona',
      title: 'پرسونا',
      hint: 'یک کاربر نمونه با نقش، هدف و مانع اصلی تعریف کن.',
      aiImproveLabel: AI_IMPROVE,
      aiCompleteLabel: AI_COMPLETE,
    },
    {
      key: 'empathy-map',
      title: 'نقشه همدلی',
      hint: 'بنویس کاربر چه می‌گوید، چه فکر می‌کند، چه می‌کند و چه احساسی دارد.',
      aiImproveLabel: AI_IMPROVE,
      aiCompleteLabel: AI_COMPLETE,
    },
    {
      key: 'research-notes',
      title: 'یادداشت پژوهش',
      hint: 'نکات مهم مصاحبه یا مشاهده را کوتاه و واضح بنویس.',
      aiImproveLabel: AI_IMPROVE,
      aiCompleteLabel: AI_COMPLETE,
    },
    {
      key: 'competitors',
      title: 'رقبا',
      hint: 'حداقل یک رقیب با یک نقطهٔ قوت و یک نقطهٔ ضعف ثبت کن.',
      aiImproveLabel: AI_IMPROVE,
      aiCompleteLabel: AI_COMPLETE,
    },
  ],
  define: [
    {
      key: 'problem',
      title: 'بیانیه مسئله',
      hint: 'مسئله را از نگاه کاربر در چند خط کوتاه بنویس.',
      aiImproveLabel: AI_IMPROVE,
      aiCompleteLabel: AI_COMPLETE,
    },
    {
      key: 'pov',
      title: 'جملهٔ دیدگاه',
      hint: 'کاربر + نیاز + دلیل را در یک جمله جمع کن.',
      aiImproveLabel: AI_IMPROVE,
      aiCompleteLabel: AI_COMPLETE,
    },
    {
      key: 'hmw',
      title: 'سؤال‌های «چطور می‌توانیم»',
      hint: 'چند سؤال باز با شروع «چطور می‌توانیم…» بنویس.',
      aiImproveLabel: AI_IMPROVE,
      aiCompleteLabel: AI_COMPLETE,
    },
  ],
  ideate: [
    {
      key: 'brainstorm',
      title: 'طوفان فکری',
      hint: 'ایده‌ها را کوتاه بنویس؛ فعلاً قضاوت نکن.',
      aiImproveLabel: AI_IMPROVE,
      aiCompleteLabel: AI_COMPLETE,
    },
    {
      key: 'userflow',
      title: 'مسیر کاربر',
      hint: 'مراحل اصلی کار کاربر را به‌ترتیب بنویس.',
      aiImproveLabel: AI_IMPROVE,
      aiCompleteLabel: AI_COMPLETE,
    },
    {
      key: 'sitemap',
      title: 'نقشهٔ سایت',
      hint: 'صفحات را مثل فهرست تو‌در‌تو بنویس.',
      aiImproveLabel: AI_IMPROVE,
      aiCompleteLabel: AI_COMPLETE,
    },
    {
      key: 'card-sort',
      title: 'مرتب‌سازی کارت‌ها',
      hint: 'گروه‌ها را نام بگذار و آیتم‌های هر گروه را مشخص کن.',
      aiImproveLabel: AI_IMPROVE,
      aiCompleteLabel: AI_COMPLETE,
    },
  ],
  prototype: [
    {
      key: 'colors',
      title: 'پالت رنگ',
      hint: 'رنگ‌های اصلی را با کد هگز وارد کن (مثل #1677ff).',
      aiImproveLabel: AI_IMPROVE,
      aiCompleteLabel: AI_COMPLETE,
    },
    {
      key: 'typography',
      title: 'اندازهٔ نوشته',
      hint: 'اندازهٔ پایه و نسبت بزرگ‌شدن تیترها را تنظیم کن.',
      aiImproveLabel: AI_IMPROVE,
      aiCompleteLabel: AI_COMPLETE,
    },
    {
      key: 'grid',
      title: 'شبکهٔ صفحه',
      hint: 'تعداد ستون و فاصلهٔ بین ستون‌ها را مشخص کن.',
      aiImproveLabel: AI_IMPROVE,
      aiCompleteLabel: AI_COMPLETE,
    },
    {
      key: 'spacing',
      title: 'فاصله‌گذاری',
      hint: 'واحد پایهٔ فاصله (معمولاً ۸ پیکسل) را انتخاب کن.',
      aiImproveLabel: AI_IMPROVE,
      aiCompleteLabel: AI_COMPLETE,
    },
    {
      key: 'wireframe',
      title: 'اسکچ صفحه',
      hint: 'بلوک‌های مهم صفحه و اولویت محتوا را یادداشت کن.',
      aiImproveLabel: AI_IMPROVE,
      aiCompleteLabel: AI_COMPLETE,
    },
  ],
  test: [
    {
      key: 'contrast',
      title: 'کنتراست رنگ',
      hint: 'رنگ متن و پس‌زمینه را وارد کن تا خوانایی بررسی شود.',
      aiImproveLabel: AI_IMPROVE,
      aiCompleteLabel: AI_COMPLETE,
    },
    {
      key: 'wcag',
      title: 'چک‌لیست دسترس‌پذیری',
      hint: 'موارد پایهٔ دسترس‌پذیری را علامت بزن؛ رد کردن آزاد است.',
      aiImproveLabel: AI_IMPROVE,
      aiCompleteLabel: AI_COMPLETE,
    },
    {
      key: 'heuristics',
      title: 'ارزیابی سریع کاربردپذیری',
      hint: 'چند اصل رایج را امتیاز بده و یک یادداشت کوتاه بنویس.',
      aiImproveLabel: AI_IMPROVE,
      aiCompleteLabel: AI_COMPLETE,
    },
    {
      key: 'report',
      title: 'گزارش نهایی',
      hint: 'یافته‌ها و کار بعدی را در چند پاراگراف خلاصه کن.',
      aiImproveLabel: AI_IMPROVE,
      aiCompleteLabel: AI_COMPLETE,
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
