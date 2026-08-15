import type { DesignThinkingStepKey } from '@/constants/design-thinking-steps'

export interface MicroFormMeta {
  key: string
  title: string
  hint: string
  aiAssistLabel: string
}

const AI_ASSIST = 'کمک هوش مصنوعی'

function form(
  key: string,
  title: string,
  hint: string,
): MicroFormMeta {
  return { key, title, hint, aiAssistLabel: AI_ASSIST }
}

export const FORM_REGISTRY: Record<DesignThinkingStepKey, readonly MicroFormMeta[]> = {
  empathize: [
    form('research-goal', 'هدف پژوهش', 'در یک جمله بنویس می‌خواهی دربارهٔ کاربر چه چیزی را بفهمی.'),
    form('persona', 'پرسونا', 'چند پرسونای نماینده بساز؛ برای هر کدام نقش، هدف و مانع بنویس.'),
    form(
      'empathy-map',
      'نقشه همدلی',
      'برای هر پرسونا (یا گروه کاربری) یک نقشه همدلی جدا بساز.',
    ),
    form(
      'research-notes',
      'یادداشت پژوهش',
      'هر نکتهٔ مصاحبه یا مشاهده را جدا بنویس؛ می‌توانی چند یادداشت داشته باشی.',
    ),
    form('competitors', 'رقبا', 'حداقل یک رقیب با یک نقطهٔ قوت و یک نقطهٔ ضعف ثبت کن.'),
  ],
  define: [
    form(
      'problem',
      'بیانیه مسئله',
      'چند پیش‌نویس بیانیه مسئله بنویس و بعد بهترین را انتخاب کن.',
    ),
    form(
      'pov',
      'جملهٔ دیدگاه',
      'چند جملهٔ دیدگاه (کاربر + نیاز + دلیل) بنویس؛ می‌توانی برای هر پرسونا یکی داشته باشی.',
    ),
    form('hmw', 'سؤال‌های «چطور می‌توانیم»', 'چند سؤال باز با شروع «چطور می‌توانیم…» بنویس.'),
  ],
  ideate: [
    form('brainstorm', 'طوفان فکری', 'ایده‌ها را کوتاه بنویس؛ فعلاً قضاوت نکن.'),
    form('userflow', 'مسیر کاربر', 'مراحل اصلی کار کاربر را به‌ترتیب بنویس.'),
    form('sitemap', 'نقشهٔ سایت', 'صفحات را مثل فهرست تو‌در‌تو بنویس.'),
    form('card-sort', 'مرتب‌سازی کارت‌ها', 'گروه‌ها را نام بگذار و آیتم‌های هر گروه را مشخص کن.'),
  ],
  prototype: [
    form(
      'colors',
      'پالت رنگ',
      'سه حالت ساخت پالت؛ در اصول رنگ فقط رنگ اصلی ویرایش می‌شود و با تعویض طرح، بقیه فوری ساخته می‌شوند.',
    ),
    form(
      'typography',
      'اندازهٔ نوشته',
      'اندازه پایه و نسبت مقیاس را تنظیم کن و نردبان تایپ را زنده ببین.',
    ),
    form(
      'grid',
      'شبکهٔ صفحه',
      'تعداد ستون و فاصله را انتخاب کن؛ شبکه روی صفحه پیش‌نمایش می‌شود.',
    ),
    form(
      'spacing',
      'فاصله‌گذاری',
      'واحد پایه فاصله را انتخاب کن و مقیاس فاصله را حس کن.',
    ),
    form(
      'wireframe',
      'اسکچ صفحه',
      'بلوک‌های صفحه (هیرو، محتوا، فراخوان…) را بچین؛ اسکچ سیمی زنده می‌شود.',
    ),
  ],
  test: [
    form('contrast', 'کنتراست رنگ', 'رنگ متن و پس‌زمینه را وارد کن تا خوانایی بررسی شود.'),
    form(
      'wcag',
      'چک‌لیست دسترس‌پذیری',
      'موارد پایهٔ دسترس‌پذیری را علامت بزن؛ رد کردن آزاد است.',
    ),
    form(
      'heuristics',
      'ارزیابی سریع کاربردپذیری',
      'ده نبض Nielsen را با سؤال سریع امتیاز بده؛ میانگین و نقاط ضعف را زنده ببین.',
    ),
    form('report', 'گزارش نهایی', 'یافته‌ها و کار بعدی را در چند پاراگراف خلاصه کن.'),
  ],
} as const

export function getFormsForPhase(phase: DesignThinkingStepKey): readonly MicroFormMeta[] {
  return FORM_REGISTRY[phase]
}

export function getFormMeta(
  phase: DesignThinkingStepKey,
  formKey: string,
): MicroFormMeta | undefined {
  return FORM_REGISTRY[phase].find((item) => item.key === formKey)
}

export function getDefaultFormKey(phase: DesignThinkingStepKey): string {
  const first = FORM_REGISTRY[phase][0]
  return first?.key ?? ''
}
