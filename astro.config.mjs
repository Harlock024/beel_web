// @ts-check
import { defineConfig, envField } from "astro/config";

import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { API_URL } from "./src/services/api_url";

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: "middleware",
  }),
  output: "server",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
