import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import react from "./react.mjs";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

/** @type {import("eslint").Linter.Config[]} */
const configs = [
  ...react,

  {
    ignores: [".next/**", "public/**"],
  },

  {
    files: ["**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },

  ...compat.extends("next/core-web-vitals", "next/typescript").map((config) => ({
    ...config,
    files: ["**/*.{js,jsx,ts,tsx}"],
  })),

  {
    files: ["**/*.{jsx,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
];

export default configs;
