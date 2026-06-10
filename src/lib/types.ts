export type Character = {
  id: string
  name: string
  image: string
  species: string
  status: string
}

export const BOARD_COLUMN_DEFS = [
  { id: 'todo', label: 'To Do' },
  { id: 'doing', label: 'Doing' },
  { id: 'done', label: 'Done' },
] as const

export type ColumnId = (typeof BOARD_COLUMN_DEFS)[number]['id']

export const COLUMN_IDS: ColumnId[] = BOARD_COLUMN_DEFS.map((column) => column.id)

export const DONE_COLUMN_ID: ColumnId = 'done'

export type KanbanItem = {
  id: string
  title: string
  character: Character
  columnId: ColumnId
}

export type BoardColumn = {
  id: string
  label: string
  items: KanbanItem[]
}

export function isColumnId(value: string): value is ColumnId {
  return COLUMN_IDS.includes(value as ColumnId)
}
