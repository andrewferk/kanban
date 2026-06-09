# Kanban Board

A frontend-only Kanban board built with React and TypeScript. Tasks are tied to [Rick and Morty](https://rickandmortyapi.com/) characters fetched from the GraphQL API, with three columns: **To Do**, **Doing**, and **Done**.

## Features

- Fetch characters from `https://rickandmortyapi.com/graphql` (native `fetch`, pages 1–2)
- Create items via a form — each task requires a title and assigned character
- Drag items between columns and reorder within a column (`@dnd-kit`)
- Confetti and a card pop animation when an item moves to Done
- In-memory board state (resets on page refresh)

## Tech stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- `@dnd-kit` for drag and drop
- `canvas-confetti` for celebrations
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
│   ├── AddItemForm.tsx    # Task creation form
│   ├── KanbanBoard.tsx    # DnD context and board layout
│   ├── KanbanColumn.tsx   # Droppable column
│   ├── KanbanCard.tsx     # Sortable task card
│   └── ui/                # shadcn/ui primitives
├── hooks/
│   ├── useCharacters.ts   # GraphQL character loading
│   └── useKanbanBoard.ts  # Board state and move logic
├── lib/
│   ├── graphql.ts         # fetch-based GraphQL client
│   ├── types.ts           # Shared TypeScript types
│   └── confetti.ts        # Done celebration helper
├── App.tsx
└── main.tsx
```

## How to use

1. Enter a task title and pick a Rick and Morty character.
2. Click **Add task** — the card appears in **To Do**.
3. Drag cards between columns or reorder within a column.
4. Drop a card into **Done** to trigger confetti and a brief completion animation.
