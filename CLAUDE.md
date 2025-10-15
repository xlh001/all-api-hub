# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This project is a browser extension called "All API Hub" (中转站管理器) designed to manage accounts for various AI API aggregator services. It allows users to view balances, supported models, and manage API keys from a single interface.

The extension is built using the WXT framework and supports the following aggregator projects:
- [one-api](https://github.com/songquanpeng/one-api)
- [new-api](https://github.com/QuantumNous/new-api)
- [Veloera](https://github.com/Veloera/Veloera)
- [one-hub](https://github.com/MartialBE/one-hub)
- [done-hub](https://github.com/deanxv/done-hub)
- [VoAPI](https://github.com/VoAPI/VoAPI)
- [Super-API](https://github.com/SuperAI-Api/Super-API)

## Tech Stack
- **Framework**: WXT v0.20.6
- **Language**: TypeScript
- **UI**: React, Tailwind CSS v3, Headless UI
- **State Management**: Zustand
- **Icons**: Heroicons, @lobehub/icons

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

## Code Architecture

This is a WXT project, which has a specific structure for browser extensions.

- **Entry Points**:
  - `entrypoints/`: This directory contains all the entry points for the extension.
    - `popup.html`: The main UI that appears when the extension icon is clicked.
    - `options.html`: The extension's options page for configuration.
    - `sidepanel.html`: A side panel UI.
    - `background.ts`: The service worker for handling background tasks.
    - `content.ts`: A content script that can interact with web pages.

- **State Management**:
  - Global state is managed using **Zustand**.
  - React contexts in the `contexts/` directory are used to provide state stores and actions to different parts of the component tree. For example, `AccountDataContext.tsx` manages the state for user accounts.

- **UI Components**:
  - Reusable React components are located in `components/`. They are organized by feature (e.g., `AccountDialog`, `ModelItem`).
  - `hooks/` contains custom React hooks to encapsulate and reuse component logic.

- **Data and Services**:
  - `services/`: This directory should contain the logic for interacting with external APIs, managing data, and handling browser storage.
  - `types/`: Contains shared TypeScript type definitions used throughout the project.
  - `constants/`: For application-wide constant values.
  - `utils/`: For utility functions.

## Important Notes
- When technical documentation is uncertain, use the `mcp context7` tool to search for information, especially for libraries like WXT, Tailwind, or Headless UI.
