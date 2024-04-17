import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import alpinejs from "@astrojs/alpinejs"

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), alpinejs({ entrypoint: "/src/alpine" })],
  markdown: {
    shikiConfig: {
      theme: "catppuccin-mocha"
    }
  }
})
