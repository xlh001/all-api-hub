import { describe, expect, it } from "vitest"

import {
  buildFileSummaryRows,
  normalizeCodecovTestRow,
  // eslint-disable-next-line import/extensions
} from "../../scripts/diagnostics/codecov-slowest-tests-utils.mjs"

describe("codecov slowest tests diagnostics", () => {
  it("groups slow Codecov test rows by file with actionable local commands", () => {
    const rows = [
      normalizeCodecovTestRow({
        duration_seconds: 3,
        classname: "tests/a.test.ts",
        name: "suite &gt; slow path",
        commit_sha: "abcdef123456",
        branch: "main",
        timestamp: "2026-05-31T00:00:00Z",
      }),
      normalizeCodecovTestRow({
        duration_seconds: 1.5,
        classname: "tests/b.test.ts",
        name: "other suite &gt; setup",
        commit_sha: "abcdef123456",
        branch: "main",
        timestamp: "2026-05-31T00:00:00Z",
      }),
      normalizeCodecovTestRow({
        duration_seconds: 2,
        classname: "tests/a.test.ts",
        name: "suite &gt; another path",
        commit_sha: "abcdef123456",
        branch: "main",
        timestamp: "2026-05-31T00:00:00Z",
      }),
    ]

    expect(buildFileSummaryRows(rows)).toEqual([
      {
        classname: "tests/a.test.ts",
        slow_test_count: 2,
        total_duration_seconds: 5,
        max_duration_seconds: 3,
        slowest_test: "suite > slow path",
        command: "pnpm exec vitest --run tests/a.test.ts --reporter=verbose",
      },
      {
        classname: "tests/b.test.ts",
        slow_test_count: 1,
        total_duration_seconds: 1.5,
        max_duration_seconds: 1.5,
        slowest_test: "other suite > setup",
        command: "pnpm exec vitest --run tests/b.test.ts --reporter=verbose",
      },
    ])
  })
})
