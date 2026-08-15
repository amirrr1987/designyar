# Debug mode

Investigate a bug with evidence (runtime / UI / types).

1. Prefer **Debug mode** when available; otherwise stay in Agent and be systematic
2. Gather: reproduction steps, console/network symptoms, relevant `src/` files
3. Use Browser MCP for UI bugs; do not run Shell — ask user for `pnpm run dev` / logs
4. Form one hypothesis at a time; minimal fix; then ask user to verify
5. After fix, optionally run **ux-flow-reviewer**
