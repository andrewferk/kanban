export type ColumnId = 'todo' | 'doing' | 'done'

export interface Character {
  id: string
  name: string
  image: string
  species: string
  status: string
}

export interface KanbanItem {
  id: string
  title: string
  character: Character
  columnId: ColumnId
}

export const COLUMN_IDS: ColumnId[] = ['todo', 'doing', 'done']

export const COLUMN_LABELS: Record<ColumnId, string> = {
  todo: 'To Do',
  doing: 'Doing',
  done: 'Done',
}

export function isColumnId(value: string): value is ColumnId {
  return (COLUMN_IDS as string[]).includes(value)
}
