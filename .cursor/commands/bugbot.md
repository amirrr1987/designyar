# Bugbot

Run Cursor **Bugbot** review on local changes.

1. Follow the built-in **review-bugbot** skill
2. Launch exactly one Task subagent: `subagent_type: "bugbot"`, description `Bugbot`, `run_in_background: false`
3. Prompt shape:

```text
Full Repository Path: D:\Projects\GitHub\designyar
Diff: branch changes
```

4. Default Diff is `branch changes`; use `uncommitted changes` only if the user asks for dirty-only
5. Do not compute the diff yourself before launching
6. Summarize findings for the user; do not auto-commit fixes unless asked
