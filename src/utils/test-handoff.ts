import type { ColorPalette } from '@/types/prototype'
import { DEFAULT_WCAG_KEYS, type TestState } from '@/types/test'
import { contrastRatio, meetsWcagAa } from '@/utils/contrast'
import { buildTestNextActions } from '@/utils/test-next-actions'

const WCAG_LABELS: Record<(typeof DEFAULT_WCAG_KEYS)[number], string> = {
  'alt-text': 'متن جایگزین تصاویر',
  keyboard: 'قابل استفاده با صفحه‌کلید',
  labels: 'برچسب فیلدها',
  contrast: 'کنتراست متن',
  'focus-visible': 'نمایان بودن فوکوس',
}

export interface HandoffPayload {
  exportedAt: string
  test: TestState
  paletteTokens?: Pick<
    ColorPalette,
    'primary' | 'accent' | 'tertiary' | 'quaternary' | 'background' | 'text' | 'surface' | 'border'
  >
  nextActions: ReturnType<typeof buildTestNextActions>
}

export function buildHandoffPayload(
  test: TestState,
  palette?: ColorPalette | null,
): HandoffPayload {
  return {
    exportedAt: new Date().toISOString(),
    test,
    paletteTokens: palette
      ? {
          primary: palette.primary,
          accent: palette.accent,
          tertiary: palette.tertiary,
          quaternary: palette.quaternary,
          background: palette.background,
          text: palette.text,
          surface: palette.surface,
          border: palette.border,
        }
      : undefined,
    nextActions: buildTestNextActions(test),
  }
}

export function buildHandoffMarkdown(payload: HandoffPayload): string {
  const { test, paletteTokens, nextActions, exportedAt } = payload
  const ratio = contrastRatio(test.contrast.foreground, test.contrast.background)
  const lines: string[] = [
    '# گزارش تست — دیزاین یار',
    '',
    `تاریخ خروجی: ${exportedAt}`,
    '',
    '## کنتراست',
    `- متن: \`${test.contrast.foreground}\``,
    `- پس‌زمینه: \`${test.contrast.background}\``,
    `- نسبت: ${ratio === null ? 'نامعتبر' : ratio.toFixed(2)}`,
    `- WCAG AA: ${ratio !== null && meetsWcagAa(ratio) ? 'قبول' : 'رد'}`,
    '',
    '## دسترس‌پذیری (چک‌لیست)',
  ]

  for (const key of DEFAULT_WCAG_KEYS) {
    const ok = test.wcag[key] === true
    lines.push(`- [${ok ? 'x' : ' '}] ${WCAG_LABELS[key]}`)
  }

  lines.push('', '## هیوریستیک')
  for (const item of test.heuristics) {
    if (item.score <= 0) continue
    lines.push(`- ${item.title}: ${item.score}/۵${item.note ? ` — ${item.note}` : ''}`)
  }

  if (paletteTokens) {
    lines.push('', '## توکن رنگ (پروتوتایپ)')
    for (const [key, value] of Object.entries(paletteTokens)) {
      lines.push(`- ${key}: \`${value}\``)
    }
  }

  if (nextActions.length > 0) {
    lines.push('', '## کار بعدی')
    for (const action of nextActions) {
      lines.push(`- **${action.title}** — ${action.reason} (\`/${action.phase}/${action.formKey}\`)`)
    }
  }

  if (test.report.trim()) {
    lines.push('', '## گزارش', '', test.report.trim())
  }

  return `${lines.join('\n')}\n`
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function downloadJsonFile(filename: string, data: unknown): void {
  const blob = new Blob([`${JSON.stringify(data, null, 2)}\n`], {
    type: 'application/json;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
