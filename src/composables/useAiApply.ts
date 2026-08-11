import { useStorage } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { useAiHistory } from '@/composables/useAiHistory'
import { useDefineStore } from '@/stores/define'
import { useIdeateStore } from '@/stores/ideate'
import { usePersonaStore } from '@/stores/persona'
import { useProjectStore } from '@/stores/project'
import type { AiChainId } from '@/constants/ai-chains'
import type { EmpathyMapsByPersona } from '@/types/empathy-map'
import type { AiApplyPayload, AiSitemapNodeDraft } from '@/types/ai-response'
import type { MicrocopyEntry } from '@/types/microcopy'
import type { CompetitorRow } from '@/types/competitor'
import type { SitemapNode } from '@/types/ideate'
import type { AiActionId } from '@/utils/ai-prompts'
import {
  buildAiHistoryEntry,
  captureApplyBeforeState,
} from '@/utils/ai-apply-diff'

function draftToSitemapNode(draft: AiSitemapNodeDraft): SitemapNode {
  return {
    key: crypto.randomUUID(),
    title: draft.title.trim(),
    children: draft.children?.length ? draft.children.map(draftToSitemapNode) : [],
  }
}

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

export interface AiApplyAudit {
  actionId: AiActionId
  chainId?: AiChainId
}

export function useAiApply() {
  const personaStore = usePersonaStore()
  const defineStore = useDefineStore()
  const ideateStore = useIdeateStore()
  const projectStore = useProjectStore()
  const { addEntry } = useAiHistory()
  const { problem, pov } = storeToRefs(defineStore)
  const { sitemap } = storeToRefs(ideateStore)

  const usabilityReportSummary = useStorage<string>(STORAGE_KEYS.usabilityReportSummary, '')
  const researchNotes = useStorage<string>(STORAGE_KEYS.researchNotes, '')
  const empathyMaps = useStorage<EmpathyMapsByPersona>(STORAGE_KEYS.empathyMaps, {})
  const empathySelectedPersona = useStorage<string>(STORAGE_KEYS.empathySelectedPersona, 'general')
  const microcopyBank = useStorage<MicrocopyEntry[]>(STORAGE_KEYS.microcopyBank, [])
  const wireframeBlocks = useStorage<string[]>(STORAGE_KEYS.wireframeBlocks, [
    'header',
    'content',
    'footer',
  ])
  const competitors = useStorage<CompetitorRow[]>(STORAGE_KEYS.competitors, [])

  function applyPayload(payload: AiApplyPayload, audit?: AiApplyAudit): number {
    const before = audit
      ? captureApplyBeforeState(payload, {
          problem: problem.value,
          pov: pov.value,
          briefTitle: projectStore.briefTitle,
          briefDescription: projectStore.briefDescription,
          researchNotes: researchNotes.value,
          testSummary: usabilityReportSummary.value,
          sitemap: sitemap.value,
          wireframeBlocks: wireframeBlocks.value,
        })
      : null

    const count = applyPayloadCore(payload)

    if (audit && count > 0 && before) {
      addEntry(buildAiHistoryEntry(audit.actionId, payload, count, before, audit.chainId))
    }

    return count
  }

  function applyPayloadCore(payload: AiApplyPayload): number {
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
      case 'researchNotes': {
        researchNotes.value = payload.item
        return 1
      }
      case 'empathyMaps': {
        let applied = 0
        for (const draft of payload.items) {
          if (!draft.personaId.trim()) continue
          empathyMaps.value = {
            ...empathyMaps.value,
            [draft.personaId]: {
              personaId: draft.personaId,
              quadrants: {
                says: draft.quadrants.says.trim(),
                thinks: draft.quadrants.thinks.trim(),
                does: draft.quadrants.does.trim(),
                feels: draft.quadrants.feels.trim(),
              },
              updatedAt: new Date().toISOString(),
            },
          }
          applied += 1
        }
        const first = payload.items[0]
        if (first?.personaId.trim()) {
          empathySelectedPersona.value = first.personaId
        }
        return applied
      }
      case 'sitemap': {
        const nodes = payload.items.map(draftToSitemapNode)
        ideateStore.setSitemap(nodes)
        return nodes.length
      }
      case 'sortCards': {
        let added = 0
        for (const label of payload.items) {
          const trimmed = label.trim()
          if (!trimmed) continue
          ideateStore.addSortCard(trimmed)
          added += 1
        }
        return added
      }
      case 'microcopy': {
        let added = 0
        const next = [...microcopyBank.value]
        for (const draft of payload.items) {
          if (!draft.text.trim()) continue
          next.push({
            id: crypto.randomUUID(),
            category: draft.category,
            text: draft.text.trim(),
            context: draft.context?.trim() ?? '',
            createdAt: new Date().toISOString(),
          })
          added += 1
        }
        microcopyBank.value = next
        return added
      }
      case 'wireframeBlocks': {
        if (payload.items.length === 0) return 0
        wireframeBlocks.value = [...payload.items]
        return payload.items.length
      }
      case 'competitors': {
        let added = 0
        const next = [...competitors.value]
        for (const draft of payload.items) {
          if (!draft.name.trim() || !draft.strength.trim() || !draft.weakness.trim()) continue
          next.push({
            id: crypto.randomUUID(),
            name: draft.name.trim(),
            strength: draft.strength.trim(),
            weakness: draft.weakness.trim(),
            url: draft.url?.trim() || undefined,
          })
          added += 1
        }
        competitors.value = next
        return added
      }
      default: {
        const _exhaustive: never = payload
        return _exhaustive
      }
    }
  }

  return { applyPayload }
}
