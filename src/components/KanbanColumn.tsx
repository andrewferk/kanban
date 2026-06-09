import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import { KanbanCard } from '@/components/KanbanCard'
import { COLUMN_LABELS, type ColumnId, type KanbanItem } from '@/lib/types'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  columnId: ColumnId
  items: KanbanItem[]
}

export function KanbanColumn({ columnId, items }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId })
  const itemIds = items.map((item) => item.id)

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="font-heading text-sm font-semibold tracking-wide">
          {COLUMN_LABELS[columnId]}
        </h2>
        <span className="text-xs text-muted-foreground">{items.length}</span>
      </header>

      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={cn(
            'flex min-h-48 flex-1 flex-col gap-3 rounded-xl border border-dashed p-3 transition-colors',
            isOver
              ? 'border-primary/50 bg-primary/5'
              : 'border-border bg-muted/30',
          )}
        >
          {items.length === 0 ? (
            <p className="m-auto text-center text-sm text-muted-foreground">
              Drop items here
            </p>
          ) : (
            items.map((item) => <KanbanCard key={item.id} item={item} />)
          )}
        </div>
      </SortableContext>
    </section>
  )
}
