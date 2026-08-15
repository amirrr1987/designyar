export const DESIGN_THINKING_STEPS = [
  {
    key: 'empathize',
    title: 'همدلی',
    icon: 'HeartOutlined',
    description: 'درک کاربر و نیازهای او',
    route: '/empathize',
    color: '#f5222d',
  },
  {
    key: 'define',
    title: 'تعریف مسئله',
    icon: 'AimOutlined',
    description: 'تعریف دقیق مسئله و دیدگاه کاربر',
    route: '/define',
    color: '#fa8c16',
  },
  {
    key: 'ideate',
    title: 'ایده‌پردازی',
    icon: 'BulbOutlined',
    description: 'تولید ایده و معماری اطلاعات',
    route: '/ideate',
    color: '#fadb14',
  },
  {
    key: 'prototype',
    title: 'پروتوتایپ',
    icon: 'ExperimentOutlined',
    description: 'نمونه اولیه و دیزاین سیستم',
    route: '/prototype',
    color: '#52c41a',
  },
  {
    key: 'test',
    title: 'تست',
    icon: 'CheckCircleOutlined',
    description: 'ارزیابی کاربردپذیری',
    route: '/test',
    color: '#1890ff',
  },
] as const

export type DesignThinkingStepKey = (typeof DESIGN_THINKING_STEPS)[number]['key']

export function isDesignThinkingStepKey(value: string): value is DesignThinkingStepKey {
  return DESIGN_THINKING_STEPS.some((step) => step.key === value)
}
