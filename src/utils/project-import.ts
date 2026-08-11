import { STORAGE_KEYS } from '@/constants/storage-keys'
import { normalizeProject } from '@/types/project'
import type { UxFlowExport } from '@/utils/project-export'
import { isUxFlowExport } from '@/utils/project-export'

export type ImportResult = { ok: true; exportedAt: string } | { ok: false; error: string }

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

/** Apply a validated export payload into LocalStorage keys. */
export function hydrateFromExport(payload: UxFlowExport): void {
  const d = payload.data
  writeJson(STORAGE_KEYS.project, normalizeProject(d.project))
  writeJson(STORAGE_KEYS.personas, d.personas)
  writeJson(STORAGE_KEYS.empathyMaps, d.empathyMaps)
  writeJson(STORAGE_KEYS.empathySelectedPersona, d.empathySelectedPersona)
  writeJson(STORAGE_KEYS.researchNotes, d.researchNotes)
  writeJson(STORAGE_KEYS.competitors, d.competitors)
  writeJson(STORAGE_KEYS.problem, d.problem)
  writeJson(STORAGE_KEYS.pov, d.pov)
  writeJson(STORAGE_KEYS.hmw, d.hmw)
  writeJson(STORAGE_KEYS.ideas, d.ideas)
  writeJson(STORAGE_KEYS.userflow, d.userflow)
  writeJson(STORAGE_KEYS.sitemap, d.sitemap)
  writeJson(STORAGE_KEYS.cardSort, d.cardSort)
  writeJson(STORAGE_KEYS.designSystem, d.designSystem)
  writeJson(STORAGE_KEYS.wireframeBlocks, d.wireframeBlocks)
  writeJson(STORAGE_KEYS.componentChecklist, d.componentChecklist)
  writeJson(STORAGE_KEYS.wcagChecked, d.wcagChecked)
  writeJson(STORAGE_KEYS.heuristicEval, d.heuristicEval)
  writeJson(STORAGE_KEYS.aiPrefs, d.aiPrefs)
  writeJson(
    STORAGE_KEYS.usabilityReportSummary,
    'usabilityReportSummary' in d && typeof d.usabilityReportSummary === 'string'
      ? d.usabilityReportSummary
      : '',
  )
  writeJson(
    STORAGE_KEYS.microcopyBank,
    'microcopyBank' in d && Array.isArray(d.microcopyBank) ? d.microcopyBank : [],
  )
}

export async function importUxFlowFromFile(file: File): Promise<ImportResult> {
  let text: string
  try {
    text = await file.text()
  } catch (e: unknown) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'خواندن فایل ناموفق بود',
    }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: 'فایل JSON معتبر نیست' }
  }

  if (!isUxFlowExport(parsed)) {
    return {
      ok: false,
      error: 'ساختار فایل با نسخه خروجی دیزاین‌یار سازگار نیست',
    }
  }

  try {
    hydrateFromExport(parsed)
    return { ok: true, exportedAt: parsed.exportedAt }
  } catch (e: unknown) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'ذخیره داده‌ها ناموفق بود',
    }
  }
}
