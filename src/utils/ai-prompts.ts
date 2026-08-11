import type { DesignStepKey } from '@/types/project'

/** AI grouping includes home (project brief) before Design Thinking steps. */
export type AiPhaseKey = DesignStepKey | 'home'

export type AiActionId =
  | 'improve-project-brief'
  | 'seed-research-notes'
  | 'persona-suggest'
  | 'synthesize-empathy'
  | 'analyze-notes'
  | 'analyze-competitors'
  | 'generate-hmw'
  | 'refine-problem'
  | 'refine-pov'
  | 'ux-improve'
  | 'microcopy'
  | 'brainstorm-ideas'
  | 'suggest-userflow'
  | 'suggest-sitemap'
  | 'suggest-card-sort'
  | 'review-design-system'
  | 'wireframe-critique'
  | 'summarize-test'
  | 'test-to-hmw'
  | 'test-to-ideas'

export interface AiActionDef {
  id: AiActionId
  label: string
  description: string
  phase: AiPhaseKey
  /** When true, system prompt requests JSON block for apply-to-form. */
  structured: boolean
  applyLabel?: string
}

export const AI_ACTIONS: readonly AiActionDef[] = [
  {
    id: 'improve-project-brief',
    label: 'بهبود شرح پروژه',
    description: 'بازنویسی عنوان و توضیح پروژه — مبنای همه مراحل',
    phase: 'home',
    structured: true,
    applyLabel: 'اعمال شرح بهبودیافته',
  },
  {
    id: 'seed-research-notes',
    label: 'پیشنهاد یادداشت تحقیق',
    description: 'اسکلت یادداشت از شرح پروژه — سوالات مصاحبه و تم‌ها',
    phase: 'empathize',
    structured: true,
    applyLabel: 'اعمال در یادداشت تحقیق',
  },
  {
    id: 'persona-suggest',
    label: 'پیشنهاد پرسونا',
    description: 'ساخت ۱–۳ پرسونا از یادداشت تحقیق و داده موجود',
    phase: 'empathize',
    structured: true,
    applyLabel: 'افزودن پرسوناها به لیست',
  },
  {
    id: 'synthesize-empathy',
    label: 'سنتز نقشه همدلی',
    description: 'پر کردن Says/Thinks/Does/Feels از پرسونا و تحقیق',
    phase: 'empathize',
    structured: true,
    applyLabel: 'اعمال نقشه همدلی',
  },
  {
    id: 'analyze-notes',
    label: 'تحلیل یادداشت تحقیق',
    description: 'تم‌ها، نقل‌قول‌ها، فرصت طراحی و سوالات باز',
    phase: 'empathize',
    structured: false,
  },
  {
    id: 'analyze-competitors',
    label: 'تحلیل رقبا',
    description: 'مقایسه نقاط قوت/ضعف و فرصت تمایز',
    phase: 'empathize',
    structured: false,
  },
  {
    id: 'generate-hmw',
    label: 'تولید سوالات HMW',
    description: '۵–۸ سوال How Might We از POV و مسئله',
    phase: 'define',
    structured: true,
    applyLabel: 'افزودن سوالات HMW',
  },
  {
    id: 'refine-problem',
    label: 'پیشنهاد بیان مسئله',
    description: 'تکمیل user / need / insight از شرح پروژه',
    phase: 'define',
    structured: true,
    applyLabel: 'اعمال در بیان مسئله',
  },
  {
    id: 'refine-pov',
    label: 'پیشنهاد POV',
    description: 'تکمیل نقطه دید از مسئله و پرسونا',
    phase: 'define',
    structured: true,
    applyLabel: 'اعمال در POV',
  },
  {
    id: 'ux-improve',
    label: 'پیشنهاد بهبود UX',
    description: '۳–۵ پیشنهاد اولویت‌دار بر اساس Define و Ideate',
    phase: 'define',
    structured: false,
  },
  {
    id: 'microcopy',
    label: 'تولید میکروکپی',
    description: 'CTA، خطا، empty state و راهنمای کوتاه',
    phase: 'prototype',
    structured: true,
    applyLabel: 'ذخیره در بانک میکروکپی',
  },
  {
    id: 'brainstorm-ideas',
    label: 'طوفان ایده',
    description: '۵–۸ ایده قابل اجرا از HMW و پرسوناها',
    phase: 'ideate',
    structured: true,
    applyLabel: 'افزودن ایده‌ها به برد',
  },
  {
    id: 'suggest-userflow',
    label: 'پیشنهاد جریان کاربر',
    description: 'مراحل start → action → decision → end',
    phase: 'ideate',
    structured: true,
    applyLabel: 'افزودن مراحل به جریان',
  },
  {
    id: 'suggest-sitemap',
    label: 'پیشنهاد نقشه سایت',
    description: 'IA درختی از ایده‌ها و جریان کاربر',
    phase: 'ideate',
    structured: true,
    applyLabel: 'اعمال نقشه سایت',
  },
  {
    id: 'suggest-card-sort',
    label: 'پیشنهاد کارت‌های مرتب‌سازی',
    description: 'ویژگی‌ها و محتوا برای card sorting',
    phase: 'ideate',
    structured: true,
    applyLabel: 'افزودن کارت‌ها',
  },
  {
    id: 'review-design-system',
    label: 'بازبینی Design System',
    description: 'رنگ، تایپ، فاصله و گرید — پیشنهاد بهبود',
    phase: 'prototype',
    structured: false,
  },
  {
    id: 'wireframe-critique',
    label: 'نقد وایرفریم',
    description: 'بررسی بلوک‌های انتخاب‌شده و پیشنهاد چیدمان',
    phase: 'prototype',
    structured: false,
  },
  {
    id: 'summarize-test',
    label: 'خلاصه یافته‌های تست',
    description: 'جمع‌بندی WCAG، کنتراست و هیوریستیک',
    phase: 'test',
    structured: true,
    applyLabel: 'ذخیره در گزارش usability',
  },
  {
    id: 'test-to-hmw',
    label: 'HMW از یافته‌های تست',
    description: 'تبدیل مشکلات تست به سوالات How Might We',
    phase: 'test',
    structured: true,
    applyLabel: 'افزودن سوالات HMW',
  },
  {
    id: 'test-to-ideas',
    label: 'ایده patch از تست',
    description: 'ایده‌های بهبود UI از ریسک‌های تست',
    phase: 'test',
    structured: true,
    applyLabel: 'افزودن ایده‌ها به برد',
  },
] as const

