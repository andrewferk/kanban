import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useState } from 'react'

import { KanbanCardContent } from '@/components/KanbanCard'
import { KanbanColumn } from '@/components/KanbanColumn'
import type { MoveItemParams } from '@/hooks/useKanbanBoard'
import { findItemById, resolveDestColumn } from '@/lib/kanbanBoard'
import { celebrateDone } from '@/lib/confetti'
import { DONE_COLUMN_ID, type BoardColumn, type KanbanItem } from '@/lib/types'

const DONE_ANIMATION_MS = 700

type KanbanBoardProps = {
  columns: BoardColumn[]
  moveItem: (params: MoveItemParams) => void
}

export function KanbanBoard({ columns, moveItem }: KanbanBoardProps) {
  const [activeItem, setActiveItem] = useState<KanbanItem | null>(null)
  const [recentlyCompletedId, setRecentlyCompletedId] = useState<string | null>(
    null,
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveItem(findItemById(columns, String(event.active.id)) ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    const dragged = activeItem
    setActiveItem(null)

    if (!over || !dragged) {
      return
    }

    const activeId = String(active.id)
    const overId = String(over.id)
    const destColumnId = resolveDestColumn(columns, overId)

    moveItem({ activeId, overId })

    if (
      dragged.columnId !== DONE_COLUMN_ID &&
      destColumnId === DONE_COLUMN_ID
    ) {
      celebrateDone()
      setRecentlyCompletedId(activeId)
      window.setTimeout(() => setRecentlyCompletedId(null), DONE_ANIMATION_MS)
    }
  }

  const handleDragCancel = () => {
    setActiveItem(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div
        className="grid min-h-[28rem] flex-1 gap-4 lg:grid-cols-3"
      >
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            recentlyCompletedId={recentlyCompletedId}
          />
        ))}
      </div>

      <DragOverlay>
        {activeItem ? (
          <KanbanCardContent item={activeItem} className="rotate-2 shadow-lg" />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
