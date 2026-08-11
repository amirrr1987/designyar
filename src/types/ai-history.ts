import type { AiActionId } from '@/utils/ai-prompts'
import type { AiChainId } from '@/constants/ai-chains'
import { isAiActionId } from '@/utils/ai-prompts'
import { isAiChainId } from '@/constants/ai-chains'

export interface AiHistoryDiffLine {
  label: string
  before?: string
  after?: string
}

export interface AiHistoryEntry {
  id: string
  actionId: AiActionId
  actionLabel: string
  appliedAt: string
  applyType: string
  itemCount: number
  summary: string
  diff: AiHistoryDiffLine[]
  chainId?: AiChainId
}

const MAX_HISTORY = 40

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isAiHistoryDiffLine(value: unknown): value is AiHistoryDiffLine {
  if (!isRecord(value)) return false
  const beforeOk = value.before === undefined || typeof value.before === 'string'
  const afterOk = value.after === undefined || typeof value.after === 'string'
  return typeof value.label === 'string' && beforeOk && afterOk
}

export function isAiHistoryEntry(value: unknown): value is AiHistoryEntry {
  if (!isRecord(value)) return false
  const chainId = value.chainId
  const chainOk =
    chainId === undefined || (typeof chainId === 'string' && isAiChainId(chainId))
  return (
    typeof value.id === 'string' &&
    typeof value.actionId === 'string' &&
    isAiActionId(value.actionId) &&
    typeof value.actionLabel === 'string' &&
    typeof value.appliedAt === 'string' &&
    typeof value.applyType === 'string' &&
    typeof value.itemCount === 'number' &&
    typeof value.summary === 'string' &&
    Array.isArray(value.diff) &&
    value.diff.every(isAiHistoryDiffLine) &&
    chainOk
  )
}

export function isAiHistoryEntryArray(value: unknown): value is AiHistoryEntry[] {
  return Array.isArray(value) && value.every(isAiHistoryEntry)
}

export function trimHistoryEntries(entries: AiHistoryEntry[]): AiHistoryEntry[] {
  return entries.slice(0, MAX_HISTORY)
}
