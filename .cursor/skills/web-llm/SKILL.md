---
name: web-llm
description: >
  Guides @mlc-ai/web-llm client-side LLM integration for UX Flow — CreateMLCEngine,
  model loading progress, chat helpers, and AIPanel patterns. Use when working with
  WebLLM, MLC AI, in-browser models, useWebLLM, AI suggestions, or @mlc-ai/web-llm.
---

# @mlc-ai/web-llm (UX Flow)

Package: `@mlc-ai/web-llm` ^0.2. Runs **entirely in the browser** — no backend. Encapsulate in `composables/useWebLLM.ts` and surface UI via antdv (`Spin`, `Progress`, `Button`, `Input`, `Alert`) per [ant-design-vue](../ant-design-vue/SKILL.md) and [ux-flow](../ux-flow/SKILL.md).

## Import

```ts
import * as webllm from '@mlc-ai/web-llm'
// or
import { CreateMLCEngine, type MLCEngineInterface } from '@mlc-ai/web-llm'
```

## Composable skeleton

```ts
import { ref } from 'vue'
import { CreateMLCEngine, type MLCEngineInterface } from '@mlc-ai/web-llm'

export function useWebLLM() {
  const engine = ref<MLCEngineInterface | null>(null)
  const isLoading = ref(false)
  const isReady = ref(false)
  const progress = ref(0)
  const response = ref('')
  const error = ref('')
  const selectedModel = ref('SmolLM2-360M-Instruct-q4f32_1-MLC')

  const availableModels = [
    'SmolLM2-360M-Instruct-q4f32_1-MLC', // fast demos
    'Phi-3.5-mini-instruct-q4f32_1-MLC',
    'Llama-3.1-8B-Instruct-q4f32_1-MLC',
    'Mistral-7B-Instruct-v0.3-q4f32_1-MLC',
  ] as const

  async function initModel(modelId?: string) {
    isLoading.value = true
    error.value = ''
    try {
      engine.value = await CreateMLCEngine(modelId ?? selectedModel.value, {
        initProgressCallback: (report) => {
          progress.value = Math.round(report.progress * 100)
        },
      })
      isReady.value = true
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
      isReady.value = false
    } finally {
      isLoading.value = false
    }
  }

  async function chat(prompt: string, systemPrompt?: string) {
    if (!engine.value) throw new Error('مدل آماده نیست')
    response.value = ''
    const messages = [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      { role: 'user' as const, content: prompt },
    ]
    const reply = await engine.value.chat.completions.create({ messages, stream: false })
    response.value = reply.choices[0]?.message?.content ?? ''
    return response.value
  }

  return {
    engine, isLoading, isReady, progress, response, error,
    selectedModel, availableModels, initModel, chat,
  }
}
```

## UX features to wire

Persian system prompts for:

- پیشنهاد پرسونا
- تحلیل یادداشت پژوهش
- پیشنهاد بهبود UX
- تولید میکروکپی
- خلاصه یافته‌ها

Show load progress with antdv `Progress` / `Spin`; errors with `Alert`.

## Package interfaces (mandatory)

Use `@mlc-ai/web-llm` exported types for the engine and chat payloads — never `any` for completions. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

| Need | Package type / API |
|------|---------------------|
| Engine | `MLCEngineInterface`, `CreateMLCEngine` |
| Init progress | callback report from `initProgressCallback` (type from package / inferred) |
| Chat messages | package chat message / completion types when exported; otherwise infer from `chat.completions.create` |
| App UI around AI | antdv `ButtonProps`, `ProgressProps`, `AlertProps` for controls |

```ts
import {
  CreateMLCEngine,
  type MLCEngineInterface,
} from '@mlc-ai/web-llm'
import type { Ref, ShallowRef } from 'vue'

const engine: ShallowRef<MLCEngineInterface | null> = shallowRef(null)

async function chat(prompt: string): Promise<string> {
  const e = engine.value
  if (!e) throw new Error('مدل آماده نیست')
  const reply = await e.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    stream: false,
  })
  return reply.choices[0]?.message?.content ?? ''
}
```

Prefer package types for engine options; keep domain prompt strings as `string` / app unions.

## Rules

1. Never call a remote LLM API — only WebLLM in-browser.
2. Default to a **small** model for first load; let user switch models in UI.
3. Keep engine in composable or `stores/ai.ts` — one shared instance.
4. Persist model preference with VueUse `useStorage` if needed; do not persist huge weights.
5. Handle WebGPU / init failures with clear Persian error messages.
6. Type engine refs as `MLCEngineInterface | null` (prefer `shallowRef`).

## Checklist

- [ ] Logic in `useWebLLM` (or ai store)
- [ ] Progress + error surfaced in antdv UI
- [ ] `MLCEngineInterface` + typed completions; no `any`
- [ ] Features match Phase 7 (AI Panel)
