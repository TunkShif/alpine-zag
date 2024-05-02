import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"
import tailwind from "@astrojs/tailwind"
import alpinejs from "@astrojs/alpinejs"

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Alpine Zag",
      favicon: "/favicon.ico",
      logo: {
        light: "./src/assets/logo-light.svg",
        dark: "./src/assets/logo-dark.svg",
        replacesTitle: true
      },
      pagination: false,
      social: {
        github: "https://github.com/TunkShif/alpine-zag"
      },
      sidebar: [
        {
          label: "Guides",
          items: [{ label: "Example Guide", link: "/guides/example/" }]
        },
        {
          label: "Components",
          autogenerate: { directory: "components" }
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" }
        }
      ],
      customCss: ["@fontsource-variable/figtree", "@fontsource/dm-mono", "./src/tailwind.css"],
      components: {
        Head: "./src/components/Head.astro"
      }
    }),
    tailwind({ applyBaseStyles: false }),
    alpinejs({ entrypoint: "/src/alpine" })
  ]
})
