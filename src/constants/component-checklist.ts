export interface ComponentChecklistOption {
  label: string
  value: string
}

export const COMPONENT_CHECKLIST_OPTIONS: readonly ComponentChecklistOption[] = [
  { label: 'Button', value: 'Button' },
  { label: 'Form / FormItem', value: 'Form' },
  { label: 'Input / Textarea', value: 'Input' },
  { label: 'Select', value: 'Select' },
  { label: 'Table', value: 'Table' },
  { label: 'Card', value: 'Card' },
  { label: 'Tabs', value: 'Tabs' },
  { label: 'Menu / Layout', value: 'Layout' },
  { label: 'Steps', value: 'Steps' },
  { label: 'Tree', value: 'Tree' },
  { label: 'Modal / Drawer', value: 'Modal' },
  { label: 'Alert / message', value: 'Alert' },
] as const

export const DEFAULT_COMPONENT_CHECKLIST: readonly string[] = [
  'Button',
  'Form',
  'Input',
  'Card',
  'Layout',
  'Tabs',
] as const

export function summarizeComponentChecklist(checked: readonly string[]): string | undefined {
  if (checked.length === 0) return undefined
  const labelByValue = new Map(COMPONENT_CHECKLIST_OPTIONS.map((o) => [o.value, o.label]))
  const lines = checked.map((value) => `- ${labelByValue.get(value) ?? value}`)
  const missing = COMPONENT_CHECKLIST_OPTIONS.filter((o) => !checked.includes(o.value)).map(
    (o) => o.label,
  )
  if (missing.length > 0) {
    lines.push(`(استفاده‌نشده: ${missing.join('، ')})`)
  }
  return lines.join('\n')
}
