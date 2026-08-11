import { useStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { storeToRefs } from 'pinia'
import { usePersona } from '@/composables/usePersona'
import { useWCAG } from '@/composables/useWCAG'
import { HEURISTIC_RULES, type HeuristicEvalMap } from '@/constants/heuristic-rules'
import { WCAG_CHECKLIST } from '@/constants/wcag-checklist'
import { useDefineStore } from '@/stores/define'
import { useDesignSystemStore } from '@/stores/designSystem'
import { useIdeateStore } from '@/stores/ideate'
import { useProjectStore } from '@/stores/project'
import type { CompetitorRow } from '@/types/competitor'
import type { EmpathyMapsByPersona } from '@/types/empathy-map'
import type { SitemapNode } from '@/types/ideate'
import { evaluateContrast } from '@/utils/contrast'
import type { AiPromptContext } from '@/utils/ai-prompts'

const WIREFRAME_LABELS: Record<string, string> = {
  header: 'هدر',
  nav: 'ناوبری جانبی',
  hero: 'هیرو',
  content: 'محتوا',
  form: 'فرم',
  list: 'لیست/جدول',
  footer: 'فوتر',
}

function flattenSitemap(nodes: SitemapNode[], depth = 0): string[] {
  const lines: string[] = []
  for (const node of nodes) {
    lines.push(`${'  '.repeat(depth)}- ${node.title}`)
    if (node.children?.length) {
      lines.push(...flattenSitemap(node.children, depth + 1))
    }
  }
  return lines
}

function summarizeEmpathyMaps(maps: EmpathyMapsByPersona): string | undefined {
  const entries = Object.values(maps).filter(
    (e) =>
      e.quadrants.says.trim() ||
      e.quadrants.thinks.trim() ||
      e.quadrants.does.trim() ||
      e.quadrants.feels.trim(),
  )
  if (entries.length === 0) return undefined

  return entries
    .map((e) => {
      const q = e.quadrants
      return `[${e.personaId}] می‌گوید: ${q.says || '—'} | فکر: ${q.thinks || '—'} | انجام: ${q.does || '—'} | احساس: ${q.feels || '—'}`
    })
    .join('\n')
}

export function useAiPromptContext(): { buildContext: (userHint?: string) => AiPromptContext } {
  const projectStore = useProjectStore()
  const defineStore = useDefineStore()
  const ideateStore = useIdeateStore()
  const designStore = useDesignSystemStore()
  const { personas } = usePersona()
  const { progress: wcagProgress, checkedIds } = useWCAG()
  const { problemSentence, povSentence, hmw } = storeToRefs(defineStore)
  const { ideas, flowNodes, sitemap, cardSort } = storeToRefs(ideateStore)
  const { palette, typography, grid, spacing } = storeToRefs(designStore)

  const researchNotes = useStorage<string>(STORAGE_KEYS.researchNotes, '')
  const empathyMaps = useStorage<EmpathyMapsByPersona>(STORAGE_KEYS.empathyMaps, {})
  const competitors = useStorage<CompetitorRow[]>(STORAGE_KEYS.competitors, [])
  const wireframeBlockIds = useStorage<string[]>(STORAGE_KEYS.wireframeBlocks, [
    'header',
    'content',
    'footer',
  ])
  const evaluations = useStorage<HeuristicEvalMap>(STORAGE_KEYS.heuristicEval, {})

  function buildContext(userHint?: string): AiPromptContext {
    const personasSummary = personas.value
      .map((p) => `- ${p.name} (${p.role}): اهداف=${p.goals}; دردها=${p.pains}`)
      .join('\n')

    const hmwSummary = hmw.value.map((item) => `- ${item.question} (${item.votes} رأی)`).join('\n')

    const ideasSummary = ideas.value
      .slice(0, 12)
      .map((i) => `- ${i.title}: ${i.detail}`)
      .join('\n')

    const userflowSummary = flowNodes.value
      .map((n) => `- [${n.kind}] ${n.label}`)
      .join('\n')

    const sitemapLines = flattenSitemap(sitemap.value)
    const sitemapSummary = sitemapLines.length > 0 ? sitemapLines.join('\n') : undefined

    const cardSortSummary = [
      ...cardSort.value.categories.map(
        (cat) =>
          `${cat.title}: ${cat.cardIds.map((id) => cardSort.value.cards.find((c) => c.id === id)?.label ?? id).join(', ') || '(خالی)'}`,
      ),
      cardSort.value.unassignedIds.length > 0
        ? `تخصیص‌نشده: ${cardSort.value.unassignedIds
            .map((id) => cardSort.value.cards.find((c) => c.id === id)?.label ?? id)
            .join(', ')}`
        : '',
    ]
      .filter(Boolean)
      .join('\n')

    const competitorsSummary = competitors.value
      .map(
        (c) =>
          `- ${c.name}: قوت=${c.strength || '—'}; ضعف=${c.weakness || '—'}${c.url ? `; ${c.url}` : ''}`,
      )
      .join('\n')

    const wireframeSummary = wireframeBlockIds.value
      .map((id) => WIREFRAME_LABELS[id] ?? id)
      .join(' → ')

    const designSystemSummary = [
      `رنگ seed: ${palette.value.seed}; primary[5]: ${palette.value.primary[5] ?? '—'}`,
      `تایپ: ${typography.value.fontFamily}; base=${typography.value.baseSize}px; ratio=${typography.value.ratio}`,
      `گرید: ${grid.value.columns} ستون، gutter=${grid.value.gutter}px، max=${grid.value.maxWidth}px`,
      `فاصله پایه: ${spacing.value.base}px`,
    ].join('\n')

    const unchecked = WCAG_CHECKLIST.filter((item) => !checkedIds.value.includes(item.id))
    const wcagUncheckedSummary =
      unchecked.length > 0
        ? unchecked
            .slice(0, 8)
            .map((item) => `- [${item.level}] ${item.id}: ${item.text}`)
            .join('\n')
        : undefined

    const ratings = HEURISTIC_RULES.map((r) => evaluations.value[r.id]?.rating ?? 0).filter(
      (n) => n > 0,
    )
    const heuristicAverage =
      ratings.length === 0
        ? undefined
        : Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10

    const weakHeuristics = HEURISTIC_RULES.filter((r) => {
      const rating = evaluations.value[r.id]?.rating ?? 0
      return rating > 0 && rating <= 2
    })
    const heuristicWeakSummary =
      weakHeuristics.length > 0
        ? weakHeuristics
            .map((r) => {
              const note = evaluations.value[r.id]?.notes?.trim()
              return `- ${r.number}. ${r.title}${note ? `: ${note}` : ''}`
            })
            .join('\n')
        : undefined

    const fg = palette.value.primary[7] ?? '#000000'
    const bg = palette.value.primary[0] ?? '#ffffff'
    const contrast = evaluateContrast(fg, bg)
    const contrastSummary = contrast ? `${contrast.ratio}:1 (${contrast.level})` : undefined

    return {
      projectName: projectStore.name,
      personasSummary: personasSummary || undefined,
      empathySummary: summarizeEmpathyMaps(empathyMaps.value),
      researchNotes: researchNotes.value || undefined,
      competitorsSummary: competitorsSummary || undefined,
      problemSentence: problemSentence.value,
      povSentence: povSentence.value,
      hmwSummary: hmwSummary || undefined,
      ideasSummary: ideasSummary || undefined,
      userflowSummary: userflowSummary || undefined,
      sitemapSummary,
      cardSortSummary: cardSortSummary || undefined,
      designSystemSummary,
      wireframeSummary: wireframeSummary || undefined,
      wcagProgress: wcagProgress.value,
      wcagUncheckedSummary,
      heuristicAverage,
      heuristicWeakSummary,
      contrastSummary,
      userHint,
    }
  }

  return { buildContext }
}
