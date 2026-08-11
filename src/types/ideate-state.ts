import {
  createEmptyCardSortState,
  isFlowNode,
  isIdeaCard,
  isSitemapNodeArray,
  type CardSortState,
  type FlowNode,
  type IdeaCard,
  type SitemapNode,
} from './ideate'

export interface IdeateState {
  ideas: IdeaCard[]
  flowNodes: FlowNode[]
  sitemap: SitemapNode[]
  cardSort: CardSortState
}

export function createDefaultIdeateState(): IdeateState {
  return {
    ideas: [],
    flowNodes: [],
    sitemap: [{ key: 'home', title: 'خانه', children: [] }],
    cardSort: createEmptyCardSortState(),
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isIdeaCardArray(value: unknown): value is IdeaCard[] {
  return Array.isArray(value) && value.every(isIdeaCard)
}

function isFlowNodeArray(value: unknown): value is FlowNode[] {
  return Array.isArray(value) && value.every(isFlowNode)
}

function isCardSortState(value: unknown): value is CardSortState {
  if (!isRecord(value)) return false
  return (
    Array.isArray(value.cards) &&
    Array.isArray(value.categories) &&
    isStringArray(value.unassignedIds)
  )
}

export function isIdeateState(value: unknown): value is IdeateState {
  if (!isRecord(value)) return false
  return (
    isIdeaCardArray(value.ideas) &&
    isFlowNodeArray(value.flowNodes) &&
    isSitemapNodeArray(value.sitemap) &&
    isCardSortState(value.cardSort)
  )
}
