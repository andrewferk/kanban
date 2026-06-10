import type { BoardColumn, ColumnId, KanbanItem } from '@/lib/types'

type ColumnOrder = Record<ColumnId, KanbanItem['id'][]>

type ColumnDef = {
  id: ColumnId
  label: string
}

export function deriveBoard(
  columnOrder: ColumnOrder,
  items: Record<KanbanItem['id'], KanbanItem>,
  columnDefs: ReadonlyArray<ColumnDef>,
): BoardColumn[] {
  return columnDefs.map(({ id, label }) => ({
    id,
    label,
    items: columnOrder[id]
      .map((itemId) => items[itemId])
      .filter((item): item is KanbanItem => item !== undefined),
  }))
}

export function findItemById(
  columns: BoardColumn[],
  itemId: string,
): KanbanItem | undefined {
  for (const column of columns) {
    const item = column.items.find((candidate) => candidate.id === itemId)
    if (item) {
      return item
    }
  }
  return undefined
}

export function resolveDestColumn(
  columns: BoardColumn[],
  overId: string,
): string | null {
  const directColumn = columns.find((column) => column.id === overId)
  if (directColumn) {
    return directColumn.id
  }

  for (const column of columns) {
    if (column.items.some((item) => item.id === overId)) {
      return column.id
    }
  }

  return null
}
