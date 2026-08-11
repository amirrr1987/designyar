import type { AiActionId } from '@/utils/ai-prompts'
import { getAiActionDef } from '@/utils/ai-prompts'
import type { AiChainId } from '@/constants/ai-chains'
import type { AiApplyPayload } from '@/types/ai-response'
import type { AiHistoryDiffLine, AiHistoryEntry } from '@/types/ai-history'
import { assemblePOVSentence, assembleProblemSentence } from '@/types/define'
import type { ProblemStatement, POV } from '@/types/define'
import type { SitemapNode } from '@/types/ideate'
import { MICROCOPY_CATEGORY_LABELS } from '@/types/microcopy'

const TRUNCATE = 160

function truncate(value: string, max = TRUNCATE): string {
  const t = value.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max)}…`
}

function countSitemapNodes(nodes: SitemapNode[]): number {
  let count = 0
  for (const node of nodes) {
    count += 1
    if (node.children?.length) count += countSitemapNodes(node.children)
  }
  return count
}

function flattenSitemapTitles(nodes: SitemapNode[], depth = 0): string[] {
  const lines: string[] = []
  for (const node of nodes) {
    lines.push(`${'  '.repeat(depth)}${node.title}`)
    if (node.children?.length) lines.push(...flattenSitemapTitles(node.children, depth + 1))
  }
  return lines
}

export interface AiApplyBeforeState {
  problem?: ProblemStatement
  pov?: POV
  briefTitle?: string
  briefDescription?: string
  researchNotes?: string
  testSummary?: string
  sitemapNodeCount?: number
  sitemapTitles?: string[]
}

export function captureApplyBeforeState(
  payload: AiApplyPayload,
  current: {
    problem: ProblemStatement
    pov: POV
    briefTitle: string
    briefDescription: string
    researchNotes: string
    testSummary: string
    sitemap: SitemapNode[]
  },
): AiApplyBeforeState {
  switch (payload.type) {
    case 'problem':
      return { problem: { ...current.problem } }
    case 'pov':
      return { pov: { ...current.pov } }
    case 'projectBrief':
      return {
        briefTitle: current.briefTitle,
        briefDescription: current.briefDescription,
      }
    case 'researchNotes':
      return { researchNotes: current.researchNotes }
    case 'testSummary':
      return { testSummary: current.testSummary }
    case 'sitemap':
      return {
        sitemapNodeCount: countSitemapNodes(current.sitemap),
        sitemapTitles: flattenSitemapTitles(current.sitemap),
      }
    default:
      return {}
  }
}

function buildDiff(payload: AiApplyPayload, before: AiApplyBeforeState): AiHistoryDiffLine[] {
  switch (payload.type) {
    case 'personas':
      return payload.items.map((p) => ({
        label: 'پرسونا',
        after: `${p.name} (${p.role})`,
      }))
    case 'hmw':
      return payload.items.map((q) => ({
        label: 'HMW',
        after: truncate(q),
      }))
    case 'ideas':
      return payload.items.map((idea) => ({
        label: 'ایده',
        after: idea.title.trim(),
      }))
    case 'flowSteps':
      return payload.items.map((step) => ({
        label: step.kind,
        after: step.label.trim(),
      }))
    case 'problem': {
      const prev = before.problem ? assembleProblemSentence(before.problem) : ''
      const next = assembleProblemSentence({
        user: payload.item.user.trim(),
        need: payload.item.need.trim(),
        insight: payload.item.insight.trim(),
      })
      return [{ label: 'بیان مسئله', before: truncate(prev), after: truncate(next) }]
    }
    case 'pov': {
      const prev = before.pov ? assemblePOVSentence(before.pov) : ''
      const next = assemblePOVSentence({
        user: payload.item.user.trim(),
        need: payload.item.need.trim(),
        insight: payload.item.insight.trim(),
        personaId: before.pov?.personaId ?? '',
      })
      return [{ label: 'POV', before: truncate(prev), after: truncate(next) }]
    }
    case 'projectBrief':
      return [
        {
          label: 'عنوان',
          before: truncate(before.briefTitle ?? ''),
          after: truncate(payload.item.briefTitle),
        },
        {
          label: 'شرح',
          before: truncate(before.briefDescription ?? ''),
          after: truncate(payload.item.briefDescription),
        },
      ]
    case 'testSummary':
      return [
        {
          label: 'خلاصه تست',
          before: truncate(before.testSummary ?? ''),
          after: truncate(payload.item),
        },
      ]
    case 'researchNotes':
      return [
        {
          label: 'یادداشت تحقیق',
          before: truncate(before.researchNotes ?? ''),
          after: truncate(payload.item),
        },
      ]
    case 'empathyMaps':
      return payload.items.map((map) => ({
        label: 'نقشه همدلی',
        after: map.personaId,
      }))
    case 'sitemap': {
      const afterTitles = payload.items.map((n) => n.title.trim()).filter(Boolean)
      const beforeCount = before.sitemapNodeCount ?? 0
      return [
        {
          label: 'تعداد گره IA',
          before: String(beforeCount),
          after: String(afterTitles.length),
        },
        ...afterTitles.slice(0, 6).map((title) => ({ label: 'صفحه', after: title })),
      ]
    }
    case 'sortCards':
      return payload.items.map((label) => ({
        label: 'کارت',
        after: label.trim(),
      }))
    case 'microcopy':
      return payload.items.map((item) => ({
        label: MICROCOPY_CATEGORY_LABELS[item.category],
        after: truncate(item.text),
      }))
    default: {
      const _exhaustive: never = payload
      return _exhaustive
    }
  }
}

function buildSummary(actionId: AiActionId, payload: AiApplyPayload, count: number): string {
  const actionLabel = getAiActionDef(actionId).label
  switch (payload.type) {
    case 'personas':
      return `${actionLabel}: ${count} پرسونا افزوده شد`
    case 'hmw':
      return `${actionLabel}: ${count} سوال HMW`
    case 'ideas':
      return `${actionLabel}: ${count} ایده`
    case 'flowSteps':
      return `${actionLabel}: ${count} مرحله جریان`
    case 'problem':
      return `${actionLabel}: بیان مسئله به‌روز شد`
    case 'pov':
      return `${actionLabel}: POV به‌روز شد`
    case 'projectBrief':
      return `${actionLabel}: شرح پروژه به‌روز شد`
    case 'testSummary':
      return `${actionLabel}: خلاصه گزارش تست ذخیره شد`
    case 'researchNotes':
      return `${actionLabel}: یادداشت تحقیق به‌روز شد`
    case 'empathyMaps':
      return `${actionLabel}: ${count} نقشه همدلی`
    case 'sitemap':
      return `${actionLabel}: نقشه سایت جایگزین شد (${count} ریشه)`
    case 'sortCards':
      return `${actionLabel}: ${count} کارت`
    case 'microcopy':
      return `${actionLabel}: ${count} میکروکپی`
    default: {
      const _exhaustive: never = payload
      return _exhaustive
    }
  }
}

export function buildAiHistoryEntry(
  actionId: AiActionId,
  payload: AiApplyPayload,
  count: number,
  before: AiApplyBeforeState,
  chainId?: AiChainId,
): AiHistoryEntry {
  return {
    id: crypto.randomUUID(),
    actionId,
    actionLabel: getAiActionDef(actionId).label,
    appliedAt: new Date().toISOString(),
    applyType: payload.type,
    itemCount: count,
    summary: buildSummary(actionId, payload, count),
    diff: buildDiff(payload, before),
    chainId,
  }
}
