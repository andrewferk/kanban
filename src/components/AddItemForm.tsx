import { type SubmitEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Character } from '@/lib/types'

type AddItemFormProps = {
  characters: Character[]
  loading: boolean
  error: string | null
  onSubmit: (title: string, character: Character) => void
}

function CharacterOption({ character }: { character: Character }) {
  return (
    <>
      <img
        src={character.image}
        alt=""
        className="size-5 rounded-full object-cover"
      />
      <span>{character.name}</span>
    </>
  )
}

export function AddItemForm({
  characters,
  loading,
  error,
  onSubmit,
}: AddItemFormProps) {
  const [title, setTitle] = useState('')
  const [characterId, setCharacterId] = useState<string | null>(null)

  const selectedCharacter = characters.find(
    (character) => character.id === characterId,
  )
  const canSubmit =
    title.trim().length > 0 && selectedCharacter !== undefined && !loading

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault()

    if (!canSubmit || !selectedCharacter) {
      return
    }

    onSubmit(title, selectedCharacter)
    setTitle('')
    setCharacterId(null)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm ring-1 ring-foreground/10 md:flex-row md:items-end"
    >
      <div className="flex flex-1 flex-col gap-2">
        <Label htmlFor="task-title">Task title</Label>
        <Input
          id="task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs to get done?"
          required
        />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <Label htmlFor="character">Character</Label>
        <Select
          value={characterId}
          onValueChange={setCharacterId}
          disabled={loading || characters.length === 0}
          required
        >
          <SelectTrigger id="character" className="w-full">
            {selectedCharacter ? (
              <span className="flex flex-1 items-center gap-2">
                <CharacterOption character={selectedCharacter} />
              </span>
            ) : (
              <SelectValue
                placeholder={
                  loading ? 'Loading characters...' : 'Select a character'
                }
              />
            )}
          </SelectTrigger>
          <SelectContent>
            {characters.map((character) => (
              <SelectItem key={character.id} value={character.id}>
                <CharacterOption character={character} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={!canSubmit}>
        Add task
      </Button>

      {error ? (
        <p className="text-sm text-destructive md:basis-full">
          Failed to load characters: {error}
        </p>
      ) : null}
    </form>
  )
}
