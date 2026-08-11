import type { AiActionId } from '@/utils/ai-prompts'
import {
  isAiFlowStepDraft,
  isAiIdeaDraft,
  isAiPersonaDraft,
  isAiStructuredJson,
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

export function parseApplyPayload(action: AiActionId, responseText: string): AiApplyPayload | null {
  const parsed = extractJsonCandidate(responseText)
  const root = normalizeStructuredRoot(parsed)
  if (!root) return null

  switch (action) {
    case 'persona-suggest':
      return parsePersonas(root.personas)
    case 'generate-hmw':
      return parseHmw(root.hmwQuestions)
    case 'brainstorm-ideas':
      return parseIdeas(root.ideas)
    case 'suggest-userflow':
      return parseFlowSteps(root.flowSteps)
    default:
      return null
  }
}

export function supportsApply(action: AiActionId): boolean {
  return (
    action === 'persona-suggest' ||
    action === 'generate-hmw' ||
    action === 'brainstorm-ideas' ||
    action === 'suggest-userflow'
  )
}
