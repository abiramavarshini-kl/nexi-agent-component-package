import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  // nexi-agent is linked from the parent folder, which has its own copy of
  // React for development — make sure the playground and the library share one.
  resolve: { dedupe: ["react", "react-dom"] },
  // one bundle for the whole gallery is fine here
  build: { chunkSizeWarningLimit: 1500 },
  server: { port: 5173 },
  preview: { port: 4173 },
});
