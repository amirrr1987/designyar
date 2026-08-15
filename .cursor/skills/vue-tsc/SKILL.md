---
name: vue-tsc
description: >
  Guides vue-tsc type-checking for UX Flow Vue SFCs — npm run type-check and build gate.
  Use when fixing Vue/TS types, running vue-tsc --build, or vue-tsc package.
---

# vue-tsc (UX Flow)

Package: `vue-tsc` ^3.3. Type-checks `.vue` + TS using the project references setup.

## Script

```json
"type-check": "vue-tsc --build",
"build": "run-p type-check \"build-only {@}\" --"
```

Confirm before running. `--build` uses root `tsconfig.json` references (`app` + `node`).

## Package interfaces (mandatory)

`vue-tsc` enforces package interfaces at CI time — treat a clean `vue-tsc --build` as the gate that antdv `*Props`, Vue Router `RouteRecordRaw`, Pinia store types, etc. are actually used. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

Do not “fix” errors by:

- introducing `any` / `as any`
- deleting `noUncheckedIndexedAccess`
- replacing package types with looser local interfaces

## Rules

1. Prefer `vue-tsc --build` over plain `tsc` for this Vue app.
2. Fix type errors in `src/**/*.vue` and `src/**/*.ts` — do not weaken tsconfig to silence errors unless user asks.
3. Incremental info goes to `node_modules/.tmp/*.tsbuildinfo` (see app/node tsconfigs).
4. Pair with [typescript](../typescript/SKILL.md) and [vue-tsconfig](../vue-tsconfig/SKILL.md).
5. antdv / Pinia / VueUse / AI SDK / Zod code must stay on **package** types — no `any` escapes.

## Checklist

- [ ] `type-check` uses `vue-tsc --build`
- [ ] Build still depends on type-check via `run-p`
- [ ] SFCs included through `tsconfig.app.json`
- [ ] Failures fixed with real package types, not casts
