import { generateText, Output } from 'ai'
import type { z } from 'zod'
import { createGroqModel } from '@/ai/groq-client'
import type { AiAssistMode } from '@/types/ai'

export interface AiFormAssistParams<TSchema extends z.ZodType> {
  schema: TSchema
  mode: AiAssistMode
  formTitle: string
  phaseTitle: string
  projectName: string
  currentJson: string
  extraContext?: string
}

export interface AiFormAssistResult<T> {
  data: T
}

function buildSystemPrompt(): string {
  return [
    'تو دستیار UX برای جونیورها هستی.',
    'فقط JSON معتبر مطابق اسکیما برگردان.',
    'متن‌ها را فارسی، کوتاه و روشن بنویس.',
    'jargon انگلیسی ننویس مگر نام فنی لازم.',
  ].join(' ')
}

function buildUserPrompt(params: AiFormAssistParams<z.ZodType>): string {
  const action =
    params.mode === 'improve'
      ? 'دادهٔ فعلی را بهبود بده؛ معنا را حفظ کن و کیفیت را بالا ببر.'
      : 'جاهای خالی را با پیشنهادهای معقول تکمیل کن؛ اگر پر است تقویت کن.'

  const lines = [
    `پروژه: ${params.projectName || 'بدون نام'}`,
    `فاز: ${params.phaseTitle}`,
    `فرم: ${params.formTitle}`,
    `عملیات: ${action}`,
    'دادهٔ فعلی (JSON):',
    params.currentJson,
  ]

  if (params.extraContext && params.extraContext.trim().length > 0) {
    lines.push('زمینهٔ اضافی:', params.extraContext.trim())
  }

  return lines.join('\n')
}

export async function runAiFormAssist<TSchema extends z.ZodType>(
  params: AiFormAssistParams<TSchema>,
): Promise<AiFormAssistResult<z.infer<TSchema>>> {
  const { output } = await generateText({
    model: createGroqModel(),
    system: buildSystemPrompt(),
    prompt: buildUserPrompt(params),
    output: Output.object({ schema: params.schema }),
  })

  const parsed = params.schema.safeParse(output)
  if (!parsed.success) {
    throw new Error('پاسخ ساخت‌یافته از AI دریافت نشد یا با اسکیما هم‌خوان نیست.')
  }

  return { data: parsed.data }
}