export function isAiActionId(value: string): value is AiActionId {
  return AI_ACTIONS.some((a) => a.id === value)
}

export function getAiActionDef(action: AiActionId): AiActionDef {
  const found = AI_ACTIONS.find((a) => a.id === action)
  if (!found) throw new Error(`Unknown AI action: ${action}`)
  return found
}

export interface AiPromptContext {
  projectName?: string
  projectBrief?: string
  personasSummary?: string
  empathySummary?: string
  researchNotes?: string
  competitorsSummary?: string
  problemSentence?: string
  povSentence?: string
  hmwSummary?: string
  ideasSummary?: string
  userflowSummary?: string
  sitemapSummary?: string
  cardSortSummary?: string
  componentChecklistSummary?: string
  microcopySummary?: string
  designSystemSummary?: string
  wireframeSummary?: string
  wcagProgress?: number
  wcagUncheckedSummary?: string
  heuristicAverage?: number
  heuristicWeakSummary?: string
  contrastSummary?: string
  testSummary?: string
  userHint?: string
}

function systemBase(): string {
  return [
    'تو دستیار تخصصی UX و Design Thinking برای محصول «دیزاین‌یار» هستی.',
    'همه پاسخ‌ها را به فارسی، کوتاه، ساخت‌یافته و قابل اجرا بنویس.',
    'از فهرست و بولت استفاده کن. حدس‌های غیرمعتبر نزن؛ اگر داده کم است بگو چه چیزی کم است.',
    'اگر «شرح پروژه» داده شده، آن را محور اصلی پیشنهادها قرار بده.',
  ].join(' ')
}

