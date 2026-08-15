import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { DESIGN_THINKING_STEPS } from '@/constants/design-thinking-steps'
import { usePersistenceStore } from '@/stores/persistence'
import { normalizeProject, projectHasBrief, type DesignStepKey } from '@/types/project'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    /** 1-based Design Thinking step; omit on home. */
    step?: number
    layout?: 'onboarding' | 'app'
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
    layout: 'app',
  },
}))

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'welcome',
    component: () => import('@/views/WelcomeView.vue'),
    meta: { title: 'خوشامدگویی', layout: 'onboarding' },
  },
  {
    path: '/setup',
    name: 'setup',
    component: () => import('@/views/ProjectSetupView.vue'),
    meta: { title: 'شرح پروژه', layout: 'onboarding' },
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'خانه', layout: 'app' },
  },
  ...stepRoutes,
  {
    path: '/synthesis',
    name: 'synthesis',
    component: () => import('@/views/SynthesisView.vue'),
    meta: { title: 'جمع‌بندی پروژه', layout: 'app' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const persistence = usePersistenceStore()
  persistence.ensureNormalized()
  const project = normalizeProject(persistence.document.project)
  const hasBrief = projectHasBrief(project)
  const routeName = to.name
  const isOnboarding = routeName === 'welcome' || routeName === 'setup'
  if (!hasBrief && !isOnboarding) {
    return { name: 'setup' }
  }
  return true
})

router.afterEach((to) => {
  const title = to.meta.title
  document.title = title ? `${title} · دیزاین‌یار` : 'دیزاین‌یار'
})

export default router
