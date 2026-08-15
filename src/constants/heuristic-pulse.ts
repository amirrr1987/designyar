import { HEURISTIC_RULES } from '@/constants/heuristic-rules'

export interface HeuristicPulseItem {
  id: string
  title: string
  score: number
  note: string
}

/** Short “pulse check” questions for creative heuristic scoring (Nielsen 10). */
export const HEURISTIC_PULSE_PROMPTS: Readonly<Record<string, string>> = {
  h1: 'اگر وسط کار صفحه رفرش شود، کاربر می‌فهمد کجاست و چه خبر است؟',
  h2: 'برچسب‌ها و پیام‌ها مثل زبان روزمرهٔ کاربرند یا مثل دفترچهٔ فنی؟',
  h3: 'اشتباه کرد؛ بدون ترس می‌تواند برگردد، لغو کند یا از مسیر خارج شود؟',
  h4: 'همان دکمه / واژه در صفحات مختلف همان معنی را می‌دهد؟',
  h5: 'طراحی جلوی اشتباه رایج را می‌گیرد، یا فقط بعد از خطا هشدار می‌دهد؟',
  h6: 'گزینه‌های مهم دیده می‌شوند، یا باید حفظ کند کجا بودند؟',
  h7: 'تازه‌کار مسیر ساده دارد و حرفه‌ای میانبر؟',
  h8: 'چیزی روی صفحه هست که اگر حذف شود، کار خراب نمی‌شود؟',
  h9: 'پیام خطا می‌گوید چه شد و قدم بعدی چیست؟',
  h10: 'کمک کوتاه و درجا هست، نه فقط یک PDF طولانی؟',
}

export function createDefaultHeuristicItems(): HeuristicPulseItem[] {
  return HEURISTIC_RULES.map((rule) => ({
    id: rule.id,
    title: rule.title,
    score: 0,
    note: '',
  }))
}

export function pulsePromptFor(id: string): string {
  return HEURISTIC_PULSE_PROMPTS[id] ?? 'این اصل را در محصول خودت سریع امتیاز بده.'
}

export function heuristicMoodLabel(average: number, ratedCount: number): string {
  if (ratedCount === 0) return 'هنوز نبضی ثبت نشده'
  if (average < 2.5) return 'کاربردپذیری ضعیف — بازنگری جدی'
  if (average < 3.5) return 'متوسط — چند نقطهٔ درد واضح است'
  if (average < 4.5) return 'خوب — با چند اصلاح نرم'
  return 'سالم و روان'
}

export function scoreTone(score: number): 'default' | 'error' | 'warning' | 'success' {
  if (score <= 0) return 'default'
  if (score <= 2) return 'error'
  if (score <= 3) return 'warning'
  return 'success'
}
