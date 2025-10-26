# Dependency Audit Summary

_Date: 2024-10-26_

## Removed Packages

- `zustand`: no runtime usage detected in the extension source. State is held via custom React context providers.
- `axios`: HTTP requests are handled via the native `fetch` API.

## Tooling Updates

- Added `depcheck` script to simplify future unused dependency scans.
- Added `lint:deps` script that enforces `import/no-extraneous-dependencies` with TypeScript-aware path resolution.
- Enabled `import/no-extraneous-dependencies` in the shared ESLint config and installed the required resolvers/plugins.

## Security Audit

`pnpm audit --audit-level=moderate`

| Severity | Package | Path | Status |
| --- | --- | --- | --- |
| High | cross-spawn < 6.0.6 | via `react-devtools` | Awaiting upstream fix. `react-devtools` latest (7.0.1) still bundles the vulnerable version. No production impact because it is a development-only dependency. |
| Moderate | got < 11.8.5 | via `react-devtools` | Same as above. |
| Moderate | electron < 35.7.5 | via `react-devtools` | Same as above. |
| Moderate | vite 6.4.0 | via `@wxt-dev/module-react` | Fixed by upgrading `@wxt-dev/module-react` once a patched release is available. Current release (1.1.3) still depends on `vite@6.4.0`. |
| Low | fast-redact <= 3.5.0 | via `web-ext` | Pending upstream update. `web-ext` is only used during development. |

All flagged issues are limited to development tooling and do not ship with the browser extension.

## Follow-up

- Monitor `react-devtools`, `@wxt-dev/module-react`, and `web-ext` for patched releases.
- Re-run `pnpm audit` during regular release cycles.
