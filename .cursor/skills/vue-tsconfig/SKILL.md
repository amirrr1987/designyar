---
name: vue-tsconfig
description: >
  Guides @vue/tsconfig for the UX Flow app TypeScript project — tsconfig.app.json extends
  tsconfig.dom.json, paths, vue-tsc build info. Use when editing app tsconfig, @vue/tsconfig,
  or DOM Vue compiler options.
---

# @vue/tsconfig (UX Flow)

Package: `@vue/tsconfig` ^0.9. Shared Vue + DOM TS bases.

## Project wiring

[`tsconfig.app.json`](../../../tsconfig.app.json):

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue"],
  "exclude": ["src/**/__tests__/*"],
  "compilerOptions": {
    "noUncheckedIndexedAccess": true,
    "paths": { "@/*": ["./src/*"] },
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo"
  }
}
```

Use `tsconfig.dom.json` for browser app code. Node tooling uses `@tsconfig/node24` instead ([tsconfig-node24](../tsconfig-node24/SKILL.md)).

## Rules

1. Keep `src/**/*.vue` included so `vue-tsc` type-checks SFCs.
2. Preserve `@/*` path mapping to match Vite alias.
3. Keep incremental `tsBuildInfoFile` under `node_modules/.tmp/`.
4. Do not switch app base to a Node tsconfig.

## Checklist

- [ ] Extends `@vue/tsconfig/tsconfig.dom.json`
- [ ] `src` + `.vue` included
- [ ] Paths align with Vite `@`
