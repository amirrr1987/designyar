import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { WCAG_CHECKLIST } from '@/constants/wcag-checklist'

export function useWCAG() {
  const checkedIds = useStorage<string[]>('ux-flow-wcag-checked', [])

  const total = WCAG_CHECKLIST.length

  const checkedCount = computed(
    () => checkedIds.value.filter((id) => WCAG_CHECKLIST.some((item) => item.id === id)).length,
  )

  const progress = computed(() => {
    if (total === 0) return 0
    return Math.round((checkedCount.value / total) * 100)
  })

  function isChecked(id: string): boolean {
    return checkedIds.value.includes(id)
  }

  function toggle(id: string, checked: boolean): void {
    if (checked) {
      if (!checkedIds.value.includes(id)) {
        checkedIds.value = [...checkedIds.value, id]
      }
      return
    }
    checkedIds.value = checkedIds.value.filter((x) => x !== id)
  }

  function setChecked(ids: string[]): void {
    checkedIds.value = ids.filter((id) => WCAG_CHECKLIST.some((item) => item.id === id))
  }

  function clear(): void {
    checkedIds.value = []
  }

  return {
    items: WCAG_CHECKLIST,
    checkedIds,
    checkedCount,
    progress,
    total,
    isChecked,
    toggle,
    setChecked,
    clear,
  }
}
