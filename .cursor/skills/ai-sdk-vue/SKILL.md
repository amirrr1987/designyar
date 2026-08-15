---
name: ai-sdk-vue
description: >
  Guides @ai-sdk/vue (^4) for UX Flow Vue 3 — useChat, useCompletion, useObject,
  UIMessage. Use when building the AI panel chat UI, streaming in SFCs, or @ai-sdk/vue.
---

# @ai-sdk/vue (UX Flow)

Package: `@ai-sdk/vue` ^4. Vue composables for [ai](../ai/SKILL.md). Import `useChat` from here — **not** `ai/react`.

This SPA has **no** `/api/chat`. Prefer `streamText` in a composable ([ai](../ai/SKILL.md) + [ai-sdk-groq](../ai-sdk-groq/SKILL.md)). Use `useChat` only with an official `ChatTransport` that does not assume Next.js.

## Package interfaces (mandatory)

Use `@ai-sdk/vue` + `ai` UI types. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

| Need | Package type / API |
|------|---------------------|
| Chat composable | `useChat` from `@ai-sdk/vue` |
| Completion | `useCompletion` from `@ai-sdk/vue` |
| Object stream | `useObject` from `@ai-sdk/vue` |
| Messages | `UIMessage` from `ai` |
| Transport | `ChatTransport` / `DefaultChatTransport` from `ai` |

```ts
import { useChat } from '@ai-sdk/vue'
import type { UIMessage } from 'ai'

const { messages, status, sendMessage, stop, error } = useChat()

const list: UIMessage[] = messages.value
```

Do not type messages as `{ role: string; content: string }[]`. Read `UIMessage.parts`.

`status`: `'submitted' | 'streaming' | 'ready' | 'error'`.

## UI

Surface loading/error with antdv (`Spin`, `Alert`, `Button`) per [ant-design-vue](../ant-design-vue/SKILL.md). No `react-markdown` — existing Vue markdown helpers if needed.

## Rules

1. Import composables from `@ai-sdk/vue` only.
2. Default `useChat()` posts to `/api/chat` — **do not** add a Next.js route. For client Groq, wrap `streamText` or supply a typed `ChatTransport`.
3. `useChat` does not own an input ref (AI SDK 5+). Bind antdv `Input` yourself.
4. Form field validation stays antdv `Rule` — not `useChat`.

## Checklist

- [ ] `@ai-sdk/vue` imports (not `ai/react`)
- [ ] `UIMessage` for chat history
- [ ] No Next `/api/chat` unless the user asks for a server
- [ ] Uses package interfaces (no hand-rolled twins)
