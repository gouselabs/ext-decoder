import type { APIRoute } from "astro";

// Dynamic so it always points at whatever `site` is configured in
// astro.config.mjs, instead of a hardcoded domain drifting out of sync.
export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site).toString();
  const body = ["User-agent: *", "Allow: /", "", `Sitemap: ${sitemapURL}`, ""].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
