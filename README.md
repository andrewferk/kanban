# Kanban Board

A frontend-only Kanban board built with React and TypeScript. Tasks are tied to [Rick and Morty](https://rickandmortyapi.com/) characters fetched from the GraphQL API, with three columns: **To Do**, **Doing**, and **Done**.

## Planned features

- Fetch characters from `https://rickandmortyapi.com/graphql`
- Create items via a form (title + required character)
- Drag items between columns and reorder within a column
- Celebrate when an item moves to Done (confetti / animation)
- In-memory board state (no persistence)

## Current status

The project scaffold is complete. The app runs, but Kanban functionality is not implemented yet.

**Done so far:**

- Vite + React 19 + TypeScript
- [mise](https://mise.jdx.dev/) for Node version management (see [`.mise.toml`](.mise.toml))
- Tailwind CSS v4 via `@tailwindcss/vite`
- shadcn/ui base setup (`components.json`, theme tokens in `src/index.css`, `cn()` helper in `src/lib/utils.ts`)
- `@/*` path alias pointing to `src/*`

**Not installed yet** (added in later todos as needed):

- shadcn/ui components (`button`, `card`, `input`, etc.)
- `@dnd-kit/*` for drag and drop
- `canvas-confetti` for the Done celebration

## Prerequisites

- Node.js 24+ (managed via [mise](https://mise.jdx.dev/) — see [`.mise.toml`](.mise.toml))

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
├── lib/utils.ts    # shadcn cn() helper
├── App.tsx         # Root component (Vite starter for now)
├── main.tsx        # App entry point
└── index.css       # Tailwind + shadcn theme
```

Kanban components, hooks, and GraphQL client code will be added under `src/` in upcoming work.
