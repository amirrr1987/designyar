import { z } from 'zod'

export const defineStateSchema = z.object({
  problems: z.array(z.string()),
  povs: z.array(z.string()),
  hmw: z.array(z.string()),
})

export type DefineState = z.infer<typeof defineStateSchema>

export function createDefaultDefineState(): DefineState {
  return {
    problems: [''],
    povs: [''],
    hmw: [''],
  }
}

export function normalizeDefineState(raw: unknown): DefineState {
  const parsed = defineStateSchema.safeParse(raw)
  if (parsed.success) {
    return {
      problems: parsed.data.problems.length > 0 ? parsed.data.problems : [''],
      povs: parsed.data.povs.length > 0 ? parsed.data.povs : [''],
      hmw: parsed.data.hmw.length > 0 ? parsed.data.hmw : [''],
    }
  }

  if (!raw || typeof raw !== 'object') {
    return createDefaultDefineState()
  }

  const record = raw as Record<string, unknown>
  const problems =
    Array.isArray(record.problems) && record.problems.every((item) => typeof item === 'string')
      ? (record.problems as string[])
      : typeof record.problemStatement === 'string'
        ? [record.problemStatement]
        : ['']

  const povs =
    Array.isArray(record.povs) && record.povs.every((item) => typeof item === 'string')
      ? (record.povs as string[])
      : typeof record.pov === 'string'
        ? [record.pov]
        : ['']

  const hmw =
    Array.isArray(record.hmw) && record.hmw.every((item) => typeof item === 'string')
      ? (record.hmw as string[])
      : ['']

  return {
    problems: problems.length > 0 ? problems : [''],
    povs: povs.length > 0 ? povs : [''],
    hmw: hmw.length > 0 ? hmw : [''],
  }
}

export const problemsAiSchema = z.object({
  problems: z.array(z.string()).min(1),
})

export const povsAiSchema = z.object({
  povs: z.array(z.string()).min(1),
})

export const hmwAiSchema = z.object({
  hmw: z.array(z.string()).min(1),
})
