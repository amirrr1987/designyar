import type { DesignThinkingStepKey } from '@/constants/design-thinking-steps'

export interface MicroFormMeta {
  key: string
  title: string
  hint: string
  aiAssistLabel: string
}

const AI_ASSIST = 'بهبود با AI'

function form(
  key: string,
  title: string,
  hint: string,
): MicroFormMeta {
  return { key, title, hint, aiAssistLabel: AI_ASSIST }
}

export const FORM_REGISTRY: Record<DesignThinkingStepKey, readonly MicroFormMeta[]> = {
  empathize: [
    form(
      'research-goal',
      'هدف پژوهش',
      'در یک جمله بنویس می‌خواهی دربارهٔ کاربر چه بفهمی. فکر انسان‌محور؛ فرض‌هایت را بعداً اصلاح کن.',
    ),
    form(
      'persona',
      'پرسونا',
      'Mini Persona: نقش، هدف، درد، علاقه، ترس و کارهای روزمره — اول جمع کن، بعد قضاوت.',
    ),
    form(
      'empathy-map',
      'نقشه همدلی',
      'برای هر پرسونا بگو چه می‌گوید، فکر می‌کند، می‌کند و احساس می‌کند.',
    ),
    form(
      'research-notes',
      'یادداشت پژوهش',
      'برگهٔ مصاحبه: چه کسی، سؤال، پاسخ/مشاهده، بینش کلیدی. ۸۰٪ گوش بده.',
    ),
    form('competitors', 'رقبا', 'حداقل یک رقیب با یک نقطهٔ قوت و یک نقطهٔ ضعف ثبت کن.'),
  ],
  define: [
    form(
      'challenge',
      'تعریف چالش',
      'چطور می‌توانیم [کار] برای [شخص] تا [مسئله]؟ راه‌حل ضمنی نگذار.',
    ),
    form(
      'problem',
      'بیانیه مسئله',
      'چند پیش‌نویس بنویس؛ Challenge را راهنما بگیر، نه قفل سخت.',
    ),
    form(
      'pov',
      'جملهٔ دیدگاه',
      'کاربر + نیاز + دلیل — چند نسخه بنویس و بهترین را نگه دار.',
    ),
    form(
      'hmw',
      'سؤال‌های «چطور می‌توانیم»',
      'سؤال باز با «چطور می‌توانیم…» — کمیت مهم است؛ قضاوت را عقب بینداز.',
    ),
  ],
  ideate: [
    form(
      'brainstorm',
      'طوفان فکری',
      'اول کمیت؛ بعد با سه سؤال (اثر / زود / شدنی) یکی را منتخب کن. Yes, and…',
    ),
    form('userflow', 'مسیر کاربر', 'مراحل اصلی کار کاربر را به‌ترتیب بنویس.'),
    form('sitemap', 'نقشهٔ سایت', 'صفحات را مثل فهرست تو‌در‌تو بنویس.'),
    form('card-sort', 'مرتب‌سازی کارت‌ها', 'گروه‌ها را نام بگذار و آیتم‌های هر گروه را مشخص کن.'),
  ],
  prototype: [
    form(
      'colors',
      'پالت رنگ',
      'سه حالت ساخت پالت؛ در اصول رنگ فقط رنگ اصلی ویرایش می‌شود و بقیه از اصول ساخته می‌شوند.',
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
      'proto-checklist',
      'چک‌لیست پروتوتایپ',
      'قبل از اسکچ: عملکرد، مخاطب، فرض شکست، تست ارزان — فقط به اندازهٔ لازم بساز.',
    ),
    form(
      'wireframe',
      'اسکچ صفحه',
      'بلوک‌های صفحه را بچین؛ اسکچ سیمی زنده می‌شود. Show, don’t tell.',
    ),
  ],
  test: [
    form('contrast', 'کنتراست رنگ', 'رنگ متن و پس‌زمینه را وارد کن تا خوانایی بررسی شود.'),
    form(
      'wcag',
      'چک‌لیست دسترس‌پذیری',
      'موارد پایه را علامت بزن؛ رد کردن آزاد است.',
    ),
    form(
      'heuristics',
      'ارزیابی سریع کاربردپذیری',
      'ده نبض Nielsen را امتیاز بده؛ میانگین و نقاط ضعف را زنده ببین.',
    ),
    form(
      'feedback',
      'بازخورد تست',
      'I like / I wish / I give — دفاع نکن؛ کنجکاو باش. شکست در تست وجود ندارد.',
    ),
    form(
      'report',
      'گزارش نهایی',
      'خلاصهٔ یافته‌ها، کار بعدی با لینک، و خروجی Markdown/JSON برای تیم.',
    ),
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
