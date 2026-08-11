export interface GridCalcInput {
  columns: number
  gutter: number
  margin: number
  maxWidth: number
  /** Viewport or container width in px. */
  containerWidth: number
}

export interface GridCalcResult {
  contentWidth: number
  columnWidth: number
  totalGutters: number
}

export function calculateGrid(input: GridCalcInput): GridCalcResult {
  const columns = Math.max(1, Math.floor(input.columns))
  const gutter = Math.max(0, input.gutter)
  const margin = Math.max(0, input.margin)
  const maxWidth = Math.max(0, input.maxWidth)
  const containerWidth = Math.max(0, input.containerWidth)

  const bounded = Math.min(containerWidth, maxWidth || containerWidth)
  const contentWidth = Math.max(0, bounded - margin * 2)
  const totalGutters = gutter * Math.max(0, columns - 1)
  const columnWidth =
    columns > 0 ? Math.max(0, (contentWidth - totalGutters) / columns) : 0

  return {
    contentWidth: round2(contentWidth),
    columnWidth: round2(columnWidth),
    totalGutters: round2(totalGutters),
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function spanWidth(
  columnWidth: number,
  gutter: number,
  span: number,
): number {
  const s = Math.max(1, Math.floor(span))
  return round2(columnWidth * s + gutter * (s - 1))
}
