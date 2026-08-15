---
name: phase-wrap-up-commit
description: >
  At the end of UX Flow work, announces which phase/micro-phase completed and drafts a
  ready-to-paste git commit message from the actual changes. Use when finishing a phase,
  wrapping up a session, asking for a commit message, or after keep-a-changelog bump.
---

# Phase wrap-up + commit message (UX Flow)

Mandatory **end-of-work** closeout. After coding (micro-phase or full phase), always:

1. State **which phase completed**
2. Give a **git commit message** the user can paste (do **not** run `git commit` unless they explicitly ask)

Pairs with [keep-a-changelog](../keep-a-changelog/SKILL.md) at full phase end. Product map: [ux-flow](../ux-flow/SKILL.md).

## When to run

Run when **any** of these is true:

1. A micro-phase or Phase 0–8 block just finished
2. User says work is done / «تمام» / asks for commit text
3. After quality gate + changelog bump for a phase
4. User asks «کدام فاز؟» or «متن commit»

## Workflow

```
1. Identify scope completed (phase + optional micro-phase ids from plan.md)
2. Summarize notable file/capability changes (from this session — not raw git log)
3. Announce phase status in the fixed format below
4. Draft commit message (subject + body) matching that work
5. Show copyable commit text — wait; user runs git themselves (manual-commands rule)
```

## Phase announcement (required)

Use this block at the end of the reply:

```markdown
### وضعیت فاز
- **فاز:** Phase X — <عنوان کوتاه فارسی/انگلیسی از plan>
- **ریزفاز:** X.Y.Z … (اگر فقط بخشی از فاز بود؛ وگرنه «کامل»)
- **نسخه:** x.y.z یا بدون bump / هنوز Unreleased
- **وضعیت:** انجام شد | نیمه‌کاره (مانده: …)
```

Phase titles (reference):

| Phase | Title |
|-------|--------|
| 0 | Project foundation |
| 1 | Layout & navigation |
| 2 | Empathize |
| 3 | Define |
| 4 | Ideate |
| 5 | Prototype |
| 6 | Test |
| 7 | AI assist (Groq) |
| 8 | Persistence & export |

If only a micro-phase finished (e.g. `0.3`), say Phase 0 **نیمه‌کاره** and list remaining `0.4` / `0.5`.

## Commit message rules

1. **Why over what** — focus on purpose of the change set.
2. **Subject** ≤ ~72 chars; imperative mood; optional prefix:
   - `feat:` new capability / phase deliverable
   - `fix:` bugfix
   - `chore:` tooling, skills, rules, changelog-only
   - `refactor:` no behavior change
3. **Body** (optional but preferred for phase closes): 2–5 bullets of notable outcomes.
4. Match **actual** work this session — never invent files you did not touch.
5. Persian OK in body; keep subject English or bilingual short — prefer English conventional subjects for git.
6. If version bumped: mention `x.y.z` in body.
7. **Do not** run `git add` / `git commit` unless the user explicitly requests a commit. Give text only.

### Template

````markdown
### متن commit (کپی کن)

```
feat: <subject>

- <bullet>
- <bullet>

Phase X (<status>). Version x.y.z (if bumped).
```
````

### Examples

**Full Phase 0 closed → 0.1.0:**

```
feat: bootstrap UX Flow foundation with RTL and typed stores

- Add domain types, Design Thinking constants, and six lazy routes
- Wire ConfigProvider fa_IR RTL and Pinia useStorage stores
- Remove scaffold counter store and App styles

Phase 0 complete. Version 0.1.0.
```

**Micro-phase only (0.3):**

```
feat: add Design Thinking routes and placeholder views

- Register home + five step routes with typed RouteMeta
- Add Card-based placeholder views for each step

Phase 0 micro-phase 0.3 done (stores + smoke still pending).
```

## Checklist

- [ ] Phase / micro-phase named clearly
- [ ] Version / Unreleased status stated
- [ ] Commit subject reflects real work
- [ ] Body bullets match files/capabilities delivered
- [ ] No git commit executed unless user asked
- [ ] If full phase done, keep-a-changelog already applied or pointed out
