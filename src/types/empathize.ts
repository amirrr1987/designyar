import { z } from 'zod'

export function createEntityId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const personaSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  goals: z.string(),
  pains: z.string(),
  /** Mini Persona — what I love */
  loves: z.string().default(''),
  /** Mini Persona — what I fear */
  fears: z.string().default(''),
  /** Mini Persona — daily jobs related to the problem */
  dailyJobs: z.string().default(''),
})

export const empathyMapEntrySchema = z.object({
  id: z.string(),
  label: z.string(),
  personaId: z.string().optional(),
  says: z.string(),
  thinks: z.string(),
  does: z.string(),
  feels: z.string(),
})

/** Interview sheet → key insights (legacy `text` kept for migration). */
export const researchNoteSchema = z.object({
  id: z.string(),
  who: z.string().default(''),
  question: z.string().default(''),
  answer: z.string().default(''),
  insight: z.string().default(''),
  text: z.string().default(''),
})

export const competitorSchema = z.object({
  name: z.string(),
  strength: z.string(),
  weakness: z.string(),
})

export const empathizeStateSchema = z.object({
  researchGoal: z.string(),
  personas: z.array(personaSchema),
  empathyMaps: z.array(empathyMapEntrySchema),
  researchNotes: z.array(researchNoteSchema),
  competitors: z.array(competitorSchema),
})

export type Persona = z.infer<typeof personaSchema>
export type EmpathyMapEntry = z.infer<typeof empathyMapEntrySchema>
export type ResearchNote = z.infer<typeof researchNoteSchema>
export type Competitor = z.infer<typeof competitorSchema>
export type EmpathizeState = z.infer<typeof empathizeStateSchema>

export function createEmptyPersona(): Persona {
  return {
    id: createEntityId(),
    name: '',
    role: '',
    goals: '',
    pains: '',
    loves: '',
    fears: '',
    dailyJobs: '',
  }
}

export function createEmptyEmpathyMap(label = ''): EmpathyMapEntry {
  return {
    id: createEntityId(),
    label,
    says: '',
    thinks: '',
    does: '',
    feels: '',
  }
}

export function createEmptyResearchNote(): ResearchNote {
  return {
    id: createEntityId(),
    who: '',
    question: '',
    answer: '',
    insight: '',
    text: '',
  }
}

function padPersona(raw: Persona): Persona {
  return {
    ...createEmptyPersona(),
    ...raw,
    id: raw.id || createEntityId(),
    loves: raw.loves ?? '',
    fears: raw.fears ?? '',
    dailyJobs: raw.dailyJobs ?? '',
  }
}

function padResearchNote(raw: ResearchNote): ResearchNote {
  const text = raw.text ?? ''
  const insight = (raw.insight ?? '').trim().length > 0 ? raw.insight : text
  const answer = (raw.answer ?? '').trim().length > 0 ? raw.answer : text
  return {
    ...createEmptyResearchNote(),
    ...raw,
    id: raw.id || createEntityId(),
    who: raw.who ?? '',
    question: raw.question ?? '',
    answer: answer ?? '',
    insight: insight ?? '',
    text,
  }
}

export function createDefaultEmpathizeState(): EmpathizeState {
  return {
    researchGoal: '',
    personas: [createEmptyPersona()],
    empathyMaps: [createEmptyEmpathyMap()],
    researchNotes: [createEmptyResearchNote()],
    competitors: [{ name: '', strength: '', weakness: '' }],
  }
}

