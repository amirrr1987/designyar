/**
 * Thin facade over AiProvider / ai store — prefer `useAiStore().completeAssist` in new UI.
 * Kept for compatibility with older call sites.
 */
import { GROQ_MODELS, isGroqModelId, type GroqModelId } from '@/ai/groq-provider'
import { useAiStore } from '@/stores/ai'

export { GROQ_MODELS, isGroqModelId, type GroqModelId }

export function useGroq() {
  const aiStore = useAiStore()

  function validateApiKey(): boolean {
    if (!isGroqModelId(aiStore.selectedModelId)) {
      aiStore.setSelectedModelId('groq/compound-mini')
    }
    return aiStore.validateProvider()
  }

  async function chat(prompt: string, systemPrompt?: string): Promise<string> {
    return aiStore.completeAssist(prompt, systemPrompt)
  }

  return {
    models: GROQ_MODELS,
    validateApiKey,
    chat,
    hasApiKey: () => aiStore.provider.isAvailable(),
  }
}
