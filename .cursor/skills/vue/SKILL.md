---
name: vue
description: >
  Guides Vue 3.5+ conventions for UX Flow — script setup, Composition API, TypeScript,
  and SFC structure without `<style>` blocks (antdv + Tailwind utilities). Use when writing Vue SFCs, composables, refs,
  props/emits, or vue core patterns in this project.
---

# Vue 3 (UX Flow)

Package: `vue` ^3.5. All components: **`<script setup lang="ts">`** + Composition API. UI via [ant-design-vue](../ant-design-vue/SKILL.md). Layout extras via [tailwindcss](../tailwindcss/SKILL.md) `class` — **no `<style>` blocks**.

## SFC template

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button, Card } from 'ant-design-vue'

interface Props {
  title: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ save: [id: string] }>()

const loading = ref(false)
const label = computed(() => props.title.trim())

onMounted(() => {
  // init
})
</script>

<template>
  <Card :title="label">
    <Button type="primary" :loading="loading" @click="emit('save', '1')">
      ذخیره
    </Button>
  </Card>
</template>
```

No second `<script>` or Options API components unless migrating legacy (there should be none).

## Conventions

1. **TypeScript everywhere** — typed props, emits, ref generics.
2. **Persian** user-facing strings in templates.
3. Composables in `src/composables/` named `useX.ts`.
4. Prefer `ref` / `computed` / lifecycle hooks from `vue`; shared browser logic from `@vueuse/core`.
5. Do not add `<style>` scoped/modules — antdv props + `Space`/`Row`/`Col`, plus Tailwind utilities ([tailwindcss](../tailwindcss/SKILL.md)).
6. Dynamic color only via `:style` bindings when required (contrast/palette).

## Imports

```ts
import { ref, computed, watch, onMounted, nextTick, shallowRef } from 'vue'
import type { Ref, ComputedRef, PropType, Component, VNode, CSSProperties } from 'vue'
```

## Package interfaces (mandatory)

Use Vue’s exported types — do not invent loose stand-ins. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

| Need | Package type |
|------|----------------|
| Ref / computed values | `Ref<T>`, `ComputedRef<T>`, `ShallowRef<T>` |
| Maybe-ref APIs | `MaybeRef<T>`, `MaybeRefOrGetter<T>` |
| Components / VNodes | `Component`, `ComponentPublicInstance`, `VNode` |
| Inline style objects | `CSSProperties` |
| Injection | `InjectionKey<T>` |
| App instance | `App` |
| Emits typing | `defineEmits<{ … }>()` typed payload tuples |

```ts
import type { Ref, ComputedRef, CSSProperties, InjectionKey } from 'vue'

const loading: Ref<boolean> = ref(false)
const title: ComputedRef<string> = computed(() => props.title.trim())
const chipStyle: CSSProperties = { backgroundColor: '#1677ff', color: '#fff' }

export const personaKey: InjectionKey<Ref<Persona | null>> = Symbol('persona')
```

When wrapping antdv, still use **antdv** props types (`ButtonProps`), not a custom Vue `PropType` clone of antdv.

## Checklist

- [ ] `<script setup lang="ts">`
- [ ] Typed props/emits
- [ ] Vue package types (`Ref`, `ComputedRef`, `CSSProperties`, …) at boundaries
- [ ] No `<style>` — Tailwind `class` utilities only when needed 
- [ ] antdv PascalCase components + antdv `*Props` where relevant
- [ ] Persian UI copy
