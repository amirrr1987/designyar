import type { AiActionId } from '@/utils/ai-prompts'
import {
  isAiEmpathyMapDraft,
  isAiFlowStepDraft,
  isAiIdeaDraft,
  isAiPersonaDraft,
  isAiProjectBriefDraft,
  isAiStatementDraft,
  isAiStructuredJson,
  isAiSitemapNodeDraftArray,
  type AiApplyPayload,
  type AiStructuredJson,
} from '@/types/ai-response'

const JSON_FENCE = /```(?:json)?\s*([\s\S]*?)```/i

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function extractJsonCandidate(text: string): unknown {
  const trimmed = text.trim()
  if (!trimmed) return null

  const fenceMatch = JSON_FENCE.exec(trimmed)
  if (fenceMatch?.[1]) {
    try {
      return JSON.parse(fenceMatch[1].trim()) as unknown
    } catch {
      // fall through
    }
  }

  const jsonStart = trimmed.indexOf('{')
  const jsonEnd = trimmed.lastIndexOf('}')
  if (jsonStart >= 0 && jsonEnd > jsonStart) {
    try {
      return JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1)) as unknown
    } catch {
      // fall through
    }
  }

  try {
    return JSON.parse(trimmed) as unknown
  } catch {
    return null
  }
}

function normalizeStructuredRoot(parsed: unknown): AiStructuredJson | null {
  if (!isRecord(parsed)) return null

  if (isAiStructuredJson(parsed.apply)) {
    return parsed.apply
  }

  if (isAiStructuredJson(parsed)) {
    return parsed
  }

  return null
}

function parsePersonas(value: unknown): AiApplyPayload | null {
  if (!Array.isArray(value)) return null
  const items = value.filter(isAiPersonaDraft)
  if (items.length === 0) return null
  return { type: 'personas', items }
}

function parseHmw(value: unknown): AiApplyPayload | null {
  if (!Array.isArray(value)) return null
  const items = value.filter((q): q is string => typeof q === 'string' && q.trim().length > 0)
  if (items.length === 0) return null
  return { type: 'hmw', items }
}

function parseIdeas(value: unknown): AiApplyPayload | null {
  if (!Array.isArray(value)) return null
  const items = value.filter(isAiIdeaDraft)
  if (items.length === 0) return null
  return { type: 'ideas', items }
}

function parseFlowSteps(value: unknown): AiApplyPayload | null {
  if (!Array.isArray(value)) return null
  const items = value.filter(isAiFlowStepDraft)
  if (items.length === 0) return null
  return { type: 'flowSteps', items }
}

function parseProblem(value: unknown): AiApplyPayload | null {
  if (!isAiStatementDraft(value)) return null
  if (!value.user.trim() && !value.need.trim() && !value.insight.trim()) return null
  return { type: 'problem', item: value }
}

function parsePov(value: unknown): AiApplyPayload | null {
  if (!isAiStatementDraft(value)) return null
  if (!value.user.trim() && !value.need.trim() && !value.insight.trim()) return null
  return { type: 'pov', item: value }
}

function parseProjectBrief(root: AiStructuredJson): AiApplyPayload | null {
  const title =
    typeof root.briefTitle === 'string'
      ? root.briefTitle
      : typeof root.briefTitle === 'undefined'
        ? ''
        : null
  const description =
    typeof root.briefDescription === 'string'
      ? root.briefDescription
      : typeof root.briefDescription === 'undefined'
        ? ''
        : null
  if (title === null || description === null) return null
  if (!title.trim() && !description.trim()) return null
  return { type: 'projectBrief', item: { briefTitle: title.trim(), briefDescription: description.trim() } }
}

function parseTestSummary(value: unknown): AiApplyPayload | null {
  if (typeof value !== 'string' || !value.trim()) return null
  return { type: 'testSummary', item: value.trim() }
}

function parseResearchNotes(value: unknown): AiApplyPayload | null {
  if (typeof value !== 'string' || !value.trim()) return null
  return { type: 'researchNotes', item: value.trim() }
}

function parseEmpathyMaps(value: unknown): AiApplyPayload | null {
  if (!Array.isArray(value)) return null
  const items = value.filter(isAiEmpathyMapDraft)
  if (items.length === 0) return null
  return { type: 'empathyMaps', items }
}

function parseSitemapNodes(value: unknown): AiApplyPayload | null {
  if (!isAiSitemapNodeDraftArray(value)) return null
  const items = value.filter((n) => n.title.trim().length > 0)
  if (items.length === 0) return null
  return { type: 'sitemap', items }
}

function parseSortCards(value: unknown): AiApplyPayload | null {
  if (!Array.isArray(value)) return null
  const items = value.filter((label): label is string => typeof label === 'string' && label.trim().length > 0)
  if (items.length === 0) return null
  return { type: 'sortCards', items }
}

export function parseApplyPayload(action: AiActionId, responseText: string): AiApplyPayload | null {
  const parsed = extractJsonCandidate(responseText)
  const root = normalizeStructuredRoot(parsed)
  if (!root) {
    if (action === 'summarize-test' && responseText.trim()) {
      return { type: 'testSummary', item: responseText.trim() }
    }
    return null
  }

  switch (action) {
    case 'persona-suggest':
      return parsePersonas(root.personas)
    case 'generate-hmw':
      return parseHmw(root.hmwQuestions)
    case 'brainstorm-ideas':
      return parseIdeas(root.ideas)
    case 'suggest-userflow':
      return parseFlowSteps(root.flowSteps)
    case 'suggest-sitemap':
      return parseSitemapNodes(root.sitemapNodes)
    case 'suggest-card-sort':
      return parseSortCards(root.sortCards)
    case 'test-to-hmw':
      return parseHmw(root.hmwQuestions)
    case 'refine-problem':
      return parseProblem(root.problem)
    case 'refine-pov':
      return parsePov(root.pov)
    case 'improve-project-brief':
      return parseProjectBrief(root)
    case 'seed-research-notes':
      return parseResearchNotes(root.researchNotes)
    case 'synthesize-empathy':
      return parseEmpathyMaps(root.empathyMaps)
    case 'summarize-test':
      return parseTestSummary(root.testSummary) ?? (responseText.trim() ? { type: 'testSummary', item: responseText.trim() } : null)
    default:
      return null
  }
}

export function supportsApply(action: AiActionId): boolean {
  return (
    action === 'persona-suggest' ||
    action === 'generate-hmw' ||
    action === 'brainstorm-ideas' ||
    action === 'suggest-userflow' ||
    action === 'suggest-sitemap' ||
    action === 'suggest-card-sort' ||
    action === 'test-to-hmw' ||
    action === 'refine-problem' ||
    action === 'refine-pov' ||
    action === 'improve-project-brief' ||
    action === 'seed-research-notes' ||
    action === 'synthesize-empathy' ||
    action === 'summarize-test'
  )
}
