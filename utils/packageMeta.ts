import pkg from "../package.json"

export const getHomepage = () => {
  return (pkg as any).homepage ?? "https://qixing-jk.github.io/all-api-hub/"
}

export const getRepository = () => {
  const repo = (pkg as any).repository
  if (!repo) return "https://github.com/qixing-jk/all-api-hub"
  if (typeof repo === "string") return repo
  return repo.url ?? "https://github.com/qixing-jk/all-api-hub"
}

export const getPkgVersion = (name: string) => {
  const v = (pkg as any).dependencies?.[name] ?? (pkg as any).devDependencies?.[name]
  if (!v) return "—"
  return String(v).replace(/^[~^><= ]+/, "")
}
