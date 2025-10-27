import "@testing-library/jest-dom/vitest"
import { cleanup, configure } from "@testing-library/react"
import "whatwg-fetch"
import { afterAll, afterEach, beforeAll, vi } from "vitest"
import { resetContext } from "vitest-webextension-mock"
import "vitest-webextension-mock"

import { server } from "./msw/server"

// Provide an in-memory implementation of @plasmohq/storage
const storageData = new Map<string, any>()

vi.mock("@plasmohq/storage", () => {
  class Storage {
    async get(key: string) {
      return storageData.get(key)
    }

    async set(key: string, value: any) {
      storageData.set(key, value)
    }

    async remove(key: string) {
      storageData.delete(key)
    }

    async clear() {
      storageData.clear()
    }

    watch() {
      return () => {}
    }
  }

  return { Storage }
})

// Mock webextension-polyfill to use the global browser mock provided by
// vitest-webextension-mock
vi.mock("webextension-polyfill", () => ({
  default: globalThis.browser,
  ...globalThis.browser
}))

// Ensure the Chrome namespace exists for modules that rely on it
const globalAny = globalThis as any
if (!globalAny.chrome) {
  globalAny.chrome = {
    runtime: {
      sendMessage: vi.fn(),
      onMessage: {
        addListener: vi.fn(),
        removeListener: vi.fn(),
        hasListener: vi.fn()
      },
      getURL: vi.fn((path: string) => `chrome-extension://mock-id/${path}`)
    },
    storage: {
      local: {
        get: vi.fn(),
        set: vi.fn(),
        remove: vi.fn(),
        clear: vi.fn()
      }
    },
    tabs: {
      query: vi.fn(),
      sendMessage: vi.fn(),
      create: vi.fn()
    }
  }
}

// Polyfill APIs used in the app that are not present in jsdom
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

globalAny.IntersectionObserver = class IntersectionObserver {
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

globalAny.ResizeObserver = class ResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}

configure({ testIdAttribute: "data-testid" })

beforeAll(() => {
  server.listen({ onUnhandledRequest: "warn" })
})

afterEach(() => {
  server.resetHandlers()
  cleanup()
  storageData.clear()
  resetContext()
  vi.clearAllMocks()
})

afterAll(() => {
  server.close()
})
