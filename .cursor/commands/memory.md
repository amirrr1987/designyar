# Memory

Help the user save durable **Cursor Memories** / preferences (personal, not committed secrets).

Suggest these memory bullets (user confirms what to save):

- UX Flow: never run Shell; show `pnpm` commands and wait for ✅
- UI: ant-design-vue named imports + Tailwind utilities; no SFC `<style>`
- Chat: Persian with user; product UI Persian RTL
- AI: prefer `ai` + `@ai-sdk/groq`; `groq-sdk` legacy only in `src/ai/`
- Package manager: pnpm

Do **not** store API keys in Memories. Point to `.env.local` (gitignored) for `VITE_GROQ_API_KEY`.
