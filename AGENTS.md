# Repository Guidelines

## Project Structure & Module Organization

- `entrypoints/`: WXT extension entry points (popup/options/background/content scripts).
- `components/` and `components/ui/`: shared React components (UI primitives live in `components/ui/`).
- `features/`: feature-oriented modules; keep UI thin and delegate logic to services/hooks.
- `services/`: business logic, persistence, and WebExtension/Storage integrations.
- `hooks/`, `contexts/`, `utils/`, `types/`, `constants/`: reusable app building blocks.
- `locales/`: UI i18n resources (i18next). Manifest strings live in `public/_locales/`.
- `tests/`: Vitest setup, MSW handlers, and test utilities. Build artifacts are written to `.output/`.

## Build, Test, and Development Commands

Prereqs: Node.js 20+ and pnpm 10+.

- Install: `pnpm install` (runs `wxt prepare` via `postinstall`).
- Dev (Chrome MV3): `pnpm dev`, then load unpacked from `.output/chrome-mv3-dev`.
- Dev (Firefox MV2): `pnpm dev:firefox`, then load temporary add-on from `.output/firefox-mv2-dev`.
- Build/Package: `pnpm build`, `pnpm zip` (or `pnpm build:all`, `pnpm zip:all`).
- Quality gates: `pnpm lint`, `pnpm format:check`, `pnpm compile`.

## Coding Style & Naming Conventions

- TypeScript + React. Formatting is enforced by Prettier (2 spaces, no semicolons, double quotes) and ESLint.
- Prefer the repo-root import alias: `import { render } from "~/tests/test-utils/render"`.
- Tests: `*.test.ts` / `*.test.tsx`, typically under `__tests__/` next to the code under test.

## Testing Guidelines

- Frameworks: Vitest (jsdom) + Testing Library; MSW for network mocking.
- Run: `pnpm test` (quick) or `pnpm test:ci` (coverage to `coverage/`, used in CI).
- Coverage: current global baseline is 5% (see `vitest.config.ts`). Add tests for new/changed behavior and raise thresholds incrementally.

## Documentation Guidelines

- Repo docs (e.g., `README.md`, `README_EN.md`, and other multi-language Markdown) should be kept consistent across language versions when updating content.
- Docs site (`docs/docs/`): treat Chinese pages (`docs/docs/*.md`) as the source of truth; `docs/docs/en/**` and `docs/docs/ja/**` are auto-translated (see `docs_assistant/translate.py` / `.github/workflows/translate-docs.yml`) and generally shouldn’t be edited manually.
- When adding/removing a docs page under `docs/docs/`, update the locale nav links in `docs/docs/.vuepress/config.js` for each language (e.g., `/...`, `/en/...`, `/ja/...`).

## Commit & Pull Request Guidelines

- Commits follow Conventional Commits in practice: `feat(scope): …`, `fix: …`, `docs: …`, `chore: …`.
- PRs: include a clear description, link issues when relevant, add screenshots/GIFs for UI changes, and note tested browsers (Chrome/Firefox).
- Before opening a PR, run: `pnpm lint && pnpm format:check && pnpm compile && pnpm test:ci`.

## Security & Configuration Tips

- Never commit secrets (API keys/tokens). Use `.env.example` as a reference and keep local overrides untracked.
