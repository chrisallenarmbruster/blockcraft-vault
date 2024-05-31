/* global process */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import { Buffer } from "buffer";
import { VitePWA } from "vite-plugin-pwa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../server/.env") });

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "Blockcraft Vault",
        short_name: "B-Vault",
        description: "Blockcraft Vault Digital Wallet",
        theme_color: "#212529",
        background_color: "#212529",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/favicon-32x32.png",
            sizes: "32x32",
            type: "image/png",
          },
          {
            src: "/favicon-16x16.png",
            sizes: "16x16",
            type: "image/png",
          },
          {
            src: "/apple-touch-icon-180x180.png",
            sizes: "180x180",
            type: "image/png",
          },
          {
            src: "/maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/mstile-150x150.png",
            sizes: "150x150",
            type: "image/png",
          },
        ],
      },
      registerType: "autoUpdate",
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.origin === self.location.origin &&
              !url.pathname.startsWith("/api"),
            handler: "CacheFirst",
            options: {
              cacheName: "static-resources",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
        ],
      },
      iconPaths: {
        favicon: "favicon.ico",
        favicon32: "favicon-32x32.png",
        favicon16: "favicon-16x16.png",
        appleTouchIcon: "apple-touch-icon-180x180.png",
        maskIcon: "maskable-icon-512x512.png",
        msTileImage: "mstile-150x150.png",
      },
    }),
  ],
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
