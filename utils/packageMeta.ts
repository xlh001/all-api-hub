import { REPO_URL } from "~/constants/about"
import pkg from "~/package.json"

export const getHomepage = () => {
  return (pkg as any).homepage ?? "https://qixing-jk.github.io/all-api-hub/"
}

export const getRepository = () => {
  const repo = (pkg as any).repository
  if (!repo) return REPO_URL
  if (typeof repo === "string") return repo
  return repo.url ?? REPO_URL
}

export const getPkgVersion = (name: string) => {
  const v =
    (pkg as any).dependencies?.[name] ?? (pkg as any).devDependencies?.[name]
  if (!v) return "—"
  return String(v).replace(/^[~^><= ]+/, "")
}
