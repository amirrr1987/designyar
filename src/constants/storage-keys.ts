export const UX_FLOW_DOCUMENT_KEY = 'ux-flow:v1' as const

/**
 * Legacy multi-key LocalStorage map (pre–schema v1).
 * Used only by `domain/migrate.ts` — do not write new domain data here.
 */
export const LEGACY_STORAGE_KEYS = {
  project: 'ux-flow-project',
  personas: 'ux-flow-personas',
  empathyMaps: 'ux-flow-empathy-maps',
  empathySelectedPersona: 'ux-flow-empathy-selected-persona',
  researchNotes: 'ux-flow-research-notes',
  competitors: 'ux-flow-competitors',
  problem: 'ux-flow-problem',
  pov: 'ux-flow-pov',
  hmw: 'ux-flow-hmw',
  ideas: 'ux-flow-ideas',
  userflow: 'ux-flow-userflow',
  sitemap: 'ux-flow-sitemap',
  cardSort: 'ux-flow-card-sort',
  designSystem: 'ux-flow-design-system',
  wireframeBlocks: 'ux-flow-wireframe-blocks',
  componentChecklist: 'ux-flow-component-checklist',
  wcagChecked: 'ux-flow-wcag-checked',
  heuristicEval: 'ux-flow-heuristic-eval',
  aiPrefs: 'ux-flow-ai-prefs',
  usabilityReportSummary: 'ux-flow-usability-report-summary',
  microcopyBank: 'ux-flow-microcopy-bank',
  aiHistory: 'ux-flow-ai-history',
  projectSynthesis: 'ux-flow-project-synthesis',
} as const

export type LegacyStorageKeyId = keyof typeof LEGACY_STORAGE_KEYS
export type LegacyStorageKeyValue = (typeof LEGACY_STORAGE_KEYS)[LegacyStorageKeyId]

/** @deprecated Prefer `UX_FLOW_DOCUMENT_KEY` + document slices. Kept as alias for migrate/import. */
export const STORAGE_KEYS = LEGACY_STORAGE_KEYS

export type StorageKeyId = LegacyStorageKeyId
export type StorageKeyValue = LegacyStorageKeyValue

export const STORAGE_KEY_LIST = Object.values(LEGACY_STORAGE_KEYS) as readonly LegacyStorageKeyValue[]

export function isStorageKeyValue(value: string): value is LegacyStorageKeyValue {
  return (STORAGE_KEY_LIST as readonly string[]).includes(value)
}
