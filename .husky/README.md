# Git Hooks

This project uses [Husky](https://typicode.github.io/husky/) to manage Git hooks and ensure code quality before commits and pushes.

## Configured Hooks

### pre-commit
Runs before each commit to ensure code quality:
- **Code Formatting**: Checks code formatting with Prettier
  - If formatting issues are found, it will auto-format and require you to review and stage changes
- **Linting**: Checks code with ESLint
  - If linting issues are found, it will attempt to auto-fix and require you to review and stage changes
- **i18n Extraction Guard**: Runs `pnpm run i18n:check:staged`
  - Only triggers when staged files touch `src/**`, `package.json`, `pnpm-lock.yaml`, or `i18next.config.ts`
  - Internally runs `pnpm run i18n:extract:ci` to ensure locale files stay in sync with code

## Manual Commands

You can also run these checks manually:

```bash
# Format code
pnpm format

# Check formatting without fixing
pnpm format:check

# Run linter
pnpm lint

# Fix linting issues
pnpm lint:fix

# Run full i18n extract CI guard
pnpm run i18n:extract:ci

# Run the staged-only i18n pre-commit check manually
pnpm run i18n:check:staged

```

## Skipping Hooks (Not Recommended)

In rare cases where you need to skip hooks:

```bash
# Skip pre-commit hook
git commit --no-verify

# Skip pre-push hook
git push --no-verify
```

⚠️ **Warning**: Skipping hooks is not recommended as it bypasses quality checks. Only do this if you have a valid reason and understand the consequences.

## Troubleshooting

### Hooks not running
If hooks are not running after cloning the repository:

```bash
pnpm install
```

This will trigger the `prepare` script which sets up Husky.

### Permission issues
If you get permission errors:

```bash
chmod +x .husky/pre-commit
```
