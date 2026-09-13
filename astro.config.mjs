// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Keep this in sync with `SITE.url` in src/config/site.ts (Astro evaluates
// this file before the rest of the app, so the value is duplicated here
// rather than imported).
const SITE_URL = "https://extdecoder.gouselabs.com";

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap()],
});
