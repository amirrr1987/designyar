/** Canonical 8pt spacing scale (px). */
export const SPACING_8PT = [0, 8, 16, 24, 32, 40, 48, 64, 80, 96] as const

export type SpacingToken = (typeof SPACING_8PT)[number]

export interface SpacingTokenRow {
  index: number
  value: number
  name: string
}

export function buildSpacingScale(base = 8, steps = 10): number[] {
  const scale: number[] = []
  for (let i = 0; i < steps; i += 1) {
    scale.push(base * i)
  }
  return scale
}

export function toSpacingTokenRows(scale: readonly number[]): SpacingTokenRow[] {
  return scale.map((value, index) => ({
    index,
    value,
    name: `space-${index}`,
  }))
}
