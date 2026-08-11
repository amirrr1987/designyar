---
name: oxfmt
description: >
  Guides oxfmt formatting for UX Flow — npm run format on src/. Use when formatting code,
  oxfmt config, or replacing Prettier-style format tasks.
---

# oxfmt (UX Flow)

Package: `oxfmt` ^0.59. Project formatter (Prettier-class workflow via Oxc).

## Script

```json
"format": "oxfmt src/"
```

Show the command and wait for user confirmation before running (UX Flow rule).

## Package interfaces (mandatory)

Use oxfmt’s CLI / official config surface for this repo — do not add a second formatter with a parallel config twin. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

## Rules

1. Format **`src/`** with oxfmt — do not add Prettier as a second formatter.
2. ESLint formatting rules are disabled via [eslint-config-prettier](../eslint-config-prettier/SKILL.md).
3. Do not introduce custom CSS just to satisfy format — product UI still uses antdv only.
4. If format scope must grow (e.g. root configs), update the `format` script deliberately.

## Checklist

- [ ] `npm run format` targets `src/`
- [ ] No competing Prettier pipeline
- [ ] Lint remains separate from format
