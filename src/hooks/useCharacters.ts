import { useEffect, useState } from 'react'

import { fetchCharacters } from '@/lib/graphql'
import type { Character } from '@/lib/types'

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchCharacters()
      .then((data) => {
        if (!cancelled) {
          setCharacters(data)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load characters')
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { characters, loading, error }
}
