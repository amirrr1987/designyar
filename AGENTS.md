# UX Flow (دیزاین یار) — agent contract

Client-only Vue 3 SPA (`ui-ux-ai`). Package manager: **pnpm** (`pnpm-lock.yaml`).

## Product (Master)

دیزاین یار روند Design Thinking را به **فرم‌های ساده، مرحله‌ای، تک‌کاره** تبدیل می‌کند. در **هر فرم** دکمهٔ **بهبود / تکمیل با AI (Groq)** با پیش‌نمایش و Accept/Edit/Reject.

**Keep:** `src/App.vue` · `src/components/layout/AppLayout.vue` · `src/stores/configProvider.store.ts`  
**Rebuild:** بقیهٔ `src/` روی مدل micro-form (فاز‌به‌فاز).

### Out of scope

- Native mobile apps
- Backend / server auth / sync API
- WebLLM / Next.js `app/api/chat`
- SoftGate / PhaseShell / multi-job dashboards
- Server DevOps beyond static SPA (`vercel.json`)

## Always

1. Entrypoint: `.cursor/skills/ux-flow-compose/SKILL.md`
2. Product: `.cursor/skills/ux-flow/SKILL.md`
3. Rules in `.cursor/rules/` override convenience
4. **Never run shell** — show commands, wait for ✅ (hook denies Shell)
5. Full-safe TypeScript — package interfaces, no `any`
6. UI: antdv named imports + Tailwind utilities; no SFC `<style>`; no shadcn
7. Persian + RTL ([persian-rtl](.cursor/skills/persian-rtl/SKILL.md))
8. New AI: `ai` + `@ai-sdk/groq` + `@ai-sdk/vue`; legacy `groq-sdk` only in `src/ai/`
9. No backend / no WebLLM / no Next.js `app/api/chat`
10. Chat with user in **Persian**; code/identifiers in English
11. **One job per screen**; AI assist never silent-overwrite
12. Build **step-by-step** — announce, finish micro-phase, ask before next

## Cursor kit (repo)

| Capability | Location |
| ---------- | -------- |
| Skills | `.cursor/skills/` |
| Rules | `.cursor/rules/*.mdc` |
| Hooks | `.cursor/hooks.json` → deny Shell |
| Commands | `.cursor/commands/*.md` |
| Subagents | `.cursor/agents/*.md` |
| Docs | Settings → Docs + `/setup-docs` |
| Figma MCP | `/figma-to-code` |
| Browser MCP | `/rtl-qa` |
| Modes | `/plan-phase` `/ask` `/debug` |
| PR tools | `/bugbot` `/security-review` `/autopilot-pr` `/split-prs` `/pr-review` |
| Optional | `/canvas-audit` `/automations` `/loop-qa` `/cloud-agent` `/memory` |

## Slash commands

| Command | Purpose |
| ------- | ------- |
| `/phase-done` | Changelog + commit text |
| `/type-check` `/lint` `/format` | Show pnpm scripts (user runs) |
| `/plan-phase` | Plan before coding |
| `/ask` `/debug` | Mode guidance |
| `/rtl-qa` | Browser RTL QA |
| `/figma-to-code` | Figma → antdv |
| `/setup-docs` | Index @Docs URLs |
| `/bugbot` `/security-review` | Built-in review subagents |
| `/pr-review` `/autopilot-pr` `/split-prs` | PR workflows |
| `/canvas-audit` `/automations` `/loop-qa` | Optional surfaces |
| `/cloud-agent` `/memory` | Cloud agent + personal memory hints |

## Subagents

| Agent | When |
| ----- | ---- |
| `ux-flow-reviewer` | After `src/` edits |
| `ai-migration-reviewer` | AI / Groq / `src/ai/` |
| `rtl-qa-agent` | Layout / RTL |
| `phase-planner` | Start of a phase |

## Preferred docs (@Docs)

- https://antdv.com/components/overview
- https://ai-sdk.dev/docs/introduction
- https://ai-sdk.dev/providers/ai-sdk-providers/groq
- https://vuejs.org/guide/introduction.html
- https://pinia.vuejs.org/
- https://vueuse.org/
- https://zod.dev/
- https://tailwindcss.com/docs
- https://vite.dev/guide/

## User runs

```bash
pnpm install
pnpm run dev
pnpm run type-check
pnpm run lint
pnpm run format
pnpm run build
```

## Deploy

Static SPA — `vercel.json` rewrites to `index.html`.

## One-time machine setup

1. Settings → Hooks: confirm project hooks load (restart Cursor if needed)
2. `/setup-docs` — index URLs above
3. Enable Figma + Browser MCP plugins if missing
4. Optional: paste memories from `/memory` into Cursor Memories
