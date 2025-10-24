import { ChildProcess, spawn } from "child_process"
import fs from "fs/promises"
import path from "path"
import { Plugin } from "vite"

interface ReactDevToolsOptions {
  autoStart?: boolean // 是否自动启动 standalone
  port?: number // DevTools 端口
  maxWait?: number // 最大等待 DevTools 启动时间(ms)
  cacheDuration?: number // backend.js 缓存时间(ms)
}

let devtoolsProcess: ChildProcess | null = null

export function reactDevToolsAuto(options: ReactDevToolsOptions = {}): Plugin {
  const {
    autoStart = true,
    port = 8097,
    maxWait = 5000,
    cacheDuration = 24 * 60 * 60 * 1000 // 1天
  } = options

  const publicDir = path.resolve(process.cwd(), "public")
  const backendPath = path.join(publicDir, "react-devtools-backend.js")

  // 轮询 DevTools 是否可用
  async function waitForDevTools(): Promise<boolean> {
    const start = Date.now()
    while (Date.now() - start < maxWait) {
      try {
        const res = await fetch(`http://localhost:${port}`)
        if (res.ok) return true
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
    return false
  }

  // 判断缓存是否过期
  async function isCacheExpired(filePath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(filePath)
      return Date.now() - stats.mtimeMs > cacheDuration
    } catch {
      return true
    }
  }

  // fetch backend.js
  async function fetchBackend() {
    try {
      const content = await fetch(`http://localhost:${port}`).then((r) =>
        r.text()
      )
      await fs.mkdir(path.dirname(backendPath), { recursive: true })
      await fs.writeFile(backendPath, content)
      console.log("✅ React DevTools backend updated")
    } catch (error) {
      console.warn("⚠️ Failed to fetch React DevTools backend:", error)
      console.log("💡 You can manually run: npx react-devtools")
    }
  }

  return {
    name: "wxt-react-devtools-auto",
    apply: "serve",

    async configureServer(server) {
      // 自动启动 DevTools standalone
      if (autoStart && !devtoolsProcess) {
        devtoolsProcess = spawn("npx", ["react-devtools"], {
          stdio: "inherit",
          shell: true
        })
        console.log("🚀 React DevTools standalone starting...")
      }

      // 等待 DevTools 可用，stale 更新策略
      const ready = await waitForDevTools()
      const expired = await isCacheExpired(backendPath)

      if (ready && expired) {
        await fetchBackend()
      } else if (!expired) {
        console.log("✅ React DevTools backend cache is valid")
      } else if (!ready && expired) {
        console.warn("⚠️ DevTools not started, using stale backend (if exists)")
      }

      // 监听 Vite 关闭
      server.httpServer?.once("close", () => {
        if (devtoolsProcess) {
          devtoolsProcess.kill()
          devtoolsProcess = null
          console.log("🛑 React DevTools standalone stopped")
        }
      })
    },

    transformIndexHtml: {
      order: "pre",
      handler(html) {
        if (html.includes("react-devtools-backend.js")) return html
        return [
          {
            tag: "script",
            attrs: { src: "/react-devtools-backend.js" },
            injectTo: "head-prepend"
          }
        ]
      }
    }
  }
}
