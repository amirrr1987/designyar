import { generateText } from 'ai'
import type { z } from 'zod'
import { createGroqModel } from '@/ai/groq-client'
import { assertNoForbiddenScripts } from '@/utils/persian-text'

export interface AiFormAssistParams<TSchema extends z.ZodType> {
  schema: TSchema
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
    'تو دستیار UX برای طراحان جونیور هستی.',
    'فقط یک شیء JSON معتبر برگردان؛ بدون توضیح، بدون markdown، بدون بلوک کد.',
    'کلیدهای JSON را دقیقاً مثل دادهٔ ورودی نگه دار.',
    'همهٔ متن‌های داخل مقادیر JSON باید فقط فارسی روان (الفبای فارسی/عربی) باشند.',
    'هرگز از حروف روسی، سیریلیک، یا مخلوط الفبای بیگانه در کلمات فارسی استفاده نکن.',
    'اگر واژه‌ای شبیه «причیه» دیدی اشتباه است؛ معادل فارسی مثل «به‌خاطر» بنویس.',
    'انگلیسی فقط برای اصطلاح فنی خیلی خاص مثل API، WCAG، یا کد رنگ hex مجاز است.',
    'جمله‌ها کوتاه و روشن باشند.',
  ].join(' ')
}

function buildUserPrompt(params: AiFormAssistParams<z.ZodType>, retryHint?: string): string {
  const lines = [
    `پروژه: ${params.projectName || 'بدون نام'}`,
    `فاز: ${params.phaseTitle}`,
    `فرم: ${params.formTitle}`,
    'عملیات: جاهای خالی را تکمیل کن و بخش‌های موجود را هم بهبود بده (هر دو کار با هم).',
    'زبان اجباری: فقط فارسی. هیچ حرف روسی/سیریلیک نباید باشد.',
    'دادهٔ فعلی (JSON) — کلیدها را عوض نکن:',
    params.currentJson,
    'خروجی: فقط همان کلیدها با مقادیر کامل‌تر و بهتر (فارسی).',
  ]

  if (params.extraContext && params.extraContext.trim().length > 0) {
    lines.push('زمینهٔ اضافی:', params.extraContext.trim())
  }

  if (retryHint) {
    lines.push('تذکر اصلاحی:', retryHint)
  }

  return lines.join('\n')
}

function extractJsonText(raw: string): string {
  const trimmed = raw.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fenced?.[1]) {
    return fenced[1].trim()
  }

  const startObj = trimmed.indexOf('{')
  const endObj = trimmed.lastIndexOf('}')
  if (startObj >= 0 && endObj > startObj) {
    return trimmed.slice(startObj, endObj + 1)
  }

  const startArr = trimmed.indexOf('[')
  const endArr = trimmed.lastIndexOf(']')
  if (startArr >= 0 && endArr > startArr) {
    return trimmed.slice(startArr, endArr + 1)
  }

  return trimmed
}

function parseJsonUnknown(text: string): unknown {
  try {
    return JSON.parse(text) as unknown
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    throw new Error(`پاسخ AI JSON معتبر نبود: ${message}`)
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function softCoerce(value: unknown): unknown {
  if (value === null || value === undefined) return ''
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.map(softCoerce)
  if (isPlainObject(value)) {
    const next: Record<string, unknown> = {}
    for (const [key, nested] of Object.entries(value)) {
      next[key] = softCoerce(nested)
    }
    return next
  }
  return value
}

function candidatePayloads(data: unknown): unknown[] {
  const candidates: unknown[] = [data, softCoerce(data)]

  if (!isPlainObject(data)) return candidates

  const wrapperKeys = ['data', 'result', 'output', 'payload', 'persona', 'form', 'value']
  for (const key of wrapperKeys) {
    const nested = data[key]
    if (nested !== undefined) {
      candidates.push(nested, softCoerce(nested))
    }
  }

  for (const nested of Object.values(data)) {
    if (isPlainObject(nested)) {
      candidates.push(nested, softCoerce(nested))
    }
  }

  return candidates
}

function tryParseWithSchema<TSchema extends z.ZodType>(
  schema: TSchema,
  data: unknown,
): z.infer<TSchema> | null {
  for (const candidate of candidatePayloads(data)) {
    const parsed = schema.safeParse(candidate)
    if (parsed.success) return parsed.data
  }
  return null
}

export async function runAiFormAssist<TSchema extends z.ZodType>(
  params: AiFormAssistParams<TSchema>,
): Promise<AiFormAssistResult<z.infer<TSchema>>> {
  async function generateOnce(retryHint?: string): Promise<z.infer<TSchema>> {
    const { text } = await generateText({
      model: createGroqModel(),
      system: buildSystemPrompt(),
      prompt: buildUserPrompt(params, retryHint),
    })

    const jsonText = extractJsonText(text)
    const raw: unknown = parseJsonUnknown(jsonText)
    const data = tryParseWithSchema(params.schema, raw)

    if (data === null) {
      const snippet = jsonText.length > 240 ? `${jsonText.slice(0, 240)}…` : jsonText
      throw new Error(
        `پاسخ ساخت‌یافته از AI با اسکیما هم‌خوان نیست. نمونه پاسخ: ${snippet}`,
      )
    }

    assertNoForbiddenScripts(data)
    return data
  }

  try {
    const data = await generateOnce()
    return { data }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    if (!message.includes('روسی') && !message.includes('سیریلیک')) {
      throw e instanceof Error ? e : new Error(message)
    }
    const data = await generateOnce(
      'پاسخ قبلی حروف غیرمجاز (مثل روسی) داشت. دوباره فقط با فارسی بنویس؛ هیچ حرف سیریلیک نگذار.',
    )
    return { data }
  }
}
