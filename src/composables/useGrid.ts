import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDesignSystemStore } from '@/stores/designSystem'
import { calculateGrid, spanWidth, type GridCalcResult } from '@/utils/grid-calculator'

const DEFAULT_CONTAINER = 1200

export function useGrid(containerWidth?: number) {
  const designStore = useDesignSystemStore()
  const { grid } = storeToRefs(designStore)

  const width = computed(() => containerWidth ?? grid.value.maxWidth ?? DEFAULT_CONTAINER)

  const result = computed(
    (): GridCalcResult =>
      calculateGrid({
        columns: grid.value.columns,
        gutter: grid.value.gutter,
        margin: grid.value.margin,
        maxWidth: grid.value.maxWidth,
        containerWidth: width.value,
      }),
  )

  function widthForSpan(span: number): number {
    return spanWidth(result.value.columnWidth, grid.value.gutter, span)
  }

  return {
    grid,
    result,
    widthForSpan,
    patchGrid: designStore.patchGrid,
  }
}
