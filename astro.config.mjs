// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";

dotenv.config();

import node from "@astrojs/node";
// https://astro.build/config
export default defineConfig({
adapter: node({
	mode: "standalone",
}),
server: {
	port: parseInt(process.env.BUN_PORT ?? "4321"),
},
output: "server",
integrations: [react()],
vite: {
	plugins: [tailwindcss()],
},
env: {
	schema: {
		PUBLIC_BEEL_API: envField.string({ context: "client", access: "public", optional: true }),
		BUN_PORT: envField.number({ context: "server", access: "public", default: 4321}),
	},
},
});
