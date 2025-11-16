import { setupServer } from "msw/node"

import * as handlersModule from "./handlers"

const handlers = Array.isArray((handlersModule as any).handlers)
  ? (handlersModule as any).handlers
  : []

export const server = setupServer(...handlers)
