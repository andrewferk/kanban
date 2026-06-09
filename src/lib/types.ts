export type Character = {
  id: string
  name: string
  image: string
  species: string
  status: string
}

export type KanbanItem = {
  id: string
  title: string
  character: Character
  columnId: ColumnId
}

export const COLUMN_IDS = ['todo', 'doing', 'done'] as const
export type ColumnId = (typeof COLUMN_IDS)[number]

export const COLUMN_LABELS: Record<ColumnId, string> = {
  todo: 'To Do',
  doing: 'Doing',
  done: 'Done',
}

export function isColumnId(value: string): value is ColumnId {
  return COLUMN_IDS.includes(value as ColumnId)
}
