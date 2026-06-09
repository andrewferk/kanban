import { AddItemForm } from '@/components/AddItemForm'
import { KanbanBoard } from '@/components/KanbanBoard'
import { useCharacters } from '@/hooks/useCharacters'
import { useKanbanBoard } from '@/hooks/useKanbanBoard'

function App() {
  const { characters, loading, error } = useCharacters()
  const { addItem, getColumnItems, moveItem } = useKanbanBoard()

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="border-b px-6 py-5">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Rick & Morty Kanban
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create tasks with a character, then drag them between To Do, Doing,
          and Done.
        </p>
      </header>

      <main className="flex flex-1 flex-col gap-6 px-6 py-6">
        <AddItemForm
          characters={characters}
          loading={loading}
          error={error}
          onSubmit={addItem}
        />
        <KanbanBoard getColumnItems={getColumnItems} moveItem={moveItem} />
      </main>
    </div>
  )
}

export default App
