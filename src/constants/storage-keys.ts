export const STORAGE_KEYS = {
  project: 'designyar:project',
  empathize: 'designyar:empathize',
  define: 'designyar:define',
  ideate: 'designyar:ideate',
  prototype: 'designyar:prototype',
  test: 'designyar:test',
  ai: 'designyar:ai',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
