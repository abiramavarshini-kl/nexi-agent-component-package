import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  // nexi-agent is linked from the parent folder, which has its own copy of
  // React for development — make sure the site and the library share one.
  resolve: { dedupe: ["react", "react-dom"] },
  // one bundle for the whole site is fine here
  build: { chunkSizeWarningLimit: 1500 },
  server: {
    port: 5173,
    // the "Sample data" tab reads the fixtures in ../src/demo
    fs: { allow: [".."] },
  },
  preview: { port: 4173 },
});
