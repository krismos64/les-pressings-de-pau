// @ts-check
import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist/", ".astro/", ".wrangler/", "node_modules/"]),
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  // Règles d'accessibilité (via eslint-plugin-jsx-a11y-x, compatible ESLint 10).
  astro.configs["jsx-a11y-recommended"],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
]);
