# Loop QA

Recurring QA tick in this session (Cursor **loop**).

1. Confirm interval with the user (default `10m`) and what to re-check
2. Typical prompt: RTL snapshot via Browser MCP on the active route, or remind user to re-run `pnpm run type-check` if types changed
3. Use `/loop <interval> <prompt>` semantics from the built-in loop skill
4. Because Shell is blocked: do **not** start a background `while true` shell loop. Instead, on each user ping / interval request, run one QA pass and ask whether to schedule another
5. Stop when the user says stop
