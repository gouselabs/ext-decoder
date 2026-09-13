// Shared type definitions for the file-extension dataset and lookup engine.
// Keep this file free of any data or UI concerns — types only.

export type EditableStatus = "yes" | "no" | "partial";
export type RiskLevel = "low" | "medium" | "high";

/**
 * A single, fully-described file extension entry.
 * `ext` is the canonical lookup key: lowercase, no leading dot.
 * Compound extensions (e.g. "tar.gz") use a dot-joined key of their parts.
 */
export interface ExtensionEntry {
  ext: string;
  /** Other extensions that mean the same format (e.g. "jpeg" for "jpg"). Lowercase, no leading dot. */
  aliases: string[];
  name: string;
  category: string;
  description: string;
  software: string[];
  platforms: string[];
  editable: EditableStatus;
  viewable: boolean;
  /** Extensions (canonical keys) this format is commonly converted to/from. */
  conversions: string[];
  /** Short, category-level safety guidance. Never a claim that the extension proves safety or danger. */
  safetyNote: string;
  riskLevel: RiskLevel;
  mimeTypes?: string[];
  /** True when this key represents a compound extension such as "tar.gz". */
  compound?: boolean;
}

/** A dotfile with no "real" extension — the whole name (with leading dot) is the identity. */
export interface DotfileEntry {
  key: string; // e.g. ".gitignore", lowercase, includes leading dot
  name: string;
  category: string;
  description: string;
  software: string[];
  platforms: string[];
  editable: EditableStatus;
  viewable: boolean;
  safetyNote: string;
  riskLevel: RiskLevel;
}

/** A well-known filename that conventionally has no extension at all. */
export interface NoExtensionEntry {
  key: string; // lowercase filename, e.g. "dockerfile"
  name: string;
  category: string;
  description: string;
  software: string[];
  platforms: string[];
  editable: EditableStatus;
  viewable: boolean;
  safetyNote: string;
  riskLevel: RiskLevel;
}

/**
 * Some extensions genuinely mean different things depending on context a filename
 * alone can't reveal (e.g. ".ts" is TypeScript source OR an MPEG transport stream).
 * These are looked up separately and shown as multiple candidates rather than
 * silently guessing one.
 */
export interface AmbiguousEntry {
  ext: string;
  candidates: ExtensionEntry[];
}

export interface FAQItem {
  question: string;
  answer: string;
}
