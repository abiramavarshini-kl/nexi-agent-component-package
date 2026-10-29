import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/index.ts", demo: "src/demo/index.ts" },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "es2020",
  // Every component is interactive; mark the bundle as a client module so it
  // works when imported from Next.js App Router server components.
  banner: { js: '"use client";' },
  external: ["react", "react-dom", "react/jsx-runtime"],
});