const JSON_FOOTER: Record<AiActionId, string | undefined> = {
  'improve-project-brief': [
    'در انتهای پاسخ حتماً یک بلوک ```json با این ساختار بده:',
    '{"briefTitle":"","briefDescription":""}',
    'عنوان کوتاه و توضیح ۳–۶ جمله‌ای؛ فقط JSON معتبر.',
  ].join('\n'),
  'seed-research-notes': [
    'در انتهای پاسخ حتماً یک بلوک ```json با این ساختار بده:',
    '{"researchNotes":"متن کامل یادداشت تحقیق"}',
    'شامل: اهداف تحقیق، سوالات مصاحبه، فرضیه‌ها؛ فقط JSON معتبر.',
  ].join('\n'),
  'synthesize-empathy': [
    'در انتهای پاسخ حتماً یک بلوک ```json با این ساختار بده:',
    '{"empathyMaps":[{"personaId":"general","quadrants":{"says":"","thinks":"","does":"","feels":""}}]}',
    'برای هر پرسونای مرتبط یک entry؛ personaId = id پرسونا یا "general"؛ فقط JSON معتبر.',
  ].join('\n'),
  'persona-suggest': [
    'در انتهای پاسخ حتماً یک بلوک ```json با این ساختار بده:',
    '{"personas":[{"name":"","role":"","goals":"","pains":"","bio":"","age":null}]}',
    '۱ تا ۳ پرسونا؛ فقط JSON معتبر.',
  ].join('\n'),
  'generate-hmw': [
    'در انتهای پاسخ حتماً یک بلوک ```json با این ساختار بده:',
    '{"hmwQuestions":["چگونه می‌توانیم …؟"]}',
    '۵ تا ۸ سوال؛ فقط JSON معتبر.',
  ].join('\n'),
  'brainstorm-ideas': [
    'در انتهای پاسخ حتماً یک بلوک ```json با این ساختار بده:',
    '{"ideas":[{"title":"","detail":"","tags":[]}]}',
    '۵ تا ۸ ایده؛ فقط JSON معتبر.',
  ].join('\n'),
  'suggest-userflow': [
    'در انتهای پاسخ حتماً یک بلوک ```json با این ساختار بده:',
    '{"flowSteps":[{"kind":"start|action|decision|end","label":""}]}',
    '۶ تا ۱۰ مرحله منطقی؛ kind فقط یکی از start/action/decision/end؛ فقط JSON معتبر.',
  ].join('\n'),
  'suggest-sitemap': [
    'در انتهای پاسخ حتماً یک بلوک ```json با این ساختار بده:',
    '{"sitemapNodes":[{"title":"صفحه","children":[{"title":"زیرصفحه"}]}]}',
    '۴ تا ۱۲ گره در ساختار درختی؛ فقط title و children؛ فقط JSON معتبر.',
  ].join('\n'),
  'suggest-card-sort': [
    'در انتهای پاسخ حتماً یک بلوک ```json با این ساختار بده:',
    '{"sortCards":["عنوان کارت ۱","عنوان کارت ۲"]}',
    '۸ تا ۱۵ کارت کوتاه و مشخص؛ فقط JSON معتبر.',
  ].join('\n'),
  'refine-problem': [
    'در انتهای پاسخ حتماً یک بلوک ```json با این ساختار بده:',
    '{"problem":{"user":"","need":"","insight":""}}',
    'فقط JSON معتبر.',
  ].join('\n'),
  'refine-pov': [
    'در انتهای پاسخ حتماً یک بلوک ```json با این ساختار بده:',
    '{"pov":{"user":"","need":"","insight":""}}',
    'فقط JSON معتبر.',
  ].join('\n'),
  'summarize-test': [
    'ابتدا خلاصه فارسی بده. در انتها ```json:',
    '{"testSummary":"خلاصه یکپارچه برای گزارش"}',
  ].join('\n'),
  'test-to-hmw': [
    'در انتهای پاسخ حتماً یک بلوک ```json با این ساختار بده:',
    '{"hmwQuestions":["چگونه می‌توانیم …؟"]}',
    '۴ تا ۶ سوال HMW بر اساس یافته‌های تست؛ فقط JSON معتبر.',
  ].join('\n'),
  'test-to-ideas': [
    'در انتهای پاسخ حتماً یک بلوک ```json با این ساختار بده:',
    '{"ideas":[{"title":"","detail":"","tags":["test-fix"]}]}',
    '۳ تا ۵ ایده patch برای ریسک‌های تست؛ tags شامل test-fix؛ فقط JSON معتبر.',
  ].join('\n'),
  microcopy: [
    'در انتهای پاسخ حتماً یک بلوک ```json با این ساختار بده:',
    '{"microcopyItems":[{"category":"cta|error|empty|hint|label","text":"","context":""}]}',
    '۶ تا ۱۰ مورد کاربردی؛ فقط JSON معتبر.',
  ].join('\n'),
  'analyze-notes': undefined,
  'analyze-competitors': undefined,
  'ux-improve': undefined,
  'review-design-system': undefined,
  'wireframe-critique': undefined,
}

