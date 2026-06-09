import type { Character } from '@/lib/types'

export const GRAPHQL_ENDPOINT = 'https://rickandmortyapi.com/graphql'

const GET_CHARACTERS_QUERY = `
  query GetCharacters($page: Int) {
    characters(page: $page) {
      results {
        id
        name
        image
        species
        status
      }
    }
  }
`

interface CharacterResult {
  id: string | null
  name: string | null
  image: string | null
  species: string | null
  status: string | null
}

interface CharactersQueryResponse {
  data?: {
    characters?: {
      results?: (CharacterResult | null)[] | null
    } | null
  }
  errors?: { message: string }[]
}

async function fetchCharacterPage(page: number): Promise<Character[]> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: GET_CHARACTERS_QUERY,
      variables: { page },
    }),
  })

  if (!response.ok) {
    throw new Error(`GraphQL request failed with status ${response.status}`)
  }

  const json = (await response.json()) as CharactersQueryResponse

  if (json.errors?.length) {
    throw new Error(json.errors.map((error) => error.message).join(', '))
  }

  const results = json.data?.characters?.results ?? []

  return results
    .filter(
      (character): character is CharacterResult =>
        character !== null &&
        character.id !== null &&
        character.name !== null &&
        character.image !== null &&
        character.species !== null &&
        character.status !== null,
    )
    .map((character) => ({
      id: character.id!,
      name: character.name!,
      image: character.image!,
      species: character.species!,
      status: character.status!,
    }))
}

export async function fetchCharacters(pages: number[] = [1, 2]): Promise<Character[]> {
  const pageResults = await Promise.all(pages.map((page) => fetchCharacterPage(page)))
  return pageResults.flat()
}
