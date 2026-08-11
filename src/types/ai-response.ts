import type { FlowNodeKind } from '@/types/ideate'
import { isFlowNodeKind } from '@/types/ideate'

export interface AiPersonaDraft {
  name: string
  role: string
  goals: string
  pains: string
  bio: string
  age?: number | null
}

export interface AiIdeaDraft {
  title: string
  detail: string
  tags?: string[]
}

export interface AiFlowStepDraft {
  kind: FlowNodeKind
  label: string
}

export type AiApplyPayload =
  | { type: 'personas'; items: AiPersonaDraft[] }
  | { type: 'hmw'; items: string[] }
  | { type: 'ideas'; items: AiIdeaDraft[] }
  | { type: 'flowSteps'; items: AiFlowStepDraft[] }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isAiPersonaDraft(value: unknown): value is AiPersonaDraft {
  if (!isRecord(value)) return false
  const ageOk = value.age === undefined || value.age === null || typeof value.age === 'number'
  return (
    typeof value.name === 'string' &&
    typeof value.role === 'string' &&
    typeof value.goals === 'string' &&
    typeof value.pains === 'string' &&
    typeof value.bio === 'string' &&
    ageOk
  )
}

export function isAiIdeaDraft(value: unknown): value is AiIdeaDraft {
  if (!isRecord(value)) return false
  const tagsOk =
    value.tags === undefined ||
    (Array.isArray(value.tags) && value.tags.every((t) => typeof t === 'string'))
  return typeof value.title === 'string' && typeof value.detail === 'string' && tagsOk
}

export function isAiFlowStepDraft(value: unknown): value is AiFlowStepDraft {
  if (!isRecord(value)) return false
  return isFlowNodeKind(value.kind) && typeof value.label === 'string'
}

export interface AiStructuredJson {
  personas?: unknown
  hmwQuestions?: unknown
  ideas?: unknown
  flowSteps?: unknown
}

export function isAiStructuredJson(value: unknown): value is AiStructuredJson {
  return isRecord(value)
}
