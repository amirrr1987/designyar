import { createGroqProvider, type GroqProviderOptions } from './groq-provider'
import type { AiProvider, AiProviderId } from './types'

let activeProvider: AiProvider | null = null

export function getAiProvider(options: GroqProviderOptions): AiProvider {
  if (!activeProvider) {
    activeProvider = createGroqProvider(options)
  }
  return activeProvider
}

/** Swap provider (tests / future local LLM). */
export function setAiProvider(provider: AiProvider): void {
  activeProvider = provider
}

export function getActiveProviderId(): AiProviderId | null {
  return activeProvider?.id ?? null
}
