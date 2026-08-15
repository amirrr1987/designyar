import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePersistenceStore } from '@/stores/persistence'
import {
  createEmptyCardSortState,
  type CardSortState,
  type FlowNode,
  type FlowNodeKind,
  type IdeaCard,
  type SitemapNode,
  type SortCard,
} from '@/types/ideate'

function createId(): string {
  return crypto.randomUUID()
}

export const useIdeateStore = defineStore('ideate', () => {
  const persistence = usePersistenceStore()

  const ideas = computed({
    get: () => persistence.document.ideate.ideas,
    set: (value: IdeaCard[]) => {
      persistence.patchIdeate({ ideas: value })
    },
  })

  const flowNodes = computed({
    get: () => persistence.document.ideate.flowNodes,
    set: (value: FlowNode[]) => {
      persistence.patchIdeate({ flowNodes: value })
    },
  })

  const sitemap = computed({
    get: () => persistence.document.ideate.sitemap,
    set: (value: SitemapNode[]) => {
      persistence.patchIdeate({ sitemap: value })
    },
  })

  const cardSort = computed({
    get: () => persistence.document.ideate.cardSort,
    set: (value: CardSortState) => {
      persistence.patchIdeate({ cardSort: value })
    },
  })

  function addIdea(input: { title: string; detail: string; tags?: string[] }): IdeaCard {
    const idea: IdeaCard = {
      id: createId(),
      title: input.title.trim(),
      detail: input.detail.trim(),
      votes: 0,
      tags: input.tags ?? [],
      createdAt: new Date().toISOString(),
    }
    persistence.patchIdeate({ ideas: [...ideas.value, idea] })
    return idea
  }

  function removeIdea(id: string): void {
    persistence.patchIdeate({ ideas: ideas.value.filter((i) => i.id !== id) })
  }

  function voteIdea(id: string): void {
    const index = ideas.value.findIndex((i) => i.id === id)
    if (index < 0) return
    const current = ideas.value[index]
    if (!current) return
    const copy = [...ideas.value]
    copy[index] = { ...current, votes: current.votes + 1 }
    persistence.patchIdeate({ ideas: copy })
  }

  function addFlowNode(kind: FlowNodeKind, label: string): FlowNode {
    const node: FlowNode = {
      id: createId(),
      kind,
      label: label.trim(),
    }
    const prev = flowNodes.value[flowNodes.value.length - 1]
    if (prev && !prev.nextId) {
      const copy = [...flowNodes.value]
      const lastIndex = copy.length - 1
      const last = copy[lastIndex]
      if (last) copy[lastIndex] = { ...last, nextId: node.id }
      persistence.patchIdeate({ flowNodes: [...copy, node] })
    } else {
      persistence.patchIdeate({ flowNodes: [...flowNodes.value, node] })
    }
    return node
  }

  function updateFlowNode(id: string, patch: Partial<Pick<FlowNode, 'kind' | 'label'>>): void {
    const index = flowNodes.value.findIndex((n) => n.id === id)
    if (index < 0) return
    const current = flowNodes.value[index]
    if (!current) return
    const copy = [...flowNodes.value]
    copy[index] = { ...current, ...patch }
    persistence.patchIdeate({ flowNodes: copy })
  }

  function removeFlowNode(id: string): void {
    persistence.patchIdeate({
      flowNodes: flowNodes.value
        .filter((n) => n.id !== id)
        .map((n) => (n.nextId === id ? { ...n, nextId: undefined } : n)),
    })
  }

  function setSitemap(nodes: SitemapNode[]): void {
    persistence.patchIdeate({ sitemap: nodes })
  }

  function addSitemapChild(parentKey: string | null, title: string): void {
    const node: SitemapNode = { key: createId(), title: title.trim(), children: [] }
    if (parentKey === null) {
      persistence.patchIdeate({ sitemap: [...sitemap.value, node] })
      return
    }
    persistence.patchIdeate({
      sitemap: mapSitemap(sitemap.value, (n) => {
        if (n.key !== parentKey) return n
        return { ...n, children: [...(n.children ?? []), node] }
      }),
    })
  }

  function updateSitemapTitle(key: string, title: string): void {
    persistence.patchIdeate({
      sitemap: mapSitemap(sitemap.value, (n) =>
        n.key === key ? { ...n, title: title.trim() } : n,
      ),
    })
  }

  function removeSitemapNode(key: string): void {
    persistence.patchIdeate({ sitemap: removeFromSitemap(sitemap.value, key) })
  }

  function addSortCard(label: string): SortCard {
    const card: SortCard = { id: createId(), label: label.trim() }
    persistence.patchIdeate({
      cardSort: {
        ...cardSort.value,
        cards: [...cardSort.value.cards, card],
        unassignedIds: [...cardSort.value.unassignedIds, card.id],
      },
    })
    return card
  }

  function assignSortCard(cardId: string, categoryId: string | null): void {
    const categories = cardSort.value.categories.map((cat) => ({
      ...cat,
      cardIds: cat.cardIds.filter((id) => id !== cardId),
    }))
    let unassignedIds = cardSort.value.unassignedIds.filter((id) => id !== cardId)

    if (categoryId === null) {
      unassignedIds = [...unassignedIds, cardId]
    } else {
      const index = categories.findIndex((c) => c.id === categoryId)
      const target = categories[index]
      if (target) {
        categories[index] = { ...target, cardIds: [...target.cardIds, cardId] }
      } else {
        unassignedIds = [...unassignedIds, cardId]
      }
    }

    persistence.patchIdeate({
      cardSort: { ...cardSort.value, categories, unassignedIds },
    })
  }

  function removeSortCard(cardId: string): void {
    persistence.patchIdeate({
      cardSort: {
        cards: cardSort.value.cards.filter((c) => c.id !== cardId),
        categories: cardSort.value.categories.map((cat) => ({
          ...cat,
          cardIds: cat.cardIds.filter((id) => id !== cardId),
        })),
        unassignedIds: cardSort.value.unassignedIds.filter((id) => id !== cardId),
      },
    })
  }

  function resetCardSort(): void {
    persistence.patchIdeate({ cardSort: createEmptyCardSortState() })
  }

  return {
    ideas,
    flowNodes,
    sitemap,
    cardSort,
    addIdea,
    removeIdea,
    voteIdea,
    addFlowNode,
    updateFlowNode,
    removeFlowNode,
    setSitemap,
    addSitemapChild,
    updateSitemapTitle,
    removeSitemapNode,
    addSortCard,
    assignSortCard,
    removeSortCard,
    resetCardSort,
  }
})

function mapSitemap(
  nodes: SitemapNode[],
  mapper: (node: SitemapNode) => SitemapNode,
): SitemapNode[] {
  return nodes.map((node) => {
    const mapped = mapper(node)
    if (!mapped.children?.length) return mapped
    return { ...mapped, children: mapSitemap(mapped.children, mapper) }
  })
}

function removeFromSitemap(nodes: SitemapNode[], key: string): SitemapNode[] {
  return nodes
    .filter((n) => n.key !== key)
    .map((n) => ({
      ...n,
      children: n.children ? removeFromSitemap(n.children, key) : undefined,
    }))
}
