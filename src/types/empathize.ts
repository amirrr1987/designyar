import { z } from 'zod'

export const personaSchema = z.object({
  name: z.string(),
  role: z.string(),
  goals: z.string(),
  pains: z.string(),
})

export const empathyMapSchema = z.object({
  says: z.string(),
  thinks: z.string(),
  does: z.string(),
  feels: z.string(),
})

export const competitorSchema = z.object({
  name: z.string(),
  strength: z.string(),
  weakness: z.string(),
})

export const empathizeStateSchema = z.object({
  researchGoal: z.string(),
  persona: personaSchema,
  empathyMap: empathyMapSchema,
  researchNotes: z.string(),
  competitors: z.array(competitorSchema),
})

export type Persona = z.infer<typeof personaSchema>
export type EmpathyMap = z.infer<typeof empathyMapSchema>
export type Competitor = z.infer<typeof competitorSchema>
export type EmpathizeState = z.infer<typeof empathizeStateSchema>

export function createDefaultEmpathizeState(): EmpathizeState {
  return {
    researchGoal: '',
    persona: { name: '', role: '', goals: '', pains: '' },
    empathyMap: { says: '', thinks: '', does: '', feels: '' },
    researchNotes: '',
    competitors: [{ name: '', strength: '', weakness: '' }],
  }
}

export const researchGoalAiSchema = z.object({
  researchGoal: z.string(),
})

export const personaAiSchema = personaSchema

export const empathyMapAiSchema = empathyMapSchema

export const researchNotesAiSchema = z.object({
  researchNotes: z.string(),
})

export const competitorsAiSchema = z.object({
  competitors: z.array(competitorSchema).min(1),
})
