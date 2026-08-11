export interface HeuristicRule {
  id: string
  number: number
  title: string
  description: string
}

/** Nielsen's 10 usability heuristics — Persian labels. */
export const HEURISTIC_RULES: readonly HeuristicRule[] = [
  {
    id: 'h1',
    number: 1,
    title: 'وضعیت سیستم را نمایان کنید',
    description: 'کاربر همیشه بداند سیستم چه می‌کند و کجاست.',
  },
  {
    id: 'h2',
    number: 2,
    title: 'هم‌خوانی با دنیای واقعی',
    description: 'زبان و مفاهیم آشنای کاربر؛ نه اصطلاحات فنی خام.',
  },
  {
    id: 'h3',
    number: 3,
    title: 'کنترل و آزادی کاربر',
    description: 'خروج اضطراری، بازگشت و لغو آسان باشد.',
  },
  {
    id: 'h4',
    number: 4,
    title: 'یکپارچگی و استانداردها',
    description: 'الگوها و واژگان در کل محصول یکدست باشند.',
  },
  {
    id: 'h5',
    number: 5,
    title: 'پیشگیری از خطا',
    description: 'قبل از وقوع خطا، طراحی مانع شود.',
  },
  {
    id: 'h6',
    number: 6,
    title: 'تشخیص به‌جای به‌خاطرسپردن',
    description: 'گزینه‌ها و اقدامات قابل دیدن باشند.',
  },
  {
    id: 'h7',
    number: 7,
    title: 'انعطاف و کارایی',
    description: 'میانبر برای کاربران حرفه‌ای؛ مسیر ساده برای تازه‌کارها.',
  },
  {
    id: 'h8',
    number: 8,
    title: 'طراحی مینیمال و زیبا',
    description: 'اطلاعات نامرتبط و شلوغی بصری کم باشد.',
  },
  {
    id: 'h9',
    number: 9,
    title: 'کمک به تشخیص، بازیابی و رفع خطا',
    description: 'پیام خطا واضح، قابل‌فهم و راه‌حل‌دار باشد.',
  },
  {
    id: 'h10',
    number: 10,
    title: 'راهنما و مستندات',
    description: 'در صورت نیاز، کمک مختصر و قابل جستجو فراهم باشد.',
  },
] as const

export interface HeuristicEvaluation {
  ruleId: string
  rating: number
  notes: string
}

export type HeuristicEvalMap = Record<string, HeuristicEvaluation>
