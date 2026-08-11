---
name: keep-a-changelog
description: >
  Ends each UX Flow phase by reviewing the whole project, applying SemVer x.y.z to
  package.json when needed, and updating CHANGELOG.md per Keep a Changelog 1.1.0.
  Use at phase completion, version bumps, release notes, CHANGELOG.md, or SemVer.
---

# Keep a Changelog + SemVer (UX Flow)

Mandatory **phase-end gate**. After a Design Thinking / setup phase is done, review the
repo, decide whether `package.json` `version` must change, then sync `CHANGELOG.md`.

Standards: [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) ·
[SemVer 2.0.0](https://semver.org/spec/v2.0.0.html).

Product phases: [ux-flow](../ux-flow/SKILL.md). Compose: [ux-flow-compose](../ux-flow-compose/SKILL.md).

## When to run

Run this skill when **any** of these is true:

1. User finishes / accepts a phase (Phase 0–8) and is about to move on
2. User asks to bump version, release, or update the changelog
3. Compose / ux-flow workflow reaches “phase done”

Do **not** bump on every tiny edit mid-phase; accumulate under `[Unreleased]` if useful,
then promote at phase end.

## Files of truth

| File | Role |
|------|------|
| `package.json` → `"version"` | Canonical SemVer `MAJOR.MINOR.PATCH` |
| `CHANGELOG.md` | Human-readable notable changes (Keep a Changelog) |

`version` in `package.json` and the newest dated section in `CHANGELOG.md` **must match**
after a release bump.

## Phase-end workflow

```
1. Announce: phase-end version gate
2. Survey the phase (and whole app state) — what shipped that users/devs notice?
3. Classify changes → SemVer decision (or no bump)
4. If bump: update package.json version
5. Update CHANGELOG.md (promote Unreleased / add version section)
6. Summarize for the user: old → new version + why
7. Ask before next phase
```

### 1. Survey (whole project, not git log dump)

Look at what the phase actually delivered across the repo:

- New routes / views / stores / composables / antdv UI
- Breaking API or LocalStorage key changes
- Bug fixes, removals, security-relevant fixes
- Tooling-only changes (usually skip bump unless they affect consumers)

Write **notable** bullets for humans — never paste raw commit subjects.

### 2. SemVer decision (`x.y.z`)

Read current `version` from `package.json`.

| Bump | When (UX Flow) |
|------|----------------|
| **MAJOR** (`x.0.0`) | Breaking change for users or stored data (e.g. wipe/rename LocalStorage schema without migration, remove a public flow). Rare before `1.0.0`. |
| **MINOR** (`0.y.0` or `x.y.0`) | New capability / completed phase feature set (new Design Thinking module UI, WebLLM panel, export/import, …). Default for finishing a phase with user-visible features. |
| **PATCH** (`x.y.z`) | Bug fixes, copy/RTL fixes, small non-breaking polish inside an already-released capability. |
| **No bump** | Docs-only, skill/rules-only, comments, formatting with zero behavior change — still OK to note under `[Unreleased]` or skip. |

**Pre-1.0 (`0.y.z`)** (current app starts at `0.0.0`):

- Prefer **MINOR** when a phase lands new modules (`0.1.0`, `0.2.0`, …).
- Prefer **PATCH** for fix-ups after that phase’s minor.
- Use **MAJOR → `1.0.0`** only when the product is declared stable / production-ready (usually after Phase 8 + success criteria), or when the user asks.

Suggested mapping (guidance, not automatic):

| Phase done | Typical bump if features landed |
|------------|----------------------------------|
| Phase 0 setup | `0.1.0` |
| Phase 1 layout | `0.2.0` |
| Phase 2 Empathize | `0.3.0` |
| Phase 3 Define | `0.4.0` |
| Phase 4 Ideate | `0.5.0` |
| Phase 5 Prototype | `0.6.0` |
| Phase 6 Test | `0.7.0` |
| Phase 7 WebLLM | `0.8.0` |
| Phase 8 persistence | `0.9.0` → later `1.0.0` when stable |

If the phase only fixed bugs on an already-bumped minor, do **PATCH** instead.

Announce the chosen bump and wait if the user might disagree; otherwise apply when they already asked to close the phase.

### 3. Update `package.json`

Set `"version"` to the new `x.y.z` string only. Do not invent other release metadata unless asked.

### 4. Update `CHANGELOG.md`

#### Required skeleton

If the file is missing or not Keep a Changelog-shaped, rewrite the header to:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [x.y.z] - YYYY-MM-DD

### Added

- …

### Changed

- …

### Fixed

- …
```

Rules:

1. Latest version first (below `[Unreleased]`).
2. Date = ISO `YYYY-MM-DD` (release day).
3. Only include **non-empty** change-type sections.
4. Change types (exact English headings): `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.
5. Bullet text may be **Persian** (product UI language); keep headings English per Keep a Changelog.
6. Optional compare links at the bottom are fine; omit if no tags/remote yet.
7. Migrate legacy headings like `## Phase 0.1.1` into proper `[x.y.z]` sections when first applying this skill — do not leave dual formats.

#### On bump

1. Move relevant `[Unreleased]` bullets into the new `## [x.y.z] - YYYY-MM-DD` section (grouped by type).
2. Leave `## [Unreleased]` empty (heading kept).
3. Match `x.y.z` to `package.json`.

#### No bump

- Either leave notes in `[Unreleased]`, or skip file edits.

### 5. User summary (required)

After edits, report briefly:

- Phase closed
- Version: `old` → `new` (or “no bump”)
- SemVer reason (Added / Fixed / breaking / …)
- Point to `CHANGELOG.md` section

## Example

Phase 1 layout finished; was `0.1.0`:

`package.json`: `"version": "0.2.0"`

```markdown
## [Unreleased]

## [0.2.0] - 2026-08-11

### Added

- لایه اصلی Layout، هدر و سایدبار با منوی پنج مرحله دیزاین تینکینگ
- همگام‌سازی Menu و Steps با Vue Router

## [0.1.0] - 2026-08-10

### Added

- راه‌اندازی Vue 3، Pinia، Router، Vite و Ant Design Vue RTL
```

## Anti-patterns

- Dumping `git log` into the changelog
- Bumping without changelog (or changelog without matching `package.json`)
- Empty `### Added` / `### Fixed` sections
- Using phase titles (`Phase 2`) as the version id instead of `x.y.z`
- Silent MAJOR before `1.0.0` without calling out breakage
- Running npm/git version commands without user confirmation (project rule: show command → wait)

## Checklist (phase done)

- [ ] Notable changes reviewed against the **whole** phase deliverable
- [ ] SemVer bump chosen or explicitly skipped
- [ ] `package.json` `version` updated if bumped
- [ ] `CHANGELOG.md` Keep a Changelog 1.1.0 + matching version + ISO date
- [ ] Only non-empty change-type sections
- [ ] User told old → new and why
