import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  base: "/",
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  server: {
    port: 5173,
    https: true,
    cors: true,
  },
  plugins: [basicSsl()],
});
