import { useCallback, useMemo, useState } from 'react'

import { deriveBoard } from '@/lib/kanbanBoard'
import {
  BOARD_COLUMN_DEFS,
  COLUMN_IDS,
  isColumnId,
  type Character,
  type ColumnId,
  type KanbanItem,
} from '@/lib/types'
import { arrayMove } from '@/lib/utils'

export type MoveItemParams = {
  activeId: string
  overId: string
}

type BoardState = {
  items: Record<KanbanItem['id'], KanbanItem>
  columnOrder: ColumnOrder
}

type ColumnOrder = Record<ColumnId, KanbanItem['id'][]>

function createEmptyBoard(): BoardState {
  return {
    items: {},
    columnOrder: {
      todo: [],
      doing: [],
      done: [],
    },
  }
}

function findColumnForItem(
  columnOrder: ColumnOrder,
  itemId: KanbanItem['id'],
): ColumnId | null {
  for (const columnId of COLUMN_IDS) {
    if (columnOrder[columnId].includes(itemId)) {
      return columnId
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
      columnId: 'todo',
    }

    setState((prev) => ({
      items: { ...prev.items, [id]: item },
      columnOrder: {
        ...prev.columnOrder,
        todo: [...prev.columnOrder.todo, id],
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

      const overColumn = isColumnId(overId)
        ? overId
        : findColumnForItem(prev.columnOrder, overId)
      if (!overColumn) {
        return prev
      }

      if (activeColumn === overColumn) {
        const columnIds = [...prev.columnOrder[activeColumn]]
        const activeIndex = columnIds.indexOf(activeId)
        const overIndex = isColumnId(overId)
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

      const sourceIds = prev.columnOrder[activeColumn].filter((id) => id !== activeId)
      const destinationIds = [...prev.columnOrder[overColumn]]
      const insertIndex = isColumnId(overId)
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
