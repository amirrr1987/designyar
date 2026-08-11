import { computed, ref } from 'vue'
import { evaluateContrast, type ContrastResult } from '@/utils/contrast'

export function useContrast(initialFg = '#000000', initialBg = '#ffffff') {
  const foreground = ref(initialFg)
  const background = ref(initialBg)

  const result = computed((): ContrastResult | null =>
    evaluateContrast(foreground.value, background.value),
  )

  function setForeground(value: string): void {
    foreground.value = value
  }

  function setBackground(value: string): void {
    background.value = value
  }

  function setColors(nextFg: string, nextBg: string): void {
    foreground.value = nextFg
    background.value = nextBg
  }

  return {
    foreground,
    background,
    result,
    setForeground,
    setBackground,
    setColors,
  }
}
