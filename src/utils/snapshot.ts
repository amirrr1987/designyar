import { z } from 'zod'
import { createDefaultDefineState, defineStateSchema } from '@/types/define'
import { createDefaultEmpathizeState, empathizeStateSchema } from '@/types/empathize'
import { createDefaultIdeateState, ideateStateSchema } from '@/types/ideate'
import { createDefaultProject, isProjectState, projectSchema } from '@/types/project'
import { createDefaultPrototypeState, prototypeStateSchema } from '@/types/prototype'
import { createDefaultTestState, testStateSchema } from '@/types/test'

export const snapshotSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  project: projectSchema,
  empathize: empathizeStateSchema,
  define: defineStateSchema,
  ideate: ideateStateSchema,
  prototype: prototypeStateSchema,
  test: testStateSchema,
})

export type ProjectSnapshot = z.infer<typeof snapshotSchema>

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

export function parseSnapshot(data: unknown): ProjectSnapshot | null {
  const result = snapshotSchema.safeParse(data)
  return result.success ? result.data : null
}

export function parseSnapshotJson(text: string): ProjectSnapshot | null {
  try {
    const data: unknown = JSON.parse(text)
    return parseSnapshot(data)
  } catch {
    return null
  }
}

export { isProjectState }
