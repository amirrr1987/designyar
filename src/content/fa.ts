import type { DesignStepKey, ExperienceMode } from '@/types/project'

/** Glossary entry — Persian-first; English only as optional gloss. */
export interface GlossaryTerm {
  id: string
  /** Persian label shown in junior UI */
  labelFa: string
  /** Optional English acronym / term in parentheses once */
  glossEn?: string
  definition: string
}

export interface PhaseCopy {
  key: DesignStepKey
  /** Short badge: مرحله N از ۵ */
  badge: string
  title: string
  titleJunior: string
  description: string
  descriptionJunior: string
  /** Definition of done for the phase */
  definitionOfDone: string
  whyItMatters: string
}

export interface JobCopy {
  id: string
  title: string
  why: string
  emptyHint: string
  aiAssistLabel?: string
}

const glossary: readonly GlossaryTerm[] = [
  {
    id: 'empathy-map',
    labelFa: 'نقشه همدلی',
    glossEn: 'Empathy Map',
    definition: 'چه می‌گوید، فکر می‌کند، می‌کند و احساس می‌کند — برای درک عمیق کاربر.',
  },
  {
    id: 'persona',
    labelFa: 'پرسونا',
    definition: 'نمایه‌ای از کاربر هدف با اهداف و دردها.',
  },
  {
    id: 'pov',
    labelFa: 'دیدگاه کاربر',
    glossEn: 'POV',
    definition: 'جملهٔ کاربر + نیاز + بینش؛ لنز مسئله.',
  },
  {
    id: 'hmw',
    labelFa: 'چگونه می‌توانیم',
    glossEn: 'HMW',
    definition: 'سؤال‌هایی که مسئله را به فرصت ایده تبدیل می‌کنند.',
  },
  {
    id: 'wcag',
    labelFa: 'دسترسی‌پذیری',
    glossEn: 'WCAG',
    definition: 'راهنمای بین‌المللی برای قابل‌استفاده بودن برای همه.',
  },
  {
    id: 'heuristic',
    labelFa: 'ارزیابی اکتشافی',
    definition: 'بررسی رابط با ده اصل کاربردپذیری نیلسن.',
  },
  {
    id: 'userflow',
    labelFa: 'مسیر کاربر',
    definition: 'گام‌به‌گام کاری که کاربر برای رسیدن به هدف انجام می‌دهد.',
  },
] as const

const phases: Record<DesignStepKey, PhaseCopy> = {
  empathize: {
    key: 'empathize',
    badge: 'مرحله ۱ از ۵',
    title: 'همدلی',
    titleJunior: 'شناخت کاربر',
    description: 'تحقیق، پرسونا، نقشه همدلی و رقبا.',
    descriptionJunior: 'یادداشت تحقیق و ساختن حداقل یک پرسونا.',
    definitionOfDone: 'تمام وقتی که یادداشت تحقیق و حداقل یک پرسونا داری.',
    whyItMatters: 'بدون شناخت کاربر، بقیهٔ مراحل حدس است.',
  },
  define: {
    key: 'define',
    badge: 'مرحله ۲ از ۵',
    title: 'تعریف مسئله',
    titleJunior: 'صورت‌بندی مسئله',
    description: 'بیان مسئله، دیدگاه کاربر و سؤال‌های چگونه می‌توانیم.',
    descriptionJunior: 'مسئله → دیدگاه کاربر → چند سؤال «چگونه می‌توانیم».',
    definitionOfDone: 'تمام وقتی که مسئله، دیدگاه کاربر و حداقل یک HMW داری.',
    whyItMatters: 'مسئلهٔ دقیق، ایده‌های مفید می‌سازد.',
  },
  ideate: {
    key: 'ideate',
    badge: 'مرحله ۳ از ۵',
    title: 'ایده‌پردازی',
    titleJunior: 'تولید ایده',
    description: 'طوفان فکری، مسیر کاربر، نقشه سایت و مرتب‌سازی کارت.',
    descriptionJunior: 'حداقل سه ایده و یک مسیر کاربر ساده.',
    definitionOfDone: 'تمام وقتی که حداقل ۳ ایده و یک مسیر کاربر داری.',
    whyItMatters: 'گزینه‌های زیاد قبل از قفل شدن روی یک راه‌حل.',
  },
  prototype: {
    key: 'prototype',
    badge: 'مرحله ۴ از ۵',
    title: 'پروتوتایپ',
    titleJunior: 'نمونه و ظاهر',
    description: 'رنگ، تایپ، گرید، فاصله، وایرفریم، چک‌لیست و متن UI.',
    descriptionJunior: 'پالت رنگ، تایپ پایه و اسکلت وایرفریم.',
    definitionOfDone: 'تمام وقتی که رنگ‌ها و اسکلت صفحه را مشخص کرده‌ای.',
    whyItMatters: 'ایده را قابل‌دیدن و قابل‌آزمایش می‌کند.',
  },
  test: {
    key: 'test',
    badge: 'مرحله ۵ از ۵',
    title: 'تست',
    titleJunior: 'بررسی کیفیت',
    description: 'کنتراست، دسترسی‌پذیری، ارزیابی اکتشافی و گزارش.',
    descriptionJunior: 'کنتراست رنگ، چک‌لیست دسترسی و یک یادداشت گزارش.',
    definitionOfDone: 'تمام وقتی که کنتراست را چک کرده و یادداشت گزارش داری.',
    whyItMatters: 'قبل از ساخت نهایی، مشکلات را ارزان پیدا می‌کنی.',
  },
}

