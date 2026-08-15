import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import {
  createDefaultIdeateState,
  type CardGroup,
  type IdeateState,
} from '@/types/ideate'

export const useIdeateStore = defineStore('ideate', () => {
  const state = useStorage<IdeateState>(STORAGE_KEYS.ideate, createDefaultIdeateState())

  function setIdeas(ideas: string[]): void {
    state.value = { ...state.value, ideas }
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
    state.value = next
  }

  return { state, setIdeas, setUserflow, setSitemap, setCardSort, hydrate }
})
