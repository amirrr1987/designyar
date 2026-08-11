---
name: vue
description: >
  Guides Vue 3.5+ conventions for UX Flow — script setup, Composition API, TypeScript,
  and SFC structure without custom CSS. Use when writing Vue SFCs, composables, refs,
  props/emits, or vue core patterns in this project.
---

# Vue 3 (UX Flow)

Package: `vue` ^3.5. All components: **`<script setup lang="ts">`** + Composition API. UI via [ant-design-vue](../ant-design-vue/SKILL.md) — **no `<style>` blocks**.

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
5. Do not add custom CSS scoped/modules — antdv props + `Space`/`Row`/`Col` only.
6. Dynamic color only via `:style` bindings when required (contrast/palette).

## Imports

```ts
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import type { Ref, ComputedRef } from 'vue'
```

## Checklist

- [ ] `<script setup lang="ts">`
- [ ] Typed props/emits
- [ ] No `<style>` 
- [ ] antdv PascalCase components
- [ ] Persian UI copy