const jobs: Record<string, JobCopy> = {
  'home.brief': {
    id: 'home.brief',
    title: 'نام و شرح پروژه را بنویس',
    why: 'همهٔ مراحل و کمک AI از همین شرح شروع می‌شوند.',
    emptyHint: 'عنوان کوتاه + دو سه جمله دربارهٔ محصول و کاربر.',
    aiAssistLabel: 'بهبود شرح با AI',
  },
  'empathize.notes': {
    id: 'empathize.notes',
    title: 'یادداشت تحقیق را پر کن',
    why: 'مشاهدات خام، پایهٔ پرسونا و مسئله‌اند.',
    emptyHint: 'مصاحبه، مشاهده یا فرضیه‌هایت را بنویس.',
    aiAssistLabel: 'پیشنهاد اسکلت یادداشت',
  },
  'empathize.persona': {
    id: 'empathize.persona',
    title: 'حداقل یک پرسونا بساز',
    why: 'طراحی بدون چهرهٔ کاربر مبهم می‌ماند.',
    emptyHint: 'نام، نقش، اهداف و دردها.',
    aiAssistLabel: 'پیشنهاد پرسونا',
  },
  'define.problem': {
    id: 'define.problem',
    title: 'بیان مسئله را کامل کن',
    why: 'یک جملهٔ شفاف مرز مسئله را مشخص می‌کند.',
    emptyHint: 'کاربر / نیاز / بینش.',
  },
  'define.pov': {
    id: 'define.pov',
    title: 'دیدگاه کاربر را بنویس',
    why: 'لنز همدلانه برای ایده‌پردازی.',
    emptyHint: 'کاربر نیاز دارد که… چون…',
  },
  'define.hmw': {
    id: 'define.hmw',
    title: 'حداقل یک «چگونه می‌توانیم» اضافه کن',
    why: 'مسئله را به فرصت ایده تبدیل می‌کند.',
    emptyHint: 'چگونه می‌توانیم …؟',
  },
  'ideate.brainstorm': {
    id: 'ideate.brainstorm',
    title: 'حداقل سه ایده بنویس',
    why: 'کمیت قبل از کیفیت — بعد رأی بده.',
    emptyHint: 'عنوان کوتاه + یک جمله توضیح.',
    aiAssistLabel: 'پیشنهاد ایده',
  },
  'ideate.userflow': {
    id: 'ideate.userflow',
    title: 'یک مسیر کاربر ساده بساز',
    why: 'ایده را به گام‌های قابل‌ساخت تبدیل می‌کند.',
    emptyHint: 'شروع → اقدام‌ها → پایان.',
  },
  'prototype.color': {
    id: 'prototype.color',
    title: 'پالت رنگ را تنظیم کن',
    why: 'هویت بصری و کنتراست از اینجا شروع می‌شود.',
    emptyHint: 'رنگ اصلی و تأکیدی را انتخاب کن.',
  },
  'prototype.wireframe': {
    id: 'prototype.wireframe',
    title: 'اسکلت وایرفریم را بچین',
    why: 'قبل از جزئیات UI، ساختار صفحه را ثابت کن.',
    emptyHint: 'بلوک‌های هدر، محتوا، فوتر…',
  },
  'prototype.type': {
    id: 'prototype.type',
    title: 'مقیاس تایپ را تنظیم کن',
    why: 'خوانایی و سلسله‌مراتب متن.',
    emptyHint: 'اندازه پایه و نسبت مقیاس.',
  },
  'test.contrast': {
    id: 'test.contrast',
    title: 'کنتراست رنگ را بررسی کن',
    why: 'متن ناخوانا تجربه را خراب می‌کند.',
    emptyHint: 'رنگ متن و پس‌زمینه را بسنج.',
  },
  'test.wcag': {
    id: 'test.wcag',
    title: 'چک‌لیست دسترسی را مرور کن',
    why: 'حداقل استاندارد برای همهٔ کاربران.',
    emptyHint: 'موارد ضروری را تیک بزن.',
  },
  'test.report': {
    id: 'test.report',
    title: 'یک یادداشت گزارش بنویس',
    why: 'یادگیری مرحله را برای جمع‌بندی نگه می‌دارد.',
    emptyHint: 'چه چیزی خوب بود؟ چه چیزی را اصلاح می‌کنی؟',
  },
  'synthesis.wrap': {
    id: 'synthesis.wrap',
    title: 'جمع‌بندی پروژه را مرور کن',
    why: 'یک روایت منسجم از کل مسیر Design Thinking.',
    emptyHint: 'وقتی مراحل اصلی پر شدند، اینجا جمع‌بندی کن.',
  },
}

