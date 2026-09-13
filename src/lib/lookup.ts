// Combines the static datasets with parseFilename() to produce a single
// typed result the UI can render. All logic here is pure and synchronous —
// no network calls, no browser APIs — so it runs identically in tests,
// during static-page generation, and in the browser.

import { EXTENSIONS } from "../data/extensions";
import { AMBIGUOUS_EXTENSIONS } from "../data/ambiguous";
import { DOTFILES } from "../data/dotfiles";
import { NO_EXTENSION_FILES } from "../data/noExtensionFiles";
import { parseFilename } from "./calculations/parseFilename";
import { findClosestMatches } from "./utilities/similarity";
import type { AmbiguousEntry, DotfileEntry, ExtensionEntry, NoExtensionEntry } from "./types";

export type LookupResult =
  | { type: "empty" }
  | { type: "no-extension"; baseName: string; knownFile: NoExtensionEntry | null }
  | { type: "dotfile"; baseName: string; entry: DotfileEntry | null; extensionFallback: string }
  | { type: "ambiguous"; baseName: string; extension: string; isHidden: boolean; candidates: ExtensionEntry[] }
  | { type: "known"; baseName: string; extension: string; isHidden: boolean; isCompound: boolean; entry: ExtensionEntry }
  | { type: "unknown"; baseName: string; extension: string; isHidden: boolean; suggestions: string[] };

// --- Build lookup indexes once, at module load. -----------------------------

const EXTENSION_INDEX: Map<string, ExtensionEntry> = new Map();
for (const entry of EXTENSIONS) {
  EXTENSION_INDEX.set(entry.ext, entry);
  for (const alias of entry.aliases) {
    EXTENSION_INDEX.set(alias, entry);
  }
}

const AMBIGUOUS_INDEX: Map<string, AmbiguousEntry> = new Map(AMBIGUOUS_EXTENSIONS.map((entry) => [entry.ext, entry]));

const DOTFILE_INDEX: Map<string, DotfileEntry> = new Map(DOTFILES.map((entry) => [entry.key, entry]));

const NO_EXTENSION_INDEX: Map<string, NoExtensionEntry> = new Map(NO_EXTENSION_FILES.map((entry) => [entry.key, entry]));

const ALL_KNOWN_EXTENSION_KEYS: string[] = [...EXTENSION_INDEX.keys(), ...AMBIGUOUS_INDEX.keys()];

// --- Public API --------------------------------------------------------------

export function lookupFilename(rawInput: string): LookupResult {
  const parsed = parseFilename(rawInput);

  switch (parsed.kind) {
    case "empty":
      return { type: "empty" };

    case "no-extension": {
      const knownFile = NO_EXTENSION_INDEX.get(parsed.lookupKey) ?? null;
      return { type: "no-extension", baseName: parsed.baseName, knownFile };
    }

    case "dotfile": {
      const entry = DOTFILE_INDEX.get(parsed.lookupKey) ?? null;
      // A dotfile's key includes the leading dot (".gitignore"); strip it for
      // a friendlier "here's what that would mean as a regular extension" fallback.
      const extensionFallback = parsed.lookupKey.slice(1);
      return { type: "dotfile", baseName: parsed.baseName, entry, extensionFallback };
    }

    case "extension": {
      const { baseName, extension, isCompound, isHidden } = parsed;

      const ambiguous = AMBIGUOUS_INDEX.get(extension);
      if (ambiguous) {
        return { type: "ambiguous", baseName, extension, isHidden, candidates: ambiguous.candidates };
      }

      const known = EXTENSION_INDEX.get(extension);
      if (known) {
        return { type: "known", baseName, extension, isHidden, isCompound, entry: known };
      }

      const suggestions = findClosestMatches(extension, ALL_KNOWN_EXTENSION_KEYS);
      return { type: "unknown", baseName, extension, isHidden, suggestions };
    }
  }
}

export { GLOBAL_SAFETY_DISCLAIMER } from "../data/safetyNotes";
