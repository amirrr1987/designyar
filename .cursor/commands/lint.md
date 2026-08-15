# Lint

Ask the user to run the full lint pipeline. Do **not** execute the command yourself.

Show this exact command:

```bash
pnpm run lint
```

One-line purpose: runs oxlint then ESLint (`run-s lint:*`).

Then stop and wait until the user confirms (✅ / انجام دادم) before fixing issues or continuing.
