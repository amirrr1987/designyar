---
name: pinia
description: >
  Guides Pinia ^4 state management for UX Flow — defineStore setup stores, VueUse
  useStorage inside stores, and module stores (project, persona, designSystem, ai).
  Use when creating or editing Pinia stores, global state, or pinia.
---

# Pinia (UX Flow)

Package: `pinia` ^4 with Vue 3. Setup API stores only. Persist via [vueuse-core](../vueuse-core/SKILL.md) `useStorage` inside stores.

## App setup

```ts
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

## Store pattern

```ts
// stores/persona.ts
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'

export interface Persona {
  id: string
  name: string
  role: string
}

export const usePersonaStore = defineStore('persona', () => {
  const personas = useStorage<Persona[]>('ux-flow-personas', [])

  const count = computed(() => personas.value.length)

  function add(persona: Persona) {
    personas.value = [...personas.value, persona]
  }

  function remove(id: string) {
    personas.value = personas.value.filter((p) => p.id !== id)
  }

  return { personas, count, add, remove }
})
```

## Required stores

| Store file | Id | Responsibility |
|------------|-----|----------------|
| `stores/project.ts` | `project` | Name, current step, createdAt |
| `stores/persona.ts` | `persona` | Empathize personas / research |
| `stores/designSystem.ts` | `designSystem` | Colors, type, grid |
| `stores/ai.ts` | `ai` | WebLLM prefs / last responses |

## Rules

1. Use **setup stores** (`defineStore(id, () => { ... })`), not options API.
2. Put `useStorage` inside the store — views call actions/getters, not raw keys.
3. Keep UI Persian strings in components; stores hold data structures.
4. No backend sync — LocalStorage only.
5. Import stores as `useXStore()` in `<script setup>`; do not use `this.$pinia` patterns.

## Checklist

- [ ] `createPinia()` in `main.ts`
- [ ] Setup store + typed state
- [ ] Persistence via `useStorage`
- [ ] One store per domain module
