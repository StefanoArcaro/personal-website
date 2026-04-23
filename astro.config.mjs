// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://stefanoarcaro.com",
  integrations: [react(), sitemap()],
  // Static output by default — Cloudflare Pages serves `dist/` directly.
  // If we ever need server routes (auth, forms, dynamic OG), add
  // `@astrojs/cloudflare` and set `output: "server"`.
});
