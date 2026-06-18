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

type BoardAction =
  | { type: 'add'; itemId: string }
  | { type: 'move'; itemId: string; fromColumnId: string; fromIndex: number }

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

export function removeItemFromState(state: BoardState, itemId: string): BoardState {
  const columnId = findColumnForItem(state.columnOrder, itemId)
  if (!columnId) {
    return state
  }

  const { [itemId]: _removed, ...items } = state.items

  return {
    items,
    columnOrder: {
      ...state.columnOrder,
      [columnId]: (state.columnOrder[columnId] ?? []).filter((id) => id !== itemId),
    },
  }
}

export function buildInverseMoveParams(
  state: BoardState,
  action: Extract<BoardAction, { type: 'move' }>,
): MoveItemParams {
  const columnIds = (state.columnOrder[action.fromColumnId] ?? []).filter(
    (id) => id !== action.itemId,
  )
  const overId =
    action.fromIndex >= columnIds.length
      ? action.fromColumnId
      : columnIds[action.fromIndex]

  return { activeId: action.itemId, overId }
}

function applyMoveItem(
  prev: BoardState,
  { activeId, overId }: MoveItemParams,
): BoardState | null {
  if (activeId === overId) {
    return null
  }

  const activeColumn = findColumnForItem(prev.columnOrder, activeId)
  if (!activeColumn) {
    return null
  }

  const overColumn = isKnownColumnId(overId, BOARD_COLUMN_DEFS)
    ? overId
    : findColumnForItem(prev.columnOrder, overId)
  if (!overColumn) {
    return null
  }

  if (activeColumn === overColumn) {
    const columnIds = [...(prev.columnOrder[activeColumn] ?? [])]
    const activeIndex = columnIds.indexOf(activeId)
    const overIndex = isKnownColumnId(overId, BOARD_COLUMN_DEFS)
      ? columnIds.length - 1
      : columnIds.indexOf(overId)

    if (activeIndex === -1 || overIndex === -1) {
      return null
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

  return {
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
}

function applyUndoAction(state: BoardState, action: BoardAction): BoardState {
  if (action.type === 'add') {
    return removeItemFromState(state, action.itemId)
  }

  const next = applyMoveItem(state, buildInverseMoveParams(state, action))
  return next ?? state
}

export function useKanbanBoard() {
  const [state, setState] = useState<BoardState>(createEmptyBoard)
  const [actionHistory, setActionHistory] = useState<BoardAction[]>([])

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
    setActionHistory((history) => [...history, { type: 'add', itemId: id }])
  }, [])

  const moveItem = useCallback(({ activeId, overId }: MoveItemParams) => {
    let action: BoardAction | undefined

    setState((prev) => {
      const fromColumnId = findColumnForItem(prev.columnOrder, activeId)
      if (!fromColumnId) {
        return prev
      }

      const fromIndex = (prev.columnOrder[fromColumnId] ?? []).indexOf(activeId)
      if (fromIndex === -1) {
        return prev
      }

      const next = applyMoveItem(prev, { activeId, overId })
      if (!next) {
        return prev
      }

      action = { type: 'move', itemId: activeId, fromColumnId, fromIndex }
      return next
    })

    if (action) {
      setActionHistory((history) => [...history, action!])
    }
  }, [])

  const undo = useCallback(() => {
    setActionHistory((history) => {
      if (history.length === 0) {
        return history
      }

      const lastAction = history[history.length - 1]
      setState((prev) => applyUndoAction(prev, lastAction))
      return history.slice(0, -1)
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
    undo,
    canUndo: actionHistory.length > 0,
  }
}
