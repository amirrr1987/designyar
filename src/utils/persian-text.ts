/** Scripts that must not appear in AI user-facing Persian text. */
const FORBIDDEN_SCRIPTS =
  /[\u0400-\u04FF\u0500-\u052F\u2DE0-\u2DFF\uA640-\uA69F]/ // Cyrillic blocks

export function containsForbiddenScript(text: string): boolean {
  return FORBIDDEN_SCRIPTS.test(text)
}

/** Walk JSON-like values and collect string leaves that contain forbidden scripts. */
export function findForbiddenScriptSnippets(value: unknown, path = ''): string[] {
  if (typeof value === 'string') {
    return containsForbiddenScript(value) ? [`${path || 'root'}: ${value.slice(0, 80)}`] : []
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      findForbiddenScriptSnippets(item, `${path}[${index}]`),
    )
  }
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).flatMap(([key, nested]) =>
      findForbiddenScriptSnippets(nested, path ? `${path}.${key}` : key),
    )
  }
  return []
}

export function assertNoForbiddenScripts(value: unknown): void {
  const hits = findForbiddenScriptSnippets(value)
  if (hits.length === 0) return
  throw new Error(
    `پاسخ AI باید فارسی باشد (بدون حروف روسی/سیریلیک). نمونه: ${hits[0] ?? ''}`,
  )
}
