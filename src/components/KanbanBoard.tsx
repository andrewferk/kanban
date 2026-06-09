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
import { COLUMN_IDS, type ColumnId, type KanbanItem } from '@/lib/types'

interface KanbanBoardProps {
  getColumnItems: (columnId: ColumnId) => KanbanItem[]
  moveItem: (params: MoveItemParams) => void
  recentlyCompletedId: string | null
}

export function KanbanBoard({
  getColumnItems,
  moveItem,
  recentlyCompletedId,
}: KanbanBoardProps) {
  const [activeItem, setActiveItem] = useState<KanbanItem | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const item = COLUMN_IDS.flatMap((columnId) => getColumnItems(columnId)).find(
      (candidate) => candidate.id === event.active.id,
    )
    setActiveItem(item ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveItem(null)

    if (!over) {
      return
    }

    moveItem({
      activeId: String(active.id),
      overId: String(over.id),
    })
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
