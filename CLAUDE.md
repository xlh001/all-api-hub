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

- **Entry points (`entrypoints/`)**:
  - `popup/`: UI that appears when the extension icon is clicked.
  - `options/`: Extension options and configuration pages.
  - `sidepanel/`: Side panel surfaces.
  - `content/`: Content scripts that run in web pages (for example, the redemption assist UI).
  - Built bundles are emitted under `.output/{browser}-mv3[-dev]` and then loaded into the browser.

- **State & context**:
  - Global UI/device/theme preferences are managed via React contexts in `contexts/` (for example, `DeviceContext`, `ThemeContext`, `UserPreferencesContext`).
  - Feature-specific state is usually co-located with components and hooks; there is currently no Zustand store.

- **UI & features**:
  - Reusable React components live in `components/`, including:
    - Feature folders like `ChannelDialog/`, `RedemptionDialog/`
    - Shared primitives under `components/ui/`
  - Higher-level feature logic is grouped in `features/`.
  - `hooks/` contains custom React hooks for shared logic.

- **Data and services**:
  - `services/`: Logic for interacting with external APIs, managing data, and handling browser storage.
  - `types/`: Shared TypeScript type definitions.
  - `constants/`: Application-wide constants and design tokens.

  - `utils/`: Cross-cutting utility functions.

  - `tests/`: Test setup, MSW handlers, and test utilities.

## Important Notes

- When technical behavior or library usage is uncertain, prefer checking the official documentation for WXT, React, Tailwind CSS, Headless UI, Radix UI, etc., or the upstream projects linked in the README, rather than guessing APIs.
