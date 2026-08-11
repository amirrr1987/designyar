# Full-safe TypeScript patterns (UX Flow)

Companion to [SKILL.md](SKILL.md). Read when implementing typed modules.

## Type guard template

```ts
export interface Project {
  name: string
  currentStep: number
  createdAt: string
}

export function isProject(value: unknown): value is Project {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.name === 'string' &&
    typeof v.currentStep === 'number' &&
    typeof v.createdAt === 'string'
  )
}
```

## Discriminated unions (Design Thinking)

```ts
export type DesignStepKey = 'empathize' | 'define' | 'ideate' | 'prototype' | 'test'

export interface DesignStep {
  key: DesignStepKey
  title: string
  route: `/${DesignStepKey}` | '/empathize' | '/define' | '/ideate' | '/prototype' | '/test'
  icon: string
  description: string
  color: string
}
```

## Package props (antdv) — prefer official interfaces

See [package-interfaces.md](package-interfaces.md). Never clone antdv props locally.

```ts
import type { ButtonProps, MenuProps, ThemeConfig, TableColumnsType } from 'ant-design-vue'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'

const theme: ThemeConfig = { token: { colorPrimary: '#1677ff' } }
const menuProps: MenuProps = { mode: 'inline', selectedKeys: ['empathize'] }
const saveBtn: ButtonProps = { type: 'primary', htmlType: 'submit' }
```

## Typed antdv form

```ts
import type { FormInstance, Rule } from 'ant-design-vue/es/form'

interface PersonaForm {
  name: string
  role: string
  age: number | null
}

const formRef = ref<FormInstance>()
const model = reactive<PersonaForm>({ name: '', role: '', age: null })

const rules: { [K in keyof PersonaForm]?: Rule[] } = {
  name: [{ required: true, message: 'الزامی است' }],
  role: [{ required: true, message: 'الزامی است' }],
  age: [{ type: 'number', min: 1, message: 'نامعتبر' }],
}

async function onSubmit() {
  await formRef.value?.validate()
}
```

## Typed table

```ts
import type { TableColumnsType } from 'ant-design-vue'

interface CompetitorRow {
  id: string
  name: string
  strength: string
}

const columns: TableColumnsType<CompetitorRow> = [
  { title: 'نام', dataIndex: 'name', key: 'name' },
  { title: 'نقطه قوت', dataIndex: 'strength', key: 'strength' },
]

const rows = useStorage<CompetitorRow[]>('ux-flow-competitors', [])
```

## Typed composable

```ts
export function useContrast() {
  function ratio(fg: string, bg: string): number {
    // …
    return 0
  }

  function level(r: number): 'AAA' | 'AA' | 'fail' {
    if (r >= 7) return 'AAA'
    if (r >= 4.5) return 'AA'
    return 'fail'
  }

  return { ratio, level }
}
```

## WebLLM typing

```ts
import { CreateMLCEngine, type MLCEngineInterface } from '@mlc-ai/web-llm'

const engine = shallowRef<MLCEngineInterface | null>(null)

async function chat(prompt: string): Promise<string> {
  const e = engine.value
  if (!e) throw new Error('مدل آماده نیست')
  const result = await e.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    stream: false,
  })
  return result.choices[0]?.message?.content ?? ''
}
```

## Exhaustive switch

```ts
function assertNever(x: never): never {
  throw new Error(`Unexpected: ${String(x)}`)
}

function stepTitle(key: DesignStepKey): string {
  switch (key) {
    case 'empathize': return 'همدلی'
    case 'define': return 'تعریف مسئله'
    case 'ideate': return 'ایده‌پردازی'
    case 'prototype': return 'پروتوتایپ'
    case 'test': return 'تست'
    default: return assertNever(key)
  }
}
```

## Satisfies for constants

```ts
export const DESIGN_THINKING_STEPS = [
  { key: 'empathize', title: 'همدلی', /* … */ },
] as const satisfies readonly DesignStep[]
```