export function normalizeEmpathizeState(raw: unknown): EmpathizeState {
  const parsed = empathizeStateSchema.safeParse(raw)
  if (parsed.success) {
    return {
      ...parsed.data,
      personas:
        parsed.data.personas.length > 0
          ? parsed.data.personas.map(padPersona)
          : [createEmptyPersona()],
      empathyMaps:
        parsed.data.empathyMaps.length > 0
          ? parsed.data.empathyMaps
          : [createEmptyEmpathyMap()],
      researchNotes:
        parsed.data.researchNotes.length > 0
          ? parsed.data.researchNotes.map(padResearchNote)
          : [createEmptyResearchNote()],
      competitors:
        parsed.data.competitors.length > 0
          ? parsed.data.competitors
          : [{ name: '', strength: '', weakness: '' }],
    }
  }

  if (!raw || typeof raw !== 'object') {
    return createDefaultEmpathizeState()
  }

  const record = raw as Record<string, unknown>
  const defaults = createDefaultEmpathizeState()

  const researchGoal =
    typeof record.researchGoal === 'string' ? record.researchGoal : ''

  let personas = defaults.personas
  if (Array.isArray(record.personas)) {
    const list = record.personas
      .map((item) => {
        if (!item || typeof item !== 'object') return null
        const p = item as Record<string, unknown>
        return padPersona({
          id: typeof p.id === 'string' ? p.id : createEntityId(),
          name: typeof p.name === 'string' ? p.name : '',
          role: typeof p.role === 'string' ? p.role : '',
          goals: typeof p.goals === 'string' ? p.goals : '',
          pains: typeof p.pains === 'string' ? p.pains : '',
          loves: typeof p.loves === 'string' ? p.loves : '',
          fears: typeof p.fears === 'string' ? p.fears : '',
          dailyJobs: typeof p.dailyJobs === 'string' ? p.dailyJobs : '',
        })
      })
      .filter((item): item is Persona => item !== null)
    if (list.length > 0) personas = list
  } else if (record.persona && typeof record.persona === 'object') {
    const p = record.persona as Record<string, unknown>
    personas = [
      padPersona({
        id: createEntityId(),
        name: typeof p.name === 'string' ? p.name : '',
        role: typeof p.role === 'string' ? p.role : '',
        goals: typeof p.goals === 'string' ? p.goals : '',
        pains: typeof p.pains === 'string' ? p.pains : '',
        loves: '',
        fears: '',
        dailyJobs: '',
      }),
    ]
  }

  let empathyMaps = defaults.empathyMaps
  if (Array.isArray(record.empathyMaps)) {
    const list = record.empathyMaps
      .map((item) => {
        if (!item || typeof item !== 'object') return null
        const m = item as Record<string, unknown>
        const entry: EmpathyMapEntry = {
          id: typeof m.id === 'string' ? m.id : createEntityId(),
          label: typeof m.label === 'string' ? m.label : '',
          says: typeof m.says === 'string' ? m.says : '',
          thinks: typeof m.thinks === 'string' ? m.thinks : '',
          does: typeof m.does === 'string' ? m.does : '',
          feels: typeof m.feels === 'string' ? m.feels : '',
        }
        if (typeof m.personaId === 'string') {
          entry.personaId = m.personaId
        }
        return entry
      })
      .filter((item): item is EmpathyMapEntry => item !== null)
    if (list.length > 0) empathyMaps = list
  } else if (record.empathyMap && typeof record.empathyMap === 'object') {
    const m = record.empathyMap as Record<string, unknown>
    const firstPersona = personas[0]
    empathyMaps = [
      {
        id: createEntityId(),
        label: firstPersona?.name ?? '',
        personaId: firstPersona?.id,
        says: typeof m.says === 'string' ? m.says : '',
        thinks: typeof m.thinks === 'string' ? m.thinks : '',
        does: typeof m.does === 'string' ? m.does : '',
        feels: typeof m.feels === 'string' ? m.feels : '',
      },
    ]
  }

  let researchNotes = defaults.researchNotes
  if (Array.isArray(record.researchNotes)) {
    const list = record.researchNotes
      .map((item) => {
        if (typeof item === 'string') {
          return padResearchNote({
            id: createEntityId(),
            who: '',
            question: '',
            answer: item,
            insight: item,
            text: item,
          })
        }
        if (!item || typeof item !== 'object') return null
        const n = item as Record<string, unknown>
        const text = typeof n.text === 'string' ? n.text : ''
        return padResearchNote({
          id: typeof n.id === 'string' ? n.id : createEntityId(),
          who: typeof n.who === 'string' ? n.who : '',
          question: typeof n.question === 'string' ? n.question : '',
          answer: typeof n.answer === 'string' ? n.answer : '',
          insight: typeof n.insight === 'string' ? n.insight : '',
          text,
        })
      })
      .filter((item): item is ResearchNote => item !== null)
    if (list.length > 0) researchNotes = list
  } else if (typeof record.researchNotes === 'string') {
    researchNotes = [
      padResearchNote({
        id: createEntityId(),
        who: '',
        question: '',
        answer: record.researchNotes,
        insight: record.researchNotes,
        text: record.researchNotes,
      }),
    ]
  }

  let competitors = defaults.competitors
  if (Array.isArray(record.competitors)) {
    const list = record.competitors
      .map((item) => {
        if (!item || typeof item !== 'object') return null
        const c = item as Record<string, unknown>
        return {
          name: typeof c.name === 'string' ? c.name : '',
          strength: typeof c.strength === 'string' ? c.strength : '',
          weakness: typeof c.weakness === 'string' ? c.weakness : '',
        } satisfies Competitor
      })
      .filter((item): item is Competitor => item !== null)
    if (list.length > 0) competitors = list
  }

  return {
    researchGoal,
    personas,
    empathyMaps,
    researchNotes,
    competitors,
  }
}

