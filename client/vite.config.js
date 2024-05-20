/* global process */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import { Buffer } from "buffer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../server/.env") });

const blockcraftNodeUrl = process.env.VITE_BLOCKCRAFT_NODE_URL;

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env,
    "process.browser": true,
    Buffer: [Buffer, "Buffer"],
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
    https: {
      key: fs.readFileSync(join(__dirname, "192.168.1.195+2-key.pem")),
      cert: fs.readFileSync(join(__dirname, "192.168.1.195+2.pem")),
    },
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.PORT}`,
        changeOrigin: true,
        secure: false,
      },
      "/external-api": {
        target: "http://localhost:8100",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/external-api/, ""),
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
