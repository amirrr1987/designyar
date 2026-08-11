---
name: eslint-config-prettier
description: >
  Guides eslint-config-prettier for UX Flow — disables ESLint formatting rules that conflict
  with oxfmt/Prettier. Use when editing skipFormatting, prettier ESLint integration, or
  eslint-config-prettier.
---

# eslint-config-prettier (UX Flow)

Package: `eslint-config-prettier` ^10. Turns off ESLint rules that fight the formatter.

## Project wiring

[`eslint.config.ts`](../../../eslint.config.ts):

```ts
import skipFormatting from 'eslint-config-prettier/flat'

export default defineConfigWithVueTs(
  // …lint rules
  skipFormatting,
)
```

Place **last** (or after style-related configs) so it wins.

## Rules

1. This project formats with **oxfmt** (`npm run format`) — ESLint must not enforce formatting.
2. Use the **flat** export: `eslint-config-prettier/flat`.
3. Do not re-enable stylistic ESLint rules that Prettier/oxfmt own.
4. See [oxfmt](../oxfmt/SKILL.md) and [eslint](../eslint/SKILL.md).

## Checklist

- [ ] `skipFormatting` imported from `/flat`
- [ ] Applied after Vue/TS rule sets
- [ ] Format via oxfmt, not ESLint
