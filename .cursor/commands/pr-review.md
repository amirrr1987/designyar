# PR review

Prepare this branch for a pull-request review.

1. Summarize notable changes (features / fixes / risks) without running git unless the user asks for a commit/PR
2. Remind the user to run on the PR (Cursor / GitHub):
   - **Bugbot** review
   - **Security Review** (especially `VITE_GROQ_API_KEY`, client AI, LocalStorage)
3. Optionally invoke the **ux-flow-reviewer** subagent on `src/` diffs
4. If creating a PR, wait for explicit user request; then follow the project's PR user-rule (show `gh` commands if shell is blocked — user runs them)
