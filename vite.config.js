import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 5173,
    host: true,
    hmr: {
      clientPort: 5173,
      protocol: "ws",
      overlay: true,
    },
    watch: {
      usePolling: false,
      interval: 100,
    },
  },
  build: {
    assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.svg"],
  },
});
