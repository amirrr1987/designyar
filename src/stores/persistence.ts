import { defineStore } from 'pinia'
import { useStorage, type RemovableRef } from '@vueuse/core'
import { UX_FLOW_DOCUMENT_KEY } from '@/constants/storage-keys'
import { migrateToDocumentV1 } from '@/domain/migrate'
import {
  createDefaultDocument,
  normalizeDocument,
  type UxFlowDocument,
} from '@/types/document'
import type { AiPrefs } from '@/types/ai-prefs'
import type { DefineState } from '@/types/define-state'
import type { EmpathizeState } from '@/types/empathize'
import type { IdeateState } from '@/types/ideate-state'
import type { MetaState } from '@/types/meta-state'
import type { Project } from '@/types/project'
import type { PrototypeState } from '@/types/prototype-state'
import type { TestState } from '@/types/test-state'

/**
 * Sole LocalStorage owner for domain data (`ux-flow:v1`).
 * Domain stores mutate slices via patch helpers — never call useStorage for domain elsewhere.
 */
export const usePersistenceStore = defineStore('persistence', () => {
  const migrated = migrateToDocumentV1()

  const document: RemovableRef<UxFlowDocument> = useStorage<UxFlowDocument>(
    UX_FLOW_DOCUMENT_KEY,
    migrated.document,
  )

  /** Normalize after HMR / partial writes. */
  function ensureNormalized(): void {
    document.value = normalizeDocument(document.value)
  }

  function replaceDocument(next: UxFlowDocument): void {
    document.value = normalizeDocument(next)
  }

  function resetDocument(): void {
    document.value = createDefaultDocument()
  }

  function patchProject(patch: Partial<Project>): void {
    const current = normalizeDocument(document.value)
    document.value = {
      ...current,
      project: { ...current.project, ...patch, schemaVersion: current.schemaVersion },
    }
  }

  function patchEmpathize(patch: Partial<EmpathizeState>): void {
    const current = normalizeDocument(document.value)
    document.value = {
      ...current,
      empathize: { ...current.empathize, ...patch },
    }
  }

  function setEmpathize(next: EmpathizeState): void {
    const current = normalizeDocument(document.value)
    document.value = { ...current, empathize: next }
  }

  function patchDefine(patch: Partial<DefineState>): void {
    const current = normalizeDocument(document.value)
    document.value = {
      ...current,
      define: { ...current.define, ...patch },
    }
  }

  function setDefine(next: DefineState): void {
    const current = normalizeDocument(document.value)
    document.value = { ...current, define: next }
  }

  function patchIdeate(patch: Partial<IdeateState>): void {
    const current = normalizeDocument(document.value)
    document.value = {
      ...current,
      ideate: { ...current.ideate, ...patch },
    }
  }

  function setIdeate(next: IdeateState): void {
    const current = normalizeDocument(document.value)
    document.value = { ...current, ideate: next }
  }

  function patchPrototype(patch: Partial<PrototypeState>): void {
    const current = normalizeDocument(document.value)
    document.value = {
      ...current,
      prototype: { ...current.prototype, ...patch },
    }
  }

  function setPrototype(next: PrototypeState): void {
    const current = normalizeDocument(document.value)
    document.value = { ...current, prototype: next }
  }

  function patchTest(patch: Partial<TestState>): void {
    const current = normalizeDocument(document.value)
    document.value = {
      ...current,
      test: { ...current.test, ...patch },
    }
  }

  function setTest(next: TestState): void {
    const current = normalizeDocument(document.value)
    document.value = { ...current, test: next }
  }

  function patchMeta(patch: Partial<MetaState>): void {
    const current = normalizeDocument(document.value)
    document.value = {
      ...current,
      meta: { ...current.meta, ...patch },
    }
  }

  function setMeta(next: MetaState): void {
    const current = normalizeDocument(document.value)
    document.value = { ...current, meta: next }
  }

  function patchAiPrefs(patch: Partial<AiPrefs>): void {
    const current = normalizeDocument(document.value)
    document.value = {
      ...current,
      aiPrefs: { ...current.aiPrefs, ...patch },
    }
  }

  return {
    document,
    migratedFromLegacy: migrated.migratedFromLegacy,
    ensureNormalized,
    replaceDocument,
    resetDocument,
    patchProject,
    patchEmpathize,
    setEmpathize,
    patchDefine,
    setDefine,
    patchIdeate,
    setIdeate,
    patchPrototype,
    setPrototype,
    patchTest,
    setTest,
    patchMeta,
    setMeta,
    patchAiPrefs,
  }
})
