import esbuild from "esbuild"

const entries = [
  {
    entryPoints: ["src/index.ts"],
    outfile: "dist/cdn.js",
    globalName: "Zag",
    bundle: true
  },
  {
    entryPoints: ["src/index.ts"],
    outfile: "dist/cdn.min.js",
    globalName: "Zag",
    bundle: true,
    minify: true
  },
  {
    entryPoints: ["src/index.ts"],
    outfile: "dist/module.cjs.js",
    bundle: true,
    platform: "node"
  },
  {
    entryPoints: ["src/index.ts"],
    outfile: "dist/module.esm.js",
    bundle: true,
    platform: "neutral",
    mainFields: ["main", "module"]
  }
]

await Promise.all(entries.map((entry) => esbuild.build(entry))).catch(() => process.exit(1))
