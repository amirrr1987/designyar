import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import {
  createDefaultIdeateState,
  normalizeIdeateState,
  type CardGroup,
  type IdeateState,
} from '@/types/ideate'

export const useIdeateStore = defineStore('ideate', () => {
  const state = useStorage<IdeateState>(STORAGE_KEYS.ideate, createDefaultIdeateState())
  state.value = normalizeIdeateState(state.value)

  function setIdeas(ideas: string[]): void {
    const next = ideas.length > 0 ? ideas : ['']
    let selected = state.value.selectedIdeaIndex
    if (selected >= next.length) selected = -1
    state.value = { ...state.value, ideas: next, selectedIdeaIndex: selected }
  }

  function setSelectedIdeaIndex(selectedIdeaIndex: number): void {
    state.value = { ...state.value, selectedIdeaIndex }
  }

  function setUserflow(userflow: string): void {
    state.value = { ...state.value, userflow }
  }

  function setSitemap(sitemap: string): void {
    state.value = { ...state.value, sitemap }
  }

  function setCardSort(cardSort: CardGroup[]): void {
    state.value = { ...state.value, cardSort }
  }

  function hydrate(next: IdeateState): void {
    state.value = normalizeIdeateState(next)
  }

  return {
    state,
    setIdeas,
    setSelectedIdeaIndex,
    setUserflow,
    setSitemap,
    setCardSort,
    hydrate,
  }
})
