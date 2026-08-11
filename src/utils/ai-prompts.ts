export type AiActionId =
  | 'persona-suggest'
  | 'analyze-notes'
  | 'ux-improve'
  | 'microcopy'
  | 'summarize-test'

export interface AiActionDef {
  id: AiActionId
  label: string
  description: string
}

export const AI_ACTIONS: readonly AiActionDef[] = [
  {
    id: 'persona-suggest',
    label: 'پیشنهاد پرسونا',
    description: 'ساخت یا تکمیل پرسونای کاربر',
  },
  {
    id: 'analyze-notes',
    label: 'تحلیل یادداشت تحقیق',
    description: 'استخراج بینش از یادداشت‌های همدلی',
  },
  {
    id: 'ux-improve',
    label: 'پیشنهاد بهبود UX',
    description: 'ایده برای Define / Ideate',
  },
  {
    id: 'microcopy',
    label: 'تولید میکروکپی',
    description: 'متن دکمه‌ها، خطاها و راهنما',
  },
  {
    id: 'summarize-test',
    label: 'خلاصه یافته‌های تست',
    description: 'جمع‌بندی ارزیابی کاربردپذیری',
  },
] as const

export function isAiActionId(value: string): value is AiActionId {
  return AI_ACTIONS.some((a) => a.id === value)
}

export interface AiPromptContext {
  projectName?: string
  personasSummary?: string
  researchNotes?: string
  problemSentence?: string
  povSentence?: string
  ideasSummary?: string
  wcagProgress?: number
  heuristicAverage?: number
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

export function buildSystemPrompt(action: AiActionId): string {
  const extra: Record<AiActionId, string> = {
    'persona-suggest': 'خروجی: ۱ تا ۳ پرسونا با نام، نقش، اهداف، دردها و یک جمله بیو.',
    'analyze-notes': 'خروجی: تم‌های کلیدی، نقل‌قول‌های مهم، فرصت‌های طراحی، و سوالات باز.',
    'ux-improve': 'خروجی: ۳ تا ۵ پیشنهاد بهبود UX با اولویت و دلیل کوتاه.',
    microcopy: 'خروجی: پیشنهاد میکروکپی برای CTA، پیام خطا، empty state و راهنمای کوتاه.',
    'summarize-test': 'خروجی: خلاصه وضعیت کنتراست/WCAG/هیوریستیک، ریسک‌ها و ۳ اقدام بعدی.',
  }
  return `${systemBase()} ${extra[action]}`
}

export function buildUserPrompt(action: AiActionId, ctx: AiPromptContext): string {
  const parts: string[] = []
  if (ctx.projectName?.trim()) parts.push(`نام پروژه: ${ctx.projectName.trim()}`)
  if (ctx.userHint?.trim()) parts.push(`درخواست کاربر: ${ctx.userHint.trim()}`)

  switch (action) {
    case 'persona-suggest':
      if (ctx.personasSummary?.trim()) parts.push(`پرسوناهای فعلی:\n${ctx.personasSummary}`)
      if (ctx.researchNotes?.trim()) parts.push(`یادداشت تحقیق:\n${ctx.researchNotes}`)
      parts.push('بر اساس داده بالا پرسونا پیشنهاد بده یا تکمیل کن.')
      break
    case 'analyze-notes':
      parts.push(`یادداشت تحقیق:\n${ctx.researchNotes?.trim() || '(خالی)'}`)
      parts.push('این یادداشت‌ها را تحلیل کن.')
      break
    case 'ux-improve':
      if (ctx.problemSentence?.trim()) parts.push(`بیان مسئله: ${ctx.problemSentence}`)
      if (ctx.povSentence?.trim()) parts.push(`POV: ${ctx.povSentence}`)
      if (ctx.ideasSummary?.trim()) parts.push(`ایده‌ها:\n${ctx.ideasSummary}`)
      parts.push('پیشنهادهای بهبود UX بده.')
      break
    case 'microcopy':
      if (ctx.problemSentence?.trim()) parts.push(`زمینه مسئله: ${ctx.problemSentence}`)
      parts.push('میکروکپی‌های کاربردی برای UI پیشنهاد بده.')
      break
    case 'summarize-test':
      if (ctx.contrastSummary?.trim()) parts.push(`کنتراست: ${ctx.contrastSummary}`)
      if (ctx.wcagProgress !== undefined) parts.push(`پیشرفت WCAG: ${ctx.wcagProgress}%`)
      if (ctx.heuristicAverage !== undefined)
        parts.push(`میانگین هیوریستیک: ${ctx.heuristicAverage}/5`)
      parts.push('یافته‌های تست را خلاصه کن.')
      break
    default: {
      const _exhaustive: never = action
      return _exhaustive
    }
  }

  return parts.join('\n\n')
}
