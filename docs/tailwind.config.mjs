import colors from "tailwindcss/colors"
import starlightPlugin from "@astrojs/starlight-tailwind"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        accent: colors.zinc,
        gray: colors.zinc
      },
      borderColor: {
        default: "var(--colors-border-default)"
      }
    }
  },
  plugins: [starlightPlugin()]
}
