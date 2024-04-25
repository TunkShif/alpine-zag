import { getIconCollections, iconsPlugin } from "@egoist/tailwindcss-icons"
import forms from "@tailwindcss/forms"
import typography from "@tailwindcss/typography"
import defaultTheme from "tailwindcss/defaultTheme"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      backgroundColor: {
        canvas: "var(--colors-bg-canvas)",
        default: "var(--colors-bg-default)",
        subtle: "var(--colors-bg-subtle)",
        muted: "var(--colors-bg-muted)",
        emphasized: "var(--colors-bg-emphasized)",
        disabled: "var(--colors-bg-disabled)"
      },
      textColor: {
        default: "var(--colors-fg-default)",
        muted: "var(--colors-fg-muted)",
        subtle: "var(--colors-fg-subtle)",
        disabled: "var(--colors-fg-disabled)"
      },
      borderColor: {
        default: "var(--colors-border-default)",
        muted: "var(--colors-border-muted)",
        subtle: "var(--colors-border-subtle)",
        disabled: "var(--colors-border-disabled)",
        outline: "var(--colors-border-outline)"
      },
      fontFamily: {
        sans: ["'Figtree Variable'", ...defaultTheme.fontFamily.sans],
        mono: ["'DM Mono'", ...defaultTheme.fontFamily.mono]
      }
    }
  },
  plugins: [
    forms,
    typography,
    iconsPlugin({ collections: getIconCollections(["lucide", "heroicons-solid"]) })
  ]
}
