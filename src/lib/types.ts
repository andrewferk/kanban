export type Character = {
  id: string
  name: string
  image: string
  species: string
  status: string
}

export type ColumnKind = 'default' | 'done'

export type ColumnDef = {
  id: string
  label: string
  kind?: ColumnKind
}

export type KanbanItem = {
  id: string
  title: string
  character: Character
  columnId: string
}

export type BoardColumn = {
  id: string
  label: string
  kind?: ColumnKind
  items: KanbanItem[]
}
