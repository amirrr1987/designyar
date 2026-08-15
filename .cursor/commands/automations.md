# Automations

Draft a **Cursor Automation** (scheduled / triggered cloud agent) for this repo.

1. Use only when the user explicitly wants Cursor Automations (not CI yaml, not generic “automate”)
2. Follow the built-in **automate** skill: Agents Window finish path; plain-language draft table; no auto-submit
3. Sensible UX Flow automation ideas (pick one the user confirms):
   - Weekly changelog hygiene reminder
   - PR opened → remind Bugbot + Security Review
   - Dependabot-style “check pnpm outdated” note (user runs commands)
4. Automation prompts must include: manual-commands-only, pnpm, no WebLLM, antdv rules
5. Do not embed untracked file contents into the automation draft
