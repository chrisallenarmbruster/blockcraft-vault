/* global process */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Buffer } from "buffer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../server/.env") });

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env,
    "process.browser": true,
    Buffer: [Buffer, "Buffer"],
  },
  server: {
    port: 8080,
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.PORT}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      external: ["buffer"],
      output: {
        globals: {
          buffer: "Buffer",
        },
      },
    },
  },
});
