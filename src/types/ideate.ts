export interface IdeaCard {
  id: string
  title: string
  detail: string
  votes: number
  tags: string[]
  createdAt: string
}

export type FlowNodeKind = 'start' | 'action' | 'decision' | 'end'

export interface FlowNode {
  id: string
  kind: FlowNodeKind
  label: string
  /** Optional next node id for linear/decision edges. */
  nextId?: string
}

export interface SitemapNode {
  key: string
  title: string
  children?: SitemapNode[]
}

export interface SortCard {
  id: string
  label: string
}

export interface SortCategory {
  id: string
  title: string
  cardIds: string[]
}

export interface CardSortState {
  cards: SortCard[]
  categories: SortCategory[]
  /** Cards not yet assigned to a category. */
  unassignedIds: string[]
}

export function createEmptyCardSortState(): CardSortState {
  return {
    cards: [],
    categories: [
      { id: 'cat-must', title: 'باید باشد', cardIds: [] },
      { id: 'cat-should', title: 'بهتر است باشد', cardIds: [] },
      { id: 'cat-could', title: 'می‌تواند باشد', cardIds: [] },
    ],
    unassignedIds: [],
  }
}

export function isIdeaCard(value: unknown): value is IdeaCard {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    typeof v.title === 'string' &&
    typeof v.detail === 'string' &&
    typeof v.votes === 'number' &&
    Array.isArray(v.tags) &&
    v.tags.every((t) => typeof t === 'string') &&
    typeof v.createdAt === 'string'
  )
}

export function isFlowNodeKind(value: unknown): value is FlowNodeKind {
  return value === 'start' || value === 'action' || value === 'decision' || value === 'end'
}

export function isFlowNode(value: unknown): value is FlowNode {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  const nextOk = v.nextId === undefined || typeof v.nextId === 'string'
  return typeof v.id === 'string' && isFlowNodeKind(v.kind) && typeof v.label === 'string' && nextOk
}

function isSitemapNode(value: unknown): value is SitemapNode {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  if (typeof v.key !== 'string' || typeof v.title !== 'string') return false
  if (v.children === undefined) return true
  return Array.isArray(v.children) && v.children.every(isSitemapNode)
}

export function isSitemapNodeArray(value: unknown): value is SitemapNode[] {
  return Array.isArray(value) && value.every(isSitemapNode)
}

export { isSitemapNode }
