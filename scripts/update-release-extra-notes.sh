#!/usr/bin/env bash

set -euo pipefail

RELEASE_TAG="${1:-${RELEASE_TAG:-}}"
REPOSITORY="${GH_REPO:-${GITHUB_REPOSITORY:-}}"
DOCS_BASE_URL="${DOCS_BASE_URL:-https://all-api-hub.qixing1217.top}"

if [ -z "$RELEASE_TAG" ]; then
  echo "RELEASE_TAG is required." >&2
  exit 1
fi

if [ -z "$REPOSITORY" ]; then
  echo "GH_REPO or GITHUB_REPOSITORY is required." >&2
  exit 1
fi

release_json="$(gh release view "$RELEASE_TAG" --repo "$REPOSITORY" --json body,assets)"

appendix_file="$(mktemp)"
current_body_file="$(mktemp)"
combined_file="$(mktemp)"

cleanup() {
  rm -f "$appendix_file" "$current_body_file" "$combined_file"
}
trap cleanup EXIT

export RELEASE_JSON="$release_json"
export RELEASE_TAG
export DOCS_BASE_URL

node --input-type=module <<'EOF' > "$appendix_file"
const release = JSON.parse(process.env.RELEASE_JSON ?? "{}")
const releaseTag = process.env.RELEASE_TAG ?? ""
const docsBaseUrl = (process.env.DOCS_BASE_URL ?? "").replace(/\/+$/, "")
const isNightly = releaseTag === "nightly"

const assetNames = Array.isArray(release.assets)
  ? release.assets
      .map((asset) => asset?.name)
      .filter((name) => typeof name === "string" && name.length > 0)
  : []

const assetOrder = (name) => {
  if (/chrome\.zip$/i.test(name)) return 10
  if (/firefox\.zip$/i.test(name)) return 20
  if (/sources\.zip$/i.test(name)) return 30
  if (/safari-xcode-bundle\.zip$/i.test(name)) return 40
  if (/safari\.zip$/i.test(name)) return 50
  return 100
}

const describeAsset = (name) => {
  if (/chrome\.zip$/i.test(name)) {
    return "Chromium 内核浏览器手动安装包，适用于 Chrome、Edge、Kiwi 等。下载后先解压，再通过扩展管理页加载已解压目录。"
  }

  if (/firefox\.zip$/i.test(name)) {
    return "Firefox 构建包。普通用户优先使用 Firefox Add-ons 商店；这个附件更适合高级用户自行验证、调试或配合发布流程使用。"
  }

  if (/sources\.zip$/i.test(name)) {
    return "Firefox 发布/审核用源码包，通常不是普通用户直接安装的附件。"
  }

  if (/safari-xcode-bundle\.zip$/i.test(name)) {
    return "Safari 推荐下载包。解压后可直接打开其中的 Xcode 工程运行，普通用户请优先下载这个文件。"
  }

  if (/safari\.zip$/i.test(name)) {
    return "Safari 原始构建包，通常作为 Xcode 工程生成输入使用；普通用户不要单独下载这个文件。"
  }

  return "发布附件。"
}

const lines = [
  "<!-- all-api-hub-release-extra:start -->",
  "## 附加说明",
  "",
  isNightly
    ? "> 当前为 Nightly 预发布，基于 `main` 最新提交自动生成。更新更快，但也更可能包含尚未充分验证的改动。"
    : "> 当前为正式版 Stable，适合大多数用户日常使用。以下内容用于说明各个附件的用途与常见安装入口。",
  "",
  "### 产物说明",
]

if (assetNames.length === 0) {
  lines.push("- 当前 release 暂未检测到附件。")
} else {
  assetNames
    .sort((left, right) => {
      const delta = assetOrder(left) - assetOrder(right)
      return delta !== 0 ? delta : left.localeCompare(right)
    })
    .forEach((name) => {
      lines.push(`- \`${name}\`：${describeAsset(name)}`)
    })
}

lines.push(
  "",
  "### 使用说明",
  "- 大多数用户：优先使用商店版本或最新正式版 Stable；如需提前验证修复或体验新功能，再考虑 Nightly 预发布。",
  "- Chrome / Edge / Kiwi 等 Chromium 浏览器：下载 `*-chrome.zip`，先解压，再在扩展管理页选择“加载已解压的扩展程序”。",
  "- Firefox：优先使用 Firefox Add-ons 商店；`*-firefox.zip` 与 `*-sources.zip` 更适合高级用户、自行验证或发布流程使用。",
  "- Safari：请下载 `*-safari-xcode-bundle.zip`，解压后直接打开其中的 Xcode 工程；不要只下载 `*-safari.zip`。",
  "",
  "### 文档链接",
  `- 快速上手：${docsBaseUrl}/get-started.html`,
  `- 常见问题：${docsBaseUrl}/faq.html`,
  `- Safari 安装指南：${docsBaseUrl}/safari-install.html`,
  `- 更新日志：${docsBaseUrl}/changelog.html`,
  "<!-- all-api-hub-release-extra:end -->",
)

process.stdout.write(`${lines.join("\n")}\n`)
EOF

gh release view "$RELEASE_TAG" --repo "$REPOSITORY" --json body --jq ".body" > "$current_body_file"

perl -0pi -e 's/\n?<!-- all-api-hub-release-extra:start -->.*?<!-- all-api-hub-release-extra:end -->\n?//s' "$current_body_file"

cp "$current_body_file" "$combined_file"

if grep -q '[^[:space:]]' "$combined_file"; then
  printf '\n\n' >> "$combined_file"
else
  : > "$combined_file"
fi

cat "$appendix_file" >> "$combined_file"

gh release edit "$RELEASE_TAG" --repo "$REPOSITORY" --notes-file "$combined_file"
