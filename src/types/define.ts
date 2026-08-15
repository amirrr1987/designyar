import { z } from 'zod'

export const defineStateSchema = z.object({
  problemStatement: z.string(),
  pov: z.string(),
  hmw: z.array(z.string()),
})

export type DefineState = z.infer<typeof defineStateSchema>

export function createDefaultDefineState(): DefineState {
  return {
    problemStatement: '',
    pov: '',
    hmw: [''],
  }
}

export const problemAiSchema = z.object({
  problemStatement: z.string(),
})

export const povAiSchema = z.object({
  pov: z.string(),
})

export const hmwAiSchema = z.object({
  hmw: z.array(z.string()).min(1),
})
