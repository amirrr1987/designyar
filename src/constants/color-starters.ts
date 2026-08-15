import type { DesignSystemKey, TheoryScheme } from '@/types/prototype'

export type PaletteProposeSource = 'theory' | 'system' | 'custom'

export function proposeSourceLabel(source: PaletteProposeSource): string {
  const labels: Record<PaletteProposeSource, string> = {
    theory: 'اصول رنگ',
    system: 'Design System',
    custom: 'سفارشی',
  }
  return labels[source]
}

export interface TheorySchemeOption {
  value: TheoryScheme
  /** Short label for Segmented */
  label: string
}

/** Paletton-aligned scheme picker */
export const THEORY_SCHEME_OPTIONS: readonly TheorySchemeOption[] = [
  { value: 'monochromatic', label: 'تک‌رنگ' },
  { value: 'adjacent', label: 'مجاور' },
  { value: 'triad', label: 'سه‌تایی' },
  { value: 'tetrad', label: 'چهارتایی' },
] as const

export type { DesignSystemKey }
