import { describe, expect, it } from "vitest";
import { EXTENSIONS } from "../src/data/extensions";
import { AMBIGUOUS_EXTENSIONS } from "../src/data/ambiguous";
import { DOTFILES } from "../src/data/dotfiles";
import { NO_EXTENSION_FILES } from "../src/data/noExtensionFiles";
import { COMPOUND_EXTENSIONS } from "../src/lib/calculations/parseFilename";

describe("EXTENSIONS dataset integrity", () => {
  it("has a sizeable, non-trivial dataset", () => {
    expect(EXTENSIONS.length).toBeGreaterThan(100);
  });

  it("has no duplicate `ext` or alias keys across the whole dataset", () => {
    const seen = new Map<string, string>();
    for (const entry of EXTENSIONS) {
      const keys = [entry.ext, ...entry.aliases];
      for (const key of keys) {
        expect(seen.has(key), `Duplicate key "${key}" (already used by "${seen.get(key)}", now also "${entry.ext}")`).toBe(false);
        seen.set(key, entry.ext);
      }
    }
  });

  it("every `ext` and alias is lowercase with no leading dot", () => {
    for (const entry of EXTENSIONS) {
      for (const key of [entry.ext, ...entry.aliases]) {
        expect(key).toBe(key.toLowerCase());
        expect(key.startsWith(".")).toBe(false);
      }
    }
  });

  it("every entry has non-empty required fields", () => {
    for (const entry of EXTENSIONS) {
      expect(entry.name.length).toBeGreaterThan(0);
      expect(entry.category.length).toBeGreaterThan(0);
      expect(entry.description.length).toBeGreaterThan(10);
      expect(entry.software.length).toBeGreaterThan(0);
      expect(entry.platforms.length).toBeGreaterThan(0);
      expect(entry.safetyNote.length).toBeGreaterThan(10);
      expect(["low", "medium", "high"]).toContain(entry.riskLevel);
      expect(["yes", "no", "partial"]).toContain(entry.editable);
    }
  });

  it("every compound-flagged entry's key is registered in COMPOUND_EXTENSIONS", () => {
    for (const entry of EXTENSIONS) {
      if (entry.compound) {
        expect(COMPOUND_EXTENSIONS.has(entry.ext)).toBe(true);
      }
    }
  });

  it("every conversion target refers to a real, known extension key", () => {
    const allKeys = new Set(EXTENSIONS.flatMap((e) => [e.ext, ...e.aliases]));
    for (const entry of EXTENSIONS) {
      for (const target of entry.conversions) {
        expect(allKeys.has(target), `"${entry.ext}" lists unknown conversion target "${target}"`).toBe(true);
      }
    }
  });

  it("does not duplicate any key already used by an ambiguous extension", () => {
    const ambiguousKeys = new Set(AMBIGUOUS_EXTENSIONS.map((a) => a.ext));
    for (const entry of EXTENSIONS) {
      for (const key of [entry.ext, ...entry.aliases]) {
        expect(ambiguousKeys.has(key), `"${key}" is defined both in EXTENSIONS and AMBIGUOUS_EXTENSIONS`).toBe(false);
      }
    }
  });
});

describe("AMBIGUOUS_EXTENSIONS dataset integrity", () => {
  it("every ambiguous extension has at least 2 distinct candidates", () => {
    for (const entry of AMBIGUOUS_EXTENSIONS) {
      expect(entry.candidates.length).toBeGreaterThanOrEqual(2);
      const names = new Set(entry.candidates.map((c) => c.name));
      expect(names.size).toBe(entry.candidates.length);
    }
  });

  it("every candidate's `ext` matches its parent key", () => {
    for (const entry of AMBIGUOUS_EXTENSIONS) {
      for (const candidate of entry.candidates) {
        expect(candidate.ext).toBe(entry.ext);
      }
    }
  });
});

describe("DOTFILES dataset integrity", () => {
  it("has no duplicate keys", () => {
    const seen = new Set<string>();
    for (const entry of DOTFILES) {
      expect(seen.has(entry.key)).toBe(false);
      seen.add(entry.key);
    }
  });

  it("every key is lowercase and starts with a dot", () => {
    for (const entry of DOTFILES) {
      expect(entry.key).toBe(entry.key.toLowerCase());
      expect(entry.key.startsWith(".")).toBe(true);
    }
  });
});

describe("NO_EXTENSION_FILES dataset integrity", () => {
  it("has no duplicate keys", () => {
    const seen = new Set<string>();
    for (const entry of NO_EXTENSION_FILES) {
      expect(seen.has(entry.key)).toBe(false);
      seen.add(entry.key);
    }
  });

  it("every key is lowercase with no dots", () => {
    for (const entry of NO_EXTENSION_FILES) {
      expect(entry.key).toBe(entry.key.toLowerCase());
      expect(entry.key.includes(".")).toBe(false);
    }
  });
});
