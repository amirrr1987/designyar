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

## Package interfaces (mandatory)

This package ships **JSON bases**, not runtime TS interfaces. Consume it only via `"extends": "@vue/tsconfig/tsconfig.dom.json"` — do not copy the base into the repo as a hand-maintained twin. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

App domain + library props still use their own package types (`ButtonProps`, `RouteRecordRaw`, …) under this DOM config.

## Rules

1. Keep `src/**/*.vue` included so `vue-tsc` type-checks SFCs.
2. Preserve `@/*` path mapping to match Vite alias.
3. Keep incremental `tsBuildInfoFile` under `node_modules/.tmp/`.
4. Do not switch app base to a Node tsconfig.
5. Do not vendor a fork of `@vue/tsconfig` into the repo.

## Checklist

- [ ] Extends `@vue/tsconfig/tsconfig.dom.json`
- [ ] `src` + `.vue` included
- [ ] Paths align with Vite `@`
- [ ] No local duplicate of the package base config
