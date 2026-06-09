import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import { KanbanCard } from '@/components/KanbanCard'
import { COLUMN_LABELS, type ColumnId, type KanbanItem } from '@/lib/types'
import { cn } from '@/lib/utils'

const COLUMN_STYLES: Record<
  ColumnId,
  { accent: string; dropzone: string; dropzoneOver: string }
> = {
  todo: {
    accent: 'bg-slate-500',
    dropzone: 'border-border bg-muted/30',
    dropzoneOver: 'border-slate-400/50 bg-slate-500/5',
  },
  doing: {
    accent: 'bg-amber-500',
    dropzone: 'border-amber-500/20 bg-amber-500/5',
    dropzoneOver: 'border-amber-500/50 bg-amber-500/10',
  },
  done: {
    accent: 'bg-emerald-500',
    dropzone: 'border-emerald-500/20 bg-emerald-500/5',
    dropzoneOver: 'border-emerald-500/50 bg-emerald-500/10',
  },
}

interface KanbanColumnProps {
  columnId: ColumnId
  items: KanbanItem[]
  recentlyCompletedId: string | null
}

export function KanbanColumn({
  columnId,
  items,
  recentlyCompletedId,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId })
  const itemIds = items.map((item) => item.id)
  const styles = COLUMN_STYLES[columnId]

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <header className="mb-3 flex items-center gap-2">
        <span className={cn('size-2 rounded-full', styles.accent)} />
        <h2 className="font-heading text-sm font-semibold tracking-wide">
          {COLUMN_LABELS[columnId]}
        </h2>
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {items.length}
        </span>
      </header>

      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={cn(
            'flex min-h-52 flex-1 flex-col gap-3 rounded-xl border border-dashed p-3 transition-colors',
            isOver ? styles.dropzoneOver : styles.dropzone,
          )}
        >
          {items.length === 0 ? (
            <p className="m-auto px-4 text-center text-sm text-muted-foreground">
              {columnId === 'done'
                ? 'Complete a task to see confetti'
                : 'Drop items here'}
            </p>
          ) : (
            items.map((item) => (
              <KanbanCard
                key={item.id}
                item={item}
                isJustCompleted={item.id === recentlyCompletedId}
              />
            ))
          )}
        </div>
      </SortableContext>
    </section>
  )
}
