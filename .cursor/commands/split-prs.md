# Split to PRs

Split the current chat/branch/diff into small reviewable PRs.

1. Follow the built-in **split-to-prs** skill
2. Propose slices first (titles + optional Mermaid) — **wait for approval** before any git branch/commit/push
3. Because Shell is denied by project hook: print exact git/`gh` commands for the user to run, step by step
4. Prefer independent PRs off default branch; stack only when dependency is real
5. No `git add .` — stage named paths only
6. No destructive git (`reset --hard`, force-push, branch delete) without explicit user approval