export const researchGoalAiSchema = z.object({
  researchGoal: z.string(),
})

const personaAiItemSchema = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    role: z.string(),
    goals: z.string(),
    pains: z.string(),
    loves: z.string().optional(),
    fears: z.string().optional(),
    dailyJobs: z.string().optional(),
  })
  .transform(
    (item): Persona => ({
      id: item.id && item.id.trim().length > 0 ? item.id : createEntityId(),
      name: item.name,
      role: item.role,
      goals: item.goals,
      pains: item.pains,
      loves: item.loves ?? '',
      fears: item.fears ?? '',
      dailyJobs: item.dailyJobs ?? '',
    }),
  )

const empathyMapAiItemSchema = z
  .object({
    id: z.string().optional(),
    label: z.string(),
    personaId: z.string().optional(),
    says: z.string(),
    thinks: z.string(),
    does: z.string(),
    feels: z.string(),
  })
  .transform(
    (item): EmpathyMapEntry => ({
      id: item.id && item.id.trim().length > 0 ? item.id : createEntityId(),
      label: item.label,
      personaId: item.personaId,
      says: item.says,
      thinks: item.thinks,
      does: item.does,
      feels: item.feels,
    }),
  )

const researchNoteAiItemSchema = z
  .object({
    id: z.string().optional(),
    who: z.string().optional(),
    question: z.string().optional(),
    answer: z.string().optional(),
    insight: z.string().optional(),
    text: z.string().optional(),
  })
  .transform((item): ResearchNote => {
    const text = item.text ?? ''
    const answer = item.answer ?? text
    const insight = item.insight ?? text
    return {
      id: item.id && item.id.trim().length > 0 ? item.id : createEntityId(),
      who: item.who ?? '',
      question: item.question ?? '',
      answer,
      insight,
      text: text || answer || insight,
    }
  })

export const personasAiSchema = z.object({
  personas: z.array(personaAiItemSchema).min(1),
})

export const empathyMapsAiSchema = z.object({
  empathyMaps: z.array(empathyMapAiItemSchema).min(1),
})

export const researchNotesAiSchema = z.object({
  researchNotes: z.array(researchNoteAiItemSchema).min(1),
})

export const competitorsAiSchema = z.object({
  competitors: z.array(competitorSchema).min(1),
})
