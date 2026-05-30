function decodeHtmlEntities(value) {
  return String(value ?? "")
    .replaceAll("&gt;", ">")
    .replaceAll("&lt;", "<")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
}

function toCsvCell(value) {
  const text = String(value ?? "")
  if (!/[",\n\r]/.test(text)) return text

  return `"${text.replaceAll('"', '""')}"`
}

export function formatCsv(rows) {
  const headers =
    rows.length > 0
      ? Object.keys(rows[0])
      : [
          "duration_seconds",
          "classname",
          "name",
          "commit_sha",
          "branch",
          "timestamp",
        ]

  return [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((header) => toCsvCell(row[header])).join(","),
    ),
  ].join("\n")
}

export function normalizeCodecovTestRow(row) {
  return {
    duration_seconds: Number(row.duration_seconds) || 0,
    classname: row.classname,
    name: decodeHtmlEntities(row.name),
    computed_name: decodeHtmlEntities(row.computed_name),
    commit_sha: row.commit_sha,
    branch: row.branch,
    timestamp: row.timestamp,
  }
}

export function buildFileSummaryRows(rows) {
  const summaries = new Map()

  for (const row of rows) {
    const classname = row.classname
    if (!classname) continue

    const duration = Number(row.duration_seconds) || 0
    const existing = summaries.get(classname) ?? {
      classname,
      slow_test_count: 0,
      total_duration_seconds: 0,
      max_duration_seconds: 0,
      slowest_test: "",
      command: `pnpm exec vitest --run ${classname} --reporter=verbose`,
    }

    existing.slow_test_count += 1
    existing.total_duration_seconds += duration
    if (duration > existing.max_duration_seconds) {
      existing.max_duration_seconds = duration
      existing.slowest_test = row.name
    }

    summaries.set(classname, existing)
  }

  return Array.from(summaries.values()).sort((a, b) => {
    const totalDiff = b.total_duration_seconds - a.total_duration_seconds
    if (totalDiff !== 0) return totalDiff

    return b.max_duration_seconds - a.max_duration_seconds
  })
}