export function buildSystemPrompt(action: AiActionId): string {
  const extra: Record<AiActionId, string> = {
    'improve-project-brief':
      'ابتدا ۲ جمله توضیح بده چه بهبودی دادی. سپس JSON عنوان و شرح.',
    'seed-research-notes':
      'ابتدا ۱ جمله خلاصه. سپس JSON یادداشت تحقیق کامل.',
    'persona-suggest':
      'ابتدا ۲–۳ جمله خلاصه بده. سپس JSON پرسوناها.',
    'analyze-notes': 'خروجی: تم‌های کلیدی، نقل‌قول‌ها، فرصت‌های طراحی، سوالات باز.',
    'synthesize-empathy': 'ابتدا ۱ جمله خلاصه. سپس JSON empathyMaps.',
    'analyze-competitors': 'خروجی: الگوهای مشترک، شکاف بازار، ۳ فرصت تمایز، ۲ تهدید.',
    'generate-hmw': 'ابتدا ۱ جمله چارچوب. سپس JSON سوالات HMW.',
    'refine-problem': 'ابتدا یک جمله پیش‌نمایش مسئله. سپس JSON problem.',
    'refine-pov': 'ابتدا یک جمله پیش‌نمایش POV. سپس JSON pov.',
    'ux-improve': 'خروجی: ۳–۵ پیشنهاد با اولویت (بالا/متوسط/پایین) و دلیل.',
    microcopy: 'ابتدا ۱ جمله خلاصه. سپس JSON microcopyItems.',
    'brainstorm-ideas': 'ابتدا ۱ جمله جهت‌گیری. سپس JSON ایده‌ها.',
    'suggest-userflow': 'ابتدا ۱ جمله هدف جریان. سپس JSON مراحل.',
    'suggest-sitemap': 'ابتدا ۱ جمله خلاصه IA. سپس JSON sitemapNodes.',
    'suggest-card-sort': 'ابتدا ۱ جمله جهت‌گیری. سپس JSON sortCards.',
    'review-design-system':
      'خروجی: نقاط قوت، ۳–۵ پیشنهاد بهبود توکن (رنگ/تایپ/فاصله/گرید)، ریسک a11y.',
    'wireframe-critique':
      'خروجی: ارزیابی چیدمان، جاهای خالی/شلوغ، ۳ پیشنهاد بهبود ساختار صفحه.',
    'summarize-test':
      'خروجی: وضعیت کنتراست/WCAG/هیوریستیک، ۳ ریسک، ۳ اقدام بعدی؛ سپس JSON testSummary.',
    'test-to-hmw':
      'ابتدا ۲ جمله جمع‌بندی یافته‌ها. سپس JSON سوالات HMW برای بازگشت به Define.',
    'test-to-ideas':
      'ابتدا ۲ جمله خلاصه ریسک‌ها. سپس JSON ایده‌های patch برای Ideate.',
  }

  const jsonPart = JSON_FOOTER[action]
  return jsonPart
    ? `${systemBase()} ${extra[action]}\n\n${jsonPart}`
    : `${systemBase()} ${extra[action]}`
}

