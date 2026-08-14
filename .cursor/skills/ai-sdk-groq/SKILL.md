---
name: ai-sdk-groq
description: >
  Guides @ai-sdk/groq (^4) for UX Flow — groq(), createGroq, GroqLanguageModelChatOptions,
  browser search, transcription. Use when configuring Groq models, VITE_GROQ_API_KEY,
  streamText with Groq, or @ai-sdk/groq.
---

# @ai-sdk/groq (UX Flow)

Package: `@ai-sdk/groq` ^4. Provider for [ai](../ai/SKILL.md). Official: [Groq provider](https://ai-sdk.dev/providers/ai-sdk-providers/groq).

Replaces `groq-sdk` and WebLLM. Do not add those packages.

## Project wiring

Vite env (browser) — default `GROQ_API_KEY` from Node will **not** work. Pass `apiKey` explicitly:

[`env.d.ts`](../../../env.d.ts):

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GROQ_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

`.env.local` (do not commit):

```
VITE_GROQ_API_KEY=
```

```ts
import { createGroq } from '@ai-sdk/groq'

const groq = createGroq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
})
```

Key is visible in the client bundle — internal/demo only. Confirm commands with the user.

## Package interfaces (mandatory)

Use `@ai-sdk/groq` exports. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

| Need | Package type / API |
|------|---------------------|
| Default provider | `groq` |
| Custom client | `createGroq` |
| Chat options | `GroqLanguageModelChatOptions` |
| Transcription options | `GroqTranscriptionModelOptions` |
| Tools | `groq.tools.browserSearch` |
| Transcription model | `groq.transcription` |

```ts
import { groq, createGroq, type GroqLanguageModelChatOptions } from '@ai-sdk/groq'
import { generateText } from 'ai'

const groqOptions: GroqLanguageModelChatOptions = {
  serviceTier: 'on_demand',
  user: 'ux-flow',
}

const { text } = await generateText({
  model: groq('llama-3.3-70b-versatile'),
  prompt: 'پیشنهاد پرسونا',
  providerOptions: { groq: groqOptions },
})
```

Prefer `satisfies GroqLanguageModelChatOptions` on `providerOptions.groq` when inlining.

Default model for this app: `llama-3.3-70b-versatile` (same as Groq’s AI SDK sample). Browser search only on `openai/gpt-oss-20b` / `openai/gpt-oss-120b`.

## Rules

1. Always `createGroq({ apiKey: import.meta.env.VITE_GROQ_API_KEY })` in Vite — do not rely on `GROQ_API_KEY`.
2. No `groq-sdk`, no `@mlc-ai/web-llm`, no Next.js API route from [console.groq.com/docs/ai-sdk](https://console.groq.com/docs/ai-sdk/).
3. Do not invent a local `interface GroqConfig` — use `createGroq` argument types + `GroqLanguageModelChatOptions`.
4. Narrow `import.meta.env.VITE_GROQ_API_KEY` (`string | undefined`) before calling.

## Checklist

- [ ] `createGroq` / `groq` from `@ai-sdk/groq`
- [ ] `VITE_GROQ_API_KEY` typed on `ImportMetaEnv`
- [ ] Chat extras typed as `GroqLanguageModelChatOptions`
- [ ] Uses package interfaces (no hand-rolled twins)
