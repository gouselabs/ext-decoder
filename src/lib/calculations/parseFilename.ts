// Pure, framework-free logic for turning a raw filename string into a
// structured description of its extension. No dataset lookups happen here —
// this only figures out *which key* to look up, handling:
//   - case-insensitivity
//   - compound extensions (archive.tar.gz -> "tar.gz", not "gz")
//   - hidden/dotfiles (.gitignore, .env, .config.json)
//   - filenames with multiple dots (my.final.report.v2.docx)
//   - filenames with no extension at all (Makefile, README)
//   - pasted paths (C:\photos\img.jpg or /home/user/img.jpg)

/**
 * Known multi-segment extensions. Only these combinations are treated as a
 * single compound extension — everything else falls back to the last
 * dot-segment, so "my.file.txt" is NOT misread as extension "file.txt".
 */
export const COMPOUND_EXTENSIONS: ReadonlySet<string> = new Set([
  "tar.gz",
  "tar.bz2",
  "tar.xz",
  "tar.z",
  "tar.lz",
  "tar.zst",
  "d.ts",
  "d.mts",
  "d.cts",
  "min.js",
  "min.css",
  "user.js",
  "spec.ts",
  "spec.js",
  "test.ts",
  "test.js",
]);

/** Longest compound extension is 2 dot-segments in the current dataset; checked longest-first. */
const COMPOUND_SEGMENT_LENGTHS = [3, 2];

export type ParsedFilename =
  | { kind: "empty" }
  | { kind: "no-extension"; baseName: string; lookupKey: string }
  | { kind: "dotfile"; baseName: string; lookupKey: string }
  | { kind: "extension"; baseName: string; extension: string; isCompound: boolean; isHidden: boolean };

function stripPath(input: string): string {
  const segments = input.split(/[\\/]/).filter(Boolean);
  return segments.length > 0 ? segments[segments.length - 1] : input;
}

/**
 * Given the non-hidden portion of a filename, find its extension using the
 * longest-known-compound-first strategy.
 */
function extractExtension(rest: string): { extension: string; isCompound: boolean } {
  const segments = rest.split(".");
  if (segments.length <= 1) {
    return { extension: "", isCompound: false };
  }

  const lowerSegments = segments.map((s) => s.toLowerCase());

  for (const len of COMPOUND_SEGMENT_LENGTHS) {
    if (lowerSegments.length > len) {
      const candidate = lowerSegments.slice(-len).join(".");
      if (COMPOUND_EXTENSIONS.has(candidate)) {
        return { extension: candidate, isCompound: true };
      }
    }
  }

  return { extension: lowerSegments[lowerSegments.length - 1], isCompound: false };
}

export function parseFilename(raw: string): ParsedFilename {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { kind: "empty" };
  }

  const baseName = stripPath(trimmed);
  if (!baseName) {
    return { kind: "empty" };
  }

  const startsWithDot = baseName.startsWith(".") && baseName.length > 1;

  if (startsWithDot) {
    const rest = baseName.slice(1);
    if (!rest.includes(".")) {
      // Pure dotfile, e.g. ".gitignore", ".env" — the whole name is the identity.
      return { kind: "dotfile", baseName, lookupKey: baseName.toLowerCase() };
    }
    // Hidden file that also has a real extension, e.g. ".eslintrc.json".
    const { extension, isCompound } = extractExtension(rest);
    if (!extension) {
      return { kind: "dotfile", baseName, lookupKey: baseName.toLowerCase() };
    }
    return { kind: "extension", baseName, extension, isCompound, isHidden: true };
  }

  const { extension, isCompound } = extractExtension(baseName);
  if (!extension) {
    return { kind: "no-extension", baseName, lookupKey: baseName.toLowerCase() };
  }

  return { kind: "extension", baseName, extension, isCompound, isHidden: false };
}
