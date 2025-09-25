import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  base: "/",
  build: {},
  server: {
    port: 5173,
    https: true,
    cors: true,
  },
  plugins: [basicSsl()],
});
