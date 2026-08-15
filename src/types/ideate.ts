import { z } from 'zod'

export const cardGroupSchema = z.object({
  name: z.string(),
  items: z.array(z.string()),
})

export const ideateStateSchema = z.object({
  ideas: z.array(z.string()),
  /** Index of selected idea for prototyping; -1 = none */
  selectedIdeaIndex: z.number().int().default(-1),
  userflow: z.string(),
  sitemap: z.string(),
  cardSort: z.array(cardGroupSchema),
})

export type CardGroup = z.infer<typeof cardGroupSchema>
export type IdeateState = z.infer<typeof ideateStateSchema>

export function createDefaultIdeateState(): IdeateState {
  return {
    ideas: [''],
    selectedIdeaIndex: -1,
    userflow: '',
    sitemap: '',
    cardSort: [{ name: 'گروه ۱', items: [''] }],
  }
}

export function normalizeIdeateState(raw: unknown): IdeateState {
  const defaults = createDefaultIdeateState()
  const parsed = ideateStateSchema.safeParse(raw)
  if (parsed.success) {
    return {
      ...parsed.data,
      ideas: parsed.data.ideas.length > 0 ? parsed.data.ideas : [''],
      selectedIdeaIndex:
        typeof parsed.data.selectedIdeaIndex === 'number' ? parsed.data.selectedIdeaIndex : -1,
    }
  }
  if (!raw || typeof raw !== 'object') return defaults
  const record = raw as Record<string, unknown>
  const ideas =
    Array.isArray(record.ideas) && record.ideas.every((item) => typeof item === 'string')
      ? (record.ideas as string[])
      : ['']
  return {
    ideas: ideas.length > 0 ? ideas : [''],
    selectedIdeaIndex:
      typeof record.selectedIdeaIndex === 'number' ? record.selectedIdeaIndex : -1,
    userflow: typeof record.userflow === 'string' ? record.userflow : '',
    sitemap: typeof record.sitemap === 'string' ? record.sitemap : '',
    cardSort: Array.isArray(record.cardSort)
      ? (record.cardSort as CardGroup[])
      : defaults.cardSort,
  }
}

export const brainstormAiSchema = z.object({
  ideas: z.array(z.string()).min(1),
  selectedIdeaIndex: z.number().int().optional(),
})

export const userflowAiSchema = z.object({
  userflow: z.string(),
})

export const sitemapAiSchema = z.object({
  sitemap: z.string(),
})

export const cardSortAiSchema = z.object({
  cardSort: z.array(cardGroupSchema).min(1),
})
