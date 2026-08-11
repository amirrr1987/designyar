import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { useDefineStore } from '@/stores/define'
import { useIdeateStore } from '@/stores/ideate'
import { usePersonaStore } from '@/stores/persona'
import { useProjectStore } from '@/stores/project'
import type { AiApplyPayload } from '@/types/ai-response'

const PERSONA_AVATAR_COLORS = ['#1677ff', '#eb2f96', '#52c41a', '#faad14', '#722ed1', '#13c2c2'] as const

function nextAvatarColor(index: number): string {
  const color = PERSONA_AVATAR_COLORS[index % PERSONA_AVATAR_COLORS.length]
  return color ?? '#1677ff'
}

function normalizeHmwQuestion(question: string): string {
  const trimmed = question.trim()
  if (!trimmed) return trimmed
  if (trimmed.startsWith('چگونه می‌توانیم')) return trimmed
  return `چگونه می‌توانیم ${trimmed.replace(/\?$/, '')}؟`
}

export function useAiApply() {
  const personaStore = usePersonaStore()
  const defineStore = useDefineStore()
  const ideateStore = useIdeateStore()
  const projectStore = useProjectStore()
  const usabilityReportSummary = useStorage<string>(STORAGE_KEYS.usabilityReportSummary, '')

  function applyPayload(payload: AiApplyPayload): number {
    switch (payload.type) {
      case 'personas': {
        let added = 0
        const baseCount = personaStore.count
        for (const [index, draft] of payload.items.entries()) {
          if (!draft.name.trim() || !draft.role.trim()) continue
          personaStore.add({
            name: draft.name.trim(),
            role: draft.role.trim(),
            goals: draft.goals.trim(),
            pains: draft.pains.trim(),
            bio: draft.bio.trim(),
            age: draft.age ?? null,
            avatarColor: nextAvatarColor(baseCount + index),
          })
          added += 1
        }
        return added
      }
      case 'hmw': {
        let added = 0
        for (const question of payload.items) {
          const normalized = normalizeHmwQuestion(question)
          if (!normalized) continue
          defineStore.addHMW(normalized)
          added += 1
        }
        return added
      }
      case 'ideas': {
        let added = 0
        for (const idea of payload.items) {
          if (!idea.title.trim()) continue
          ideateStore.addIdea({
            title: idea.title,
            detail: idea.detail,
            tags: idea.tags ?? [],
          })
          added += 1
        }
        return added
      }
      case 'flowSteps': {
        let added = 0
        for (const step of payload.items) {
          if (!step.label.trim()) continue
          ideateStore.addFlowNode(step.kind, step.label)
          added += 1
        }
        return added
      }
      case 'problem': {
        defineStore.setProblem({
          user: payload.item.user.trim(),
          need: payload.item.need.trim(),
          insight: payload.item.insight.trim(),
        })
        return 1
      }
      case 'pov': {
        const currentPersonaId = defineStore.pov.personaId
        defineStore.setPOV({
          user: payload.item.user.trim(),
          need: payload.item.need.trim(),
          insight: payload.item.insight.trim(),
          personaId: currentPersonaId,
        })
        return 1
      }
      case 'projectBrief': {
        projectStore.patchBrief({
          briefTitle: payload.item.briefTitle,
          briefDescription: payload.item.briefDescription,
        })
        if (payload.item.briefTitle.trim() && !projectStore.name.trim()) {
          projectStore.setName(payload.item.briefTitle.trim())
        }
        return 1
      }
      case 'testSummary': {
        usabilityReportSummary.value = payload.item
        return 1
      }
      default: {
        const _exhaustive: never = payload
        return _exhaustive
      }
    }
  }

  return { applyPayload }
}
