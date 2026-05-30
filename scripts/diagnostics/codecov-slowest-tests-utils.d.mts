export interface CodecovTestRow {
  duration_seconds?: number | string | null
  classname?: string
  name?: string | null
  computed_name?: string | null
  commit_sha?: string
  branch?: string
  timestamp?: string
}

export interface NormalizedCodecovTestRow {
  duration_seconds: number
  classname?: string
  name: string
  computed_name: string
  commit_sha?: string
  branch?: string
  timestamp?: string
}

export interface CodecovFileSummaryRow {
  classname: string
  slow_test_count: number
  total_duration_seconds: number
  max_duration_seconds: number
  slowest_test: string
  command: string
}

export function formatCsv(
  rows: Array<Record<string, string | number | null | undefined>>,
): string

export function normalizeCodecovTestRow(
  row: CodecovTestRow,
): NormalizedCodecovTestRow

export function buildFileSummaryRows(
  rows: NormalizedCodecovTestRow[],
): CodecovFileSummaryRow[]
