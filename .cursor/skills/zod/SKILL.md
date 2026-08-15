---
name: zod
description: >
  Guides zod ^4 runtime schemas for UX Flow — z.object, z.infer, safeParse, AI SDK
  Output.object. Use when validating JSON/LocalStorage/unknown, structured AI output,
  or the zod package. Do not replace ant-design-vue Form Rule with Zod.
---

# zod (UX Flow)

Package: `zod` ^4. Runtime validation + inferred types at **untrusted boundaries**. Forms stay [ant-design-vue](../ant-design-vue/SKILL.md) `Rule`. AI structured objects: [ai](../ai/SKILL.md).

## When

- `JSON.parse`, LocalStorage, import files, `unknown` payloads
- `Output.object` / structured model JSON
- **Not** persona/HMW/antdv field validation — that is `Rule` / `FormInstance`

## Package interfaces (mandatory)

Use `zod` exports. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

| Need | Package type / API |
|------|---------------------|
| Namespace | `z` from `zod` |
| Schema values | `z.ZodType` / inferred from `z.object` … |
| Inferred type | `z.infer<typeof schema>` |
| Input vs output | `z.input<typeof schema>`, `z.output<typeof schema>` |
| Parse result | `safeParse` → `{ success: true; data } \| { success: false; error }` |
| Errors | `z.ZodError` — `error.issues` |

```ts
import { z } from 'zod'

export const personaSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  role: z.string(),
})

export type Persona = z.infer<typeof personaSchema>

export function parsePersona(data: unknown): Persona | null {
  const result = personaSchema.safeParse(data)
  return result.success ? result.data : null
}
```

Prefer `safeParse` over `parse` in UI paths (no throw). Do not clone Zod’s result shape into a local `interface ParseOk<T>`.

## AI SDK

```ts
import { generateText, Output } from 'ai'
import { groq } from '@ai-sdk/groq'

const { output } = await generateText({
  model: groq('llama-3.3-70b-versatile'),
  output: Output.object({ schema: personaSchema }),
  prompt: 'یک پرسونا به فارسی بساز',
})
```

`output` is `Persona | undefined` — narrow before use.

## Rules

1. Domain types may be `z.infer<typeof schema>` **or** a hand-written interface plus a matching schema — not a third twin.
2. Never `as Persona` after `JSON.parse` without `safeParse` / a type guard.
3. Persian `message` strings on schemas only when the error is shown to the user; antdv forms still use `Rule`.
4. Do not add `@hookform/resolvers` / React Hook Form.

## Checklist

- [ ] `import { z } from 'zod'`
- [ ] `z.infer<typeof schema>` (no hand-rolled twin of the schema)
- [ ] `safeParse` at JSON / storage / AI boundaries
- [ ] antdv `Rule` unchanged for in-app forms
- [ ] Uses package interfaces (no hand-rolled twins)
