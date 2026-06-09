import { KanbanBoard } from '@/components/KanbanBoard'
import { useKanbanBoard } from '@/hooks/useKanbanBoard'

function App() {
  const { getColumnItems, moveItem } = useKanbanBoard()

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="border-b px-6 py-5">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Rick & Morty Kanban
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drag tasks between To Do, Doing, and Done.
        </p>
      </header>

      <main className="flex flex-1 flex-col px-6 py-6">
        <KanbanBoard getColumnItems={getColumnItems} moveItem={moveItem} />
      </main>
    </div>
  )
}

export default App
