---
name: types-node
description: >
  Guides @types/node usage for UX Flow Node tooling TypeScript — node:url, process,
  Buffer types in vite.config and eslint.config. Use when typing Node APIs, @types/node,
  or tsconfig.node types array.
---

# @types/node (UX Flow)

Package: `@types/node` ^24. Provides TypeScript types for Node built-ins used by tooling configs.

## Project wiring

Enabled only in [`tsconfig.node.json`](../../../tsconfig.node.json):

```json
"compilerOptions": {
  "types": ["node"]
}
```

Engines in `package.json`: `"node": "^22.18.0 || >=24.12.0"` — keep `@types/node` major aligned with that.

## Common usage

```ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

Prefer `node:` protocol imports (`node:url`, `node:fs`, `node:path`).

## Package interfaces (mandatory)

`@types/node` provides ambient/`node:` module types — use them directly (`URL`, `Buffer`, `process`) instead of declaring local ambient twins. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

```ts
import { fileURLToPath } from 'node:url'
import type { Buffer } from 'node:buffer'
```

## Rules

1. Do **not** add `"types": ["node"]` to `tsconfig.app.json` — app code is DOM/`@vue/tsconfig`.
2. Use Node types only in Vite/ESLint/tooling files under `tsconfig.node.json` include.
3. Avoid depending on ambient Node globals in `src/` Vue app code.
4. Prefer official `node:` typings over hand-written `declare module 'fs'`.

## Checklist

- [ ] `@types/node` available for tooling TS
- [ ] App tsconfig does not pull Node types globally
- [ ] Prefer `node:` imports
- [ ] No hand-rolled Node ambient duplicates
