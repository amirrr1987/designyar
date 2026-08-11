import type { DesignStepKey } from '@/types/project'

export interface PhaseCoachSnapshot {
  hasBrief: boolean
  hasResearchNotes: boolean
  personaCount: number
  hasEmpathy: boolean
  hasProblem: boolean
  hasPov: boolean
  hmwCount: number
  ideaCount: number
  flowNodeCount: number
  sitemapCount: number
  cardSortCount: number
  hasTestSummary: boolean
  wcagProgress: number
}

export interface PhaseCoachResult {
  hint: string
  actionLabel?: string
  actionId?: string
}

function countSitemapNodes(nodes: { children?: unknown[] }[]): number {
  let count = 0
  for (const node of nodes) {
    count += 1
    if (Array.isArray(node.children)) {
      count += countSitemapNodes(node.children as { children?: unknown[] }[])
    }
  }
  return count
}

export function buildPhaseCoachSnapshot(input: {
  briefTitle: string
  briefDescription: string
  researchNotes: string
  personaCount: number
  empathyMapCount: number
  problemFilled: boolean
  povFilled: boolean
  hmwCount: number
  ideaCount: number
  flowNodeCount: number
  sitemap: { children?: unknown[] }[]
  cardSortCardCount: number
  testSummary: string
  wcagProgress: number
}): PhaseCoachSnapshot {
  return {
    hasBrief: Boolean(input.briefTitle.trim() || input.briefDescription.trim()),
    hasResearchNotes: Boolean(input.researchNotes.trim()),
    personaCount: input.personaCount,
    hasEmpathy: input.empathyMapCount > 0,
    hasProblem: input.problemFilled,
    hasPov: input.povFilled,
    hmwCount: input.hmwCount,
    ideaCount: input.ideaCount,
    flowNodeCount: input.flowNodeCount,
    sitemapCount: countSitemapNodes(input.sitemap),
    cardSortCount: input.cardSortCardCount,
    hasTestSummary: Boolean(input.testSummary.trim()),
    wcagProgress: input.wcagProgress,
  }
}

export function getPhaseCoachHint(
  step: DesignStepKey | 'home',
  snapshot: PhaseCoachSnapshot,
): PhaseCoachResult | null {
  switch (step) {
    case 'home':
      if (!snapshot.hasBrief) {
        return {
          hint: 'شرح پروژه (عنوان + توضیح) را بنویسید — مبنای همه مراحل AI است.',
          actionLabel: 'بهبود شرح با AI',
          actionId: 'improve-project-brief',
        }
      }
      return {
        hint: 'شرح آماده است — به Empathize بروید یا زنجیره Empathize را اجرا کنید.',
        actionLabel: 'پیشنهاد یادداشت',
        actionId: 'seed-research-notes',
      }
    case 'empathize':
      if (!snapshot.hasBrief) {
        return { hint: 'اول در خانه «شرح پروژه» را تکمیل کنید.', actionId: 'improve-project-brief' }
      }
      if (!snapshot.hasResearchNotes) {
        return {
          hint: 'یادداشت تحقیق خالی است — از AI اسکلت یادداشت بگیرید.',
          actionLabel: 'پیشنهاد یادداشت',
          actionId: 'seed-research-notes',
        }
      }
      if (snapshot.personaCount === 0) {
        return {
          hint: 'حداقل یک پرسونا بسازید یا از AI پیشنهاد بگیرید.',
          actionLabel: 'پیشنهاد پرسونا',
          actionId: 'persona-suggest',
        }
      }
      if (!snapshot.hasEmpathy) {
        return {
          hint: 'نقشه همدلی را از پرسوناها سنتز کنید.',
          actionLabel: 'سنتز empathy',
          actionId: 'synthesize-empathy',
        }
      }
      return {
        hint: 'Empathize خوب پیش رفته — به Define بروید.',
        actionLabel: 'پیشنهاد مسئله',
        actionId: 'refine-problem',
      }
    case 'define':
      if (!snapshot.hasProblem) {
        return {
          hint: 'بیان مسئله را تکمیل کنید.',
          actionLabel: 'پیشنهاد مسئله',
          actionId: 'refine-problem',
        }
      }
      if (!snapshot.hasPov) {
        return {
          hint: 'POV را از مسئله و پرسونا بسازید.',
          actionLabel: 'پیشنهاد POV',
          actionId: 'refine-pov',
        }
      }
      if (snapshot.hmwCount === 0) {
        return {
          hint: 'سوالات HMW تولید کنید.',
          actionLabel: 'تولید HMW',
          actionId: 'generate-hmw',
        }
      }
      return {
        hint: 'Define آماده است — Ideate را شروع کنید.',
        actionLabel: 'طوفان ایده',
        actionId: 'brainstorm-ideas',
      }
    case 'ideate':
      if (snapshot.ideaCount === 0) {
        return {
          hint: 'ایده‌ای ثبت نشده — از HMW و POV ایده بگیرید.',
          actionLabel: 'طوفان ایده',
          actionId: 'brainstorm-ideas',
        }
      }
      if (snapshot.flowNodeCount === 0) {
        return {
          hint: 'جریان کاربر را از ایده‌های برتر پیشنهاد دهید.',
          actionLabel: 'پیشنهاد userflow',
          actionId: 'suggest-userflow',
        }
      }
      if (snapshot.sitemapCount <= 1) {
        return {
          hint: 'IA / نقشه سایت را از ایده‌ها بسازید.',
          actionLabel: 'پیشنهاد sitemap',
          actionId: 'suggest-sitemap',
        }
      }
      if (snapshot.cardSortCount === 0) {
        return {
          hint: 'کارت‌های مرتب‌سازی را از ویژگی‌های کلیدی پر کنید.',
          actionLabel: 'پیشنهاد card sort',
          actionId: 'suggest-card-sort',
        }
      }
      return {
        hint: 'Ideate کامل شد — Prototype را ادامه دهید.',
        actionLabel: 'بازبینی Design System',
        actionId: 'review-design-system',
      }
    case 'prototype':
      return {
        hint: 'توکن‌ها و وایرفریم را تنظیم کنید؛ سپس Test.',
        actionLabel: 'نقد وایرفریم',
        actionId: 'wireframe-critique',
      }
    case 'test':
      if (snapshot.wcagProgress < 30) {
        return { hint: 'چک‌لیست WCAG را پیش ببرید.' }
      }
      if (!snapshot.hasTestSummary) {
        return {
          hint: 'خلاصه AI تست را در گزارش ذخیره کنید.',
          actionLabel: 'خلاصه تست',
          actionId: 'summarize-test',
        }
      }
      return {
        hint: 'یافته‌های تست را به HMW تبدیل کنید (بازخورد به Define).',
        actionLabel: 'HMW از تست',
        actionId: 'test-to-hmw',
      }
    default:
      return null
  }
}
