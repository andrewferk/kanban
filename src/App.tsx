import { Undo2 } from 'lucide-react'

import { AddItemForm } from '@/components/AddItemForm'
import { KanbanBoard } from '@/components/KanbanBoard'
import { Button } from '@/components/ui/button'
import { useCharacters } from '@/hooks/useCharacters'
import { useKanbanBoard } from '@/hooks/useKanbanBoard'

function App() {
  const { characters, loading, error } = useCharacters()
  const { addItem, canUndo, columns, moveItem, undo } = useKanbanBoard()

  return (
    <div className="min-h-svh bg-[radial-gradient(ellipse_at_top,_oklch(0.97_0.03_145)_0%,_var(--background)_50%)]">
      <div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6">
          <p className="text-sm font-medium text-primary">Rick & Morty Kanban</p>
          <h1 className="font-heading mt-1 text-3xl font-semibold tracking-tight">
            Portal Productivity Board
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Create tasks with a character, then drag them between To Do, Doing,
            and Done. Moving a task to Done triggers confetti.
          </p>
        </header>

        <main className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={undo}
              disabled={!canUndo}
            >
              <Undo2 />
              Undo
            </Button>
            <AddItemForm
              characters={characters}
              loading={loading}
              error={error}
              onSubmit={addItem}
            />
          </div>
          <KanbanBoard columns={columns} moveItem={moveItem} />
        </main>
      </div>
    </div>
  )
}

export default App
