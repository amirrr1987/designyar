import {
  adjustLightness,
  inkForBackground,
  normalizeHex,
  rotateHue,
  tintBackground,
} from '@/utils/color-harmony'
import type { ColorHarmonyMode, ColorPalette } from '@/types/prototype'

const FALLBACK_SEED = '#0f766e'

export function buildPaletteFromHarmony(
  seed: string,
  harmony: ColorHarmonyMode,
): ColorPalette {
  const primary = normalizeHex(seed, FALLBACK_SEED)

  let accent = primary
  switch (harmony) {
    case 'monochromatic':
      accent = adjustLightness(primary, 0.18)
      break
    case 'primaryAccent':
      accent = adjustLightness(rotateHue(primary, 28), 0.06)
      break
    case 'complementary':
      accent = rotateHue(primary, 180)
      break
    case 'analogous':
      accent = rotateHue(primary, 30)
      break
    case 'triadic':
      accent = rotateHue(primary, 120)
      break
  }

  const background = tintBackground(primary)
  const text = inkForBackground(background)

  return {
    primary,
    accent: normalizeHex(accent, primary),
    background,
    text,
    harmony,
  }
}

export function paletteSummary(palette: ColorPalette): string {
  return [
    `اصلی ${palette.primary}`,
    `تاکیدی ${palette.accent}`,
    `پس‌زمینه ${palette.background}`,
    `متن ${palette.text}`,
  ].join(' · ')
}
