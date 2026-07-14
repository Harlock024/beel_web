// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { API_URL } from "./src/services/api_url";
import dotenv from "dotenv";

dotenv.config();

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  server: {
    port: parseInt(process.env.BUN_PORT ?? "4321"),
  },
  output: "server",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: vercel(),
  env: {
    schema: {
      PUBLIC_BEEL_API: envField.string({ context: "client", access: "public", optional: true }),
      BUN_PORT: envField.number({ context: "server", access: "public", default: 4321}),
    },
  },
});
