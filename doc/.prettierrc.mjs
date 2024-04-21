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
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ["prettier-plugin-astro", "@trivago/prettier-plugin-sort-imports"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro"
      }
    }
  ]
}
