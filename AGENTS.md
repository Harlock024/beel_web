# AGENTS.md

## Project

Astro 6 + React 19 task-list frontend (SSR, deployed to Vercel). Communicates with a separate backend API.

## Quick start

```bash
bun install
bun run dev
```

**Package manager is Bun**, not npm. `bun.lock` is committed; `package-lock.json` is gitignored.

## Environment

Copy `.env.example` to `.env`. The only variable is `PUBLIC_BEEL_API` (defaults to `http://localhost:8080`). The backend must be running for the app to function.

## Architecture

- **Entry point:** `src/pages/` (Astro file-based routing)
- **Layouts:** `src/layouts/` — `Layout.astro` (main app shell with sidebar + header), `Layout_auth.astro`, `Layout_index.astro`
- **React components:** `src/components/` — use `client:load` directive in `.astro` files to hydrate
- **State:** Zustand stores in `src/stores/` — some use `persist` middleware (localStorage keys: `auth-storage`, `list-storage`, `settings-storage`)
- **Services:** `src/services/` — API calls. Auth services use raw `fetch`; all others use the shared Axios client from `src/lib/api.ts`
- **Types:** `src/types/`
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` plugin (no separate `tailwind.config` file — config is in `src/styles/global.css`)

## Key conventions

- Path alias: `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- Auth: JWT tokens (access + refresh) stored in Zustand persisted to localStorage. The Axios interceptor in `src/lib/api.ts` handles token injection and automatic refresh on 401.
- `Protected` component wraps auth-required pages; redirects to `/auth` if unauthenticated.
- Dark mode: toggled via a `dark` class on `<html>`, persisted in `settings-storage` localStorage. An inline `<script>` in `Layout.astro` applies it before hydration to avoid flash.
- UI components are in `src/components/ui/` — Radix-based (shadcn/ui pattern).

## What's NOT configured

- No linter, formatter, typechecker, or test runner is set up
- No CI/CD workflows
- No `npm run lint`, `npm run test`, or similar commands exist
