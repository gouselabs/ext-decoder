// Extensions that genuinely mean two (or more) common, unrelated things.
// A filename alone can't disambiguate these — the lookup UI shows every
// candidate rather than silently guessing one.
//
// Keep entries here OUT of extensions.ts to avoid two sources of truth for
// the same key. See tests/extensions.dataset.test.ts for the cross-check.

import { CATEGORY, PLATFORM } from "./categories";
import { SAFETY_NOTE } from "./safetyNotes";
import type { AmbiguousEntry } from "../lib/types";

const ALL_DESKTOP = [PLATFORM.WINDOWS, PLATFORM.MAC, PLATFORM.LINUX];

export const AMBIGUOUS_EXTENSIONS: AmbiguousEntry[] = [
  {
    ext: "ts",
    candidates: [
      {
        ext: "ts",
        aliases: [],
        name: "TypeScript Source Code",
        category: CATEGORY.CODE,
        description: "Source code written in TypeScript, a typed superset of JavaScript that compiles down to plain JavaScript.",
        software: ["Visual Studio Code", "Node.js toolchain", "Any text editor"],
        platforms: ALL_DESKTOP,
        editable: "yes",
        viewable: true,
        conversions: ["js"],
        safetyNote: SAFETY_NOTE.CODE,
        riskLevel: "low",
      },
      {
        ext: "ts",
        aliases: [],
        name: "MPEG Transport Stream (Video)",
        category: CATEGORY.VIDEO,
        description:
          "A video container format used for broadcast television and streaming, capable of carrying multiple audio/video streams.",
        software: ["VLC", "FFmpeg"],
        platforms: ALL_DESKTOP,
        editable: "partial",
        viewable: true,
        conversions: ["mp4"],
        safetyNote: SAFETY_NOTE.MEDIA,
        riskLevel: "low",
      },
    ],
  },
  {
    ext: "key",
    candidates: [
      {
        ext: "key",
        aliases: [],
        name: "Apple Keynote Presentation",
        category: CATEGORY.PRESENTATION,
        description: "Apple's native presentation format for the Keynote app, part of the iWork suite.",
        software: ["Keynote (macOS/iOS)", "Keynote for iCloud"],
        platforms: [PLATFORM.MAC, PLATFORM.IOS, PLATFORM.WEB],
        editable: "yes",
        viewable: true,
        conversions: ["pptx", "pdf"],
        safetyNote: SAFETY_NOTE.DOCUMENT,
        riskLevel: "low",
      },
      {
        ext: "key",
        aliases: [],
        name: "Private Key File",
        category: CATEGORY.SECURITY,
        description: "A cryptographic private key, typically used for TLS/SSL, SSH, or code signing.",
        software: ["OpenSSL", "SSH clients", "Web servers (Apache, nginx)"],
        platforms: ALL_DESKTOP,
        editable: "no",
        viewable: false,
        conversions: [],
        safetyNote: SAFETY_NOTE.SECURITY,
        riskLevel: "high",
      },
    ],
  },
  {
    ext: "obj",
    candidates: [
      {
        ext: "obj",
        aliases: [],
        name: "Wavefront 3D Model",
        category: CATEGORY.CAD,
        description: "A simple, widely-supported text-based 3D model format describing geometry, often paired with a companion .mtl material file.",
        software: ["Blender", "Autodesk Maya", "Any 3D modeling app"],
        platforms: ALL_DESKTOP,
        editable: "yes",
        viewable: true,
        conversions: ["fbx", "stl"],
        safetyNote: SAFETY_NOTE.DOCUMENT,
        riskLevel: "low",
      },
      {
        ext: "obj",
        aliases: [],
        name: "Compiled Object File",
        category: CATEGORY.CODE,
        description: "Machine code produced by compiling a C, C++, or similar source file, not yet linked into a final executable or library.",
        software: ["Produced by compilers (GCC, Clang, MSVC); used by linkers"],
        platforms: ALL_DESKTOP,
        editable: "no",
        viewable: false,
        conversions: [],
        safetyNote: SAFETY_NOTE.EXECUTABLE,
        riskLevel: "medium",
      },
    ],
  },
  {
    ext: "pkg",
    candidates: [
      {
        ext: "pkg",
        aliases: [],
        name: "macOS Installer Package",
        category: CATEGORY.EXECUTABLE,
        description: "An installer format for macOS that can run scripts and place files anywhere on the system during installation.",
        software: ["Installer (macOS, built-in)"],
        platforms: [PLATFORM.MAC],
        editable: "no",
        viewable: false,
        conversions: [],
        safetyNote: SAFETY_NOTE.EXECUTABLE,
        riskLevel: "high",
      },
      {
        ext: "pkg",
        aliases: [],
        name: "Generic Software Package",
        category: CATEGORY.EXECUTABLE,
        description:
          "Used as a package format by several other systems too (e.g. Unix pkg tools, some game mod packages, Unity asset packages). The exact contents depend entirely on which tool created it.",
        software: ["Varies by platform/tool"],
        platforms: ALL_DESKTOP,
        editable: "no",
        viewable: false,
        conversions: [],
        safetyNote: SAFETY_NOTE.EXECUTABLE,
        riskLevel: "medium",
      },
    ],
  },
];
