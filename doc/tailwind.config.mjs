import defaultTheme from "tailwindcss/defaultTheme"
import typography from "@tailwindcss/typography"
import forms from "@tailwindcss/forms"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Figtree Variable'", ...defaultTheme.fontFamily.sans],
        mono: ["'DM Mono'", ...defaultTheme.fontFamily.mono]
      }
    }
  },
  plugins: [forms, typography]
}
