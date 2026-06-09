import { useCallback, useState } from 'react'

import { celebrateDone } from '@/lib/confetti'
import {
  COLUMN_IDS,
  isColumnId,
  type Character,
  type ColumnId,
  type KanbanItem,
} from '@/lib/types'

export interface MoveItemParams {
  activeId: string
  overId: string
}

interface BoardState {
  items: Record<string, KanbanItem>
  columnOrder: Record<ColumnId, string[]>
}

function createEmptyColumnOrder(): Record<ColumnId, string[]> {
  return {
    todo: [],
    doing: [],
    done: [],
  }
}

function createInitialState(): BoardState {
  return {
    items: {},
    columnOrder: createEmptyColumnOrder(),
  }
}

function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const result = [...array]
  const [removed] = result.splice(from, 1)
  result.splice(to, 0, removed)
  return result
}

function findColumnForItem(
  columnOrder: Record<ColumnId, string[]>,
  itemId: string,
): ColumnId | null {
  for (const columnId of COLUMN_IDS) {
    if (columnOrder[columnId].includes(itemId)) {
      return columnId
    }
  }
  return null
}

const DONE_ANIMATION_MS = 700

export function useKanbanBoard() {
  const [state, setState] = useState<BoardState>(createInitialState)
  const [recentlyCompletedId, setRecentlyCompletedId] = useState<string | null>(
    null,
  )

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

    let completedId: string | null = null

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

      const previousColumn = prev.items[activeId]?.columnId

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

      if (overColumn === 'done' && previousColumn !== 'done') {
        completedId = activeId
      }

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

    if (completedId) {
      celebrateDone()
      setRecentlyCompletedId(completedId)
      window.setTimeout(() => setRecentlyCompletedId(null), DONE_ANIMATION_MS)
    }
  }, [])

  const getColumnItems = useCallback(
    (columnId: ColumnId): KanbanItem[] => {
      return state.columnOrder[columnId]
        .map((id) => state.items[id])
        .filter((item): item is KanbanItem => item !== undefined)
    },
    [state.columnOrder, state.items],
  )

  return {
    addItem,
    moveItem,
    getColumnItems,
    recentlyCompletedId,
  }
}
