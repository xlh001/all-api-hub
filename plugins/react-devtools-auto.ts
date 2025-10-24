import fs from "fs/promises"
import path from "path"
import { Plugin } from "vite"

let backendReady = false

export function reactDevToolsAuto(): Plugin {
  return {
    name: "wxt-react-devtools-auto",
    apply: "serve",

    async configResolved() {
      if (backendReady) return

      const publicDir = path.resolve(process.cwd(), "public")
      const backendPath = path.join(publicDir, "react-devtools-backend.js")

      // 检查是否已存在
      try {
        await fs.access(backendPath)
        console.log("✅ React DevTools backend already exists")
        backendReady = true
        return
      } catch {
        // 文件不存在，需要获取
      }

      console.log("📦 Fetching React DevTools backend...")

      try {
        // 获取 backend
        const content = await fetch("http://localhost:8097").then((r) =>
          r.text()
        )
        await fs.mkdir(publicDir, { recursive: true })
        await fs.writeFile(backendPath, content)
        console.log("✅ React DevTools backend saved")

        backendReady = true
      } catch (error) {
        console.warn("⚠️  Failed to fetch React DevTools backend:", error)
        console.log("💡 You can manually run: npx react-devtools")
      }
    },

    transformIndexHtml: {
      order: "pre",
      handler(html) {
        if (html.includes("react-devtools-backend.js")) {
          return html
        }
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
