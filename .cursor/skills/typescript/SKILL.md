---
name: typescript
description: >
  Guides TypeScript ~6 for UX Flow — project references, strict app typing, and tooling
  configs. Use when editing tsconfig, TypeScript compiler options, or typescript package.
---

# typescript (UX Flow)

Package: `typescript` ~6.0. Type-check via [vue-tsc](../vue-tsc/SKILL.md), not raw `tsc` for Vue SFCs.

## Project layout

| File | Role |
|------|------|
| `tsconfig.json` | Solution-style references only |
| `tsconfig.app.json` | App/`src` via `@vue/tsconfig` |
| `tsconfig.node.json` | Tooling via `@tsconfig/node24` |

## Rules

1. Keep **project references** at the root — do not collapse into one mega tsconfig without reason.
2. App code: strong typing, `noUncheckedIndexedAccess` already on — avoid `any` (especially antdv props).
3. Use `vue-tsc --build` for checks (`npm run type-check`).
4. Align with [vue-tsconfig](../vue-tsconfig/SKILL.md) and [tsconfig-node24](../tsconfig-node24/SKILL.md).
5. All new app files are TypeScript / `lang="ts"`.

## Checklist

- [ ] Root references app + node projects
- [ ] No unchecked `any` in new code
- [ ] Type-check script uses vue-tsc
