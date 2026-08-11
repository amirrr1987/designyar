import type { AiPromptContext } from '@/utils/ai-prompts'

export interface ContextCoverageItem {
  id: string
  label: string
  filled: boolean
}

export interface ContextCoverage {
  percent: number
  items: ContextCoverageItem[]
}

function hasText(value: string | undefined): boolean {
  return Boolean(value?.trim())
}

/** How much of the project artifact graph is available to AI prompts. */
export function getProjectContextCoverage(ctx: AiPromptContext): ContextCoverage {
  const items: ContextCoverageItem[] = [
    { id: 'brief', label: 'شرح پروژه', filled: hasText(ctx.projectBrief) },
    { id: 'research', label: 'یادداشت تحقیق', filled: hasText(ctx.researchNotes) },
    { id: 'personas', label: 'پرسونا', filled: hasText(ctx.personasSummary) },
    { id: 'empathy', label: 'نقشه همدلی', filled: hasText(ctx.empathySummary) },
    { id: 'competitors', label: 'رقبا', filled: hasText(ctx.competitorsSummary) },
    { id: 'problem', label: 'بیان مسئله', filled: hasText(ctx.problemSentence) },
    { id: 'pov', label: 'POV', filled: hasText(ctx.povSentence) },
    { id: 'hmw', label: 'HMW', filled: hasText(ctx.hmwSummary) },
    { id: 'ideas', label: 'ایده‌ها', filled: hasText(ctx.ideasSummary) },
    { id: 'userflow', label: 'جریان کاربر', filled: hasText(ctx.userflowSummary) },
    { id: 'sitemap', label: 'IA', filled: hasText(ctx.sitemapSummary) },
    { id: 'cardSort', label: 'Card sort', filled: hasText(ctx.cardSortSummary) },
    { id: 'designSystem', label: 'Design System', filled: hasText(ctx.designSystemSummary) },
    { id: 'wireframe', label: 'وایرفریم', filled: hasText(ctx.wireframeSummary) },
    { id: 'components', label: 'چک‌لیست UI', filled: hasText(ctx.componentChecklistSummary) },
    { id: 'microcopy', label: 'میکروکپی', filled: hasText(ctx.microcopySummary) },
    {
      id: 'wcag',
      label: 'WCAG',
      filled: ctx.wcagProgress !== undefined && ctx.wcagProgress > 0,
    },
    {
      id: 'heuristic',
      label: 'هیوریستیک',
      filled: ctx.heuristicAverage !== undefined && ctx.heuristicAverage > 0,
    },
    { id: 'contrast', label: 'کنتراست', filled: hasText(ctx.contrastSummary) },
    { id: 'testSummary', label: 'خلاصه تست', filled: hasText(ctx.testSummary) },
  ]

  const filled = items.filter((i) => i.filled).length
  const percent = items.length === 0 ? 0 : Math.round((filled / items.length) * 100)

  return { percent, items }
}
