import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  minify: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true
})
