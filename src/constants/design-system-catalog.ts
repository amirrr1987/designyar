/** Stack of this app — used to mark recommended design systems. */
export const APP_UI_FRAMEWORK = 'vue' as const

export type CatalogTheoryScheme = 'monochromatic' | 'adjacent' | 'triad' | 'tetrad'

export interface DesignSystemCatalogEntry {
  key: string
  label: string
  /** Ecosystems where this DS is commonly used */
  frameworks: readonly string[]
  hint: string
  /** Official / default primary-ish seed */
  seed: string
  scheme: CatalogTheoryScheme
}

/**
 * Curated catalog of well-known design systems (color token starters only).
 * Selecting one does NOT swap the UI library — only proposes palette roles.
 */
export const DESIGN_SYSTEM_CATALOG = [
  // —— Vue-friendly / this project ——
  {
    key: 'antd',
    label: 'Ant Design',
    frameworks: ['vue', 'react'],
    hint: 'متناسب با ant-design-vue همین پروژه',
    seed: '#1677ff',
    scheme: 'adjacent',
  },
  {
    key: 'element-plus',
    label: 'Element Plus',
    frameworks: ['vue'],
    hint: 'رایج در اکوسیستم Vue',
    seed: '#409eff',
    scheme: 'adjacent',
  },
  {
    key: 'naive-ui',
    label: 'Naive UI',
    frameworks: ['vue'],
    hint: 'Vue 3 — سبز پیش‌فرض',
    seed: '#18a058',
    scheme: 'adjacent',
  },
  {
    key: 'vuetify',
    label: 'Vuetify',
    frameworks: ['vue'],
    hint: 'Material-inspired برای Vue',
    seed: '#1867c0',
    scheme: 'adjacent',
  },
  {
    key: 'quasar',
    label: 'Quasar',
    frameworks: ['vue'],
    hint: 'Vue / Capacitor / Electron',
    seed: '#1976d2',
    scheme: 'adjacent',
  },
  {
    key: 'primevue',
    label: 'PrimeVue',
    frameworks: ['vue'],
    hint: 'PrimeFaces برای Vue',
    seed: '#3b82f6',
    scheme: 'adjacent',
  },
  {
    key: 'arco',
    label: 'Arco Design',
    frameworks: ['vue', 'react'],
    hint: 'ByteDance — Vue و React',
    seed: '#165dff',
    scheme: 'adjacent',
  },
  {
    key: 'varlet',
    label: 'Varlet',
    frameworks: ['vue'],
    hint: 'موبایل‌محور Vue 3',
    seed: '#3a7afe',
    scheme: 'adjacent',
  },
  {
    key: 'tdesign',
    label: 'TDesign',
    frameworks: ['vue', 'react', 'miniprogram'],
    hint: 'Tencent Design',
    seed: '#0052d9',
    scheme: 'adjacent',
  },
  {
    key: 'nutui',
    label: 'NutUI',
    frameworks: ['vue'],
    hint: 'JD — موبایل Vue',
    seed: '#fa2c19',
    scheme: 'adjacent',
  },
  {
    key: 'vant',
    label: 'Vant',
    frameworks: ['vue'],
    hint: 'موبایل Vue (Youzan)',
    seed: '#1989fa',
    scheme: 'adjacent',
  },

  // —— Cross-platform / React-heavy (still usable as color starters) ——
  {
    key: 'material',
    label: 'Material Design 3',
    frameworks: ['vue', 'react', 'flutter', 'android'],
    hint: 'فقط توکن رنگ — کتابخانه UI عوض نمی‌شود',
    seed: '#6750a4',
    scheme: 'triad',
  },
  {
    key: 'fluent',
    label: 'Fluent UI (Microsoft)',
    frameworks: ['react', 'web'],
    hint: 'آبی مایکروسافت',
    seed: '#0078d4',
    scheme: 'adjacent',
  },
  {
    key: 'carbon',
    label: 'Carbon (IBM)',
    frameworks: ['react', 'web'],
    hint: 'IBM Design System',
    seed: '#0f62fe',
    scheme: 'adjacent',
  },
  {
    key: 'polaris',
    label: 'Shopify Polaris',
    frameworks: ['react'],
    hint: 'سبز Shopify',
    seed: '#008060',
    scheme: 'adjacent',
  },
  {
    key: 'atlassian',
    label: 'Atlassian Design',
    frameworks: ['react'],
    hint: 'Jira / Confluence blue',
    seed: '#0052cc',
    scheme: 'adjacent',
  },
  {
    key: 'lightning',
    label: 'Salesforce Lightning',
    frameworks: ['web'],
    hint: 'SLDS',
    seed: '#0176d3',
    scheme: 'adjacent',
  },
  {
    key: 'spectrum',
    label: 'Adobe Spectrum',
    frameworks: ['web', 'react'],
    hint: 'Adobe Design System',
    seed: '#0265dc',
    scheme: 'adjacent',
  },
  {
    key: 'primer',
    label: 'GitHub Primer',
    frameworks: ['react', 'web'],
    hint: 'GitHub UI',
    seed: '#0969da',
    scheme: 'adjacent',
  },
  {
    key: 'semi',
    label: 'Semi Design',
    frameworks: ['react'],
    hint: 'Douyin / ByteDance React',
    seed: '#0077fa',
    scheme: 'adjacent',
  },
  {
    key: 'chakra',
    label: 'Chakra UI',
    frameworks: ['react'],
    hint: 'کامپوننت‌محور React',
    seed: '#3182ce',
    scheme: 'adjacent',
  },
  {
    key: 'mantine',
    label: 'Mantine',
    frameworks: ['react'],
    hint: 'React hooks + components',
    seed: '#228be6',
    scheme: 'adjacent',
  },
  {
    key: 'nextui',
    label: 'HeroUI (NextUI)',
    frameworks: ['react'],
    hint: 'قبلاً NextUI',
    seed: '#006fee',
    scheme: 'adjacent',
  },
  {
    key: 'shadcn',
    label: 'shadcn/ui',
    frameworks: ['react'],
    hint: 'معمولاً خنثی + یک accent',
    seed: '#18181b',
    scheme: 'monochromatic',
  },
  {
    key: 'radix',
    label: 'Radix Themes',
    frameworks: ['react'],
    hint: 'Radix UI Themes',
    seed: '#0090ff',
    scheme: 'adjacent',
  },

  // —— CSS / general frameworks ——
  {
    key: 'bootstrap',
    label: 'Bootstrap',
    frameworks: ['web', 'vue', 'react'],
    hint: 'Bootstrap 5 primary',
    seed: '#0d6efd',
    scheme: 'adjacent',
  },
  {
    key: 'tailwind',
    label: 'Tailwind (blue-500)',
    frameworks: ['web', 'vue', 'react'],
    hint: 'پالت رایج Tailwind',
    seed: '#3b82f6',
    scheme: 'adjacent',
  },
  {
    key: 'daisyui',
    label: 'daisyUI',
    frameworks: ['web', 'vue', 'react'],
    hint: 'روی Tailwind',
    seed: '#6419e6',
    scheme: 'triad',
  },
  {
    key: 'bulma',
    label: 'Bulma',
    frameworks: ['web'],
    hint: 'CSS framework',
    seed: '#00d1b2',
    scheme: 'adjacent',
  },
  {
    key: 'foundation',
    label: 'Foundation',
    frameworks: ['web'],
    hint: 'Zurb Foundation',
    seed: '#1779ba',
    scheme: 'adjacent',
  },
  {
    key: 'ionic',
    label: 'Ionic',
    frameworks: ['vue', 'react', 'angular', 'mobile'],
    hint: 'Hybrid mobile',
    seed: '#3880ff',
    scheme: 'adjacent',
  },
  {
    key: 'apple-hig',
    label: 'Apple HIG',
    frameworks: ['ios', 'web'],
    hint: 'System Blue تقریبی',
    seed: '#007aff',
    scheme: 'adjacent',
  },
  {
    key: 'blueprint',
    label: 'Blueprint (Palantir)',
    frameworks: ['react'],
    hint: 'داده و ابزار سازمانی',
    seed: '#2d72d2',
    scheme: 'adjacent',
  },
  {
    key: 'evergreen',
    label: 'Evergreen (Segment)',
    frameworks: ['react'],
    hint: 'Segment UI kit',
    seed: '#3366ff',
    scheme: 'adjacent',
  },
  {
    key: 'grommet',
    label: 'Grommet',
    frameworks: ['react'],
    hint: 'HPE / accessibility-focused',
    seed: '#7d4cdb',
    scheme: 'adjacent',
  },
  {
    key: 'ant-mobile',
    label: 'Ant Design Mobile',
    frameworks: ['react', 'mobile'],
    hint: 'موبایل Ant Design',
    seed: '#1677ff',
    scheme: 'adjacent',
  },
  {
    key: 'mui',
    label: 'MUI (Material UI)',
    frameworks: ['react'],
    hint: 'پیاده‌سازی React از Material',
    seed: '#1976d2',
    scheme: 'adjacent',
  },
] as const satisfies readonly DesignSystemCatalogEntry[]

export type DesignSystemKey = (typeof DESIGN_SYSTEM_CATALOG)[number]['key']

const KEY_SET: ReadonlySet<string> = new Set(
  DESIGN_SYSTEM_CATALOG.map((item) => item.key),
)

/** Runtime check — not a type predicate (avoids narrowing `string` to `never`). */
export function isDesignSystemKey(value: string): boolean {
  return KEY_SET.has(value)
}

export function getDesignSystemEntry(key: string): DesignSystemCatalogEntry | undefined {
  return DESIGN_SYSTEM_CATALOG.find((item) => item.key === key)
}

export function isRecommendedForApp(entry: DesignSystemCatalogEntry): boolean {
  return entry.frameworks.includes(APP_UI_FRAMEWORK)
}

export function listDesignSystemKeys(): readonly DesignSystemKey[] {
  return DESIGN_SYSTEM_CATALOG.map((item) => item.key)
}

export function designSystemKeysForPrompt(): string {
  return DESIGN_SYSTEM_CATALOG.map((item) => item.key).join(' | ')
}
