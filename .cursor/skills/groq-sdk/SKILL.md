---
name: groq-sdk
description: >
  Guides leftover groq-sdk (^0.37) in UX Flow — Groq client, ChatCompletionCreateParams,
  dangerouslyAllowBrowser. Use only when editing src/ai/groq-provider.ts or groq-sdk.
  New AI work uses ai + @ai-sdk/groq + @ai-sdk/vue instead.
---

# groq-sdk (UX Flow — legacy)

Package: `groq-sdk` ^0.37. **Still installed** and used by [`src/ai/groq-provider.ts`](../../../src/ai/groq-provider.ts).

**Canonical stack for new AI code:** [ai](../ai/SKILL.md) + [ai-sdk-groq](../ai-sdk-groq/SKILL.md) + [ai-sdk-vue](../ai-sdk-vue/SKILL.md) + [zod](../zod/SKILL.md).

Do not add new `groq-sdk` call sites. Do not reinstall WebLLM. When touching `src/ai/`, migrate that path toward `ai` + `@ai-sdk/groq` if the task allows.

## Existing wiring

Browser client (key is public in the bundle — demo only):

```ts
import Groq from 'groq-sdk'
import type { ChatCompletionCreateParams } from 'groq-sdk/resources/chat/completions'

const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
})
```

Confirm commands with the user. Narrow `VITE_GROQ_API_KEY` (`string | undefined`) before use.

## Package interfaces (mandatory)

If you **must** edit the legacy provider, use `groq-sdk` exports — not a local `interface GroqConfig`. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

| Need | Package type / API |
|------|---------------------|
| Client | `Groq` default export |
| Client options | constructor arg (`apiKey`, `dangerouslyAllowBrowser`, …) |
| Chat params | `ChatCompletionCreateParams` from `groq-sdk/resources/chat/completions` |
| Stream chunks | inferred from `client.chat.completions.create` |

```ts
import Groq from 'groq-sdk'
import type { ChatCompletionCreateParams } from 'groq-sdk/resources/chat/completions'

const params: ChatCompletionCreateParams = {
  model: 'groq/compound-mini',
  messages: [{ role: 'user', content: 'سلام' }],
  stream: true,
}

const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true })
const stream = await groq.chat.completions.create(params)
```

App-level `AiProvider` / `AiCompleteRequest` in `src/ai/types.ts` are **domain** types wrapping the SDK — do not duplicate `ChatCompletionCreateParams` as `MyGroqParams`.

## Rules

1. New panel/chat/stream work → `streamText` / `generateText` from `ai`, not `groq-sdk`.
2. No `@mlc-ai/web-llm`, no Next.js `app/api/chat`.
3. Compound extras (`compound_custom`) are Groq-specific; keep them in the legacy file until migrated.
4. Errors: `catch (e: unknown)` then `e instanceof Error ? e.message : String(e)`.

## Checklist

- [ ] No new imports of `groq-sdk` outside `src/ai/`
- [ ] Legacy edits use `Groq` + `ChatCompletionCreateParams`
- [ ] New features go through `ai` / `@ai-sdk/groq`
- [ ] Uses package interfaces (no hand-rolled twins)
