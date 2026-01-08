# Project Context

## Purpose
All API Hub (中转站管理器) is a multi-browser extension that helps users manage accounts for AI API aggregator panels and self-hosted New API instances from one place.

Core goals:
- Auto-detect supported sites from an open tab and add an account using existing login state (cookies/session).
- Show and refresh account balance/usage, model availability and pricing, and health status.
- Manage API keys/tokens (list/copy/export) and support common workflows like daily check-in.
- Provide “New API” admin tooling (model sync, channel management) for self-hosted instances.
- Support backup/restore, including JSON import/export and WebDAV sync.

## Tech Stack
- **Runtime/Platform**: Browser Extension (Manifest V3) built with WXT (`wxt`), targeting Chrome/Edge and Firefox.
- **Language**: TypeScript (ESM; strict mode; `~/*` path alias).
- **UI**: React 19 + Tailwind CSS v4.
- **UI primitives/components**: Headless UI, Radix UI primitives, shadcn/ui-style component structure (`components/ui`), `class-variance-authority`, `clsx`, `tailwind-merge`.
- **Data/state**: React Context + custom hooks; TanStack React Query for server-ish async state.
- **i18n**: i18next + react-i18next (locale resources under `locales/`).
- **Storage**: `@plasmohq/storage` (wraps extension storage areas).
- **Testing**: Vitest + Testing Library + jsdom; MSW for network mocking.
- **Tooling**: pnpm, ESLint (flat config), Prettier (Tailwind + import sorting), Husky + lint-staged.

## Project Conventions

### Code Style
- **Formatting**: Prettier with no semicolons, 2-space indentation, and Tailwind class sorting; import order is enforced via `@ianvs/prettier-plugin-sort-imports` (`.prettierrc.mjs`).
- **Linting**: ESLint + TypeScript ESLint; React Hooks rules are errors; JSDoc is linted (`eslint.config.js`).
- **Comments/docs**: TSDoc for public APIs; JSDoc for complex logic; keep comments aligned with behavior.
- **Imports/aliases**: Prefer `~/...` imports (maps to repo root); keep imports sorted/partitioned per Prettier import order.
- **Strings/config**: Avoid magic strings for identifiers/config; prefer `as const` constant maps and derived types; reference constants instead of raw strings.
- **UI text**: User-facing strings should be i18n’d (no hard-coded UI copy without a clear reason).

### Architecture Patterns
- **Separation of concerns**:
  - `entrypoints/`: extension surfaces (background, content scripts, popup, options, sidepanel).
  - `components/`: reusable UI building blocks (including `components/ui/` primitives).
  - `features/`: feature flows (often co-located hooks/utils).
  - `services/`: business logic, storage, API integrations, migrations.
  - `contexts/`: global UI contexts (device/theme/user preferences).
  - `utils/`, `constants/`, `types/`: shared helpers, constants, and domain types.
- **Service-first data access**: External calls and persistence should be implemented in `services/` (components shouldn’t call remote APIs directly).
- **Migrations**: Backward-compatible config/schema changes are handled in `services/configMigration/`.
- **Cross-browser support**: WXT manifest is generated via `wxt.config.ts` with browser-specific conditionals.

### Testing Strategy
- **Test runner**: Vitest in `jsdom`, with global APIs enabled (`vitest.config.ts`).
- **Test location**: Centralized `tests/` tree mirroring app domains (`tests/services`, `tests/components`, `tests/features`, `tests/entrypoints`, `tests/hooks`, `tests/utils`).
- **Utilities/mocks**: Shared setup in `tests/setup.ts`; Testing Library helpers in `tests/test-utils/`; MSW handlers/server under `tests/msw/`.
- **Coverage**: `pnpm test:ci` enforces a (currently low) global coverage threshold; expand tests when adding new logic in covered folders.

### Git Workflow
- **Branching**: Branch from `main`; keep PRs focused and small.
- **Commits**: Conventional Commits with scopes (e.g., `feat(user-preferences): ...`, `refactor(api): ...`).
- **Quality gates**: Prefer running `pnpm lint`, `pnpm format:check`, `pnpm compile`, and `pnpm test:ci` before PRs.
- **Hooks**: Husky + lint-staged run checks on commit; avoid bypassing hooks unless necessary.

## Domain Context
- **Supported “panel” families**: New API / one-api-derived projects and compatible third-party panels. The extension detects site type, reuses browser login state, and interacts with the panel’s HTTP APIs to fetch balance/models/keys.
- **New API integration**: When configured with admin credentials, the extension can sync model lists and manage channels for a self-hosted New API instance.
- **Cloudflare/shields**: Some sites may be protected by Cloudflare; flows exist to assist users in completing challenges so detection/refresh can proceed.

## Important Constraints
- **Extension environment**: Manifest V3 constraints apply (service worker background, CSP, limited APIs); browser differences must be handled (Chrome/Edge vs Firefox).
- **Permissions**: Host access is broad (`<all_urls>`); optional permissions differ by browser (`cookies`, `webRequest*` vs `declarativeNetRequestWithHostAccess`).
- **Security/privacy**: Treat site tokens/API keys and backup payloads as sensitive; avoid logging secrets; never commit credentials.
- **Localization**: UI copy must remain translatable; add/update locale keys alongside UI changes.

## External Dependencies
- **Third-party panel APIs**: HTTP endpoints for supported aggregator panels (balance/models/keys/check-in), including OpenAI-compatible variants.
- **WebDAV**: Remote backup/sync for user configuration.
- **Browser APIs**: `chrome.*`/`browser.*` WebExtension APIs (tabs, storage, alarms, context menus, optional cookie/network permissions).
