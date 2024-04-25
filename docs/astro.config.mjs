import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"
import tailwind from "@astrojs/tailwind"
import alpinejs from "@astrojs/alpinejs"

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Alpine Zag",
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
      customCss: ["./src/tailwind.css"]
    }),
    tailwind({ applyBaseStyles: false }),
    alpinejs({ entrypoint: "/src/alpine" })
  ]
})
