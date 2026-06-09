import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import type { HTMLAttributes } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { KanbanItem } from '@/lib/types'
import { cn } from '@/lib/utils'

type KanbanCardContentProps = {
  item: KanbanItem
  dragHandleProps?: HTMLAttributes<HTMLButtonElement>
  className?: string
  isJustCompleted?: boolean
}

export function KanbanCardContent({
  item,
  dragHandleProps,
  className,
  isJustCompleted = false,
}: KanbanCardContentProps) {
  const isDone = item.columnId === 'done'

  return (
    <Card
      size="sm"
      className={cn(
        'shadow-sm transition-shadow',
        isDone && 'ring-1 ring-emerald-500/30',
        isJustCompleted && 'animate-done-pop',
        className,
      )}
    >
      <CardHeader className="flex-row items-center gap-2">
        {dragHandleProps ? (
          <button
            type="button"
            className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
            aria-label={`Drag ${item.title}`}
            {...dragHandleProps}
          >
            <GripVertical className="size-4" />
          </button>
        ) : (
          <GripVertical className="size-4 text-muted-foreground" />
        )}
        <img
          src={item.character.image}
          alt={item.character.name}
          className="size-8 rounded-full object-cover ring-1 ring-border"
        />
        <div className="min-w-0 flex-1">
          <CardTitle className="truncate">{item.title}</CardTitle>
          <p className="truncate text-xs text-muted-foreground">
            {item.character.name}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1.5 pt-0">
        <Badge variant="secondary">{item.character.species}</Badge>
        <Badge variant="outline">{item.character.status}</Badge>
      </CardContent>
    </Card>
  )
}

type KanbanCardProps = {
  item: KanbanItem
  isJustCompleted?: boolean
}

export function KanbanCard({ item, isJustCompleted = false }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('touch-none', isDragging && 'z-10 opacity-40')}
    >
      <KanbanCardContent
        item={item}
        dragHandleProps={{ ...attributes, ...listeners }}
        isJustCompleted={isJustCompleted}
        className={isDragging ? 'shadow-md' : undefined}
      />
    </div>
  )
}
