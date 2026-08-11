import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { WCAG_CHECKLIST } from '@/constants/wcag-checklist'
import { useTestStore } from '@/stores/test'

export function useWCAG() {
  const testStore = useTestStore()
  const { wcagChecked: checkedIds } = storeToRefs(testStore)

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
    testStore.toggleWcag(id, checked)
  }

  function setChecked(ids: string[]): void {
    testStore.setWcagChecked(
      ids.filter((id) => WCAG_CHECKLIST.some((item) => item.id === id)),
    )
  }

  function clear(): void {
    testStore.setWcagChecked([])
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
