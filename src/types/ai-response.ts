import type { EmpathyQuadrants } from '@/types/empathy-map'
import { isEmpathyQuadrants } from '@/types/empathy-map'
import type { FlowNodeKind } from '@/types/ideate'
import { isFlowNodeKind } from '@/types/ideate'
import type { MicrocopyCategory } from '@/types/microcopy'
import { isMicrocopyCategory } from '@/types/microcopy'

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

export interface AiMicrocopyDraft {
  category: MicrocopyCategory
  text: string
  context?: string
}

export interface AiSitemapNodeDraft {
  title: string
  children?: AiSitemapNodeDraft[]
}

export interface AiCompetitorDraft {
  name: string
  strength: string
  weakness: string
  url?: string
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
  | { type: 'sitemap'; items: AiSitemapNodeDraft[] }
  | { type: 'sortCards'; items: string[] }
  | { type: 'microcopy'; items: AiMicrocopyDraft[] }
  | { type: 'wireframeBlocks'; items: string[] }
  | { type: 'competitors'; items: AiCompetitorDraft[] }

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

export function isAiMicrocopyDraft(value: unknown): value is AiMicrocopyDraft {
  if (!isRecord(value)) return false
  const contextOk = value.context === undefined || typeof value.context === 'string'
  return isMicrocopyCategory(value.category) && typeof value.text === 'string' && contextOk
}

function isAiSitemapNodeDraft(value: unknown): value is AiSitemapNodeDraft {
  if (!isRecord(value)) return false
  if (typeof value.title !== 'string') return false
  if (value.children === undefined) return true
  return Array.isArray(value.children) && value.children.every(isAiSitemapNodeDraft)
}

export function isAiSitemapNodeDraftArray(value: unknown): value is AiSitemapNodeDraft[] {
  return Array.isArray(value) && value.every(isAiSitemapNodeDraft)
}

export function isAiCompetitorDraft(value: unknown): value is AiCompetitorDraft {
  if (!isRecord(value)) return false
  const urlOk = value.url === undefined || typeof value.url === 'string'
  return (
    typeof value.name === 'string' &&
    typeof value.strength === 'string' &&
    typeof value.weakness === 'string' &&
    urlOk
  )
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
  sitemapNodes?: unknown
  sortCards?: unknown
  microcopyItems?: unknown
  wireframeBlocks?: unknown
  competitors?: unknown
}

export function isAiStructuredJson(value: unknown): value is AiStructuredJson {
  return isRecord(value)
}
