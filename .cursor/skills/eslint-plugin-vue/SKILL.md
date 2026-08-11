---
name: eslint-plugin-vue
description: >
  Guides eslint-plugin-vue flat/essential rules for UX Flow Vue SFCs. Use when fixing Vue
  ESLint issues, template lint rules, or eslint-plugin-vue.
---

# eslint-plugin-vue (UX Flow)

Package: `eslint-plugin-vue` ~10.9. Vue-specific ESLint rules for `.vue` files.

## Project wiring

[`eslint.config.ts`](../../../eslint.config.ts):

```ts
import pluginVue from 'eslint-plugin-vue'

export default defineConfigWithVueTs(
  ...pluginVue.configs['flat/essential'],
  // …
)
```

Uses **flat/essential** — keep unless user requests `flat/recommended` or `flat/strongly-recommended`.

## Package interfaces (mandatory)

Use the plugin’s flat config exports (`pluginVue.configs['flat/essential']`) — do not reinvent Vue rule sets. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

```ts
import pluginVue from 'eslint-plugin-vue'
import type { Linter } from 'eslint'

const vueEssential: Linter.Config[] = pluginVue.configs['flat/essential']
```

## Rules

1. Respect Vue 3 + `<script setup>` patterns; do not suggest Options-API-only fixes.
2. Parser chain is provided via `@vue/eslint-config-typescript` + [vue-eslint-parser](../vue-eslint-parser/SKILL.md).
3. UI still follows antdv no-custom-CSS — lint does not replace that product rule.
4. Prefer essential severity; escalate configs only when asked.

## Checklist

- [ ] `flat/essential` spread into flat config
- [ ] Official plugin configs used (no hand-rolled Vue rule twin)
- [ ] `.vue` files in ESLint `files` glob
- [ ] Compatible with TS script setup