export function buildUserPrompt(action: AiActionId, ctx: AiPromptContext): string {
  const parts: string[] = []
  if (ctx.projectName?.trim()) parts.push(`نام پروژه: ${ctx.projectName.trim()}`)
  if (ctx.projectBrief?.trim()) parts.push(`شرح پروژه (محور اصلی):\n${ctx.projectBrief.trim()}`)
  if (ctx.userHint?.trim()) parts.push(`درخواست کاربر: ${ctx.userHint.trim()}`)

  switch (action) {
    case 'improve-project-brief':
      parts.push(`شرح فعلی:\n${ctx.projectBrief?.trim() || '(خالی — از صفر بنویس)'}`)
      parts.push('عنوان و توضیح پروژه را واضح، مختصر و قابل استفاده در Design Thinking بازنویسی کن.')
      break
    case 'seed-research-notes':
      if (ctx.researchNotes?.trim()) parts.push(`یادداشت فعلی:\n${ctx.researchNotes}`)
      parts.push('یادداشت تحقیق ساخت‌یافته برای فاز Empathize بنویس.')
      break
    case 'persona-suggest':
      if (ctx.personasSummary?.trim()) parts.push(`پرسوناهای فعلی:\n${ctx.personasSummary}`)
      if (ctx.empathySummary?.trim()) parts.push(`نقشه همدلی:\n${ctx.empathySummary}`)
      if (ctx.researchNotes?.trim()) parts.push(`یادداشت تحقیق:\n${ctx.researchNotes}`)
      parts.push('پرسونای جدید پیشنهاد بده (تکمیل‌کننده، نه تکراری).')
      break
    case 'synthesize-empathy':
      if (ctx.personasSummary?.trim()) parts.push(`پرسوناها:\n${ctx.personasSummary}`)
      if (ctx.researchNotes?.trim()) parts.push(`یادداشت تحقیق:\n${ctx.researchNotes}`)
      if (ctx.empathySummary?.trim()) parts.push(`نقشه فعلی:\n${ctx.empathySummary}`)
      parts.push('نقشه همدلی را برای پرسوناهای مرتبط تکمیل کن.')
      break
    case 'analyze-notes':
      parts.push(`یادداشت تحقیق:\n${ctx.researchNotes?.trim() || '(خالی)'}`)
      if (ctx.personasSummary?.trim()) parts.push(`پرسوناها:\n${ctx.personasSummary}`)
      parts.push('یادداشت‌ها را تحلیل کن.')
      break
    case 'analyze-competitors':
      parts.push(`جدول رقبا:\n${ctx.competitorsSummary?.trim() || '(خالی)'}`)
      if (ctx.researchNotes?.trim()) parts.push(`زمینه تحقیق:\n${ctx.researchNotes}`)
      parts.push('رقبا را تحلیل و فرصت تمایز بده.')
      break
    case 'generate-hmw':
      if (ctx.problemSentence?.trim()) parts.push(`بیان مسئله: ${ctx.problemSentence}`)
      if (ctx.povSentence?.trim()) parts.push(`POV: ${ctx.povSentence}`)
      if (ctx.personasSummary?.trim()) parts.push(`پرسوناها:\n${ctx.personasSummary}`)
      if (ctx.hmwSummary?.trim()) parts.push(`سوالات HMW فعلی:\n${ctx.hmwSummary}`)
      parts.push('سوالات HMW جدید و متنوع تولید کن.')
      break
    case 'refine-problem':
      if (ctx.problemSentence?.trim()) parts.push(`بیان مسئله فعلی: ${ctx.problemSentence}`)
      if (ctx.personasSummary?.trim()) parts.push(`پرسوناها:\n${ctx.personasSummary}`)
      parts.push('بیان مسئله را در قالب user / need / insight تکمیل یا بهبود بده.')
      break
    case 'refine-pov':
      if (ctx.problemSentence?.trim()) parts.push(`بیان مسئله: ${ctx.problemSentence}`)
      if (ctx.povSentence?.trim()) parts.push(`POV فعلی: ${ctx.povSentence}`)
      if (ctx.personasSummary?.trim()) parts.push(`پرسوناها:\n${ctx.personasSummary}`)
      parts.push('POV را در قالب user / need / insight تکمیل یا بهبود بده.')
      break
    case 'ux-improve':
      if (ctx.problemSentence?.trim()) parts.push(`بیان مسئله: ${ctx.problemSentence}`)
      if (ctx.povSentence?.trim()) parts.push(`POV: ${ctx.povSentence}`)
      if (ctx.hmwSummary?.trim()) parts.push(`HMW:\n${ctx.hmwSummary}`)
      if (ctx.ideasSummary?.trim()) parts.push(`ایده‌ها:\n${ctx.ideasSummary}`)
      parts.push('پیشنهادهای بهبود UX بده.')
      break
    case 'microcopy':
      if (ctx.problemSentence?.trim()) parts.push(`زمینه مسئله: ${ctx.problemSentence}`)
      if (ctx.wireframeSummary?.trim()) parts.push(`وایرفریم: ${ctx.wireframeSummary}`)
      if (ctx.componentChecklistSummary?.trim())
        parts.push(`کامپوننت‌های UI:\n${ctx.componentChecklistSummary}`)
      if (ctx.microcopySummary?.trim()) parts.push(`بانک فعلی:\n${ctx.microcopySummary}`)
      parts.push('میکروکپی‌های کاربردی برای UI پیشنهاد بده.')
      break
    case 'brainstorm-ideas':
      if (ctx.povSentence?.trim()) parts.push(`POV: ${ctx.povSentence}`)
      if (ctx.hmwSummary?.trim()) parts.push(`HMW:\n${ctx.hmwSummary}`)
      if (ctx.personasSummary?.trim()) parts.push(`پرسوناها:\n${ctx.personasSummary}`)
      if (ctx.ideasSummary?.trim()) parts.push(`ایده‌های فعلی:\n${ctx.ideasSummary}`)
      parts.push('ایده‌های جدید و متنوع پیشنهاد بده.')
      break
    case 'suggest-userflow':
      if (ctx.problemSentence?.trim()) parts.push(`مسئله: ${ctx.problemSentence}`)
      if (ctx.ideasSummary?.trim()) parts.push(`ایده‌های برتر:\n${ctx.ideasSummary}`)
      if (ctx.userflowSummary?.trim()) parts.push(`جریان فعلی:\n${ctx.userflowSummary}`)
      parts.push('جریان کاربر پیشنهادی بده.')
      break
    case 'suggest-sitemap':
      if (ctx.ideasSummary?.trim()) parts.push(`ایده‌ها:\n${ctx.ideasSummary}`)
      if (ctx.userflowSummary?.trim()) parts.push(`جریان کاربر:\n${ctx.userflowSummary}`)
      if (ctx.sitemapSummary?.trim()) parts.push(`نقشه فعلی:\n${ctx.sitemapSummary}`)
      if (ctx.problemSentence?.trim()) parts.push(`مسئله: ${ctx.problemSentence}`)
      parts.push('ساختار IA / نقشه سایت پیشنهادی بده.')
      break
    case 'suggest-card-sort':
      if (ctx.ideasSummary?.trim()) parts.push(`ایده‌ها:\n${ctx.ideasSummary}`)
      if (ctx.sitemapSummary?.trim()) parts.push(`IA:\n${ctx.sitemapSummary}`)
      if (ctx.cardSortSummary?.trim()) parts.push(`کارت‌های فعلی:\n${ctx.cardSortSummary}`)
      parts.push('کارت‌های محتوا/ویژگی برای card sorting پیشنهاد بده.')
      break
    case 'review-design-system':
      if (ctx.designSystemSummary?.trim()) parts.push(`Design System:\n${ctx.designSystemSummary}`)
      if (ctx.contrastSummary?.trim()) parts.push(`کنتراست: ${ctx.contrastSummary}`)
      if (ctx.componentChecklistSummary?.trim())
        parts.push(`چک‌لیست کامپوننت:\n${ctx.componentChecklistSummary}`)
      parts.push('Design System را بازبینی کن.')
      break
    case 'wireframe-critique':
      if (ctx.wireframeSummary?.trim()) parts.push(`بلوک‌های وایرفریم: ${ctx.wireframeSummary}`)
      if (ctx.problemSentence?.trim()) parts.push(`مسئله: ${ctx.problemSentence}`)
      if (ctx.sitemapSummary?.trim()) parts.push(`IA:\n${ctx.sitemapSummary}`)
      if (ctx.componentChecklistSummary?.trim())
        parts.push(`کامپوننت‌های انتخاب‌شده:\n${ctx.componentChecklistSummary}`)
      parts.push('وایرفریم را نقد کن.')
      break
    case 'summarize-test':
      if (ctx.contrastSummary?.trim()) parts.push(`کنتراست: ${ctx.contrastSummary}`)
      if (ctx.wcagProgress !== undefined) parts.push(`پیشرفت WCAG: ${ctx.wcagProgress}%`)
      if (ctx.wcagUncheckedSummary?.trim())
        parts.push(`موارد بررسی‌نشده WCAG:\n${ctx.wcagUncheckedSummary}`)
      if (ctx.heuristicAverage !== undefined)
        parts.push(`میانگین هیوریستیک: ${ctx.heuristicAverage}/5`)
      if (ctx.heuristicWeakSummary?.trim())
        parts.push(`ضعیف‌ترین هیوریستیک‌ها:\n${ctx.heuristicWeakSummary}`)
      parts.push('یافته‌های تست را خلاصه کن.')
      break
    case 'test-to-hmw':
      if (ctx.testSummary?.trim()) parts.push(`خلاصه تست:\n${ctx.testSummary}`)
      if (ctx.contrastSummary?.trim()) parts.push(`کنتراست: ${ctx.contrastSummary}`)
      if (ctx.wcagProgress !== undefined) parts.push(`پیشرفت WCAG: ${ctx.wcagProgress}%`)
      if (ctx.heuristicWeakSummary?.trim())
        parts.push(`هیوریستیک ضعیف:\n${ctx.heuristicWeakSummary}`)
      if (ctx.povSentence?.trim()) parts.push(`POV: ${ctx.povSentence}`)
      parts.push('از یافته‌های تست سوالات HMW برای دور بعد Design Thinking بساز.')
      break
    case 'test-to-ideas':
      if (ctx.testSummary?.trim()) parts.push(`خلاصه تست:\n${ctx.testSummary}`)
      if (ctx.heuristicWeakSummary?.trim())
        parts.push(`هیوریستیک ضعیف:\n${ctx.heuristicWeakSummary}`)
      if (ctx.wcagUncheckedSummary?.trim())
        parts.push(`WCAG بررسی‌نشده:\n${ctx.wcagUncheckedSummary}`)
      if (ctx.ideasSummary?.trim()) parts.push(`ایده‌های فعلی:\n${ctx.ideasSummary}`)
      parts.push('ایده‌های patch برای رفع ریسک‌های تست پیشنهاد بده (بازخورد به Ideate).')
      break
    default: {
      const _exhaustive: never = action
      return _exhaustive
    }
  }

  return parts.join('\n\n')
}

