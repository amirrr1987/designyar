export interface ProblemStatement {
  user: string
  need: string
  insight: string
}

export interface POV {
  user: string
  need: string
  insight: string
  /** Optional linked persona id from Empathize. */
  personaId?: string
}

export interface HMWItem {
  id: string
  question: string
  votes: number
}

export function createEmptyProblemStatement(): ProblemStatement {
  return { user: '', need: '', insight: '' }
}

export function createEmptyPOV(): POV {
  return { user: '', need: '', insight: '' }
}

export function assembleProblemSentence(p: ProblemStatement): string {
  const user = p.user.trim() || '…'
  const need = p.need.trim() || '…'
  const insight = p.insight.trim() || '…'
  return `${user} نیاز دارد به ${need}؛ چون ${insight}.`
}

export function assemblePOVSentence(p: POV): string {
  const user = p.user.trim() || '…'
  const need = p.need.trim() || '…'
  const insight = p.insight.trim() || '…'
  return `${user} نیاز دارد که ${need}؛ چون ${insight}.`
}

export function isProblemStatement(value: unknown): value is ProblemStatement {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.user === 'string' && typeof v.need === 'string' && typeof v.insight === 'string'
  )
}

export function isPOV(value: unknown): value is POV {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  const personaOk = v.personaId === undefined || typeof v.personaId === 'string'
  return (
    typeof v.user === 'string' &&
    typeof v.need === 'string' &&
    typeof v.insight === 'string' &&
    personaOk
  )
}

export function isHMWItem(value: unknown): value is HMWItem {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    typeof v.question === 'string' &&
    typeof v.votes === 'number' &&
    Number.isFinite(v.votes)
  )
}

export function isHMWItemArray(value: unknown): value is HMWItem[] {
  return Array.isArray(value) && value.every(isHMWItem)
}
