import Groq from 'groq-sdk'
import type { ChatCompletionCreateParams } from 'groq-sdk/resources/chat/completions'
import {
  AiProviderError,
  type AiCompleteRequest,
  type AiCompleteResult,
  type AiProvider,
} from './types'

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

export interface GroqProviderOptions {
  /** Default model when request omits modelId. */
  getDefaultModelId: () => string
}

export function createGroqProvider(options: GroqProviderOptions): AiProvider {
  return {
    id: 'groq',
    displayName: 'Groq',

    isAvailable(): boolean {
      return Boolean(readApiKey())
    },

    async complete(request: AiCompleteRequest): Promise<AiCompleteResult> {
      const apiKey = readApiKey()
      if (!apiKey) {
        throw new AiProviderError(
          'missing_key',
          'کلید API یافت نشد — VITE_GROQ_API_KEY را در .env.local تنظیم کنید',
        )
      }

      const rawModel = request.modelId?.trim() || options.getDefaultModelId()
      const modelId = isGroqModelId(rawModel) ? rawModel : 'groq/compound-mini'
      const client = createClient(apiKey)

      const params: GroqChatCreateParams = {
        model: modelId,
        messages: request.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: request.temperature ?? 0.6,
      }

      if (isCompoundModel(modelId)) {
        params.compound_custom = {
          tools: { enabled_tools: [...COMPOUND_ENABLED_TOOLS] },
        }
      }

      try {
        const completion = await client.chat.completions.create(params)
        const text = completion.choices[0]?.message?.content?.trim() ?? ''
        if (!text) {
          throw new AiProviderError('empty_response', 'پاسخ خالی از Groq دریافت شد')
        }
        return { text, modelId, providerId: 'groq' }
      } catch (e: unknown) {
        if (e instanceof AiProviderError) throw e
        const message = e instanceof Error ? e.message : String(e)
        throw new AiProviderError('request_failed', message)
      }
    },
  }
}
