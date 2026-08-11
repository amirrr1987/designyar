import type { DesignStepKey } from '@/types/project'
import { isDesignStepKey } from '@/types/project'

export interface DesignStep {
  key: DesignStepKey
  title: string
  description: string
  route: `/${DesignStepKey}`
  /** Icon component name from `@ant-design/icons-vue` (mapped in UI). */
  icon: string
  color: string
  /** 1-based step index matching `Project.currentStep`. */
  step: number
}

function assertNever(x: never): never {
  throw new Error(`Unexpected DesignStepKey: ${String(x)}`)
}

export const DESIGN_THINKING_STEPS = [
  {
    key: 'empathize',
    title: 'همدلی',
    description: 'کاربر را بشناس — یادداشت و پرسونا',
    route: '/empathize',
    icon: 'HeartOutlined',
    color: '#f5222d',
    step: 1,
  },
  {
    key: 'define',
    title: 'تعریف مسئله',
    description: 'مسئله را روشن کن و سوال بساز',
    route: '/define',
    icon: 'AimOutlined',
    color: '#fa8c16',
    step: 2,
  },
  {
    key: 'ideate',
    title: 'ایده‌پردازی',
    description: 'ایده بساز و مسیر کاربر را بچین',
    route: '/ideate',
    icon: 'BulbOutlined',
    color: '#fadb14',
    step: 3,
  },
  {
    key: 'prototype',
    title: 'پروتوتایپ',
    description: 'رنگ و اسکلت صفحه را بساز',
    route: '/prototype',
    icon: 'ExperimentOutlined',
    color: '#52c41a',
    step: 4,
  },
  {
    key: 'test',
    title: 'تست',
    description: 'خوانایی و دسترسی را بررسی کن',
    route: '/test',
    icon: 'CheckCircleOutlined',
    color: '#1890ff',
    step: 5,
  },
] as const satisfies readonly DesignStep[]

export type DesignThinkingStep = (typeof DESIGN_THINKING_STEPS)[number]

export function getStepByKey(key: DesignStepKey): DesignThinkingStep {
  switch (key) {
    case 'empathize':
      return DESIGN_THINKING_STEPS[0]
    case 'define':
      return DESIGN_THINKING_STEPS[1]
    case 'ideate':
      return DESIGN_THINKING_STEPS[2]
    case 'prototype':
      return DESIGN_THINKING_STEPS[3]
    case 'test':
      return DESIGN_THINKING_STEPS[4]
    default:
      return assertNever(key)
  }
}

export function getStepByRoute(path: string): DesignThinkingStep | undefined {
  const normalized = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path
  return DESIGN_THINKING_STEPS.find((s) => s.route === normalized)
}

export function getStepByNumber(step: number): DesignThinkingStep | undefined {
  return DESIGN_THINKING_STEPS.find((s) => s.step === step)
}

export function routeToStepKey(path: string): DesignStepKey | undefined {
  const step = getStepByRoute(path)
  return step?.key
}

export function isDesignThinkingRoute(path: string): boolean {
  return getStepByRoute(path) !== undefined
}

/** Narrow unknown string to DesignStepKey via constants table. */
export function parseDesignStepKey(value: string): DesignStepKey | undefined {
  return isDesignStepKey(value) ? value : undefined
}
