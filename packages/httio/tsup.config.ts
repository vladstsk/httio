import { defineConfig } from "tsup";

const entries = ["src/index.ts"];

export default defineConfig((options) => [
  {
    bundle: true,
    clean: !options.watch,
    entry: entries,
    format: ["esm", "cjs"],
    minify: !options.watch,
    platform: "neutral",
    silent: !!options.watch,
    sourcemap: !!options.watch,
    tsconfig: "tsconfig.json",

    outExtension({ format }) {
      return { js: format === "esm" ? ".mjs" : ".cjs" };
    },
  },
  {
    bundle: true,
    dts: {
      only: true,
    },
    entry: entries,
    platform: "neutral",
    silent: !!options.watch,
  },
]);
