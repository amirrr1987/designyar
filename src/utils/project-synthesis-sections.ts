import type { DesignStepKey } from '@/types/project'
import type { AiPromptContext } from '@/utils/ai-prompts'

export interface SynthesisItem {
  id: string
  label: string
  content: string | undefined
  filled: boolean
}

export interface SynthesisSection {
  id: string
  phase: 'home' | DesignStepKey
  phaseTitle: string
  items: SynthesisItem[]
}

function hasText(value: string | undefined): boolean {
  return Boolean(value?.trim())
}

function item(id: string, label: string, content: string | undefined): SynthesisItem {
  return { id, label, content: content?.trim() || undefined, filled: hasText(content) }
}

/** Structured artifact sections for the project synthesis page. */
export function buildSynthesisSections(ctx: AiPromptContext): SynthesisSection[] {
  const wcagText =
    ctx.wcagProgress !== undefined
      ? `پیشرفت: ${ctx.wcagProgress}%${ctx.wcagUncheckedSummary ? `\n\nموارد بررسی‌نشده:\n${ctx.wcagUncheckedSummary}` : ''}`
      : undefined

  const heuristicText =
    ctx.heuristicAverage !== undefined
      ? `میانگین: ${ctx.heuristicAverage}/5${ctx.heuristicWeakSummary ? `\n\nضعیف‌ترین موارد:\n${ctx.heuristicWeakSummary}` : ''}`
      : undefined

  return [
    {
      id: 'home',
      phase: 'home',
      phaseTitle: 'شرح پروژه',
      items: [
        item('projectName', 'نام پروژه', ctx.projectName),
        item('projectBrief', 'شرح پروژه', ctx.projectBrief),
      ],
    },
    {
      id: 'empathize',
      phase: 'empathize',
      phaseTitle: 'همدلی',
      items: [
        item('researchNotes', 'یادداشت تحقیق', ctx.researchNotes),
        item('personasSummary', 'پرسوناها', ctx.personasSummary),
        item('empathySummary', 'نقشه همدلی', ctx.empathySummary),
        item('competitorsSummary', 'رقبا', ctx.competitorsSummary),
      ],
    },
    {
      id: 'define',
      phase: 'define',
      phaseTitle: 'تعریف مسئله',
      items: [
        item('problemSentence', 'بیان مسئله', ctx.problemSentence),
        item('povSentence', 'دیدگاه کاربر', ctx.povSentence),
        item('hmwSummary', 'سوالات چگونه می‌توانیم', ctx.hmwSummary),
        item('hmwTopSummary', 'سوالات برتر (با رأی)', ctx.hmwTopSummary),
      ],
    },
    {
      id: 'ideate',
      phase: 'ideate',
      phaseTitle: 'ایده‌پردازی',
      items: [
        item('ideasSummary', 'ایده‌ها', ctx.ideasSummary),
        item('userflowSummary', 'جریان کاربر', ctx.userflowSummary),
        item('sitemapSummary', 'نقشه سایت', ctx.sitemapSummary),
        item('cardSortSummary', 'مرتب‌سازی کارت', ctx.cardSortSummary),
      ],
    },
    {
      id: 'prototype',
      phase: 'prototype',
      phaseTitle: 'پروتوتایپ',
      items: [
        item('designSystemSummary', 'دیزاین‌سیستم', ctx.designSystemSummary),
        item('wireframeSummary', 'وایرفریم', ctx.wireframeSummary),
        item('componentChecklistSummary', 'چک‌لیست کامپوننت', ctx.componentChecklistSummary),
        item('microcopySummary', 'متن‌های UI', ctx.microcopySummary),
      ],
    },
    {
      id: 'test',
      phase: 'test',
      phaseTitle: 'تست',
      items: [
        item('contrastSummary', '\u06A9\u0646\u062A\u0631\u0627\u0633\u062A', ctx.contrastSummary),
        item('wcag', 'دسترسی‌پذیری', wcagText),
        item('heuristic', 'قوانین کاربردپذیری', heuristicText),
        item('testSummary', 'خلاصه تست', ctx.testSummary),
      ],
    },
  ]
}

/** Full context dump for holistic AI analysis prompts. */
export function formatFullProjectContext(ctx: AiPromptContext): string {
  const sections = buildSynthesisSections(ctx)
  const parts: string[] = []

  for (const section of sections) {
    parts.push(`## ${section.phaseTitle}`)
    for (const entry of section.items) {
      parts.push(`### ${entry.label}`)
      parts.push(entry.content?.trim() || '(خالی — هنوز تکمیل نشده)')
    }
  }

  if (ctx.projectSynthesis?.trim()) {
    parts.push('## تحلیل AI قبلی')
    parts.push(ctx.projectSynthesis.trim())
  }

  return parts.join('\n\n')
}
