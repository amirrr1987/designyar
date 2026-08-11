export type WcagLevel = 'A' | 'AA' | 'AAA'

export interface WcagChecklistItem {
  id: string
  level: WcagLevel
  text: string
  help?: string
}

export const WCAG_CHECKLIST: readonly WcagChecklistItem[] = [
  {
    id: '1.1.1',
    level: 'A',
    text: 'متن جایگزین برای محتوای غیرمتنی',
    help: 'تصاویر و آیکون‌های معنادار alt مناسب دارند.',
  },
  {
    id: '1.3.1',
    level: 'A',
    text: 'اطلاعات و روابط به‌صورت ساختاری قابل درک است',
    help: 'سرتیترها، لیست‌ها و برچسب فرم‌ها معنایی هستند.',
  },
  {
    id: '1.4.3',
    level: 'AA',
    text: 'کنتراست حداقل ۴.۵:۱ برای متن معمولی',
  },
  {
    id: '1.4.4',
    level: 'AA',
    text: 'امکان تغییر اندازه متن تا ۲۰۰٪ بدون از دست رفتن محتوا',
  },
  {
    id: '2.1.1',
    level: 'A',
    text: 'همه قابلیت‌ها با صفحه‌کلید در دسترس‌اند',
  },
  {
    id: '2.4.3',
    level: 'A',
    text: 'ترتیب فوکوس منطقی است',
  },
  {
    id: '2.4.4',
    level: 'A',
    text: 'هدف لینک از متن لینک یا زمینه مشخص است',
  },
  {
    id: '2.4.7',
    level: 'AA',
    text: 'نشانگر فوکوس قابل مشاهده است',
  },
  {
    id: '3.2.2',
    level: 'A',
    text: 'تغییر زمینه هنگام ورود داده بدون هشدار رخ نمی‌دهد',
  },
  {
    id: '3.3.1',
    level: 'A',
    text: 'خطاها شناسایی و به کاربر اعلام می‌شوند',
  },
  {
    id: '3.3.2',
    level: 'A',
    text: 'برچسب یا راهنما برای ورودی‌ها وجود دارد',
  },
  {
    id: '4.1.2',
    level: 'A',
    text: 'نام، نقش و مقدار برای کنترل‌های UI در دسترس است',
  },
] as const
