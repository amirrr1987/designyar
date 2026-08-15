# Figma → code

Implement or sync UI from Figma into this Vue + ant-design-vue app.

1. Load Figma skills **before** MCP tools (`figma-design-to-code` before `get_design_context`; `figma-use` before `use_figma`)
2. Treat Figma/MCP output as a **reference** — remap to antdv named imports + package `*Props` + Tailwind utilities
3. No shadcn / no SFC `<style>` / keep Persian RTL
4. Reuse existing project components and `ThemeConfig` tokens when possible
5. After implementation, optionally run the **ux-flow-reviewer** subagent
