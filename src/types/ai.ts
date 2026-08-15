import { z } from 'zod'

export const aiPrefsSchema = z.object({
  lastModel: z.string(),
  lastError: z.string(),
})

export type AiPrefs = z.infer<typeof aiPrefsSchema>

export function createDefaultAiPrefs(): AiPrefs {
  return {
    lastModel: 'llama-3.3-70b-versatile',
    lastError: '',
  }
}
