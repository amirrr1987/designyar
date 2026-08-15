# Security review

Run Cursor **Security Review** on local changes.

1. Follow the built-in **review-security** skill
2. Launch exactly one Task subagent: `subagent_type: "security-review"`, description `Security Review`, `run_in_background: false`
3. Prompt shape:

```text
Full Repository Path: D:\Projects\GitHub\designyar
Diff: branch changes
Custom Instructions: Focus on VITE_GROQ_API_KEY / client bundle secrets, LocalStorage PII, XSS via v-html, and unsafe AI prompt injection from stored user text.
```

4. Default Diff is `branch changes`; use `uncommitted changes` if the user asks
5. Report Critical / Warning only; suggest fixes without committing unless asked
