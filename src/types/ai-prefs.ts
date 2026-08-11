export interface AiPrefs {
  /** Groq model id preference. */
  selectedModelId: string
}

export const DEFAULT_GROQ_MODEL_ID = 'groq/compound-mini'

export function createDefaultAiPrefs(): AiPrefs {
  return {
    selectedModelId: DEFAULT_GROQ_MODEL_ID,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isAiPrefs(value: unknown): value is AiPrefs {
  if (!isRecord(value)) return false
  return typeof value.selectedModelId === 'string'
}
