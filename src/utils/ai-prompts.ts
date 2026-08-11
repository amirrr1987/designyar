import type { DesignStepKey } from '@/types/project'

export type AiActionId =
  | 'persona-suggest'
  | 'analyze-notes'
  | 'analyze-competitors'
  | 'generate-hmw'
  | 'ux-improve'
  | 'microcopy'
  | 'brainstorm-ideas'
  | 'suggest-userflow'
  | 'review-design-system'
  | 'wireframe-critique'
  | 'summarize-test'

export interface AiActionDef {
  id: AiActionId
  label: string
  description: string
  phase: DesignStepKey
  /** When true, system prompt requests JSON block for apply-to-form. */
  structured: boolean
  applyLabel?: string
}

export const AI_ACTIONS: readonly AiActionDef[] = [
  {
    id: 'persona-suggest',
    label: 'پیشنهاد پرسونا',
    description: 'ساخت ۱–۳ پرسونا از یادداشت تحقیق و داده موجود',
    phase: 'empathize',
    structured: true,
    applyLabel: 'افزودن پرسوناها به لیست',
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
    phase: 'define',
    structured: false,
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
    structured: false,
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
  designSystemSummary?: string
  wireframeSummary?: string
  wcagProgress?: number
  wcagUncheckedSummary?: string
  heuristicAverage?: number
  heuristicWeakSummary?: string
  contrastSummary?: string
  userHint?: string
}

function systemBase(): string {
  return [
    'تو دستیار تخصصی UX و Design Thinking برای محصول «دیزاین‌یار» هستی.',
    'همه پاسخ‌ها را به فارسی، کوتاه، ساخت‌یافته و قابل اجرا بنویس.',
    'از فهرست و بولت استفاده کن. حدس‌های غیرمعتبر نزن؛ اگر داده کم است بگو چه چیزی کم است.',
  ].join(' ')
}

const JSON_FOOTER: Record<AiActionId, string | undefined> = {
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
  'analyze-notes': undefined,
  'analyze-competitors': undefined,
  'ux-improve': undefined,
  microcopy: undefined,
  'review-design-system': undefined,
  'wireframe-critique': undefined,
  'summarize-test': undefined,
}

export function buildSystemPrompt(action: AiActionId): string {
  const extra: Record<AiActionId, string> = {
    'persona-suggest':
      'ابتدا ۲–۳ جمله خلاصه بده. سپس JSON پرسوناها.',
    'analyze-notes': 'خروجی: تم‌های کلیدی، نقل‌قول‌ها، فرصت‌های طراحی، سوالات باز.',
    'analyze-competitors': 'خروجی: الگوهای مشترک، شکاف بازار، ۳ فرصت تمایز، ۲ تهدید.',
    'generate-hmw': 'ابتدا ۱ جمله چارچوب. سپس JSON سوالات HMW.',
    'ux-improve': 'خروجی: ۳–۵ پیشنهاد با اولویت (بالا/متوسط/پایین) و دلیل.',
    microcopy: 'خروجی: CTA، پیام خطا، empty state، راهنمای کوتاه — هر کدام یک خط.',
    'brainstorm-ideas': 'ابتدا ۱ جمله جهت‌گیری. سپس JSON ایده‌ها.',
    'suggest-userflow': 'ابتدا ۱ جمله هدف جریان. سپس JSON مراحل.',
    'review-design-system':
      'خروجی: نقاط قوت، ۳–۵ پیشنهاد بهبود توکن (رنگ/تایپ/فاصله/گرید)، ریسک a11y.',
    'wireframe-critique':
      'خروجی: ارزیابی چیدمان، جاهای خالی/شلوغ، ۳ پیشنهاد بهبود ساختار صفحه.',
    'summarize-test':
      'خروجی: وضعیت کنتراست/WCAG/هیوریستیک، ۳ ریسک، ۳ اقدام بعدی با اولویت.',
  }

  const jsonPart = JSON_FOOTER[action]
  return jsonPart
    ? `${systemBase()} ${extra[action]}\n\n${jsonPart}`
    : `${systemBase()} ${extra[action]}`
}

export function buildUserPrompt(action: AiActionId, ctx: AiPromptContext): string {
  const parts: string[] = []
  if (ctx.projectName?.trim()) parts.push(`نام پروژه: ${ctx.projectName.trim()}`)
  if (ctx.userHint?.trim()) parts.push(`درخواست کاربر: ${ctx.userHint.trim()}`)

  switch (action) {
    case 'persona-suggest':
      if (ctx.personasSummary?.trim()) parts.push(`پرسوناهای فعلی:\n${ctx.personasSummary}`)
      if (ctx.empathySummary?.trim()) parts.push(`نقشه همدلی:\n${ctx.empathySummary}`)
      if (ctx.researchNotes?.trim()) parts.push(`یادداشت تحقیق:\n${ctx.researchNotes}`)
      parts.push('پرسونای جدید پیشنهاد بده (تکمیل‌کننده، نه تکراری).')
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
    case 'review-design-system':
      if (ctx.designSystemSummary?.trim()) parts.push(`Design System:\n${ctx.designSystemSummary}`)
      if (ctx.contrastSummary?.trim()) parts.push(`کنتراست: ${ctx.contrastSummary}`)
      parts.push('Design System را بازبینی کن.')
      break
    case 'wireframe-critique':
      if (ctx.wireframeSummary?.trim()) parts.push(`بلوک‌های وایرفریم: ${ctx.wireframeSummary}`)
      if (ctx.problemSentence?.trim()) parts.push(`مسئله: ${ctx.problemSentence}`)
      if (ctx.sitemapSummary?.trim()) parts.push(`IA:\n${ctx.sitemapSummary}`)
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
    case 'persona-suggest':
    case 'analyze-notes':
      if (!ctx.researchNotes?.trim() && !ctx.personasSummary?.trim()) {
        hints.push('یادداشت تحقیق یا پرسونا را در تب همدلی پر کنید.')
      }
      break
    case 'analyze-competitors':
      if (!ctx.competitorsSummary?.trim()) {
        hints.push('حداقل یک رقیب در جدول رقبا ثبت کنید.')
      }
      break
    case 'generate-hmw':
    case 'ux-improve':
      if (!ctx.povSentence?.trim() && !ctx.problemSentence?.trim()) {
        hints.push('بیان مسئله یا POV را در Define تکمیل کنید.')
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
    case 'summarize-test':
      if (
        ctx.wcagProgress === undefined &&
        ctx.heuristicAverage === undefined &&
        !ctx.contrastSummary?.trim()
      ) {
        hints.push('حداقل یکی از ابزار Test را پر کنید.')
      }
      break
    case 'microcopy':
      if (!ctx.problemSentence?.trim()) {
        hints.push('بیان مسئله در Define به میکروکپی کمک می‌کند.')
      }
      break
    default:
      break
  }

  return hints
}

export const AI_ACTIONS_BY_PHASE = (['empathize', 'define', 'ideate', 'prototype', 'test'] as const).map(
  (phase) => ({
    phase,
    actions: AI_ACTIONS.filter((a) => a.phase === phase),
  }),
)
