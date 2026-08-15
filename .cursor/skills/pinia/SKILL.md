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
| `stores/ai.ts` | `ai` | Groq prefs / last responses |

## Package interfaces (mandatory)

Use Pinia’s exported types — do not type stores as `any` or untyped return bags. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

| Need | Package type / API |
|------|---------------------|
| Store factory | `defineStore` (setup form) |
| Pinia instance | `Pinia`, `createPinia` |
| Store type helper | `Store`, `StoreDefinition`, `ReturnType<typeof useXStore>` |
| Outside-component use | `storeToRefs` for reactive field refs |

```ts
import { defineStore, storeToRefs, type Pinia } from 'pinia'
import type { RemovableRef } from '@vueuse/core'

export const usePersonaStore = defineStore('persona', () => {
  const personas: RemovableRef<Persona[]> = useStorage<Persona[]>('ux-flow-personas', [])
  // …
  return { personas, count, add, remove }
})

export type PersonaStore = ReturnType<typeof usePersonaStore>
```

```ts
const store = usePersonaStore()
const { personas, count } = storeToRefs(store)
```

Domain entities (`Persona`, `Project`) are **app** interfaces; persistence refs use VueUse generics; store shape comes from `ReturnType<typeof useXStore>`.

## Rules

1. Use **setup stores** (`defineStore(id, () => { ... })`), not options API.
2. Put `useStorage` inside the store — views call actions/getters, not raw keys.
3. Keep UI Persian strings in components; stores hold data structures.
4. No backend sync — LocalStorage only.
5. Import stores as `useXStore()` in `<script setup>`; do not use `this.$pinia` patterns.
6. Prefer `storeToRefs` + Pinia/`ReturnType` typing over reinventing store state interfaces.

## Checklist

- [ ] `createPinia()` in `main.ts`
- [ ] Setup store + typed state
- [ ] Pinia/VueUse package types at boundaries (`ReturnType`, `storeToRefs`, `useStorage<T>`)
- [ ] Persistence via `useStorage`
- [ ] One store per domain module
