import type { UxFlowDocument } from '@/types/document'
import {
  buildCompletionSnapshot,
  getPhaseProgress,
  getProjectProgress,
  type CompletionSnapshot,
  type PhaseProgress,
  type ProjectProgress,
} from './completion'

/** Re-export helpers for callers that want snapshot + progress together. */
export function snapshotFromDocument(doc: UxFlowDocument): CompletionSnapshot {
  return buildCompletionSnapshot(doc)
}

export function projectProgressFromDocument(doc: UxFlowDocument): ProjectProgress {
  return getProjectProgress(buildCompletionSnapshot(doc))
}

export function phaseProgressFromDocument(
  doc: UxFlowDocument,
  phase: PhaseProgress['phase'],
): PhaseProgress {
  return getPhaseProgress(buildCompletionSnapshot(doc), phase)
}

export type { CompletionSnapshot, PhaseProgress, ProjectProgress }
