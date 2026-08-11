import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import {
  assemblePOVSentence,
  assembleProblemSentence,
  createEmptyPOV,
  createEmptyProblemStatement,
  type HMWItem,
  type POV,
  type ProblemStatement,
} from '@/types/define'

export const useDefineStore = defineStore('define', () => {
  const problem = useStorage<ProblemStatement>(
    STORAGE_KEYS.problem,
    createEmptyProblemStatement(),
  )
  const pov = useStorage<POV>(STORAGE_KEYS.pov, createEmptyPOV())
  const hmw = useStorage<HMWItem[]>(STORAGE_KEYS.hmw, [])

  const problemSentence = computed(() => assembleProblemSentence(problem.value))
  const povSentence = computed(() => assemblePOVSentence(pov.value))

  function setProblem(next: ProblemStatement): void {
    problem.value = next
  }

  function patchProblem(patch: Partial<ProblemStatement>): void {
    problem.value = { ...problem.value, ...patch }
  }

  function setPOV(next: POV): void {
    pov.value = next
  }

  function patchPOV(patch: Partial<POV>): void {
    pov.value = { ...pov.value, ...patch }
  }

  function addHMW(question: string): HMWItem {
    const item: HMWItem = {
      id: crypto.randomUUID(),
      question: question.trim(),
      votes: 0,
    }
    hmw.value = [...hmw.value, item]
    return item
  }

  function removeHMW(id: string): void {
    hmw.value = hmw.value.filter((item) => item.id !== id)
  }

  function setHMWVotes(id: string, votes: number): void {
    const index = hmw.value.findIndex((item) => item.id === id)
    if (index < 0) return
    const current = hmw.value[index]
    if (!current) return
    const nextVotes = Math.max(0, votes)
    const copy = [...hmw.value]
    copy[index] = { ...current, votes: nextVotes }
    hmw.value = copy
  }

  function incrementHMWVote(id: string): void {
    const current = hmw.value.find((item) => item.id === id)
    if (!current) return
    setHMWVotes(id, current.votes + 1)
  }

  return {
    problem,
    pov,
    hmw,
    problemSentence,
    povSentence,
    setProblem,
    patchProblem,
    setPOV,
    patchPOV,
    addHMW,
    removeHMW,
    setHMWVotes,
    incrementHMWVote,
  }
})
