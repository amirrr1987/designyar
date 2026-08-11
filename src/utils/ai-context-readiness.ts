import type { AiPromptContext } from '@/utils/ai-prompts'
import type { AiActionId } from '@/utils/ai-prompts'

export interface ReadinessItem {
  id: string
  label: string
  met: boolean
  essential: boolean
}

export interface ContextReadiness {
  percent: number
  items: ReadinessItem[]
  readyEnough: boolean
}

interface CheckDef {
  id: string
  label: string
  essential: boolean
  test: (ctx: AiPromptContext) => boolean
}

function hasText(value: string | undefined): boolean {
  return Boolean(value?.trim())
}

function checksFor(action: AiActionId): CheckDef[] {
  const brief: CheckDef = {
    id: 'brief',
    label: 'شرح پروژه',
    essential: true,
    test: (ctx) => hasText(ctx.projectBrief),
  }

  switch (action) {
    case 'improve-project-brief':
      return [
        {
          id: 'brief-draft',
          label: 'عنوان یا توضیح اولیه',
          essential: true,
          test: (ctx) => hasText(ctx.projectBrief),
        },
      ]
    case 'seed-research-notes':
      return [brief]
    case 'persona-suggest':
      return [
        brief,
        {
          id: 'notes-or-persona',
          label: 'یادداشت تحقیق یا پرسونا',
          essential: false,
          test: (ctx) => hasText(ctx.researchNotes) || hasText(ctx.personasSummary),
        },
      ]
    case 'synthesize-empathy':
      return [
        brief,
        {
          id: 'personas',
          label: 'حداقل یک پرسونا',
          essential: true,
          test: (ctx) => hasText(ctx.personasSummary),
        },
        {
          id: 'notes',
          label: 'یادداشت تحقیق',
          essential: false,
          test: (ctx) => hasText(ctx.researchNotes),
        },
      ]
    case 'analyze-notes':
      return [
        {
          id: 'notes',
          label: 'یادداشت تحقیق',
          essential: true,
          test: (ctx) => hasText(ctx.researchNotes),
        },
        brief,
      ]
    case 'analyze-competitors':
      return [
        {
          id: 'competitors',
          label: 'جدول رقبا',
          essential: true,
          test: (ctx) => hasText(ctx.competitorsSummary),
        },
        brief,
      ]
    case 'refine-problem':
      return [
        brief,
        {
          id: 'personas',
          label: 'پرسونا',
          essential: false,
          test: (ctx) => hasText(ctx.personasSummary),
        },
        {
          id: 'empathy',
          label: 'نقشه همدلی',
          essential: false,
          test: (ctx) => hasText(ctx.empathySummary),
        },
      ]
    case 'refine-pov':
      return [
        brief,
        {
          id: 'problem',
          label: 'بیان مسئله',
          essential: true,
          test: (ctx) => hasText(ctx.problemSentence),
        },
        {
          id: 'personas',
          label: 'پرسونا',
          essential: false,
          test: (ctx) => hasText(ctx.personasSummary),
        },
      ]
    case 'generate-hmw':
      return [
        {
          id: 'pov',
          label: 'POV',
          essential: true,
          test: (ctx) => hasText(ctx.povSentence),
        },
        {
          id: 'problem',
          label: 'بیان مسئله',
          essential: false,
          test: (ctx) => hasText(ctx.problemSentence),
        },
        brief,
      ]
    case 'brainstorm-ideas':
      return [
        {
          id: 'hmw-voted',
          label: 'HMW با رأی',
          essential: false,
          test: (ctx) => hasText(ctx.hmwTopSummary),
        },
        {
          id: 'hmw',
          label: 'سوالات HMW',
          essential: true,
          test: (ctx) => hasText(ctx.hmwTopSummary) || hasText(ctx.hmwSummary),
        },
        { ...brief, essential: false },
      ]
    case 'suggest-competitors':
      return [brief]
    case 'suggest-wireframe-blocks':
      return [
        {
          id: 'userflow',
          label: 'جریان کاربر',
          essential: false,
          test: (ctx) => hasText(ctx.userflowSummary),
        },
        {
          id: 'sitemap',
          label: 'نقشه سایت',
          essential: false,
          test: (ctx) => hasText(ctx.sitemapSummary),
        },
        brief,
      ]
    case 'suggest-userflow':
      return [
        {
          id: 'ideas',
          label: 'ایده‌ها',
          essential: true,
          test: (ctx) => hasText(ctx.ideasSummary),
        },
        {
          id: 'problem',
          label: 'بیان مسئله',
          essential: false,
          test: (ctx) => hasText(ctx.problemSentence),
        },
      ]
    case 'suggest-sitemap':
      return [
        {
          id: 'ideas',
          label: 'ایده‌ها',
          essential: true,
          test: (ctx) => hasText(ctx.ideasSummary),
        },
        {
          id: 'userflow',
          label: 'جریان کاربر',
          essential: false,
          test: (ctx) => hasText(ctx.userflowSummary),
        },
      ]
    case 'suggest-card-sort':
      return [
        {
          id: 'ideas',
          label: 'ایده‌ها',
          essential: true,
          test: (ctx) => hasText(ctx.ideasSummary),
        },
        {
          id: 'sitemap',
          label: 'نقشه سایت',
          essential: false,
          test: (ctx) => hasText(ctx.sitemapSummary),
        },
      ]
    case 'test-to-hmw':
      return [
        {
          id: 'test-summary',
          label: 'خلاصه تست',
          essential: false,
          test: (ctx) => hasText(ctx.testSummary),
        },
        {
          id: 'wcag-or-heuristic',
          label: 'WCAG یا هیوریستیک',
          essential: true,
          test: (ctx) =>
            hasText(ctx.testSummary) ||
            (ctx.wcagProgress !== undefined && ctx.wcagProgress > 0) ||
            (ctx.heuristicAverage !== undefined && ctx.heuristicAverage > 0),
        },
      ]
    case 'test-to-ideas':
      return [
        {
          id: 'test-summary',
          label: 'خلاصه تست',
          essential: false,
          test: (ctx) => hasText(ctx.testSummary),
        },
        {
          id: 'wcag-or-heuristic',
          label: 'WCAG یا هیوریستیک',
          essential: true,
          test: (ctx) =>
            hasText(ctx.testSummary) ||
            (ctx.wcagProgress !== undefined && ctx.wcagProgress > 0) ||
            (ctx.heuristicAverage !== undefined && ctx.heuristicAverage > 0),
        },
      ]
    case 'microcopy':
      return [
        {
          id: 'wireframe',
          label: 'وایرفریم',
          essential: false,
          test: (ctx) => hasText(ctx.wireframeSummary),
        },
        {
          id: 'problem',
          label: 'بیان مسئله',
          essential: false,
          test: (ctx) => hasText(ctx.problemSentence),
        },
        brief,
      ]
    case 'review-design-system':
      return [
        {
          id: 'design-system',
          label: 'توکن Design System',
          essential: true,
          test: (ctx) => hasText(ctx.designSystemSummary),
        },
        {
          id: 'components',
          label: 'چک‌لیست کامپوننت',
          essential: false,
          test: (ctx) => hasText(ctx.componentChecklistSummary),
        },
      ]
    case 'wireframe-critique':
      return [
        {
          id: 'wireframe',
          label: 'بلوک وایرفریم',
          essential: true,
          test: (ctx) => hasText(ctx.wireframeSummary),
        },
        {
          id: 'components',
          label: 'چک‌لیست کامپوننت',
          essential: false,
          test: (ctx) => hasText(ctx.componentChecklistSummary),
        },
      ]
    case 'summarize-test':
      return [
        {
          id: 'wcag',
          label: 'پیشرفت WCAG',
          essential: false,
          test: (ctx) => ctx.wcagProgress !== undefined && ctx.wcagProgress > 0,
        },
        {
          id: 'heuristic',
          label: 'ارزیابی هیوریستیک',
          essential: false,
          test: (ctx) => ctx.heuristicAverage !== undefined && ctx.heuristicAverage > 0,
        },
        {
          id: 'contrast',
          label: 'کنتراست',
          essential: false,
          test: (ctx) => hasText(ctx.contrastSummary),
        },
      ]
    default:
      return [brief]
  }
}

export function getContextReadiness(action: AiActionId, ctx: AiPromptContext): ContextReadiness {
  const defs = checksFor(action)
  if (defs.length === 0) {
    return { percent: 100, items: [], readyEnough: true }
  }

  const items: ReadinessItem[] = defs.map((d) => ({
    id: d.id,
    label: d.label,
    met: d.test(ctx),
    essential: d.essential,
  }))

  const essential = items.filter((i) => i.essential)
  const optional = items.filter((i) => !i.essential)

  const essentialMet = essential.filter((i) => i.met).length
  const optionalMet = optional.filter((i) => i.met).length

  const essentialScore = essential.length === 0 ? 1 : essentialMet / essential.length
  const optionalScore = optional.length === 0 ? 1 : optionalMet / optional.length

  const percent = Math.round(essentialScore * 70 + optionalScore * 30)
  const readyEnough = essential.length === 0 || essentialMet === essential.length

  return { percent, items, readyEnough }
}
