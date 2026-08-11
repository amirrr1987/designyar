---
name: jiti
description: >
  Guides jiti for loading TypeScript ESLint config (eslint.config.ts) in UX Flow. Use when
  ESLint cannot load .ts config, jiti runtime, or TypeScript config bootstrapping.
---

# jiti (UX Flow)

Package: `jiti` ^2.7. Runtime TypeScript/ESM loader used so tools can execute `eslint.config.ts` without a separate compile step.

## Project wiring

Present as a **devDependency** so ESLint can load [`eslint.config.ts`](../../../eslint.config.ts). Usually transparent — no direct imports in app `src/`.

## Package interfaces (mandatory)

jiti is a loader for `eslint.config.ts` — prefer its automatic ESLint integration over importing jiti into app code or inventing a custom TS-config bootstrap. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

If scripting with jiti explicitly, use the package’s exported `createJiti` / documented API rather than a local loader twin.

## Rules

1. Keep `eslint.config.ts` (not only `.mjs`) — jiti enables the TS config file.
2. If ESLint fails to load the config, verify `jiti` is installed and matches ESLint 10 expectations.
3. Do not use jiti inside the Vue app runtime bundle.
4. Prefer fixing config syntax over replacing with a compiled `eslint.config.js` unless requested.

## Checklist

- [ ] `jiti` in devDependencies
- [ ] `eslint.config.ts` loads successfully
- [ ] Not imported from `src/`
