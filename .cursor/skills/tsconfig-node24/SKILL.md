---
name: tsconfig-node24
description: >
  Guides @tsconfig/node24 usage in this UX Flow project — Node tooling tsconfig via
  tsconfig.node.json for Vite/ESLint configs. Use when editing tsconfig.node.json,
  Node TypeScript bases, or @tsconfig/node24.
---

# @tsconfig/node24 (UX Flow)

Package: `@tsconfig/node24` ^24. Base config for **Node-side** TS files (Vite, ESLint configs).

## Project wiring

[`tsconfig.node.json`](../../../tsconfig.node.json) extends this package:

```json
{
  "extends": "@tsconfig/node24/tsconfig.json",
  "include": ["vite.config.*", "eslint.config.*", "vitest.config.*", "cypress.config.*", "playwright.config.*"],
  "compilerOptions": {
    "module": "preserve",
    "moduleResolution": "bundler",
    "types": ["node"],
    "noEmit": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo"
  }
}
```

Root [`tsconfig.json`](../../../tsconfig.json) references `./tsconfig.node.json` (project references).

## Rules

1. Do **not** extend `@tsconfig/node24` from `tsconfig.app.json` (app uses `@vue/tsconfig`).
2. Keep Node configs listed in `include` only.
3. Keep `"types": ["node"]` so random `@types/*` do not leak in.
4. Prefer editing `tsconfig.node.json` overrides over forking the base package.

## Checklist

- [ ] Node tooling files covered by `tsconfig.node.json`
- [ ] Still extends `@tsconfig/node24/tsconfig.json`
- [ ] `noEmit: true` for type-check-only builds
