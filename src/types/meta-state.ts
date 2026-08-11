import { isAiHistoryEntryArray, type AiHistoryEntry } from './ai-history'

export interface MetaState {
  projectSynthesis: string
  aiHistory: AiHistoryEntry[]
}

export function createDefaultMetaState(): MetaState {
  return {
    projectSynthesis: '',
    aiHistory: [],
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isMetaState(value: unknown): value is MetaState {
  if (!isRecord(value)) return false
  return (
    typeof value.projectSynthesis === 'string' && isAiHistoryEntryArray(value.aiHistory)
  )
}
