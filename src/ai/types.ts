/**
 * Abstract AI runtime — Groq today; local/WebLLM can implement the same contract later.
 */

export type AiProviderId = 'groq' | 'local'

export interface AiChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AiCompleteRequest {
  messages: AiChatMessage[]
  /** Optional model override; provider may ignore. */
  modelId?: string
  temperature?: number
  /** Streaming chunks — `full` is cumulative text so far. */
  onDelta?: (chunk: string, full: string) => void
}

export interface AiCompleteResult {
  text: string
  modelId: string
  providerId: AiProviderId
}

export interface AiProvider {
  readonly id: AiProviderId
  readonly displayName: string
  /** True when credentials / engine are available for assist. */
  isAvailable(): boolean
  complete(request: AiCompleteRequest): Promise<AiCompleteResult>
}

export class AiProviderError extends Error {
  readonly code: 'missing_key' | 'request_failed' | 'empty_response'

  constructor(code: AiProviderError['code'], message: string) {
    super(message)
    this.name = 'AiProviderError'
    this.code = code
  }
}
