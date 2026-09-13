import { describe, expect, it } from "vitest";
import { lookupFilename } from "../src/lib/lookup";

describe("lookupFilename", () => {
  it("returns empty for blank input", () => {
    expect(lookupFilename("")).toEqual({ type: "empty" });
    expect(lookupFilename("   ")).toEqual({ type: "empty" });
  });

  it("finds a simple, common extension", () => {
    const result = lookupFilename("photo.heic");
    expect(result.type).toBe("known");
    if (result.type === "known") {
      expect(result.entry.ext).toBe("heic");
      expect(result.entry.category).toBe("Image");
    }
  });

  it("is case-insensitive when resolving the extension", () => {
    const lower = lookupFilename("video.mkv");
    const upper = lookupFilename("VIDEO.MKV");
    expect(lower.type).toBe("known");
    expect(upper.type).toBe("known");
    if (lower.type === "known" && upper.type === "known") {
      expect(lower.entry).toBe(upper.entry);
      expect(lower.extension).toBe(upper.extension);
    }
  });

  it("resolves an alias to its canonical entry", () => {
    const jpg = lookupFilename("a.jpg");
    const jpeg = lookupFilename("a.jpeg");
    expect(jpg.type).toBe("known");
    expect(jpeg.type).toBe("known");
    if (jpg.type === "known" && jpeg.type === "known") {
      expect(jpg.entry).toBe(jpeg.entry);
    }
  });

  it("resolves a compound extension like .tar.gz", () => {
    const result = lookupFilename("archive.tar.gz");
    expect(result.type).toBe("known");
    if (result.type === "known") {
      expect(result.entry.ext).toBe("tar.gz");
      expect(result.isCompound).toBe(true);
    }
  });

  it("resolves the tgz alias to the same tar.gz entry", () => {
    const tgz = lookupFilename("archive.tgz");
    const targz = lookupFilename("archive.tar.gz");
    expect(tgz.type).toBe("known");
    expect(targz.type).toBe("known");
    if (tgz.type === "known" && targz.type === "known") {
      expect(tgz.entry).toBe(targz.entry);
    }
  });

  it("flags a known dotfile", () => {
    const result = lookupFilename(".gitignore");
    expect(result.type).toBe("dotfile");
    if (result.type === "dotfile") {
      expect(result.entry).not.toBeNull();
      expect(result.entry?.name).toContain("Git Ignore");
    }
  });

  it("falls back gracefully for an unrecognized dotfile", () => {
    const result = lookupFilename(".someveryobscurerc");
    expect(result.type).toBe("dotfile");
    if (result.type === "dotfile") {
      expect(result.entry).toBeNull();
    }
  });

  it("flags a known extensionless filename", () => {
    const result = lookupFilename("Dockerfile");
    expect(result.type).toBe("no-extension");
    if (result.type === "no-extension") {
      expect(result.knownFile?.name).toBe("Dockerfile");
    }
  });

  it("falls back gracefully for an unrecognized extensionless filename", () => {
    const result = lookupFilename("SomeRandomFile");
    expect(result.type).toBe("no-extension");
    if (result.type === "no-extension") {
      expect(result.knownFile).toBeNull();
    }
  });

  it("returns every candidate for an ambiguous extension", () => {
    const result = lookupFilename("recording.ts");
    expect(result.type).toBe("ambiguous");
    if (result.type === "ambiguous") {
      expect(result.candidates.length).toBeGreaterThanOrEqual(2);
      const names = result.candidates.map((c) => c.name);
      expect(names.some((n) => n.includes("TypeScript"))).toBe(true);
      expect(names.some((n) => n.includes("Transport Stream"))).toBe(true);
    }
  });

  it("returns unknown with suggestions for a near-miss typo", () => {
    const result = lookupFilename("photo.jpgg");
    expect(result.type).toBe("unknown");
    if (result.type === "unknown") {
      expect(result.suggestions).toContain("jpg");
    }
  });

  it("returns unknown with no crash for a totally made-up extension", () => {
    const result = lookupFilename("file.qqqzzzxyz");
    expect(result.type).toBe("unknown");
    if (result.type === "unknown") {
      expect(result.extension).toBe("qqqzzzxyz");
    }
  });

  it("marks hidden files with a real extension as hidden", () => {
    const result = lookupFilename(".config.json");
    expect(result.type).toBe("known");
    if (result.type === "known") {
      expect(result.isHidden).toBe(true);
      expect(result.entry.ext).toBe("json");
    }
  });
});