const empathizeTools = {
  notes: {
    title: 'یادداشت تحقیق',
    alertMessage: 'چه دیدی؟ چه شنیدی؟',
    alertDescription:
      'مصاحبه، مشاهده یا فرضیه‌ات را بنویس. بعداً از همین متن پرسونا می‌سازی.',
    placeholder: `نمونه ساختار:
• نقل‌قول کاربر: «…»
• مشاهده رفتار: …
• فرضیه / فرصت: …
• سوال باز بعدی: …`,
    analyzeLabel: 'تحلیل این یادداشت',
  },
  persona: {
    title: 'پرسونا',
    formTitle: 'ساخت پرسونا',
    listTitle: 'پرسوناهای پروژه',
    emptyList: 'هنوز پرسونایی نداری — از قالب یا فرم بساز.',
    templateHint: 'از قالب شروع کن (سریع)، بعد جزئیات را عوض کن.',
    quickAdd: 'افزودن سریع',
    aiLabel: 'پیشنهاد پرسونا با AI',
    name: 'نام',
    role: 'نقش / شغل',
    age: 'سن (اختیاری)',
    goals: 'اهداف',
    pains: 'دردها و موانع',
    bio: 'بیوگرافی کوتاه (اختیاری)',
    avatar: 'رنگ آواتار',
    submit: 'افزودن پرسونا',
    reset: 'پاک کردن فرم',
  },
  empathyMap: {
    alertMessage: 'اختیاری — نقشه همدلی',
    alertDescription:
      'چهار خانه: می‌گوید، فکر می‌کند، انجام می‌دهد، احساس می‌کند. اول پرسونا داشته باش.',
    linkPersona: 'مرتبط با پرسونا',
    autoSave: 'تغییرات خودکار ذخیره می‌شوند.',
    cells: {
      says: { title: 'می‌گوید', placeholder: 'چیزی که با صدای بلند می‌گوید…' },
      thinks: { title: 'فکر می‌کند', placeholder: 'چیزی که در ذهن دارد ولی نمی‌گوید…' },
      does: { title: 'انجام می‌دهد', placeholder: 'رفتار و اقدامات واقعی…' },
      feels: { title: 'احساس می‌کند', placeholder: 'احساسات و نگرانی‌ها…' },
    },
  },
  competitors: {
    alertMessage: 'اختیاری — جدول رقبا',
    alertDescription: 'چند رقیب با نقطه قوت و ضعف کافی است؛ لازم نیست کامل باشد.',
  },
} as const

export const fa = {
  brand: 'دیزاین‌یار',
  tagline: 'در هر لحظه فقط یک کار درست را می‌بینی؛ AI کمکت می‌کند؛ در پایان یک پروژهٔ منسجم داری.',
  modes: {
    junior: 'حالت ساده',
    full: 'حالت حرفه‌ای',
  } satisfies Record<ExperienceMode, string>,
  optionalLabel: 'اختیاری',
  moreTools: 'ابزارهای بیشتر',
  moreAi: 'ابزارهای بیشتر AI',
  softGateTitle: 'پیشنهاد مسیر',
  softGateBody: (recommended: string) =>
    `پیشنهاد می‌کنیم اول «${recommended}» را تمام کنی؛ بعد به این مرحله بیایی.`,
  softGateSkip: 'رد کردن و ادامه',
  softGateGo: 'برو به مرحلهٔ پیشنهادی',
  prev: 'قبلی',
  next: 'بعدی',
  primaryCtaHome: 'شروع / ادامه کار پیشنهادی',
  whyHeading: 'چرا این مهم است؟',
  dodHeading: 'تمام وقتی که…',
  glossary,
  phases,
  jobs,
  empathizeTools,
  getPhase(key: DesignStepKey, _mode: ExperienceMode): PhaseCopy {
    return phases[key]
  },
  phaseTitle(key: DesignStepKey, mode: ExperienceMode): string {
    const p = phases[key]
    return mode === 'junior' ? p.titleJunior : p.title
  },
  phaseDescription(key: DesignStepKey, mode: ExperienceMode): string {
    const p = phases[key]
    return mode === 'junior' ? p.descriptionJunior : p.description
  },
  getJob(id: string): JobCopy | undefined {
    return jobs[id]
  },
  getGlossary(id: string): GlossaryTerm | undefined {
    return glossary.find((g) => g.id === id)
  },
} as const

export type FaContent = typeof fa
