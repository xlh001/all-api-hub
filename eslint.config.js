import pluginImport from "eslint-plugin-import"
import reactHooks from "eslint-plugin-react-hooks"
import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"

import autoImports from "./.wxt/eslint-auto-imports.mjs"

export default defineConfig([
  autoImports,
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      ".plasmo/**",
      ".output/**",
      ".wxt/**",
      "docs/**"
    ]
  },
  {
    files: ["**/*.ts", "**/*.tsx"],

    plugins: { "react-hooks": reactHooks, import: pluginImport },

    // Configure language/parsing options
    languageOptions: {
      // Use TypeScript ESLint parser for TypeScript files
      parser: tseslint.parser,
      parserOptions: {
        // Enable project service for better TypeScript integration
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },

    settings: {
      "import/resolver": {
        typescript: {
          project: ["./tsconfig.json"],
          alwaysTryTypes: true
        }
      }
    },

    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            "**/*.config.{js,ts,mjs,cjs}",
            "**/__tests__/**",
            "**/*.test.{js,ts,jsx,tsx}",
            "scripts/**",
            "plugins/**",
            "docs/**",
            "wxt.config.ts"
          ],
          optionalDependencies: false,
          peerDependencies: true,
          packageDir: ["."]
        }
      ]
    }
  }
])
