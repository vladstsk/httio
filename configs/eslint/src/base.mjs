import css from "@eslint/css";
import js from "@eslint/js";
import prettierConfig from "@repo/prettier" with { type: "json" };
import warnOnly from "eslint-plugin-only-warn";
import perfectionist from "eslint-plugin-perfectionist";
import prettier from "eslint-plugin-prettier/recommended";
import turbo from "eslint-plugin-turbo";
import dependency from "eslint-plugin-unused-imports";
import globals from "globals";
import { resolve } from "node:path";
import ts from "typescript-eslint";

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config[]} */
const configs = [
  {
    ignores: [".turbo", ".cache", "dist", "node_modules", "coverage"],
  },

  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,cjs,mjs}"],
    ignores: ["*min.{js,jsx,cjs,mjs}", "*min.*.{js,jsx,cjs,mjs}"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "no-console": "error",
      "no-unused-vars": "off",
    },
  },

  ...ts.configs.recommended,
  {
    files: ["**/*.{ts,tsx,cts,mts}"],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        parser: "@typescript-eslint/parser",
        project,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": ["error", { disallowTypeAnnotations: false }],
      "@typescript-eslint/no-unused-vars": "off",
      "no-console": "error",
    },
    settings: {
      "import/resolver": {
        typescript: {
          project,
        },
      },
    },
  },

  prettier,
  {
    rules: {
      "prettier/prettier": ["error", prettierConfig],
    },
  },

  {
    files: ["**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}"],
    plugins: { dependency },
    rules: {
      "dependency/no-unused-imports": "error",
      "dependency/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },

  { plugins: { turbo, warnonly: warnOnly } },

  {
    ...perfectionist.configs["recommended-natural"],
    files: ["**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}"],
    plugins: { perfectionist },
    rules: {
      ...perfectionist.configs["recommended-natural"].rules,
      "perfectionist/sort-imports": [
        "warn",
        {
          groups: [
            ["side-effect"],
            ["builtin", "external"],
            ["internal"],
            ["parent", "sibling", "index"],
            "style",
            "object",
            "unknown",
          ],
          internalPattern: ["~", "^~/.*"],
          order: "asc",
          type: "natural",
        },
      ],
      "perfectionist/sort-interfaces": [
        "warn",
        {
          groups: ["unknown", "method"],
          newlinesBetween: "ignore",
          order: "asc",
          type: "natural",
        },
      ],
      "perfectionist/sort-intersection-types": [
        "warn",
        {
          groups: ["nullish", "named", ["intersection", "union"], "unknown"],
          newlinesBetween: "ignore",
          order: "asc",
          type: "natural",
        },
      ],
      "perfectionist/sort-jsx-props": "warn",
      "perfectionist/sort-modules": [
        "warn",
        {
          groups: [
            "enum",
            "type",
            "interface",
            ["class", "function"],
            ["export-interface", "export-class", "export-function"],
            ["export-default-interface", "export-default-class", "export-default-function"],
          ],
          order: "asc",
          type: "natural",
        },
      ],
      "perfectionist/sort-object-types": [
        "warn",
        {
          groups: ["unknown", "method"],
          newlinesBetween: "ignore",
          order: "asc",
          type: "natural",
        },
      ],
      "perfectionist/sort-objects": [
        "warn",
        {
          groups: ["unknown", "method"],
          newlinesBetween: "ignore",
          order: "asc",
          type: "natural",
        },
      ],
      "perfectionist/sort-union-types": [
        "warn",
        {
          groups: ["named", "literal", "keyword", "tuple", "operator", "nullish", "intersection", "union", "unknown"],
          order: "asc",
          type: "natural",
        },
      ],
    },
  },

  {
    files: ["**/*.css"],
    language: "css/css",
    languageOptions: {
      tolerant: true,
    },
    plugins: {
      css,
    },
    rules: {
      "css/no-empty-blocks": "error",
      "no-irregular-whitespace": "off",
    },
  },
];

export default configs;
