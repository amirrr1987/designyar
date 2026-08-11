import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { DESIGN_THINKING_STEPS } from '@/constants/design-thinking-steps'
import type { DesignStepKey } from '@/types/project'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    /** 1-based Design Thinking step; omit on home. */
    step?: number
  }
}

const stepViewLoaders: Record<DesignStepKey, () => Promise<unknown>> = {
  empathize: () => import('@/views/EmpathizeView.vue'),
  define: () => import('@/views/DefineView.vue'),
  ideate: () => import('@/views/IdeateView.vue'),
  prototype: () => import('@/views/PrototypeView.vue'),
  test: () => import('@/views/TestView.vue'),
}

const stepRoutes: RouteRecordRaw[] = DESIGN_THINKING_STEPS.map((step) => ({
  path: step.route,
  name: step.key,
  component: stepViewLoaders[step.key],
  meta: {
    title: step.title,
    step: step.step,
  },
}))

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'خانه' },
  },
  ...stepRoutes,
  {
    path: '/synthesis',
    name: 'synthesis',
    component: () => import('@/views/SynthesisView.vue'),
    meta: { title: 'جمع‌بندی پروژه' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.afterEach((to) => {
  const title = to.meta.title
  document.title = title ? `${title} · دیزاین‌یار` : 'دیزاین‌یار'
})

export default router