export function getContextHints(action: AiActionId, ctx: AiPromptContext): string[] {
  const hints: string[] = []

  switch (action) {
    case 'improve-project-brief':
    case 'seed-research-notes':
      if (!ctx.projectBrief?.trim()) {
        hints.push('عنوان یا توضیح پروژه را در صفحه خانه بنویسید.')
      }
      break
    case 'synthesize-empathy':
      if (!ctx.personasSummary?.trim()) {
        hints.push('حداقل یک پرسونا بسازید یا از AI پیشنهاد بگیرید.')
      }
      break
    case 'persona-suggest':
    case 'analyze-notes':
      if (!ctx.projectBrief?.trim() && !ctx.researchNotes?.trim() && !ctx.personasSummary?.trim()) {
        hints.push('شرح پروژه یا یادداشت تحقیق را پر کنید.')
      }
      break
    case 'analyze-competitors':
      if (!ctx.competitorsSummary?.trim()) {
        hints.push('حداقل یک رقیب در جدول رقبا ثبت کنید.')
      }
      break
    case 'generate-hmw':
    case 'refine-problem':
    case 'refine-pov':
    case 'ux-improve':
      if (!ctx.povSentence?.trim() && !ctx.problemSentence?.trim() && !ctx.projectBrief?.trim()) {
        hints.push('شرح پروژه یا بیان مسئله/POV را در Define تکمیل کنید.')
      }
      break
    case 'brainstorm-ideas':
      if (!ctx.hmwSummary?.trim() && !ctx.povSentence?.trim()) {
        hints.push('HMW یا POV را در Define پر کنید.')
      }
      break
    case 'suggest-userflow':
      if (!ctx.ideasSummary?.trim() && !ctx.problemSentence?.trim()) {
        hints.push('ایده یا بیان مسئله را برای جریان کاربر پر کنید.')
      }
      break
    case 'suggest-sitemap':
      if (!ctx.ideasSummary?.trim() && !ctx.userflowSummary?.trim()) {
        hints.push('ایده یا جریان کاربر را برای IA پر کنید.')
      }
      break
    case 'suggest-card-sort':
      if (!ctx.ideasSummary?.trim() && !ctx.sitemapSummary?.trim()) {
        hints.push('ایده یا نقشه سایت را برای card sort پر کنید.')
      }
      break
    case 'review-design-system':
      if (!ctx.designSystemSummary?.trim()) {
        hints.push('توکن‌های Prototype را تنظیم کنید.')
      }
      break
    case 'wireframe-critique':
      if (!ctx.wireframeSummary?.trim()) {
        hints.push('بلوک‌های وایرفریم را در Prototype انتخاب کنید.')
      }
      break
    case 'microcopy':
      if (!ctx.problemSentence?.trim() && !ctx.wireframeSummary?.trim()) {
        hints.push('بیان مسئله یا وایرفریم به میکروکopi کمک می‌کند.')
      }
      break
    case 'summarize-test':
      if (
        ctx.wcagProgress === undefined &&
        ctx.heuristicAverage === undefined &&
        !ctx.contrastSummary?.trim()
      ) {
        hints.push('حداقل یکی از ابزار Test را پر کنید.')
      }
      break
    case 'test-to-hmw':
      if (!ctx.testSummary?.trim() && ctx.wcagProgress === 0 && !ctx.heuristicWeakSummary?.trim()) {
        hints.push('خلاصه تست یا داده WCAG/هیوریستیک را پر کنید.')
      }
      break
    case 'test-to-ideas':
      if (!ctx.testSummary?.trim() && ctx.wcagProgress === 0 && !ctx.heuristicWeakSummary?.trim()) {
        hints.push('خلاصه تست یا یافته‌های WCAG/هیوریستیک را پر کنید.')
      }
      break
    default:
      break
  }

  return hints
}

export const AI_ACTIONS_BY_PHASE = (
  ['home', 'empathize', 'define', 'ideate', 'prototype', 'test'] as const
).map((phase) => ({
  phase,
  actions: AI_ACTIONS.filter((a) => a.phase === phase),
}))
