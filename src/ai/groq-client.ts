import { createGroq } from '@ai-sdk/groq'

/** Default chat model — JSON via prompt+Zod (not Groq json_schema). */
const DEFAULT_MODEL_ID = 'llama-3.3-70b-versatile'

export function getGroqApiKey(): string | undefined {
  const key = import.meta.env.VITE_GROQ_API_KEY
  if (typeof key !== 'string' || key.trim().length === 0) {
    return undefined
  }
  return key.trim()
}

export function requireGroqApiKey(): string {
  const key = getGroqApiKey()
  if (!key) {
    throw new Error('کلید VITE_GROQ_API_KEY تنظیم نشده است.')
  }
  return key
}

export function createGroqModel(modelId: string = DEFAULT_MODEL_ID) {
  const groq = createGroq({
    apiKey: requireGroqApiKey(),
  })
  return groq(modelId)
}

export { DEFAULT_MODEL_ID }
