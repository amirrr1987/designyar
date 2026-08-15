import {
  APP_UI_FRAMEWORK,
  DESIGN_SYSTEM_CATALOG,
  getDesignSystemEntry,
  isRecommendedForApp,
  type DesignSystemCatalogEntry,
} from '@/constants/design-system-catalog'
import {
  adjustLightness,
  inkForBackground,
  normalizeHex,
  rotateHue,
  tintBackground,
} from '@/utils/color-harmony'
import {
  createEmptySwatch,
  type ColorPalette,
  type DesignSystemKey,
  type TheoryScheme,
} from '@/types/prototype'

export { APP_UI_FRAMEWORK, DESIGN_SYSTEM_CATALOG }
export type { DesignSystemCatalogEntry }

const FALLBACK_SEED = '#0f766e'

export interface DesignSystemStarter extends DesignSystemCatalogEntry {
  recommended: boolean
}

/** Full catalog with recommended flag for current app framework. */
export const DESIGN_SYSTEM_STARTERS: readonly DesignSystemStarter[] = DESIGN_SYSTEM_CATALOG.map(
  (entry) => ({
    ...entry,
    recommended: isRecommendedForApp(entry),
  }),
)

function deriveAdvanced(
  primary: string,
  background: string,
  text: string,
): Pick<ColorPalette, 'surface' | 'textMuted' | 'border'> {
  return {
    surface: adjustLightness(background, -0.035),
    textMuted: adjustLightness(text, 0.22),
    border: adjustLightness(tintBackground(primary), -0.14),
  }
}

function defaultSwatches(
  scheme: TheoryScheme,
  primary: string,
  accent: string,
  tertiary: string,
  quaternary: string,
): ColorPalette['swatches'] {
  if (scheme === 'monochromatic') {
    return [
      createEmptySwatch('پایه', primary),
      createEmptySwatch('روشن', accent),
      createEmptySwatch('تیره', tertiary),
    ]
  }
  if (scheme === 'adjacent' || scheme === 'triad') {
    return [
      createEmptySwatch('رنگ ۱', primary),
      createEmptySwatch('رنگ ۲', accent),
      createEmptySwatch('رنگ ۳', tertiary),
    ]
  }
  // tetrad
  return [
    createEmptySwatch('رنگ ۱', primary),
    createEmptySwatch('رنگ ۲', accent),
    createEmptySwatch('رنگ ۳', tertiary),
    createEmptySwatch('رنگ ۴', quaternary),
  ]
}

/**
 * Paletton-style schemes from a seed hue:
 * Monochromatic / Adjacent (analogous) / Triad / Tetrad
 * @see https://paletton.com
 */
export function buildPaletteFromTheory(seed: string, scheme: TheoryScheme): ColorPalette {
  const primary = normalizeHex(seed, FALLBACK_SEED)
  let accent = primary
  let tertiary = primary
  let quaternary = primary

  switch (scheme) {
    case 'monochromatic':
      accent = adjustLightness(primary, 0.18)
      tertiary = adjustLightness(primary, -0.14)
      quaternary = adjustLightness(primary, 0.08)
      break
    case 'adjacent':
      // Adjacent / analogous — neighbors on the wheel (±30°)
      accent = rotateHue(primary, 30)
      tertiary = rotateHue(primary, -30)
      quaternary = tertiary
      break
    case 'triad':
      accent = rotateHue(primary, 120)
      tertiary = rotateHue(primary, 240)
      quaternary = tertiary
      break
    case 'tetrad':
      // Square tetrad: 0° / 90° / 180° / 270°
      accent = rotateHue(primary, 90)
      tertiary = rotateHue(primary, 180)
      quaternary = rotateHue(primary, 270)
      break
  }

  const safeAccent = normalizeHex(accent, primary)
  const safeTertiary = normalizeHex(tertiary, safeAccent)
  const safeQuaternary = normalizeHex(quaternary, safeTertiary)
  const background = tintBackground(primary)
  const text = inkForBackground(background)
  const advanced = deriveAdvanced(primary, background, text)

  return {
    mode: 'theory',
    theoryScheme: scheme,
    systemKey: '',
    seed: primary,
    swatches: defaultSwatches(scheme, primary, safeAccent, safeTertiary, safeQuaternary),
    primary,
    accent: safeAccent,
    tertiary: safeTertiary,
    quaternary: safeQuaternary,
    background,
    text,
    ...advanced,
  }
}

export function buildPaletteFromDesignSystem(key: DesignSystemKey): ColorPalette {
  const starter = getDesignSystemEntry(key)
  if (!starter) {
    return buildPaletteFromTheory(FALLBACK_SEED, 'adjacent')
  }

  const scheme = starter.scheme as TheoryScheme
  const built = buildPaletteFromTheory(starter.seed, scheme)
  return {
    ...built,
    mode: 'system',
    systemKey: starter.key,
    seed: starter.seed,
  }
}

export function syncRolesFromSwatches(palette: ColorPalette): ColorPalette {
  const first = palette.swatches[0]
  const second = palette.swatches[1]
  const third = palette.swatches[2]
  const fourth = palette.swatches[3]
  return {
    ...palette,
    primary: first?.value ?? palette.primary,
    accent: second?.value ?? first?.value ?? palette.accent,
    tertiary: third?.value ?? second?.value ?? palette.tertiary,
    quaternary: fourth?.value ?? third?.value ?? palette.quaternary,
    seed: first?.value ?? palette.seed,
  }
}

export function paletteSummary(palette: ColorPalette): string {
  const parts = [`۱ ${palette.primary}`, `۲ ${palette.accent}`]
  if (
    palette.theoryScheme === 'adjacent' ||
    palette.theoryScheme === 'triad' ||
    palette.theoryScheme === 'tetrad' ||
    palette.theoryScheme === 'monochromatic'
  ) {
    parts.push(`۳ ${palette.tertiary}`)
  }
  if (palette.theoryScheme === 'tetrad') {
    parts.push(`۴ ${palette.quaternary}`)
  }
  parts.push(`پس‌زمینه ${palette.background}`, `متن ${palette.text}`)
  return parts.join(' · ')
}
