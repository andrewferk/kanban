import type { BoardColumn, ColumnDef, KanbanItem } from '@/lib/types'

type ColumnOrder = Record<string, KanbanItem['id'][]>

export function deriveBoard(
  columnOrder: ColumnOrder,
  items: Record<KanbanItem['id'], KanbanItem>,
  columnDefs: ReadonlyArray<ColumnDef>,
): BoardColumn[] {
  return columnDefs.map(({ id, label, kind }) => ({
    id,
    label,
    kind,
    items: (columnOrder[id] ?? [])
      .map((itemId) => items[itemId])
      .filter((item): item is KanbanItem => item !== undefined),
  }))
}

export function findItemById(
  columns: BoardColumn[],
  itemId: string,
): KanbanItem | undefined {
  return columns.flatMap((column) => column.items).find((item) => item.id === itemId)
}

export function resolveDestColumn(
  columns: BoardColumn[],
  overId: string,
): string | undefined {
  const directColumnId = columns.find((column) => column.id === overId)?.id
  if (directColumnId) {
    return directColumnId
  }

  return columns.flatMap((column) => column.items).find((item) => item.id === overId)?.columnId
}
