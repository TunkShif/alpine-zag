/**
 * @type {import('prettier').Options}
 */
export default {
  printWidth: 100,
  tabWidth: 2,
  semi: false,
  useTabs: false,
  singleQuote: false,
  trailingComma: "none",
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro"
      }
    }
  ]
}
