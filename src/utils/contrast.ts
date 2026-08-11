export type ContrastLevel = 'AAA' | 'AA' | 'fail'

export interface ContrastResult {
  ratio: number
  level: ContrastLevel
}

/** Parse `#rgb` / `#rrggbb` to 0–1 RGB channels. */
export function parseHexColor(hex: string): { r: number; g: number; b: number } | null {
  const raw = hex.trim().replace(/^#/, '')
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(raw)) return null

  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => `${c}${c}`)
          .join('')
      : raw

  const r = Number.parseInt(full.slice(0, 2), 16)
  const g = Number.parseInt(full.slice(2, 4), 16)
  const b = Number.parseInt(full.slice(4, 6), 16)
  if ([r, g, b].some((n) => Number.isNaN(n))) return null
  return { r: r / 255, g: g / 255, b: b / 255 }
}

function channelLuminance(c: number): number {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

export function relativeLuminance(hex: string): number | null {
  const rgb = parseHexColor(hex)
  if (!rgb) return null
  const r = channelLuminance(rgb.r)
  const g = channelLuminance(rgb.g)
  const b = channelLuminance(rgb.b)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(foreground: string, background: string): number | null {
  const l1 = relativeLuminance(foreground)
  const l2 = relativeLuminance(background)
  if (l1 === null || l2 === null) return null
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function contrastLevel(ratio: number): ContrastLevel {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  return 'fail'
}

export function evaluateContrast(foreground: string, background: string): ContrastResult | null {
  const ratio = contrastRatio(foreground, background)
  if (ratio === null) return null
  const rounded = Math.round(ratio * 100) / 100
  return { ratio: rounded, level: contrastLevel(rounded) }
}
