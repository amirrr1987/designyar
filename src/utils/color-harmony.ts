/** Color harmony helpers for Prototype palette roles (no CSS). */

export type Rgb = { r: number; g: number; b: number }
export type Hsl = { h: number; s: number; l: number }

export function parseHexColor(color: string): Rgb | null {
  const normalized = color.trim().replace('#', '')
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null
  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
  return { r, g, b }
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const to = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l }

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
  else if (max === gn) h = ((bn - rn) / d + 2) / 6
  else h = ((rn - gn) / d + 4) / 6
  return { h: h * 360, s, l }
}

function hueToRgb(p: number, q: number, t: number): number {
  let tt = t
  if (tt < 0) tt += 1
  if (tt > 1) tt -= 1
  if (tt < 1 / 6) return p + (q - p) * 6 * tt
  if (tt < 1 / 2) return q
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
  return p
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const hh = ((h % 360) + 360) % 360
  if (s === 0) {
    const v = l * 255
    return { r: v, g: v, b: v }
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const hk = hh / 360
  return {
    r: hueToRgb(p, q, hk + 1 / 3) * 255,
    g: hueToRgb(p, q, hk) * 255,
    b: hueToRgb(p, q, hk - 1 / 3) * 255,
  }
}

export function hslToHex(hsl: Hsl): string {
  return rgbToHex(hslToRgb(hsl))
}

export function normalizeHex(color: string, fallback: string): string {
  const parsed = parseHexColor(color)
  return parsed ? rgbToHex(parsed) : fallback
}

export function rotateHue(hex: string, degrees: number): string {
  const rgb = parseHexColor(hex)
  if (!rgb) return hex
  const hsl = rgbToHsl(rgb)
  return hslToHex({ ...hsl, h: hsl.h + degrees })
}

export function adjustLightness(hex: string, delta: number): string {
  const rgb = parseHexColor(hex)
  if (!rgb) return hex
  const hsl = rgbToHsl(rgb)
  return hslToHex({ ...hsl, l: Math.max(0.08, Math.min(0.92, hsl.l + delta)) })
}

export function tintBackground(primaryHex: string): string {
  const rgb = parseHexColor(primaryHex)
  if (!rgb) return '#f8fafc'
  const hsl = rgbToHsl(rgb)
  return hslToHex({ h: hsl.h, s: Math.min(0.18, hsl.s * 0.35), l: 0.97 })
}

export function inkForBackground(backgroundHex: string): string {
  const rgb = parseHexColor(backgroundHex)
  if (!rgb) return '#1c1917'
  const hsl = rgbToHsl(rgb)
  if (hsl.l > 0.55) {
    return hslToHex({ h: hsl.h, s: Math.min(0.2, hsl.s), l: 0.14 })
  }
  return hslToHex({ h: hsl.h, s: Math.min(0.12, hsl.s), l: 0.96 })
}
