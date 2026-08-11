import { shallowRef, type ShallowRef } from 'vue'
import { CreateMLCEngine, type MLCEngineInterface } from '@mlc-ai/web-llm'
import { useAiStore } from '@/stores/ai'

export const WEBLLM_MODELS = [
  'SmolLM2-360M-Instruct-q4f16_1-MLC',
  'SmolLM2-1.7B-Instruct-q4f16_1-MLC',
  'Phi-3.5-mini-instruct-q4f16_1-MLC',
  'Llama-3.2-1B-Instruct-q4f16_1-MLC',
] as const

export type WebLLMModelId = (typeof WEBLLM_MODELS)[number]

export function isWebLLMModelId(value: string): value is WebLLMModelId {
  return (WEBLLM_MODELS as readonly string[]).includes(value)
}

/** Shared engine instance for the session (not persisted). */
const engine: ShallowRef<MLCEngineInterface | null> = shallowRef(null)

export function useWebLLM() {
  const aiStore = useAiStore()

  async function initModel(modelId?: string): Promise<void> {
    const id = modelId?.trim() || aiStore.selectedModelId
    if (!id) {
      aiStore.setError('شناسه مدل خالی است')
      return
    }

    aiStore.setLoading(true)
    aiStore.setError('')
    aiStore.setProgress(0)
    aiStore.setReady(false)

    try {
      if (modelId) aiStore.setSelectedModelId(id)
      engine.value = await CreateMLCEngine(id, {
        initProgressCallback: (report) => {
          aiStore.setProgress(Math.round(report.progress * 100))
        },
      })
      aiStore.setReady(true)
    } catch (e: unknown) {
      engine.value = null
      aiStore.setReady(false)
      aiStore.setError(e instanceof Error ? e.message : String(e))
    } finally {
      aiStore.setLoading(false)
    }
  }

  async function chat(prompt: string, systemPrompt?: string): Promise<string> {
    const e = engine.value
    if (!e) {
      const msg = 'مدل آماده نیست — ابتدا مدل را بارگذاری کنید'
      aiStore.setError(msg)
      throw new Error(msg)
    }

    aiStore.setError('')
    aiStore.setLoading(true)

    try {
      const messages = [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user' as const, content: prompt },
      ]

      const reply = await e.chat.completions.create({
        messages,
        stream: false,
      })

      const content = reply.choices[0]?.message?.content ?? ''
      aiStore.setLastResponse(content)
      return content
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      aiStore.setError(msg)
      throw err instanceof Error ? err : new Error(msg)
    } finally {
      aiStore.setLoading(false)
    }
  }

  function unload(): void {
    engine.value = null
    aiStore.setReady(false)
    aiStore.setProgress(0)
  }

  return {
    engine,
    models: WEBLLM_MODELS,
    initModel,
    chat,
    unload,
  }
}
