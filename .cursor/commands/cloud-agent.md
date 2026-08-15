# Cloud agent

Run or prepare a **Cloud / background** agent task for this repo.

1. Only when the user explicitly asks for a cloud/background agent
2. Restate the task, branch expectations, and that product rules still apply (antdv, RTL, no WebLLM)
3. Cloud agents may have their own shell — remind the user this **repo policy** still prefers showing commands when work returns to the local agent with the deny-shell hook
4. Do not force-push; do not merge PRs
5. After the cloud run, summarize diff and offer `/bugbot` + `/security-review` + `ux-flow-reviewer`
