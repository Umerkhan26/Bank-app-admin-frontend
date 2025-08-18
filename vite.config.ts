// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Service-Worker-Allowed": "/",
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        sw: "./public/firebase-messaging-sw.js",
      },
    },
  },
});
