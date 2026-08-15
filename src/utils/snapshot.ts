import { z } from 'zod'
import {
  createDefaultDefineState,
  normalizeDefineState,
  type DefineState,
} from '@/types/define'
import {
  createDefaultEmpathizeState,
  normalizeEmpathizeState,
  type EmpathizeState,
} from '@/types/empathize'
import { createDefaultIdeateState, ideateStateSchema, normalizeIdeateState, type IdeateState } from '@/types/ideate'
import { createDefaultProject, isProjectState, projectSchema, type ProjectState } from '@/types/project'
import {
  createDefaultPrototypeState,
  normalizePrototypeState,
  type PrototypeState,
} from '@/types/prototype'
import {
  createDefaultTestState,
  normalizeTestState,
  testStateSchema,
  type TestState,
} from '@/types/test'

export interface ProjectSnapshot {
  version: 1
  exportedAt: string
  project: ProjectState
  empathize: EmpathizeState
  define: DefineState
  ideate: IdeateState
  prototype: PrototypeState
  test: TestState
}

export function createEmptySnapshot(): ProjectSnapshot {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    project: createDefaultProject(),
    empathize: createDefaultEmpathizeState(),
    define: createDefaultDefineState(),
    ideate: createDefaultIdeateState(),
    prototype: createDefaultPrototypeState(),
    test: createDefaultTestState(),
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function parseSnapshot(data: unknown): ProjectSnapshot | null {
  if (!isRecord(data)) return null
  if (data.version !== 1) return null
  if (typeof data.exportedAt !== 'string') return null

  const projectParsed = projectSchema.safeParse(data.project)
  if (!projectParsed.success) return null

  return {
    version: 1,
    exportedAt: data.exportedAt,
    project: projectParsed.data,
    empathize: normalizeEmpathizeState(data.empathize),
    define: normalizeDefineState(data.define),
    ideate: normalizeIdeateState(data.ideate),
    prototype: normalizePrototypeState(data.prototype),
    test: normalizeTestState(data.test),
  }
}

export function parseSnapshotJson(text: string): ProjectSnapshot | null {
  try {
    const data: unknown = JSON.parse(text)
    return parseSnapshot(data)
  } catch {
    return null
  }
}

/** Kept for callers that still import the Zod object shape. */
export const snapshotSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  project: projectSchema,
  empathize: z.unknown(),
  define: z.unknown(),
  ideate: ideateStateSchema,
  prototype: z.unknown(),
  test: testStateSchema,
})

export { isProjectState }
