import { createDefaultAiPrefs, isAiPrefs, type AiPrefs } from './ai-prefs'
import { createDefaultDefineState, isDefineState, type DefineState } from './define-state'
import { createDefaultEmpathizeState, isEmpathizeState, type EmpathizeState } from './empathize'
import { createDefaultIdeateState, isIdeateState, type IdeateState } from './ideate-state'
import { createDefaultMetaState, isMetaState, type MetaState } from './meta-state'
import {
  createDefaultProject,
  isProject,
  normalizeProject,
  type Project,
} from './project'
import {
  createDefaultPrototypeState,
  isPrototypeState,
  type PrototypeState,
} from './prototype-state'
import { createDefaultTestState, isTestState, type TestState } from './test-state'

/** Current on-disk / export document schema. */
export const UX_FLOW_SCHEMA_VERSION = 1 as const

export type UxFlowSchemaVersion = typeof UX_FLOW_SCHEMA_VERSION

/**
 * Single namespaced persistence document (`ux-flow:v1`).
 * All domain stores read/write slices of this document.
 */
export interface UxFlowDocument {
  schemaVersion: UxFlowSchemaVersion
  project: Project
  empathize: EmpathizeState
  define: DefineState
  ideate: IdeateState
  prototype: PrototypeState
  test: TestState
  meta: MetaState
  aiPrefs: AiPrefs
}

export function createDefaultDocument(): UxFlowDocument {
  return {
    schemaVersion: UX_FLOW_SCHEMA_VERSION,
    project: createDefaultProject(),
    empathize: createDefaultEmpathizeState(),
    define: createDefaultDefineState(),
    ideate: createDefaultIdeateState(),
    prototype: createDefaultPrototypeState(),
    test: createDefaultTestState(),
    meta: createDefaultMetaState(),
    aiPrefs: createDefaultAiPrefs(),
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isUxFlowDocument(value: unknown): value is UxFlowDocument {
  if (!isRecord(value)) return false
  return (
    value.schemaVersion === UX_FLOW_SCHEMA_VERSION &&
    isProject(value.project) &&
    isEmpathizeState(value.empathize) &&
    isDefineState(value.define) &&
    isIdeateState(value.ideate) &&
    isPrototypeState(value.prototype) &&
    isTestState(value.test) &&
    isMetaState(value.meta) &&
    isAiPrefs(value.aiPrefs)
  )
}

/** Merge unknown JSON into a valid document (import / migrate soft-fail). */
export function normalizeDocument(value: unknown): UxFlowDocument {
  const defaults = createDefaultDocument()
  if (!isRecord(value)) return defaults

  const schemaVersion =
    value.schemaVersion === UX_FLOW_SCHEMA_VERSION
      ? UX_FLOW_SCHEMA_VERSION
      : defaults.schemaVersion

  return {
    schemaVersion,
    project: normalizeProject(value.project),
    empathize: isEmpathizeState(value.empathize) ? value.empathize : defaults.empathize,
    define: isDefineState(value.define) ? value.define : defaults.define,
    ideate: isIdeateState(value.ideate) ? value.ideate : defaults.ideate,
    prototype: isPrototypeState(value.prototype) ? value.prototype : defaults.prototype,
    test: isTestState(value.test) ? value.test : defaults.test,
    meta: isMetaState(value.meta) ? value.meta : defaults.meta,
    aiPrefs: isAiPrefs(value.aiPrefs) ? value.aiPrefs : defaults.aiPrefs,
  }
}
