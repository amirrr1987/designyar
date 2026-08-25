---
name: ai
description: >
  Guides the Vercel AI SDK `ai` package (^7) for UX Flow — generateText, streamText,
  UIMessage, Output. Use when calling Groq via the AI SDK, streaming completions,
  structured output, or the `ai` npm package.
---

# ai (UX Flow)

Package: `ai` ^7. Core SDK. Groq models: [ai-sdk-groq](../ai-sdk-groq/SKILL.md). Vue UI: [ai-sdk-vue](../ai-sdk-vue/SKILL.md). Docs: [AI SDK](https://ai-sdk.dev) · Groq page: [Vercel AI SDK + Groq](https://console.groq.com/docs/ai-sdk/).

This app is **Vue + Vite, client-only**. Do not copy that page’s Next.js `app/api/chat` or `ai/react`.

## Project wiring

Call `generateText` / `streamText` from composables (e.g. `src/composables/`). Pass a Groq model from `@ai-sdk/groq`. Confirm install/dev commands with the user.

## Package interfaces (mandatory)

Use official exports — never local clones of message/result shapes. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

| Need | Package type / API |
|------|---------------------|
| Generate | `generateText`, `streamText` from `ai` |
| Chat UI messages | `UIMessage`, `convertToModelMessages` |
| Structured object | `Output` from `ai` + Zod (`zod` is a dependency) |
| Stream response helpers | `toUIMessageStreamResponse` / `createUIMessageStreamResponse` (server only — not this SPA) |

```ts
import { generateText, streamText, type UIMessage } from 'ai'
import { groq } from '@ai-sdk/groq'

const { text } = await generateText({
  model: groq('openai/gpt-oss-120b'),
  prompt: 'یک جمله POV به فارسی بنویس.',
})

const result = streamText({
  model: groq('openai/gpt-oss-120b'),
  prompt: 'خلاصه یادداشت تحقیق',
})

for await (const delta of result.textStream) {
  void delta
}

const history: UIMessage[] = []
```

## Rules

1. Prefer `streamText` for the AI panel; `generateText` for one-shot apply-to-store.
2. No Next.js routes, no `ai/react`, no `react-markdown`.
3. Errors: `catch (e: unknown)` then `e instanceof Error ? e.message : String(e)`.
4. Do not replace antdv `Form` / `Rule` with AI SDK types.
5. Structured JSON from the model: `Output.object` + [zod](../zod/SKILL.md) — not for persona/HMW form fields (`Rule`).

## Checklist

- [ ] Imports from `ai` (not `groq-sdk`)
- [ ] `UIMessage` / official result fields — no hand-rolled message twins
- [ ] Client composable, not `app/api/chat`
- [ ] Uses package interfaces (no hand-rolled twins)
