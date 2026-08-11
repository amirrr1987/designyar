import {
  createDefaultDesignSystem,
  isDesignSystem,
  type DesignSystem,
} from './design-system'
import { isMicrocopyEntryArray, type MicrocopyEntry } from './microcopy'

export interface PrototypeState {
  designSystem: DesignSystem
  wireframeBlocks: string[]
  componentChecklist: string[]
  microcopyBank: MicrocopyEntry[]
}

export function createDefaultPrototypeState(): PrototypeState {
  return {
    designSystem: createDefaultDesignSystem(),
    wireframeBlocks: ['header', 'content', 'footer'],
    componentChecklist: [],
    microcopyBank: [],
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

export function isPrototypeState(value: unknown): value is PrototypeState {
  if (!isRecord(value)) return false
  return (
    isDesignSystem(value.designSystem) &&
    isStringArray(value.wireframeBlocks) &&
    isStringArray(value.componentChecklist) &&
    isMicrocopyEntryArray(value.microcopyBank)
  )
}
