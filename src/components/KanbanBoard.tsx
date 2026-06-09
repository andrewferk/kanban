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
import { celebrateDone } from '@/lib/confetti'
import {
  COLUMN_IDS,
  isColumnId,
  type ColumnId,
  type KanbanItem,
} from '@/lib/types'

const DONE_ANIMATION_MS = 700

type KanbanBoardProps = {
  getColumnItems: (columnId: ColumnId) => KanbanItem[]
  moveItem: (params: MoveItemParams) => void
}

export function KanbanBoard({
  getColumnItems,
  moveItem,
}: KanbanBoardProps) {
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

  const resolveDestColumn = (overId: string): ColumnId | null => {
    if (isColumnId(overId)) {
      return overId
    }
    for (const columnId of COLUMN_IDS) {
      if (getColumnItems(columnId).some((item) => item.id === overId)) {
        return columnId
      }
    }
    return null
  }

  const handleDragStart = (event: DragStartEvent) => {
    const item = COLUMN_IDS.flatMap((columnId) => getColumnItems(columnId)).find(
      (candidate) => candidate.id === event.active.id,
    )
    setActiveItem(item ?? null)
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
    const destColumn = resolveDestColumn(overId)

    moveItem({ activeId, overId })

    if (dragged.columnId !== 'done' && destColumn === 'done') {
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
      <div className="grid min-h-[28rem] flex-1 gap-4 lg:grid-cols-3">
        {COLUMN_IDS.map((columnId) => (
          <KanbanColumn
            key={columnId}
            columnId={columnId}
            items={getColumnItems(columnId)}
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
