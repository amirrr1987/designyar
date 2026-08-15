import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import {
  getDefaultFormKey,
  getFormMeta,
} from '@/constants/form-registry'
import { isDesignThinkingStepKey } from '@/constants/design-thinking-steps'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'خانه' },
  },
  {
    path: '/done',
    name: 'done',
    component: () => import('@/views/DoneView.vue'),
    meta: { title: 'پایان مسیر' },
  },
  {
    path: '/:phase',
    component: () => import('@/components/layout/WizardChrome.vue'),
    children: [
      {
        path: '',
        name: 'phase-default',
        redirect: (to) => {
          const raw = to.params.phase
          const phase = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : undefined
          if (!phase || !isDesignThinkingStepKey(phase)) {
            return { name: 'home' }
          }
          return {
            name: 'micro-form',
            params: { phase, formKey: getDefaultFormKey(phase) },
          }
        },
      },
      {
        path: ':formKey',
        name: 'micro-form',
        component: () => import('@/views/MicroFormHostView.vue'),
        meta: { title: 'فرم' },
        beforeEnter: (to) => {
          const rawPhase = to.params.phase
          const phase =
            typeof rawPhase === 'string'
              ? rawPhase
              : Array.isArray(rawPhase)
                ? rawPhase[0]
                : undefined
          const rawForm = to.params.formKey
          const formKey =
            typeof rawForm === 'string'
              ? rawForm
              : Array.isArray(rawForm)
                ? rawForm[0]
                : undefined

          if (!phase || !isDesignThinkingStepKey(phase) || !formKey) {
            return { name: 'home' }
          }
          if (!getFormMeta(phase, formKey)) {
            return {
              name: 'micro-form',
              params: { phase, formKey: getDefaultFormKey(phase) },
            }
          }
          return true
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.afterEach((to) => {
  const title = typeof to.meta.title === 'string' ? to.meta.title : 'دیزاین یار'
  document.title = `${title} | دیزاین یار`
})

export default router
