/** Design Thinking step keys (order-independent identity). */
export type DesignStepKey = 'empathize' | 'define' | 'ideate' | 'prototype' | 'test'

/** UI complexity mode — junior hides advanced tools and jargon-heavy AI clusters. */
export type ExperienceMode = 'junior' | 'full'

export function isExperienceMode(value: unknown): value is ExperienceMode {
  return value === 'junior' || value === 'full'
}

export interface Project {
  name: string
  /** عنوان کوتاه / نام محصول در شرح پروژه. */
  briefTitle: string
  /** توضیح آزاد پروژه — محور context برای AI و فرم‌ها. */
  briefDescription: string
  /** 1-based index into DESIGN_THINKING_STEPS (1 = empathize … 5 = test). */
  currentStep: number
  /**
   * UI complexity: `junior` (default) shows essentials + guides;
   * `full` exposes every tool and AI action.
   */
  experienceMode: ExperienceMode
  /**
   * Document schema version stamped on the project for migrations.
   * Keep in sync with `UX_FLOW_SCHEMA_VERSION` in `types/document.ts`.
   */
  schemaVersion: number
  createdAt: string
}

export function createDefaultProject(): Project {
  return {
    name: '',
    briefTitle: '',
    briefDescription: '',
    currentStep: 1,
    experienceMode: 'junior',
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
  }
}

/** True when any of name / title / description is filled. */
export function projectHasBrief(project: Project): boolean {
  return Boolean(
    project.name.trim() || project.briefTitle.trim() || project.briefDescription.trim(),
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/** Merge persisted project with defaults (backward-compatible reads). */
export function normalizeProject(value: unknown): Project {
  const defaults = createDefaultProject()
  if (!isRecord(value)) return defaults
  const currentStep =
    typeof value.currentStep === 'number' &&
    Number.isFinite(value.currentStep) &&
    value.currentStep >= 1 &&
    value.currentStep <= 5
      ? value.currentStep
      : defaults.currentStep
  const schemaVersion =
    typeof value.schemaVersion === 'number' &&
    Number.isFinite(value.schemaVersion) &&
    value.schemaVersion >= 1
      ? Math.floor(value.schemaVersion)
      : defaults.schemaVersion
  return {
    name: typeof value.name === 'string' ? value.name : defaults.name,
    briefTitle: typeof value.briefTitle === 'string' ? value.briefTitle : defaults.briefTitle,
    briefDescription:
      typeof value.briefDescription === 'string'
        ? value.briefDescription
        : defaults.briefDescription,
    currentStep,
    experienceMode: isExperienceMode(value.experienceMode)
      ? value.experienceMode
      : defaults.experienceMode,
    schemaVersion,
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : defaults.createdAt,
  }
}

export function isDesignStepKey(value: unknown): value is DesignStepKey {
  return (
    value === 'empathize' ||
    value === 'define' ||
    value === 'ideate' ||
    value === 'prototype' ||
    value === 'test'
  )
}

export function isProject(value: unknown): value is Project {
  if (!isRecord(value)) return false
  const briefTitleOk = value.briefTitle === undefined || typeof value.briefTitle === 'string'
  const briefDescriptionOk =
    value.briefDescription === undefined || typeof value.briefDescription === 'string'
  const experienceModeOk =
    value.experienceMode === undefined || isExperienceMode(value.experienceMode)
  const schemaOk =
    value.schemaVersion === undefined ||
    (typeof value.schemaVersion === 'number' && Number.isFinite(value.schemaVersion))
  return (
    typeof value.name === 'string' &&
    briefTitleOk &&
    briefDescriptionOk &&
    experienceModeOk &&
    schemaOk &&
    typeof value.currentStep === 'number' &&
    Number.isFinite(value.currentStep) &&
    value.currentStep >= 1 &&
    value.currentStep <= 5 &&
    typeof value.createdAt === 'string'
  )
}
