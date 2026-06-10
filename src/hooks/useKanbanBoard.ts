import { useCallback, useMemo, useState } from 'react'

import { deriveBoard } from '@/lib/kanbanBoard'
import {
  type Character,
  type ColumnDef,
  type KanbanItem,
} from '@/lib/types'
import { arrayMove } from '@/lib/utils'

const BOARD_COLUMN_DEFS: ReadonlyArray<ColumnDef> = [
  { id: 'todo', label: 'To Do', kind: 'default' },
  { id: 'doing', label: 'Doing' },
  { id: 'done', label: 'Done', kind: 'done' },
]

const DEFAULT_COLUMN_ID = BOARD_COLUMN_DEFS.find((column) => column.kind === 'default')?.id || BOARD_COLUMN_DEFS[0].id

export type MoveItemParams = {
  activeId: string
  overId: string
}

type BoardState = {
  items: Record<KanbanItem['id'], KanbanItem>
  columnOrder: ColumnOrder
}

type ColumnOrder = Record<string, KanbanItem['id'][]>

function createEmptyBoard(): BoardState {
  return {
    items: {},
    columnOrder: Object.fromEntries(
      BOARD_COLUMN_DEFS.map(({ id }) => [id, []]),
    ),
  }
}

function isKnownColumnId(
  value: string,
  columnDefs: ReadonlyArray<ColumnDef>,
): boolean {
  return columnDefs.some((column) => column.id === value)
}

function findColumnForItem(
  columnOrder: ColumnOrder,
  itemId: KanbanItem['id'],
): string | null {
  for (const { id } of BOARD_COLUMN_DEFS) {
    if (columnOrder[id]?.includes(itemId)) {
      return id
    }
  }
  return null
}

export function useKanbanBoard() {
  const [state, setState] = useState<BoardState>(createEmptyBoard)

  const addItem = useCallback((title: string, character: Character) => {
    const id = crypto.randomUUID()
    const item: KanbanItem = {
      id,
      title: title.trim(),
      character,
      columnId: DEFAULT_COLUMN_ID,
    }

    setState((prev) => ({
      items: { ...prev.items, [id]: item },
      columnOrder: {
        ...prev.columnOrder,
        [DEFAULT_COLUMN_ID]: [...(prev.columnOrder[DEFAULT_COLUMN_ID] ?? []), id],
      },
    }))
  }, [])

  const moveItem = useCallback(({ activeId, overId }: MoveItemParams) => {
    if (activeId === overId) {
      return
    }

    setState((prev) => {
      const activeColumn = findColumnForItem(prev.columnOrder, activeId)
      if (!activeColumn) {
        return prev
      }

      const overColumn = isKnownColumnId(overId, BOARD_COLUMN_DEFS)
        ? overId
        : findColumnForItem(prev.columnOrder, overId)
      if (!overColumn) {
        return prev
      }

      if (activeColumn === overColumn) {
        const columnIds = [...(prev.columnOrder[activeColumn] ?? [])]
        const activeIndex = columnIds.indexOf(activeId)
        const overIndex = isKnownColumnId(overId, BOARD_COLUMN_DEFS)
          ? columnIds.length - 1
          : columnIds.indexOf(overId)

        if (activeIndex === -1 || overIndex === -1) {
          return prev
        }

        return {
          ...prev,
          columnOrder: {
            ...prev.columnOrder,
            [activeColumn]: arrayMove(columnIds, activeIndex, overIndex),
          },
        }
      }

      const sourceIds = (prev.columnOrder[activeColumn] ?? []).filter(
        (id) => id !== activeId,
      )
      const destinationIds = [...(prev.columnOrder[overColumn] ?? [])]
      const insertIndex = isKnownColumnId(overId, BOARD_COLUMN_DEFS)
        ? destinationIds.length
        : destinationIds.indexOf(overId)

      destinationIds.splice(
        insertIndex === -1 ? destinationIds.length : insertIndex,
        0,
        activeId,
      )

      const nextState: BoardState = {
        items: {
          ...prev.items,
          [activeId]: {
            ...prev.items[activeId],
            columnId: overColumn,
          },
        },
        columnOrder: {
          ...prev.columnOrder,
          [activeColumn]: sourceIds,
          [overColumn]: destinationIds,
        },
      }

      return nextState
    })
  }, [])

  const columns = useMemo(
    () => deriveBoard(state.columnOrder, state.items, BOARD_COLUMN_DEFS),
    [state.columnOrder, state.items],
  )

  return {
    addItem,
    moveItem,
    columns,
  }
}
