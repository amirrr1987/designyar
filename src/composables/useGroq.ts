import Groq from 'groq-sdk'
import type { ChatCompletionCreateParams } from 'groq-sdk/resources/chat/completions'
import { useAiStore } from '@/stores/ai'

export const GROQ_MODELS = ['groq/compound-mini', 'groq/compound'] as const

export type GroqModelId = (typeof GROQ_MODELS)[number]

export function isGroqModelId(value: string): value is GroqModelId {
  return (GROQ_MODELS as readonly string[]).includes(value)
}

const COMPOUND_ENABLED_TOOLS = ['web_search', 'code_interpreter', 'visit_website'] as const

interface CompoundCustomConfig {
  tools: {
    enabled_tools: string[]
  }
}

type GroqChatCreateParams = ChatCompletionCreateParams & {
  compound_custom?: CompoundCustomConfig
}

function readApiKey(): string {
  const key = import.meta.env.VITE_GROQ_API_KEY
  return typeof key === 'string' ? key.trim() : ''
}

function createClient(apiKey: string): Groq {
  return new Groq({
    apiKey,
    dangerouslyAllowBrowser: true,
  })
}

function isCompoundModel(modelId: string): boolean {
  return modelId.startsWith('groq/compound')
}

export function useGroq() {
  const aiStore = useAiStore()

  function validateApiKey(): boolean {
    if (!isGroqModelId(aiStore.selectedModelId)) {
      aiStore.setSelectedModelId('groq/compound-mini')
    }

    const apiKey = readApiKey()
    if (!apiKey) {
      aiStore.setError(
        'کلید API تنظیم نشده — در .env.local مقدار VITE_GROQ_API_KEY را از console.groq.com/keys قرار دهید',
      )
      aiStore.setReady(false)
      return false
    }
    aiStore.setError('')
    aiStore.setReady(true)
    return true
  }

  async function chat(prompt: string, systemPrompt?: string): Promise<string> {
    const apiKey = readApiKey()
    if (!apiKey) {
      const msg = 'کلید API یافت نشد — VITE_GROQ_API_KEY را در .env.local تنظیم کنید'
      aiStore.setError(msg)
      throw new Error(msg)
    }

    const modelId = aiStore.selectedModelId
    const client = createClient(apiKey)

    aiStore.setError('')
    aiStore.setLoading(true)
    aiStore.setLastResponse('')

    try {
      const messages: ChatCompletionCreateParams['messages'] = [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user' as const, content: prompt },
      ]

      const params: GroqChatCreateParams = {
        model: modelId,
        messages,
        temperature: 1,
        max_completion_tokens: 2048,
        top_p: 1,
        stream: true,
      }

      if (isCompoundModel(modelId)) {
        params.compound_custom = {
          tools: {
            enabled_tools: [...COMPOUND_ENABLED_TOOLS],
          },
        }
      }

      const stream = await client.chat.completions.create(params)

      let full = ''
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? ''
        if (delta) {
          full += delta
          aiStore.setLastResponse(full)
        }
      }

      return full
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      aiStore.setError(msg)
      throw err instanceof Error ? err : new Error(msg)
    } finally {
      aiStore.setLoading(false)
    }
  }

  return {
    models: GROQ_MODELS,
    validateApiKey,
    chat,
    hasApiKey: () => Boolean(readApiKey()),
  }
}
