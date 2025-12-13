# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This project is a browser extension called "All API Hub" (中转站管理器) designed to manage accounts for various AI API aggregator services. It allows users to view balances, supported models, and manage API keys from a single interface.

The extension is built using the WXT framework and can automatically discover and manage accounts for aggregator projects such as:

- [one-api](https://github.com/songquanpeng/one-api)
- [new-api](https://github.com/QuantumNous/new-api)
- [Veloera](https://github.com/Veloera/Veloera)
- [one-hub](https://github.com/MartialBE/one-hub)
- [done-hub](https://github.com/deanxv/done-hub)
- Neo-API（闭源）
- Super-API（闭源）
- RIX_API（闭源，基本功能支持）
- VoAPI（闭源，老版本支持）

## Tech Stack

- **Framework**: WXT 0.20.x
- **Language**: TypeScript
- **UI**: React, Tailwind CSS v4, Headless UI, Radix UI primitives
- **State Management**: React Context + custom hooks
- **Icons**: Heroicons, @lobehub/icons, lucide-react
- **Testing**: Vitest, @testing-library/react, MSW
- **Tooling**: pnpm, ESLint, Prettier, Husky

## Common Development Tasks

### Setup

Install dependencies using pnpm:

```bash
pnpm install
```

### Running the Development Server

This will start the development server using WXT.

- For Chrome:

  ```bash
  pnpm dev
  ```

- For Firefox:

  ```bash
  pnpm dev:firefox
  ```

After running the command, load the extension from the `.output/chrome-mv3` or `.output/firefox-mv3` directory in your browser.

### Building for Production

- For Chrome:

  ```bash
  pnpm build
  ```

- For Firefox:

  ```bash
  pnpm build:firefox
  ```

- To build for all targets:

  ```bash
  pnpm build:all
  ```

The production-ready extension will be in the `.output/chrome-mv3` or `.output/firefox-mv3` directory.

### Packaging the Extension

This creates a zip file in the `.output` directory ready for submission to the respective web stores.

- For Chrome:

  ```bash
  pnpm zip
  ```

- For Firefox:

  ```bash
  pnpm zip:firefox
  ```

- To package for all targets:

  ```bash
  pnpm zip:all
  ```

### Linting and Formatting

- To lint the code:

  ```bash
  pnpm lint
  ```

- To format the code:

  ```bash
  pnpm format
  ```

- To compile and check for type errors:

  ```bash
  pnpm compile
  ```

### Testing

- Run all tests:

  ```bash
  pnpm test
  ```

- Watch mode during development:

  ```bash
  pnpm test:watch
  ```

- CI / coverage run:

  ```bash
  pnpm test:ci
  ```

## Code Architecture

This is a WXT project with the standard multi-entrypoint structure for browser extensions.

### Entry Points (`entrypoints/`)
- `popup/`: Main UI that appears when the extension icon is clicked
- `options/`: Extension settings and configuration pages
- `sidepanel/`: Chrome/Edge side panel interface
- `content/`: Content scripts injected into web pages (e.g., redemption assist UI)
- `background/`: Background service worker for extension lifecycle management
- Built bundles are emitted under `.output/{browser}-mv3[-dev]`

### State Management & Contexts (`contexts/`)
Global UI state managed via React Context API:
- `DeviceContext`: Device detection (desktop/mobile) and responsive behavior
- `ThemeContext`: Theme management (light/dark mode)
- `UserPreferencesContext`: User settings and preferences

Feature-specific state is co-located with components and hooks. No Zustand or Redux store is used.

### Services Layer (`services/`)
Core business logic and data persistence:
- `accountStorage.ts`: CRUD operations for AI aggregator accounts using @plasmohq/storage
- `accountOperations.ts`: Higher-level account management operations
- `autoDetectService.ts`: Automatic site detection and account discovery
- `detectSiteType.ts`: Site type identification (one-api, new-api, etc.)
- `apiService.ts`: API communication with various aggregator platforms
- `configMigration/`: Schema migration logic for backward compatibility
- `userPreferences.ts`: User preference storage and management
- `webdavService.ts`: WebDAV sync integration
- `channelConfigStorage.ts`: New API channel configuration management

### Data Models (`types/`)
TypeScript type definitions:
- `index.ts`: Core types including `SiteAccount`, `AccountInfo`, `HealthStatus`
- `newapi.ts`: New API specific types for model sync and channel management
- `channelConfig.ts`: Channel configuration schema
- Domain-specific types for WebDAV, redemption, check-in, etc.

### UI Components (`components/`)
- Feature components: `ChannelDialog/`, `RedemptionDialog/`, `SiteCard/`, etc.
- Shared primitives: `components/ui/` (buttons, inputs, modals from Radix UI)
- Feature modules: `features/` for higher-level feature logic

### Utilities & Hooks
- `hooks/`: Custom React hooks for shared logic
- `utils/`: Pure utility functions (error handling, formatting, etc.)
- `constants/`: Application-wide constants and design tokens

### Testing Infrastructure (`tests/`)
- `setup.ts`: Vitest configuration and global test setup
- MSW handlers for API mocking
- Test utilities and custom matchers

## Data Flow & Key Patterns

### Account Data Flow
1. User navigates to an AI aggregator site (e.g., one-api, new-api)
2. `autoDetectService` detects the site type and creates an access token
3. `accountStorage` persists account data using @plasmohq/storage (local storage)
4. `accountOperations` manages higher-level operations (refresh, validate, check-in)
5. UI components consume account data via React Context or direct service calls

### Configuration Migration
The extension uses a versioned configuration system (`configVersion` field in `SiteAccount`):
- `configMigration/account/`: Handles backward compatibility for account schema changes
- Migrations run automatically on account load via `migrateAccountsConfig()`
- Example: Legacy `can_check_in` → `checkIn` object structure

### Browser Storage Pattern
Uses `@plasmohq/storage` (wrapper around chrome.storage.local):
```typescript
const storage = new Storage({ area: "local" })
await storage.get(key)
await storage.set(key, value)
```

### Multi-Browser Support
- WXT handles browser-specific differences automatically
- Firefox-specific manifest configuration in `wxt.config.ts` (sidebar actions, optional permissions)
- Conditional permission requests for Firefox's `webRequest` API

## Development Guidelines

### Running Tests for Specific Files
```bash
# Run tests for a specific file pattern
pnpm test accounts

# Run a single test file
pnpm test services/accountStorage.test.ts
```

### Browser-Specific Testing
- Chrome/Edge: Load unpacked extension from `.output/chrome-mv3-dev`
- Firefox: Load temporary add-on from `.output/firefox-mv3-dev`
- Use `pnpm dev:mobile:firefox` for Android debugging with adb

### Adding New Service Modules
1. Create service file in `services/` with clear single responsibility
2. Define TypeScript types in `types/`
3. Add tests in `tests/` directory
4. Export service instance for singleton pattern if needed

### Working with Account Data
- Always use `accountStorage` service for account CRUD operations
- Account IDs are UUIDs (strings), not integers
- Use `configVersion` field to track schema changes
- Implement migration logic in `services/configMigration/` for breaking changes

## Important Notes

- WXT auto-generates manifest and handles browser differences; check `wxt.config.ts` for customizations
- @plasmohq/storage is the preferred storage API over raw chrome.storage
- All external API calls should go through services layer, not directly from components
- Icon assets are auto-generated from `assets/icon.png` via `@wxt-dev/auto-icons`
- Localization files are in `locales/` and use i18next for internationalization
