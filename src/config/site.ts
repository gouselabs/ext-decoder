// Central brand/site constants. Keep in sync with the `SITE_URL` literal in
// astro.config.mjs (Astro's config file can't cleanly import from src at
// config-eval time, so that one value is duplicated there — see the comment
// in astro.config.mjs).

export const SITE = {
  name: "Ext Decoder",
  brandMark: "Ext Decoder",
  tagline: "Decode any file extension, instantly",
  domain: "extdecoder.gouselabs.com",
  url: "https://extdecoder.gouselabs.com",
  parentBrand: "Gouse Labs",
  parentUrl: "https://gouselabs.com",
  contactEmail: "gouseshaikh1999@gmail.com",
  github: "https://github.com/gouselabs",
  linkedin: "https://www.linkedin.com/in/mohammed-gouse-shaikh",
  siblingSites: [
    { name: "Gouse Labs Portfolio", url: "https://gouselabs.com" },
    { name: "JD Decoder", url: "https://jddecoder.gouselabs.com" },
    { name: "Log Timeline Visualizer", url: "https://logtimeline.gouselabs.com" },
  ],
  /** Google Analytics 4 measurement ID. Set to null to disable the tag entirely. */
  googleAnalyticsId: "G-GW17RK2WQ3" as string | null,
} as const;

/** Default, site-wide keyword set used when a page doesn't supply more specific ones. */
export const DEFAULT_KEYWORDS = [
  "file extension lookup",
  "what is this file extension",
  "file extension meaning",
  "file type checker",
  "unknown file extension",
  "file extension database",
  "what does this file extension mean",
  "how to open a file extension",
  "is this file extension safe",
];
