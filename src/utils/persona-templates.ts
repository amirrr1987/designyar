import type { Persona } from '@/types/persona'

export interface PersonaTemplate {
  id: string
  label: string
  draft: Omit<Persona, 'id' | 'createdAt'>
}

export const PERSONA_TEMPLATES: readonly PersonaTemplate[] = [
  {
    id: 'young-shopper',
    label: 'خریدار جوان آنلاین',
    draft: {
      name: 'سارا محمدی',
      role: 'دانشجو / خریدار آنلاین',
      age: 23,
      goals: 'خرید سریع، مقایسه قیمت، تحویل مطمئن',
      pains: 'اطلاعات ناقص محصول، هزینه ارسال بالا، پشتیبانی کند',
      bio: 'دانشجوی طراحی که بیشتر خریدهایش را از موبایل انجام می‌دهد.',
      avatarColor: '#eb2f96',
    },
  },
  {
    id: 'busy-parent',
    label: 'والد پرمشغله',
    draft: {
      name: 'امیر رضایی',
      role: 'والد شاغل',
      age: 38,
      goals: 'صرفه‌جویی در زمان، انتخاب ایمن برای خانواده',
      pains: 'کمبود وقت برای تحقیق، پیچیدگی فیلترها',
      bio: 'والد دو فرزند که شب‌ها برای خریدهای ضروری وقت می‌گذارد.',
      avatarColor: '#1677ff',
    },
  },
  {
    id: 'sme-owner',
    label: 'صاحب کسب‌وکار کوچک',
    draft: {
      name: 'نگار احمدی',
      role: 'مدیر فروشگاه محلی',
      age: 45,
      goals: 'ابزار ساده برای مدیریت مشتری و موجودی',
      pains: 'رابط پیچیده، هزینه اشتراک، آموزش تیم',
      bio: 'صاحب فروشگاه پوشاک که به‌تازگی به کانال آنلاین فکر می‌کند.',
      avatarColor: '#52c41a',
    },
  },
] as const

export function getPersonaTemplate(id: string): PersonaTemplate | undefined {
  return PERSONA_TEMPLATES.find((t) => t.id === id)
}

/** Build a full `Persona` from a template id (new id + createdAt). */
export function createPersonaFromTemplate(templateId: string): Persona | null {
  const template = getPersonaTemplate(templateId)
  if (!template) return null
  return {
    ...template.draft,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
}
