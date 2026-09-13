import { describe, expect, it } from "vitest";
import { parseFilename } from "../src/lib/calculations/parseFilename";

describe("parseFilename", () => {
  it("handles empty and whitespace-only input", () => {
    expect(parseFilename("")).toEqual({ kind: "empty" });
    expect(parseFilename("   ")).toEqual({ kind: "empty" });
  });

  it("parses a simple extension", () => {
    const result = parseFilename("photo.jpg");
    expect(result).toEqual({ kind: "extension", baseName: "photo.jpg", extension: "jpg", isCompound: false, isHidden: false });
  });

  it("is case-insensitive", () => {
    const result = parseFilename("PHOTO.JPG");
    expect(result.kind).toBe("extension");
    if (result.kind === "extension") {
      expect(result.extension).toBe("jpg");
    }
  });

  it("recognizes known compound extensions like tar.gz", () => {
    const result = parseFilename("archive.tar.gz");
    expect(result).toEqual({ kind: "extension", baseName: "archive.tar.gz", extension: "tar.gz", isCompound: true, isHidden: false });
  });

  it("does not falsely compound unrelated multi-dot filenames", () => {
    const result = parseFilename("my.final.report.docx");
    expect(result.kind).toBe("extension");
    if (result.kind === "extension") {
      expect(result.extension).toBe("docx");
      expect(result.isCompound).toBe(false);
    }
  });

  it("handles many dots with a real compound suffix", () => {
    const result = parseFilename("2024.q1.data.dump.tar.bz2");
    expect(result.kind).toBe("extension");
    if (result.kind === "extension") {
      expect(result.extension).toBe("tar.bz2");
      expect(result.isCompound).toBe(true);
    }
  });

  it("treats a pure dotfile as its own identity", () => {
    const result = parseFilename(".gitignore");
    expect(result).toEqual({ kind: "dotfile", baseName: ".gitignore", lookupKey: ".gitignore" });
  });

  it("lowercases dotfile lookup keys", () => {
    const result = parseFilename(".ENV");
    expect(result).toEqual({ kind: "dotfile", baseName: ".ENV", lookupKey: ".env" });
  });

  it("finds a real extension inside a hidden file with multiple dots", () => {
    const result = parseFilename(".eslintrc.json");
    expect(result).toEqual({ kind: "extension", baseName: ".eslintrc.json", extension: "json", isCompound: false, isHidden: true });
  });

  it("handles filenames with no extension", () => {
    const result = parseFilename("README");
    expect(result).toEqual({ kind: "no-extension", baseName: "README", lookupKey: "readme" });
  });

  it("handles Dockerfile (no extension, mixed case)", () => {
    const result = parseFilename("Dockerfile");
    expect(result).toEqual({ kind: "no-extension", baseName: "Dockerfile", lookupKey: "dockerfile" });
  });

  it("strips a Windows-style path down to the basename", () => {
    const result = parseFilename("C:\\Users\\me\\Documents\\report.pdf");
    expect(result.kind).toBe("extension");
    if (result.kind === "extension") {
      expect(result.baseName).toBe("report.pdf");
      expect(result.extension).toBe("pdf");
    }
  });

  it("strips a POSIX-style path down to the basename", () => {
    const result = parseFilename("/home/me/archive.tar.gz");
    expect(result.kind).toBe("extension");
    if (result.kind === "extension") {
      expect(result.baseName).toBe("archive.tar.gz");
      expect(result.extension).toBe("tar.gz");
    }
  });

  it("trims surrounding whitespace from pasted input", () => {
    const result = parseFilename("  video.mkv  ");
    expect(result.kind).toBe("extension");
    if (result.kind === "extension") {
      expect(result.baseName).toBe("video.mkv");
    }
  });

  it("handles an unknown extension gracefully", () => {
    const result = parseFilename("mystery.xyzabc");
    expect(result).toEqual({ kind: "extension", baseName: "mystery.xyzabc", extension: "xyzabc", isCompound: false, isHidden: false });
  });

  it("handles a filename that is only a dot", () => {
    const result = parseFilename(".");
    expect(result.kind).toBe("no-extension");
  });

  it("treats a trailing dot with no extension text as no-extension", () => {
    const result = parseFilename("archive.");
    expect(result.kind).toBe("no-extension");
  });
});
