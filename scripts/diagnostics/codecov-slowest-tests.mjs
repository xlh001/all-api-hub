#!/usr/bin/env node
import { fileURLToPath } from "node:url"

import {
  buildFileSummaryRows,
  formatCsv,
  normalizeCodecovTestRow,
} from "./codecov-slowest-tests-utils.mjs"

const DEFAULT_OWNER = "qixing-jk"
const DEFAULT_REPO = "all-api-hub"
const DEFAULT_SERVICE = "github"
const DEFAULT_BRANCH = "main"
const DEFAULT_LIMIT = 25
const DEFAULT_MIN_DURATION = 1
const PAGE_SIZE = 100

const args = process.argv.slice(2)

function readArg(name, fallback) {
  const prefix = `--${name}=`
  const inline = args.find((arg) => arg.startsWith(prefix))
  if (inline) return inline.slice(prefix.length)

  const index = args.indexOf(`--${name}`)
  if (index >= 0 && args[index + 1]) return args[index + 1]

  return fallback
}

function readNumberArg(name, fallback) {
  const raw = readArg(name, String(fallback))
  const value = Number(raw)
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`--${name} must be a non-negative number`)
  }

  return value
}

function getBooleanArg(name) {
  return args.includes(`--${name}`)
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(
      `Codecov request failed: ${response.status} ${response.statusText}`,
    )
  }

  return response.json()
}

async function main() {
  const service = readArg("service", DEFAULT_SERVICE)
  const owner = readArg("owner", DEFAULT_OWNER)
  const repo = readArg("repo", DEFAULT_REPO)
  const branch = readArg("branch", DEFAULT_BRANCH)
  const commitSha = readArg("commit", "")
  const limit = Math.trunc(readNumberArg("limit", DEFAULT_LIMIT))
  const minDuration = readNumberArg("min-duration", DEFAULT_MIN_DURATION)
  const format = readArg("format", "table")
  const includeAllPages = getBooleanArg("all-pages")

  const collected = []
  const baseUrl = new URL(
    `https://api.codecov.io/api/v2/${service}/${owner}/repos/${repo}/test-analytics/`,
  )
  if (branch) baseUrl.searchParams.set("branch", branch)
  if (commitSha) baseUrl.searchParams.set("commit_sha", commitSha)
  baseUrl.searchParams.set("duration_min", String(minDuration))
  baseUrl.searchParams.set("page_size", String(PAGE_SIZE))

  let nextUrl = baseUrl.toString()
  while (nextUrl && (includeAllPages || collected.length < limit)) {
    const payload = await fetchJson(nextUrl)
    collected.push(...payload.results)
    nextUrl = payload.next
  }

  const rows = collected
    .map(normalizeCodecovTestRow)
    .sort((a, b) => b.duration_seconds - a.duration_seconds)
    .slice(0, limit)

  const fileRows = buildFileSummaryRows(rows)

  if (format === "files-json") {
    console.log(JSON.stringify(fileRows, null, 2))
    return
  }

  if (format === "files-csv") {
    console.log(formatCsv(fileRows))
    return
  }

  if (format === "files-table") {
    console.table(
      fileRows.map((row) => ({
        total_seconds: row.total_duration_seconds.toFixed(3),
        slow_tests: row.slow_test_count,
        max_seconds: row.max_duration_seconds.toFixed(3),
        file: row.classname,
        slowest_test: row.slowest_test,
        command: row.command,
      })),
    )
    return
  }

  if (format === "json") {
    console.log(JSON.stringify(rows, null, 2))
    return
  }

  if (format === "csv") {
    console.log(formatCsv(rows))
    return
  }

  console.table(
    rows.map((row) => ({
      seconds: row.duration_seconds.toFixed(3),
      file: row.classname,
      test: row.name,
      commit: row.commit_sha.slice(0, 12),
    })),
  )
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}
