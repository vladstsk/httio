import { defineConfig } from "tsup";

export default defineConfig((options) => [
  {
    bundle: true,
    clean: !options.watch,
    entry: ["src/index.ts"],
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
    entry: ["src/index.ts"],
    platform: "neutral",
    silent: !!options.watch,
  },
]);
