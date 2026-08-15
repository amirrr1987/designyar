/** Shared AI extra-context snippets for DT-booklet-aligned micro-forms. */

export const AI_PERSIAN_RULES = [
  'متن انسانی فقط فارسی روان؛ بدون سیریلیک.',
  'کلیدهای JSON و enum/id را انگلیسی نگه دار.',
  'کلید اختیاری را حذف کن؛ null نگذار.',
].join(' ')

export function challengeAiExtraContext(): string {
  return [
    AI_PERSIAN_RULES,
    'فرم: Challenge Definition (کتابچه DT2Go).',
    'ساختار: challenge.action (چه کاری)، challenge.person (برای چه کسی)، challenge.problem (برای حل چه مسئله‌ای).',
    'جملهٔ هدف: «چطور می‌توانیم [action] برای [person] تا [problem]؟»',
    'ممنوع: راه‌حل ضمنی داخل challenge (مثلاً نام اپ یا دکمهٔ خاص).',
    'کوتاه، مشخص، یک کاربر و یک جنبه.',
    'خروجی فقط: { "challenge": { "action", "person", "problem" } }',
  ].join('\n')
}

export function personaAiExtraContext(researchGoal: string): string {
  return [
    AI_PERSIAN_RULES,
    'فرم: Mini Persona.',
    'برای هر پرسونا پر کن: name, role, goals, pains, loves (علاقه), fears (ترس), dailyJobs (کارهای روزمره دربارهٔ مسئله).',
    'پرسونا را زنده و مشخص بنویس؛ کلی‌گویی ممنوع.',
    researchGoal.trim() ? `هدف پژوهش فعلی: ${researchGoal.trim()}` : 'هدف پژوهش خالی است؛ از زمینهٔ کلی UX استفاده کن.',
    'خروجی: { "personas": [ ... ] } با id اختیاری.',
  ].join('\n')
}

export function researchNotesAiExtraContext(payload: string): string {
  return [
    AI_PERSIAN_RULES,
    'فرم: Interview sheet → Key Insights.',
    'هر آیتم: who، question، answer (پاسخ+مشاهده)، insight (بینش جدید)، text می‌تواند خلاصهٔ insight باشد.',
    'سبک مصاحبه اکتشافی: چرا؟ احساس؟ آخرین بار کی؟ — نه تأیید فرض طراح.',
    'حداقل ۲–۳ بینش واقعی پیشنهاد بده اگر ورودی خالی است.',
    `زمینهٔ پروژه: ${payload}`,
    'خروجی: { "researchNotes": [ ... ] }',
  ].join('\n')
}

export function protoChecklistAiExtraContext(): string {
  return [
    AI_PERSIAN_RULES,
    'فرم: Prototype Checklist.',
    'فیلدها: mainFunction، audience، mainAssumption (فرضی که اگر غلط باشد ایده می‌میرد)، testIdea (تست سریع و ارزان).',
    'فرض را قابل ابطال بنویس؛ تست را عملی و کم‌هزینه (مصاحبه کوتاه، اسکچ کاغذی، …).',
    'خروجی: { "protoChecklist": { "mainFunction", "audience", "mainAssumption", "testIdea" } }',
  ].join('\n')
}

export function feedbackAiExtraContext(): string {
  return [
    AI_PERSIAN_RULES,
    'فرم: I like / I wish / I give.',
    'like: نکات مثبت از دید کاربر تست؛ wish: کمبود/گیجی؛ give: یک پیشنهاد مشخص برای دور بعد.',
    'دفاع از طراحی نکن؛ کنجکاو و مشخص باش.',
    'خروجی: { "feedback": { "like", "wish", "give" } }',
  ].join('\n')
}

export function brainstormAiExtraContext(defineJson: string): string {
  return [
    AI_PERSIAN_RULES,
    'فرم: Brainwriting / ideation.',
    'اول کمیت: چند ایدهٔ کوتاه و متنوع.',
    'اگر مناسب است selectedIdeaIndex را روی بهترین ایده از نظر اثر / سرعت اجرا / تناسب سازمان بگذار (۰-پایه).',
    'از Challenge و HMW تعریف‌شده الهام بگیر؛ ایده را به راه‌حل ضمنی challenge محدود نکن بیش از حد.',
    `وضعیت define: ${defineJson}`,
    'خروجی: { "ideas": ["..."], "selectedIdeaIndex"?: number }',
  ].join('\n')
}
