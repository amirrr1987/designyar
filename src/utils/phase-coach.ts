import type { DesignStepKey } from '@/types/project'

export interface PhaseCoachSnapshot {
  hasBrief: boolean
  hasResearchNotes: boolean
  personaCount: number
  competitorCount: number
  hasEmpathy: boolean
  hasProblem: boolean
  hasPov: boolean
  hmwCount: number
  ideaCount: number
  flowNodeCount: number
  sitemapCount: number
  cardSortCount: number
  hasTestSummary: boolean
  wireframeBlockCount: number
  microcopyCount: number
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
  competitorCount: number
  empathyMapCount: number
  problemFilled: boolean
  povFilled: boolean
  hmwCount: number
  ideaCount: number
  flowNodeCount: number
  sitemap: { children?: unknown[] }[]
  cardSortCardCount: number
  testSummary: string
  wireframeBlockCount: number
  microcopyCount: number
  wcagProgress: number
}): PhaseCoachSnapshot {
  return {
    hasBrief: Boolean(input.briefTitle.trim() || input.briefDescription.trim()),
    hasResearchNotes: Boolean(input.researchNotes.trim()),
    personaCount: input.personaCount,
    competitorCount: input.competitorCount,
    hasEmpathy: input.empathyMapCount > 0,
    hasProblem: input.problemFilled,
    hasPov: input.povFilled,
    hmwCount: input.hmwCount,
    ideaCount: input.ideaCount,
    flowNodeCount: input.flowNodeCount,
    sitemapCount: countSitemapNodes(input.sitemap),
    cardSortCount: input.cardSortCardCount,
    hasTestSummary: Boolean(input.testSummary.trim()),
    wireframeBlockCount: input.wireframeBlockCount,
    microcopyCount: input.microcopyCount,
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
          hint: 'شرح پروژه (عنوان + توضیح) را بنویسید — مبنای همه مراحل است.',
          actionLabel: 'بهبود شرح با AI',
          actionId: 'improve-project-brief',
        }
      }
      return {
        hint: 'شرح آماده است — برو به همدلی یا از AI اسکلت یادداشت بگیر.',
        actionLabel: 'پیشنهاد یادداشت',
        actionId: 'seed-research-notes',
      }
    case 'empathize':
      if (!snapshot.hasBrief) {
        return {
          hint: 'اول در خانه «شرح پروژه» را تکمیل کنید.',
          actionId: 'improve-project-brief',
        }
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
          hint: 'اختیاری: نقشه همدلی را از پرسوناها پر کنید — یا به تعریف مسئله بروید.',
          actionLabel: 'سنتز نقشه همدلی',
          actionId: 'synthesize-empathy',
        }
      }
      if (snapshot.competitorCount === 0) {
        return {
          hint: 'اختیاری: جدول رقبا را پر کنید — یا به تعریف مسئله بروید.',
          actionLabel: 'پیشنهاد رقبا',
          actionId: 'suggest-competitors',
        }
      }
      return {
        hint: 'همدلی خوب پیش رفته — به تعریف مسئله بروید.',
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
          hint: 'دیدگاه کاربر را از مسئله و پرسونا بسازید.',
          actionLabel: 'پیشنهاد دیدگاه',
          actionId: 'refine-pov',
        }
      }
      if (snapshot.hmwCount === 0) {
        return {
          hint: 'سوالات «چگونه می‌توانیم…» را بنویسید.',
          actionLabel: 'تولید سوالات',
          actionId: 'generate-hmw',
        }
      }
      return {
        hint: 'تعریف مسئله آماده است — ایده‌پردازی را شروع کنید.',
        actionLabel: 'طوفان ایده',
        actionId: 'brainstorm-ideas',
      }
    case 'ideate':
      if (snapshot.ideaCount === 0) {
        return {
          hint: 'ایده‌ای ثبت نشده — از سوالات «چگونه می‌توانیم» ایده بگیرید.',
          actionLabel: 'طوفان ایده',
          actionId: 'brainstorm-ideas',
        }
      }
      if (snapshot.flowNodeCount === 0) {
        return {
          hint: 'جریان کاربر را از ایده‌های برتر بسازید.',
          actionLabel: 'پیشنهاد جریان کاربر',
          actionId: 'suggest-userflow',
        }
      }
      if (snapshot.sitemapCount <= 1) {
        return {
          hint: 'اختیاری: نقشه سایت را بسازید — یا به پروتوتایپ بروید.',
          actionLabel: 'پیشنهاد نقشه سایت',
          actionId: 'suggest-sitemap',
        }
      }
      if (snapshot.cardSortCount === 0) {
        return {
          hint: 'اختیاری: مرتب‌سازی کارت — یا به پروتوتایپ بروید.',
          actionLabel: 'پیشنهاد کارت‌ها',
          actionId: 'suggest-card-sort',
        }
      }
      return {
        hint: 'ایده‌پردازی کامل شد — پروتوتایپ را ادامه دهید.',
        actionLabel: 'بازبینی دیزاین سیستم',
        actionId: 'review-design-system',
      }
    case 'prototype':
      if (snapshot.wireframeBlockCount <= 1) {
        return {
          hint: 'چیدمان وایرفریم را مشخص کنید (یا از AI پیشنهاد بگیرید).',
          actionLabel: 'پیشنهاد وایرفریم',
          actionId: 'suggest-wireframe-blocks',
        }
      }
      if (snapshot.microcopyCount === 0) {
        return {
          hint: 'اختیاری: متن‌های کوتاه UI را بسازید — یا به تست بروید.',
          actionLabel: 'تولید متن UI',
          actionId: 'microcopy',
        }
      }
      return {
        hint: 'رنگ و وایرفریم آماده است — به تست بروید.',
        actionLabel: 'نقد وایرفریم',
        actionId: 'wireframe-critique',
      }
    case 'test':
      if (snapshot.wcagProgress < 30) {
        return { hint: 'چک‌لیست دسترسی‌پذیری را پیش ببرید.' }
      }
      if (!snapshot.hasTestSummary) {
        return {
          hint: 'خلاصه یافته‌ها را در گزارش ذخیره کنید.',
          actionLabel: 'خلاصه تست',
          actionId: 'summarize-test',
        }
      }
      return {
        hint: 'می‌توانید سوالات جدید از تست بسازید یا به جمع‌بندی بروید.',
        actionLabel: 'سوالات از تست',
        actionId: 'test-to-hmw',
      }
    default:
      return null
  }
}
