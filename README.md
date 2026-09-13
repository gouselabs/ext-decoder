# Ext Decoder

A fast, privacy-first tool that explains what a file extension means. Paste
or type a filename — `photo.heic`, `archive.tar.gz`, `.gitignore`,
`Dockerfile` — and instantly see its file type, typical purpose, commonly
associated software, supported platforms, whether it's editable/viewable,
common conversions, and safety guidance.

Branded **Ext Decoder**, deployed at **`extdecoder.gouselabs.com`** — a
subdomain of the [Gouse Labs](https://gouselabs.com) personal brand, alongside
[JD Decoder](https://jddecoder.gouselabs.com) and
[Log Timeline Visualizer](https://logtimeline.gouselabs.com). Brand constants
live in `src/config/site.ts`.

**Everything runs locally in the browser.** There is no backend, no
database, no file upload, no signup/login, and no external API calls. The
entire extension dataset ships as static, bundled TypeScript.

## Why this exists

Typing a filename into a search engine to figure out what it is/whether it's
safe is a genuinely common need, and most existing answers either require
uploading the file somewhere or bury the answer in ads. This tool answers
the single question — "what does this extension mean?" — in one input, with
no friction, and is explicit that **an extension is a naming hint, not proof
of a file's real contents or safety.**

## Technology stack

- **[Astro](https://astro.build)** — static site generation, zero client JS by default
- **TypeScript** — strict mode, throughout the app and the dataset
- Vanilla client-side TypeScript for the interactive lookup (no React/Vue/etc.)
- **[Vitest](https://vitest.dev)** — unit tests for all business logic
- Deploys as a fully static site to **Cloudflare Pages**

## Project structure

```
src/
  components/     SiteHeader.astro, SiteFooter.astro (global chrome),
                   Lookup.astro, FAQ.astro, resultRenderer.ts (DOM rendering)
  layouts/        BaseLayout.astro (SEO meta, page shell, header/footer)
  config/
    site.ts       brand constants: name, domain, contact, sibling sites, default SEO keywords
  lib/
    calculations/ parseFilename.ts — pure filename parsing (no data, no DOM)
    utilities/    similarity.ts — Levenshtein "did you mean" suggestions
    validation/   filenameInput.ts — input sanitization
    lookup.ts     ties parsing + datasets together into one LookupResult
    types.ts      shared TypeScript types
  data/
    extensions.ts       the main extension dataset (150+ entries)
    ambiguous.ts        extensions with 2+ unrelated common meanings (.ts, .key, .pkg, .obj)
    dotfiles.ts         pure dotfiles (.gitignore, .env, ...)
    noExtensionFiles.ts known extensionless filenames (Dockerfile, README, ...)
    safetyNotes.ts       shared safety-guidance strings + the global disclaimer
    categories.ts        category/platform label constants
    faq.ts                FAQ copy (general, per-extension, and site/about FAQ)
  pages/
    index.astro                 the main tool
    file-extension/[ext].astro  one static SEO page per dataset entry
    faq.astro                   full FAQ (general + site/about questions)
    about.astro, contact.astro, privacy-policy.astro, terms.astro
    404.astro, 500.astro
    robots.txt.ts                dynamic robots.txt (always matches astro.config's `site`)
tests/            Vitest specs for parseFilename, lookup, and dataset integrity
public/
  _redirects      Cloudflare Pages redirect: /sitemap.xml -> /sitemap-index.xml
```

Business logic (`src/lib`) has no dependency on Astro or the DOM, so it's
directly unit-testable and reusable if the UI ever changes.

## How extension identification works

1. **Parsing** (`parseFilename.ts`) turns a raw string into one of:
   `empty`, `no-extension`, `dotfile`, or `extension` (with the resolved
   extension key, whether it's hidden, and whether it's a compound
   extension). This step never touches the dataset.
2. **Lookup** (`lookup.ts`) takes that parsed shape and checks, in order:
   ambiguous extensions → the main extension dataset → (for dotfiles/no
   extension) their respective small datasets → a graceful "unknown"
   fallback with closest-match suggestions.
3. Everything is synchronous and pure — the same code runs in the browser,
   in tests, and at build time for the static per-extension pages.

Handled edge cases (see `tests/parseFilename.test.ts` and
`tests/lookup.test.ts`): case-insensitivity, known compound extensions
(`.tar.gz`, `.tar.bz2`, `d.ts`, `min.js`, ...) vs. filenames that merely
contain multiple dots, hidden dotfiles with and without a real extension,
extensionless filenames (known and unknown), pasted file paths, and
genuinely ambiguous extensions (`.ts`, `.key`, `.pkg`, `.obj`) that are
shown as multiple candidates rather than a guessed single answer.

## Safety information vs. format information

This is a hard rule in the dataset and the UI, not just a design choice:

- Every result separates **format description** ("this is commonly a JPEG
  photo") from **safety guidance** ("media files are generally low-risk;
  keep your viewer updated").
- No entry ever states that an extension *proves* a file is safe or
  malicious — see `GLOBAL_SAFETY_DISCLAIMER` in `src/data/safetyNotes.ts`,
  shown on every result.
- Unknown extensions get an explicit fallback explaining that not being in
  the dataset doesn't make a file suspicious, and a familiar extension
  doesn't guarantee the file's real content matches it.

## Local development

```bash
npm install
npm run dev
```

## Testing

```bash
npm test          # run once
npm run test:watch
```

Tests cover `parseFilename` (parsing edge cases), `lookup` (end-to-end
lookup behavior), and dataset integrity (no duplicate keys, every
`conversions` target actually exists, compound entries are registered,
etc.) — so a copy-paste mistake in the dataset fails CI instead of shipping.

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # preview the production build locally
```

Run `npx astro check` to type-check the whole project (also install
`@astrojs/check` + `typescript` as dev dependencies if not already present).

## Deploying to Cloudflare Pages

1. Push this repository to GitHub/GitLab.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect
   to Git**, select the repo.
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Deploy. No environment variables or backend services are required.

**Before deploying**, update `SITE_URL` in `astro.config.mjs` **and**
`SITE.url`/`SITE.domain` in `src/config/site.ts` to your real production
domain (they're intentionally duplicated since Astro evaluates its config
before the rest of the app can be imported). Both feed canonical URLs, Open
Graph tags, and — since `robots.txt.ts` reads `astro.config`'s `site` at
build time — the `Sitemap:` line in `robots.txt` automatically follows.

### SEO files

- **Sitemap:** `@astrojs/sitemap` generates `sitemap-index.xml` (which lists
  `sitemap-0.xml`) at build time from every static route. `robots.txt`
  points at it. `/sitemap.xml` (the conventional URL some tools assume)
  301-redirects to `/sitemap-index.xml` via `public/_redirects` — a
  [Cloudflare Pages redirect rule](https://developers.cloudflare.com/pages/configuration/redirects/),
  since a real HTTP redirect isn't possible from a purely static page.
- **robots.txt:** generated by `src/pages/robots.txt.ts` instead of a static
  file, so its `Sitemap:` line can never drift out of sync with the
  configured domain.
- **Keywords:** `BaseLayout` accepts a `keywords` prop (merged with
  `DEFAULT_KEYWORDS` from `src/config/site.ts`) rendered as
  `<meta name="keywords">`. Per-extension pages auto-generate their own
  keyword set from the entry's name, category, and aliases.

## Adding or editing extensions

The dataset is plain TypeScript, so most changes don't need any UI work:

- **New extension:** add an entry to the `EXTENSIONS` array in
  `src/data/extensions.ts`.
- **New alias for an existing format** (e.g. another spelling of an
  existing extension): add it to that entry's `aliases` array — don't
  create a duplicate entry.
- **New compound extension** (like `.tar.gz`): add the entry to
  `extensions.ts` with `compound: true` and the dot-joined `ext`, **and**
  add that same key to `COMPOUND_EXTENSIONS` in
  `src/lib/calculations/parseFilename.ts`, or it won't be recognized as one
  unit.
- **New genuinely ambiguous extension** (two unrelated common meanings):
  add it to `src/data/ambiguous.ts` instead, as an `AmbiguousEntry` with 2+
  full candidate entries — keep it out of `extensions.ts` to avoid two
  sources of truth for the same key.
- **New dotfile / extensionless filename:** add to `src/data/dotfiles.ts` or
  `src/data/noExtensionFiles.ts` respectively.

`tests/extensions.dataset.test.ts` enforces dataset invariants (unique
keys, lowercase, non-empty required fields, valid conversion targets) —
run `npm test` after any dataset edit.

Every dataset entry also gets its own static SEO page automatically at
`/file-extension/<ext>/` via `src/pages/file-extension/[ext].astro` — no
extra work needed per entry.

## Assumptions & known limitations

- The dataset favors breadth of common, real-world extensions over
  exhaustive coverage of every format that has ever existed — it's designed
  to be easy to extend, not to be a complete registry.
- Per-extension static pages are generated only for canonical extension
  keys, not every alias (e.g. there's a page for `.jpg` but not a separate
  one for `.jpeg`) — this avoids duplicate-content SEO issues while keeping
  the dataset simple. Aliases are still recognized and resolved correctly
  by the lookup tool itself.
- This tool identifies file **formats** from **filenames**. It never
  inspects real file bytes/content (by design — no upload), so it cannot
  and does not make any claim about a specific file's actual, true content
  or safety.
- **Contact page is email-only, by design** — there's no backend to receive
  a form submission without contradicting the whole "no backend" premise of
  the tool, so it links a `mailto:` address and social profiles instead.
- **`/500.astro` is a static, informational page**, not a live error handler
  — static hosting (Cloudflare Pages) has no server-side process that could
  render it automatically on a real 5xx error the way a dynamic backend
  would. It exists so there's *something* reasonable to show if it's ever
  linked to directly, and to fulfill the review checklist's error-page
  expectations for an otherwise fully static site.
- Legal pages (Privacy Policy, Terms & Conditions) are written to accurately
  describe this specific app's actual data handling (no uploads, no
  first-party tracking) — review them yourself before relying on them as a
  substitute for real legal advice if requirements change (e.g. analytics or
  a backend are added later).
