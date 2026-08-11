/**
 * Canonical LocalStorage keys for UX Flow.
 *
 * Persistence rules (Phase 8.4 audit):
 * - Runtime app state uses VueUse `useStorage` only (via these keys).
 * - Direct `localStorage` is allowed only in import/export hydrate helpers.
 * - Debounce is not required; module payloads stay small enough for sync writes.
 */
export const STORAGE_KEYS = {
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

export type StorageKeyId = keyof typeof STORAGE_KEYS
export type StorageKeyValue = (typeof STORAGE_KEYS)[StorageKeyId]

export const STORAGE_KEY_LIST = Object.values(STORAGE_KEYS) as readonly StorageKeyValue[]

export function isStorageKeyValue(value: string): value is StorageKeyValue {
  return (STORAGE_KEY_LIST as readonly string[]).includes(value)
}
