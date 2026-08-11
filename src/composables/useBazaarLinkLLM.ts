import OpenAI from 'openai'
import type { ChatCompletionMessageParam, ClientOptions } from 'openai/resources'
import { BAZAARLINK_BASE_URL } from '@/constants/bazaarlink'
import { useAiStore } from '@/stores/ai'

function resolveApiKey(storedKey: string): string {
  const envKey = import.meta.env.VITE_BAZAARLINK_API_KEY?.trim() ?? ''
  return storedKey.trim() || envKey
}

function createClient(apiKey: string): OpenAI {
  const options: ClientOptions = {
    baseURL: BAZAARLINK_BASE_URL,
    apiKey,
    dangerouslyAllowBrowser: true,
  }
  return new OpenAI(options)
}

export function useBazaarLinkLLM() {
  const aiStore = useAiStore()

  async function initModel(modelId?: string): Promise<void> {
    const apiKey = resolveApiKey(aiStore.bazaarlinkApiKey)
    if (!apiKey) {
      aiStore.setError('کلید API وارد نشده — در پنل AI یا فایل .env.local')
      aiStore.setReady(false)
      return
    }

    aiStore.setLoading(true)
    aiStore.setError('')
    aiStore.setProgress(0)
    aiStore.setReady(false)

    try {
      if (modelId) aiStore.setSelectedModelId(modelId)
      aiStore.setReady(true)
    } catch (e: unknown) {
      aiStore.setReady(false)
      aiStore.setError(e instanceof Error ? e.message : String(e))
    } finally {
      aiStore.setLoading(false)
    }
  }

  async function chat(prompt: string, systemPrompt?: string): Promise<string> {
    const apiKey = resolveApiKey(aiStore.bazaarlinkApiKey)
    if (!apiKey) {
      const msg = 'کلید API وارد نشده — ابتدا کلید را تنظیم کنید'
      aiStore.setError(msg)
      throw new Error(msg)
    }

    aiStore.setError('')
    aiStore.setLoading(true)

    try {
      const client = createClient(apiKey)
      const messages: ChatCompletionMessageParam[] = [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user' as const, content: prompt },
      ]

      const completion = await client.chat.completions.create({
        model: aiStore.selectedModelId,
        messages,
      })

      const content = completion.choices[0]?.message?.content ?? ''
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
    aiStore.setReady(false)
    aiStore.setProgress(0)
  }

  return {
    initModel,
    chat,
    unload,
  }
}
