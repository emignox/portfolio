import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/portfolio/",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // three e r3f stanno in chunk a parte: caricati solo con le scene 3D
        manualChunks: {
          three: ["three"],
          r3f: ["@react-three/fiber", "@react-three/drei"],
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
});
