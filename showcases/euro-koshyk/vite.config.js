
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  base: "/showcase/euro-koshyk/",

  plugins: [react(), tailwindcss()],

  css: {
    postcss: {
      plugins: [],
    },
  },

  build: {
    outDir: "../../public/showcase/euro-koshyk",
    emptyOutDir: true,
  },
})
