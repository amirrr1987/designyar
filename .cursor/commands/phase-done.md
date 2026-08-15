# Phase done

Close the current UX Flow micro-phase or full phase.

1. Load `.cursor/skills/phase-wrap-up-commit/SKILL.md`
2. If a **full** phase finished, also load `.cursor/skills/keep-a-changelog/SKILL.md` (SemVer + `CHANGELOG.md`)
3. Announce phase status (phase / micro-phase / version / done|partial)
4. Draft a ready-to-paste git commit message — **do not** run `git commit` unless the user explicitly asks
5. Prefer `pnpm` in any suggested commands; show commands and wait for ✅
