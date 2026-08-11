export type MicrocopyCategory = 'cta' | 'error' | 'empty' | 'hint' | 'label'

export interface MicrocopyEntry {
  id: string
  category: MicrocopyCategory
  text: string
  context: string
  createdAt: string
}

export const MICROCOPY_CATEGORY_LABELS: Record<MicrocopyCategory, string> = {
  cta: 'CTA',
  error: 'پیام خطا',
  empty: 'Empty state',
  hint: 'راهنما',
  label: 'برچسب',
}

export function isMicrocopyCategory(value: unknown): value is MicrocopyCategory {
  return value === 'cta' || value === 'error' || value === 'empty' || value === 'hint' || value === 'label'
}

export function isMicrocopyEntry(value: unknown): value is MicrocopyEntry {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    isMicrocopyCategory(v.category) &&
    typeof v.text === 'string' &&
    typeof v.context === 'string' &&
    typeof v.createdAt === 'string'
  )
}

export function isMicrocopyEntryArray(value: unknown): value is MicrocopyEntry[] {
  return Array.isArray(value) && value.every(isMicrocopyEntry)
}
