import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePersistenceStore } from '@/stores/persistence'
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
  const persistence = usePersistenceStore()

  const problem = computed({
    get: () => persistence.document.define.problem,
    set: (value: ProblemStatement) => {
      persistence.patchDefine({ problem: value })
    },
  })

  const pov = computed({
    get: () => persistence.document.define.pov,
    set: (value: POV) => {
      persistence.patchDefine({ pov: value })
    },
  })

  const hmw = computed({
    get: () => persistence.document.define.hmw,
    set: (value: HMWItem[]) => {
      persistence.patchDefine({ hmw: value })
    },
  })

  const problemSentence = computed(() => assembleProblemSentence(problem.value))
  const povSentence = computed(() => assemblePOVSentence(pov.value))

  function setProblem(next: ProblemStatement): void {
    persistence.patchDefine({ problem: next })
  }

  function patchProblem(patch: Partial<ProblemStatement>): void {
    persistence.patchDefine({ problem: { ...problem.value, ...patch } })
  }

  function setPOV(next: POV): void {
    persistence.patchDefine({ pov: next })
  }

  function patchPOV(patch: Partial<POV>): void {
    persistence.patchDefine({ pov: { ...pov.value, ...patch } })
  }

  function addHMW(question: string): HMWItem {
    const item: HMWItem = {
      id: crypto.randomUUID(),
      question: question.trim(),
      votes: 0,
    }
    persistence.patchDefine({ hmw: [...hmw.value, item] })
    return item
  }

  function removeHMW(id: string): void {
    persistence.patchDefine({ hmw: hmw.value.filter((item) => item.id !== id) })
  }

  function setHMWVotes(id: string, votes: number): void {
    const index = hmw.value.findIndex((item) => item.id === id)
    if (index < 0) return
    const current = hmw.value[index]
    if (!current) return
    const nextVotes = Math.max(0, votes)
    const copy = [...hmw.value]
    copy[index] = { ...current, votes: nextVotes }
    persistence.patchDefine({ hmw: copy })
  }

  function incrementHMWVote(id: string): void {
    const current = hmw.value.find((item) => item.id === id)
    if (!current) return
    setHMWVotes(id, current.votes + 1)
  }

  function reset(): void {
    persistence.setDefine({
      problem: createEmptyProblemStatement(),
      pov: createEmptyPOV(),
      hmw: [],
    })
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
    reset,
  }
})
