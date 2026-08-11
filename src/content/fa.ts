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
  defineTools: {
    problem: {
      stepTitle: '۱. بیان مسئله',
      why: 'مسئله را در سه تکه بنویس تا همه یک زبان داشته باشید.',
      user: 'کاربر (چه کسی؟)',
      need: 'نیاز (چه می‌خواهد؟)',
      insight: 'بینش (چرا مهم است؟)',
      userPh: 'مثلاً خریدار جوان آنلاین',
      needPh: 'مثلاً مقایسه سریع قیمت و تحویل مطمئن',
      insightPh: 'مثلاً وقت کمی دارد و به اطلاعات ناقص اعتماد نمی‌کند',
      previewReady: 'پیش‌نمایش جمله مسئله',
      previewEmpty: 'با پر کردن فیلدها، جمله مسئله اینجا ساخته می‌شود.',
      aiLabel: 'پیشنهاد بیان مسئله با AI',
    },
    pov: {
      stepTitle: '۲. دیدگاه کاربر',
      stepTitleFull: '۲. دیدگاه کاربر (POV)',
      why: 'همان مسئله را از لنز همدلانه کاربر بنویس.',
      persona: 'پرسونا (اختیاری)',
      personaPh: 'اتصال به پرسونا',
      copyFromProblem: 'کپی از بیان مسئله',
      user: 'کاربر',
      need: 'نیاز دارد که…',
      insight: 'چون…',
      previewReady: 'پیش‌نمایش دیدگاه کاربر',
      previewEmpty: 'با پر کردن فیلدها یا انتخاب پرسونا، جمله ساخته می‌شود.',
      aiLabel: 'پیشنهاد دیدگاه کاربر با AI',
    },
    hmw: {
      stepTitle: '۳. سوالات «چگونه می‌توانیم…»',
      stepTitleFull: '۳. سوالات How Might We',
      why: 'مسئله را به فرصت ایده تبدیل کن — حداقل یک سوال.',
      placeholder: 'مثلاً خرید را برای والدین پرمشغله ساده‌تر کنیم',
      add: 'افزودن سوال',
      empty: 'هنوز سوالی نداری — یک سوال باز بنویس.',
      aiLabel: 'پیشنهاد سوالات با AI',
      vote: 'رأی',
    },
    currentJob: 'کار فعلی',
    doneStep: 'انجام شد',
  } as const,
  ideateTools: {
    brainstorm: {
      tab: '۱. طوفان فکری',
      why: 'اول کمیت، بعد کیفیت — حداقل ۳ ایده از سوالات «چگونه می‌توانیم».',
      newIdea: 'ایده جدید',
      empty: 'هنوز ایده‌ای نداری — یکی بنویس یا از AI کمک بگیر.',
      aiLabel: 'پیشنهاد ایده با AI',
      modalTitle: 'افزودن ایده',
      title: 'عنوان',
      detail: 'جزئیات',
      tags: 'برچسب‌ها (با ویرگول)',
      tagsPh: 'مثلاً موبایل، سرعت، اعتماد',
      vote: 'رأی',
      goalHint: 'هدف جونیور: حداقل ۳ ایده',
    },
    userflow: {
      tab: '۲. مسیر کاربر',
      why: 'گام‌به‌گام کاری که کاربر برای رسیدن به هدف انجام می‌دهد.',
      aiLabel: 'پیشنهاد مسیر با AI',
      addStep: 'افزودن گام',
      empty: 'هنوز مسیری نداری — از شروع تا پایان چند گام بساز.',
      labelPh: 'مثلاً ورود به صفحه محصول',
      goalHint: 'هدف جونیور: حداقل ۲ گام (مثلاً شروع + اقدام)',
      nextConnected: '→ گام بعدی متصل است',
    },
    sitemap: {
      alertMessage: 'اختیاری — نقشه سایت',
      alertDescription: 'ساختار صفحات محصول؛ بعد از مسیر کاربر مفید است.',
    },
    cardsort: {
      alertMessage: 'اختیاری — مرتب‌سازی کارت',
      alertDescription: 'کارت‌ها را در دسته‌ها بچین تا اولویت محتوا روشن شود.',
    },
  } as const,
  prototypeTools: {
    color: {
      tab: '۱. رنگ',
      why: 'رنگ اصلی هویت بصری و کنتراست را می‌سازد.',
      primaryTitle: 'رنگ اصلی',
      accentTitle: 'رنگ تأکیدی',
      seedPh: '#1677ff',
      accentPh: '#faad14',
      generate: 'ساخت و ذخیره',
      applyQuick: 'اعمال سریع',
      generateAccent: 'ساخت رنگ تأکیدی',
      rampHint: '۱۰ پله رنگ از بذر — برای دکمه‌ها و پس‌زمینه.',
      aiLabel: 'بازبینی پالت با AI',
      presetsHint: 'یا از رنگ‌های پیشنهادی شروع کن',
    },
    wireframe: {
      tab: '۲. وایرفریم',
      why: 'قبل از جزئیات UI، اسکلت صفحه را ثابت کن.',
      hint: 'بلوک‌های ساختاری را انتخاب کن — فقط چیدمان، بدون استایل.',
      selectedTitle: 'چینش انتخاب‌شده',
      empty: 'هیچ بلوکی انتخاب نشده',
      aiSuggest: 'پیشنهاد چیدمان با AI',
      aiCritique: 'نقد وایرفریم با AI',
      goalHint: 'حداقل ۲ بلوک انتخاب کن',
    },
    type: {
      tab: '۳. تایپوگرافی',
      why: 'اندازه پایه و نسبت مقیاس، خوانایی را می‌سازند.',
      baseSize: 'اندازه پایه (px)',
      ratio: 'نسبت مقیاس',
      font: 'فونت',
      preview: 'پیش‌نمایش',
      aiLabel: 'بازبینی تایپ با AI',
    },
    grid: {
      alertMessage: 'اختیاری — گرید',
      alertDescription: 'ستون‌ها و فاصله برای چیدمان دقیق‌تر صفحه.',
    },
    spacing: {
      alertMessage: 'اختیاری — فاصله',
      alertDescription: 'مقیاس ۸ نقطه‌ای برای فاصله‌های یکدست.',
    },
    checklist: {
      alertMessage: 'اختیاری — چک‌لیست کامپوننت',
      alertDescription: 'کامپوننت‌های UI که در پروژه استفاده می‌کنی را علامت بزن.',
    },
    microcopy: {
      alertMessage: 'اختیاری — متن UI',
      alertDescription: 'متن‌های کوتاه دکمه، خطا و empty state.',
    },
  } as const,
  testTools: {
    contrast: {
      tab: '۱. کنتراست',
      why: 'متن ناخوانا تجربه را خراب می‌کند — نسبت رنگ را بسنج.',
      fgPh: 'رنگ متن #000000',
      bgPh: 'رنگ زمینه #ffffff',
      pullPalette: 'از پالت پروژه',
      save: 'ثبت این بررسی',
      saved: 'بررسی ثبت شد',
      preview: 'پیش‌نمایش',
      ratio: 'نسبت کنتراست',
      level: 'سطح',
      hint: 'برای متن معمولی: AA حداقل ۴.۵:۱ ، AAA حداقل ۷:۱',
      invalid: 'رنگ hex نامعتبر',
      aiLabel: 'تحلیل کنتراست با AI',
    },
    wcag: {
      tab: '۲. دسترسی‌پذیری',
      tabFull: '۲. WCAG',
      why: 'چند مورد ضروری را تیک بزن — لازم نیست همه را الان کامل کنی.',
      goalHint: 'حداقل ۳ مورد را علامت بزن',
      progressLabel: 'انجام‌شده',
      helpTitle: 'راهنما',
      aiLabel: 'خلاصه دسترسی با AI',
    },
    report: {
      tab: '۳. گزارش',
      why: 'با چند جمله بنویس چه چیزی خوب بود و چه چیزی را اصلاح می‌کنی.',
      notesTitle: 'یادداشت یافته‌ها',
      notesPh: 'مثال: کنتراست دکمه‌ها ضعیف است؛ فوکوس کیبورد روی منو مشخص نیست…',
      clear: 'پاک کردن',
      empty: 'هنوز یادداشتی نیست — خودت بنویس یا از AI کمک بگیر.',
      aiLabel: 'خلاصه یافته‌ها با AI',
      aggregateTitle: 'جمع‌بندی وضعیت',
      contrastSection: 'کنتراست',
      wcagSection: 'دسترسی‌پذیری',
      heuristicSection: 'قوانین کاربردپذیری (اختیاری)',
    },
    heuristics: {
      alertMessage: 'اختیاری — قوانین کاربردپذیری',
      alertDescription: '۱۰ اصل نیلسن برای ارزیابی عمیق‌تر؛ برای جونیور لازم نیست.',
      avgTitle: 'میانگین امتیاز (از ۵)',
      notesPh: 'یادداشت ارزیابی…',
      aiLabel: 'خلاصه ارزیابی با AI',
    },
  } as const,
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
  ai: {
    drawerTitle: 'دستیار AI',
    headerButton: 'کمک AI',
    juniorAlertTitle: 'کمک برای کار فعلی',
    juniorAlertDesc:
      'همان اکشنی که از صفحه باز کردی را اجرا کن. اگر جواب ساخت‌یافته بود، با «اعمال» در پروژه ذخیره می‌شود.',
    fullAlertTitle: 'دستیار Design Thinking (Groq)',
    fullAlertDesc:
      'هر اکشن از کل داده‌های پروژه context می‌گیرد — نه فقط همین صفحه.',
    noKeyTitle: 'کلید API یافت نشد',
    noKeyDesc: 'فایل .env.local را با VITE_GROQ_API_KEY=... بسازید.',
    getKey: 'دریافت کلید',
    coverageTitle: 'پوشش داده پروژه',
    chainsTitle: 'زنجیره‌های پیشنهادی',
    chainRunning: 'زنجیره در حال اجرا',
    stopChain: 'توقف زنجیره',
    checkConnection: 'بررسی اتصال',
    readinessTitle: 'آمادگی context',
    hintLabel: 'نکته اختیاری برای مدل',
    hintPh: 'مثلاً تمرکز روی کاربران موبایل…',
    run: 'اجرا',
    retry: 'تکرار',
    apply: 'اعمال در پروژه',
    copy: 'کپی',
    clear: 'پاک',
    responseTitle: 'پاسخ',
    structuredReady: 'داده ساخت‌یافته آماده است — اعمال کن تا در پروژه ذخیره شود.',
    showSettings: 'تنظیمات مدل',
    hideSettings: 'بستن تنظیمات',
    historyCollapse: 'تاریخچه اعمال',
    sectionHint: 'AI از داده پروژه کمک می‌گیرد',
  } as const,
} as const

export type FaContent = typeof fa
