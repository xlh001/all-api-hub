# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This project is a browser extension called "All API Hub" (中转站管理器) designed to manage accounts for various AI API aggregator services. It allows users to view balances, supported models, and manage API keys from a single interface.

The extension is built using the Plasmo framework and supports the following aggregator projects:
- [one-api](https://github.com/songquanpeng/one-api)
- [new-api](https://github.com/QuantumNous/new-api)
- [Veloera](https://github.com/Veloera/Veloera)
- [one-hub](https://github.com/MartialBE/one-hub)
- [done-hub](https://github.com/deanxv/done-hub)
- [VoAPI](https://github.com/VoAPI/VoAPI)
- [Super-API](https://github.com/SuperAI-Api/Super-API)

## Tech Stack
- **Framework**: Plasmo v0.90.5
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
- For Chrome:
  ```bash
  pnpm dev
  ```
- For Firefox:
  ```bash
  pnpm dev:firefox
  ```
After running the command, load the extension from the `build/chrome-mv3-dev` or `build/firefox-mv3-dev` directory in your browser.

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
The production-ready extension will be in the `build/chrome-mv3-prod` or `build/firefox-mv3-prod` directory.

### Packaging the Extension
- For Chrome:
  ```bash
  pnpm package
  ```
- For Firefox:
  ```bash
  pnpm package:firefox
  ```
- To package for all targets:
    ```bash
    pnpm package:all
    ```
This creates a zip file in the `build` directory ready for submission to the respective web stores.

### Code Formatting
To format the code, run:
```bash
pnpm format
```

## Code Architecture

This is a Plasmo project, which has a specific structure for browser extensions.

- **Entry Points**:
  - `popup/`: The main UI that appears when the extension icon is clicked. This is the core interface.
  - `options/`: The extension's options page for configuration.
  - `sidepanel/`: A side panel UI.
  - `background.ts`: The service worker for handling background tasks.
  - `content.ts`: A content script that can interact with web pages.

- **State Management**:
  - Global state is managed using **Zustand**.
  - React contexts in the `contexts/` directory are used to provide state stores and actions to different parts of the component tree. For example, `AccountDataContext.tsx` manages the state for user accounts.

- **UI Components**:
  - Reusable React components are located in `components/`. They are organized by feature (e.g., `AccountDialog`, `ModelItem`).
  - `hooks/` contains custom React hooks to encapsulate and reuse component logic.

- **Data and Services**:
  - `services/`: This directory should contain the logic for interacting with external APIs, managing data, and handling browser storage (`@plasmohq/storage`).
  - `types/`: Contains shared TypeScript type definitions used throughout the project.
  - `constants/`: For application-wide constant values.

## Important Notes
- When technical documentation is uncertain, use the `mcp context7` tool to search for information, especially for libraries like Plasmo, Tailwind, or Headless UI.