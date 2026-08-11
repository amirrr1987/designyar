export interface WireframeBlockDef {
  id: string
  label: string
  description: string
}

export const WIREFRAME_BLOCK_DEFS: readonly WireframeBlockDef[] = [
  { id: 'header', label: 'هدر', description: 'لوگو، ناوبری، جستجو' },
  { id: 'nav', label: 'ناوبری جانبی', description: 'منوی مراحل یا بخش‌ها' },
  { id: 'hero', label: 'هیرو', description: 'معرفی و CTA اصلی' },
  { id: 'content', label: 'محتوا', description: 'بدنه اصلی صفحه' },
  { id: 'form', label: 'فرم', description: 'ورود داده کاربر' },
  { id: 'list', label: 'لیست/جدول', description: 'نمایش مجموعه‌ای از آیتم‌ها' },
  { id: 'footer', label: 'فوتر', description: 'لینک‌ها و اطلاعات تماس' },
] as const

export const WIREFRAME_BLOCK_IDS = WIREFRAME_BLOCK_DEFS.map((b) => b.id)

const labelById = new Map(WIREFRAME_BLOCK_DEFS.map((b) => [b.id, b.label]))

export function isWireframeBlockId(value: unknown): value is string {
  return typeof value === 'string' && labelById.has(value)
}

export function isWireframeBlockIdArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isWireframeBlockId)
}

export function wireframeBlockLabel(id: string): string {
  return labelById.get(id) ?? id
}

export function summarizeWireframeBlocks(ids: readonly string[]): string | undefined {
  if (ids.length === 0) return undefined
  return ids.map((id) => wireframeBlockLabel(id)).join(' → ')
}
