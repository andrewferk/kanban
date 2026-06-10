# Kanban Board

A frontend-only Kanban board built with React and TypeScript. Tasks are tied to [Rick and Morty](https://rickandmortyapi.com/) characters fetched from the GraphQL API, with three columns: **To Do**, **Doing**, and **Done**.

## Features

- Fetch characters from `https://rickandmortyapi.com/graphql` (native `fetch`, pages 1–2)
- Create items via a form — each task requires a title and assigned character (with avatar preview in the select)
- Drag items between columns and reorder within a column (`@dnd-kit`), including keyboard support
- Drag overlay, per-column accent colors, and item counts in column headers
- Character species and status badges on each card
- Confetti and a card pop animation when an item moves to Done
- In-memory board state (resets on page refresh)

## Tech stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Geist Variable font (`@fontsource-variable/geist`)
- `@dnd-kit` for drag and drop
- `canvas-confetti` for celebrations
- `lucide-react` icons, `tw-animate-css` for the Done pop animation
- [mise](https://mise.jdx.dev/) for Node version management (see [`.mise.toml`](.mise.toml))

## Prerequisites

- Node.js 24+ (managed via mise — see [`.mise.toml`](.mise.toml))

## Getting started

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Useful commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── components/
│   ├── AddItemForm.tsx    # Task creation form with character select
│   ├── KanbanBoard.tsx    # DnD context, Done celebrations, board layout
│   ├── KanbanColumn.tsx   # Droppable column with per-column styling
│   ├── KanbanCard.tsx     # Sortable task card (KanbanCardContent for overlay)
│   └── ui/                # shadcn/ui primitives
├── hooks/
│   ├── useCharacters.ts   # GraphQL character loading
│   └── useKanbanBoard.ts  # Board state, column definitions, and move logic
├── lib/
│   ├── graphql.ts         # fetch-based GraphQL client
│   ├── kanbanBoard.ts     # Board view-model helpers (deriveBoard, etc.)
│   ├── types.ts           # Shared TypeScript types
│   ├── utils.ts           # cn() and arrayMove utilities
│   └── confetti.ts        # Done celebration helper
├── App.tsx
└── main.tsx
```

## Architecture

Board state lives in `useKanbanBoard` as a normalized structure: an `items` map keyed by ID and a `columnOrder` map of column ID → item IDs. Column definitions (`todo`, `doing`, `done`) are declared in the hook with optional `kind` markers (`default` for the initial column, `done` for the celebration column).

`deriveBoard` in `lib/kanbanBoard.ts` projects that state into a `BoardColumn[]` view model for the UI. `KanbanBoard` owns drag-and-drop wiring and Done celebrations (confetti + completion animation); the hook only updates state via `addItem` and `moveItem`.

## How to use

1. Enter a task title and pick a Rick and Morty character.
2. Click **Add task** — the card appears in **To Do**.
3. Drag cards between columns or reorder within a column (keyboard accessible via the drag handle).
4. Drop a card into **Done** to trigger confetti and a brief completion animation.
