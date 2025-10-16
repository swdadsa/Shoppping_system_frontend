# Repository Guidelines

## Project Structure & Module Organization
- App entry: `src/main.tsx`, root component: `src/App.tsx`.
- Views: `src/pages/` (e.g., `ProductsPage.tsx`, `CartPage.tsx`) via `react-router-dom`.
- Components: `src/components/` and shadcn-style UI in `src/components/ui/`.
- API layer: `src/api/` (e.g., `AccountApi.tsx`, `ItemsApi.tsx`).
- Utilities & assets: `src/utils/`, `src/assets/`; static files in `public/`.
- Config: `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`, `tsconfig*.json`.

## Build, Test, and Development Commands
- `npm run dev` — start Vite dev server with HMR.
- `npm run build` — type-check (`tsc -b`) and build production assets.
- `npm run preview` — serve the production build locally.
- `npm run lint` — run ESLint on the codebase.
Requirements: Node 18+ recommended. Copy `.env.example` to `.env` as needed (Vite env vars must start with `VITE_`).

## Coding Style & Naming Conventions
- Language: TypeScript + React 19 functional components; Tailwind for styles.
- Indentation: 2 spaces; max 100–120 cols when practical.
- Naming: PascalCase for React components/files (e.g., `Header.tsx`, `ProductsPage.tsx`); camelCase for functions/vars; UI primitives in `components/ui/` are lowercase (e.g., `button.tsx`). API modules follow `*Api.tsx`.
- Imports: prefer `@/` alias for `src/`.
- Linting: ESLint (typescript-eslint, react-hooks, react-refresh). Keep `npm run lint` clean.

## Testing Guidelines
- No test runner is configured yet. If adding tests, prefer Vitest + React Testing Library.
- Place tests under `src/__tests__/` or alongside modules as `*.test.tsx/ts`.
- Aim for meaningful coverage on pages, API calls, and utilities.

## Commit & Pull Request Guidelines
- Current history uses short, task-oriented messages. Prefer clear, imperative subjects (e.g., `fix: handle empty cart`) and concise bodies. Conventional Commits are welcome.
- Before PR: run `npm run lint` and, if applicable, build/preview.
- PRs should include: problem/solution summary, linked issues, and UI screenshots/GIFs for visible changes.

## Security & Configuration Tips
- Do not commit secrets. Use `.env` and Vite `VITE_*` variables for client config.
- Keep API endpoints and keys configurable (e.g., `VITE_API_BASE_URL`).
