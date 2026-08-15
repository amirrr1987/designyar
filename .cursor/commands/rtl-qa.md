# RTL visual QA

Use the **cursor-ide-browser** MCP to visually check Persian RTL UI.

1. Confirm `pnpm run dev` is already running (if not, show the command and wait for ✅)
2. Navigate to the relevant route (home or Design Thinking step)
3. Snapshot + screenshot: layout direction, Menu/Steps alignment, form labels, overflow
4. Report issues only (logical properties, antdv `direction="rtl"`, no LTR leftovers)
5. Do not invent CSS — fix with antdv props + Tailwind logical utilities (`ms-*` / `me-*` / `ps-*` / `pe-*` / `text-start`)
