import { z } from 'zod'

export const challengeSchema = z.object({
  action: z.string(),
  person: z.string(),
  problem: z.string(),
})

export type ChallengeDefinition = z.infer<typeof challengeSchema>

export function createEmptyChallenge(): ChallengeDefinition {
  return { action: '', person: '', problem: '' }
}

export function formatChallengeSentence(challenge: ChallengeDefinition): string {
  const action = challenge.action.trim() || '…'
  const person = challenge.person.trim() || '…'
  const problem = challenge.problem.trim() || '…'
  return `چطور می‌توانیم ${action} برای ${person} تا ${problem}؟`
}

export const defineStateSchema = z.object({
  challenge: challengeSchema,
  problems: z.array(z.string()),
  povs: z.array(z.string()),
  hmw: z.array(z.string()),
})

export type DefineState = z.infer<typeof defineStateSchema>

export function createDefaultDefineState(): DefineState {
  return {
    challenge: createEmptyChallenge(),
    problems: [''],
    povs: [''],
    hmw: [''],
  }
}

function normalizeChallenge(raw: unknown): ChallengeDefinition {
  if (!raw || typeof raw !== 'object') return createEmptyChallenge()
  const record = raw as Record<string, unknown>
  return {
    action: typeof record.action === 'string' ? record.action : '',
    person: typeof record.person === 'string' ? record.person : '',
    problem: typeof record.problem === 'string' ? record.problem : '',
  }
}

export function normalizeDefineState(raw: unknown): DefineState {
  const parsed = defineStateSchema.safeParse(raw)
  if (parsed.success) {
    return {
      challenge: parsed.data.challenge,
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
    challenge: normalizeChallenge(record.challenge),
    problems: problems.length > 0 ? problems : [''],
    povs: povs.length > 0 ? povs : [''],
    hmw: hmw.length > 0 ? hmw : [''],
  }
}

export const challengeAiSchema = z.object({
  challenge: challengeSchema,
})

export const problemsAiSchema = z.object({
  problems: z.array(z.string()).min(1),
})

export const povsAiSchema = z.object({
  povs: z.array(z.string()).min(1),
})

export const hmwAiSchema = z.object({
  hmw: z.array(z.string()).min(1),
})
