import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { defineConfig } from 'vite'
import {heyApiPlugin} from "@hey-api/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      tailwindcss(),
      heyApiPlugin(),
  ],
  server: {
      proxy: {
          "/api": {
              target: "http://localhost:8000",
              changeOrigin: true,
          }
      }
  }
})
