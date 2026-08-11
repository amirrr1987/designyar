import type { EmpathyQuadrants } from '@/types/empathy-map'
import { isEmpathyQuadrants } from '@/types/empathy-map'
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

export interface AiStatementDraft {
  user: string
  need: string
  insight: string
}

export interface AiProjectBriefDraft {
  briefTitle: string
  briefDescription: string
}

export interface AiEmpathyMapDraft {
  personaId: string
  quadrants: EmpathyQuadrants
}

export type AiApplyPayload =
  | { type: 'personas'; items: AiPersonaDraft[] }
  | { type: 'hmw'; items: string[] }
  | { type: 'ideas'; items: AiIdeaDraft[] }
  | { type: 'flowSteps'; items: AiFlowStepDraft[] }
  | { type: 'problem'; item: AiStatementDraft }
  | { type: 'pov'; item: AiStatementDraft }
  | { type: 'projectBrief'; item: AiProjectBriefDraft }
  | { type: 'testSummary'; item: string }
  | { type: 'researchNotes'; item: string }
  | { type: 'empathyMaps'; items: AiEmpathyMapDraft[] }

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

export function isAiStatementDraft(value: unknown): value is AiStatementDraft {
  if (!isRecord(value)) return false
  return (
    typeof value.user === 'string' &&
    typeof value.need === 'string' &&
    typeof value.insight === 'string'
  )
}

export function isAiProjectBriefDraft(value: unknown): value is AiProjectBriefDraft {
  if (!isRecord(value)) return false
  return typeof value.briefTitle === 'string' && typeof value.briefDescription === 'string'
}

export function isAiEmpathyMapDraft(value: unknown): value is AiEmpathyMapDraft {
  if (!isRecord(value)) return false
  return typeof value.personaId === 'string' && isEmpathyQuadrants(value.quadrants)
}

export interface AiStructuredJson {
  personas?: unknown
  hmwQuestions?: unknown
  ideas?: unknown
  flowSteps?: unknown
  problem?: unknown
  pov?: unknown
  briefTitle?: unknown
  briefDescription?: unknown
  testSummary?: unknown
  researchNotes?: unknown
  empathyMaps?: unknown
}

export function isAiStructuredJson(value: unknown): value is AiStructuredJson {
  return isRecord(value)
}
