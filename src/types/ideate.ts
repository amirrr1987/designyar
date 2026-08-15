import { z } from 'zod'

export const cardGroupSchema = z.object({
  name: z.string(),
  items: z.array(z.string()),
})

export const ideateStateSchema = z.object({
  ideas: z.array(z.string()),
  userflow: z.string(),
  sitemap: z.string(),
  cardSort: z.array(cardGroupSchema),
})

export type CardGroup = z.infer<typeof cardGroupSchema>
export type IdeateState = z.infer<typeof ideateStateSchema>

export function createDefaultIdeateState(): IdeateState {
  return {
    ideas: [''],
    userflow: '',
    sitemap: '',
    cardSort: [{ name: 'گروه ۱', items: [''] }],
  }
}

export const brainstormAiSchema = z.object({
  ideas: z.array(z.string()).min(1),
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
