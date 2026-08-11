import {
  createEmptyPOV,
  createEmptyProblemStatement,
  isHMWItemArray,
  isPOV,
  isProblemStatement,
  type HMWItem,
  type POV,
  type ProblemStatement,
} from './define'

export interface DefineState {
  problem: ProblemStatement
  pov: POV
  hmw: HMWItem[]
}

export function createDefaultDefineState(): DefineState {
  return {
    problem: createEmptyProblemStatement(),
    pov: createEmptyPOV(),
    hmw: [],
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isDefineState(value: unknown): value is DefineState {
  if (!isRecord(value)) return false
  return (
    isProblemStatement(value.problem) && isPOV(value.pov) && isHMWItemArray(value.hmw)
  )
}
