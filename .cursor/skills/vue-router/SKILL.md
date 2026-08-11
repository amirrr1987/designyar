---
name: vue-router
description: >
  Guides vue-router ^5 for UX Flow — createRouter, Design Thinking routes, lazy views,
  and Menu/Steps sync. Use when editing routes, navigation, RouterView, router-link,
  or vue-router.
---

# Vue Router (UX Flow)

Package: `vue-router` ^5 with Vue 3 history mode. Five Design Thinking views + home. UI navigation uses antdv `Menu` / `Steps` with named imports ([ant-design-vue](../ant-design-vue/SKILL.md)).

## Setup

```ts
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue'), meta: { title: 'خانه' } },
    { path: '/empathize', name: 'empathize', component: () => import('@/views/EmpathizeView.vue'), meta: { title: 'همدلی', step: 0 } },
    { path: '/define', name: 'define', component: () => import('@/views/DefineView.vue'), meta: { title: 'تعریف مسئله', step: 1 } },
    { path: '/ideate', name: 'ideate', component: () => import('@/views/IdeateView.vue'), meta: { title: 'ایده‌پردازی', step: 2 } },
    { path: '/prototype', name: 'prototype', component: () => import('@/views/PrototypeView.vue'), meta: { title: 'پروتوتایپ', step: 3 } },
    { path: '/test', name: 'test', component: () => import('@/views/TestView.vue'), meta: { title: 'تست', step: 4 } },
  ],
})

export default router
```

```ts
// main.ts
import router from './router'
app.use(router)
```

```vue
<!-- App.vue -->
<template>
  <RouterView />
</template>
```

## Sync with Design Thinking constants

Routes must match `constants/design-thinking-steps.ts` `route` fields (`/empathize`, …). Drive sider `Menu` with `router.push` / `useRouter`:

```vue
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Menu, MenuItem } from 'ant-design-vue'
import { DESIGN_THINKING_STEPS } from '@/constants/design-thinking-steps'

const route = useRoute()
const router = useRouter()

function onSelect({ key }: { key: string }) {
  const step = DESIGN_THINKING_STEPS.find((s) => s.key === key)
  if (step) router.push(step.route)
}
</script>
```

Update `stores/project.ts` `currentStep` when `route` changes (`watch` on `route.name`).

## Rules

1. Lazy-load all views with `() => import(...)`.
2. Use named routes for programmatic navigation.
3. Keep titles Persian in `meta.title`.
4. No auth guards needed for MVP (client-only).
5. Prefer `createWebHistory` for static hosting; use `createWebHashHistory` only if host lacks SPA fallback and user asks.

## Checklist

- [ ] Router registered in `main.ts`
- [ ] Home + 5 DT routes
- [ ] Lazy views
- [ ] Menu/Steps stay in sync with route
- [ ] Align with `DESIGN_THINKING_STEPS`
