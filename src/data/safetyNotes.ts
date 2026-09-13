// Reusable, category-level safety guidance strings.
//
// IMPORTANT: none of these claim that an extension proves a file is safe or
// malicious. They describe what the *format* is generally capable of. Actual
// safety depends on the real file contents and its source, which a filename
// can never guarantee — see GLOBAL_SAFETY_DISCLAIMER in lookup.ts.

export const SAFETY_NOTE = {
  MEDIA:
    "Media files are generally low-risk to open with trusted, up-to-date software. Keep your viewer/player updated, since any file format can theoretically be crafted to exploit a buggy app.",
  DOCUMENT:
    "Plain documents are generally low-risk to view. If the format supports macros or embedded scripts, keep them disabled unless you specifically expect and trust them.",
  MACRO_DOCUMENT:
    "This format can contain macros or embedded scripts that run code when enabled. Keep macros disabled unless you trust the source and specifically expect them.",
  ARCHIVE:
    "Archives can contain any type of file, including executables or scripts, inside them. Check what's inside — ideally with an up-to-date antivirus scan — before opening extracted contents.",
  DISK_IMAGE:
    "Disk images can contain an entire file system, including installers or executables. Treat the contents with the same caution you'd give any downloaded software.",
  EXECUTABLE:
    "This runs code directly on your system when opened. Only install or run software from sources you trust, and consider scanning it with antivirus software first.",
  SCRIPT:
    "Scripts can run commands on your computer when executed. Only run scripts from sources you trust, and review the contents in a text editor first if you're unsure.",
  CODE:
    "Source code is plain text and doesn't execute on its own — it has to be compiled or run by a specific tool, which is where any real risk would occur.",
  FONT:
    "Fonts are rendered by the operating system or an app and carry generally low risk. Still, only install fonts from sources you trust.",
  DATABASE:
    "Database files store structured data and don't execute on their own, but the software that opens them may run embedded queries. Only open databases from sources you trust.",
  CONFIG:
    "This is a plain-text configuration or data format with no built-in ability to execute code on its own.",
  SECURITY:
    "Contains cryptographic key, certificate, or credential material. Handle private keys and credentials carefully, and never share them with anyone you don't fully trust.",
  VM:
    "Virtual machine files can contain an entire guest operating system, including any software installed on it. Only import VM images from sources you trust.",
  GENERIC:
    "A generic or catch-all format. What it can actually do depends entirely on the application that created it — treat it with the same caution as any file from an untrusted source.",
} as const;

/**
 * Shown once, prominently, wherever extension results are displayed. This is
 * the single source of truth for the "format info is not a safety guarantee"
 * message — individual entries should stay short and defer to this.
 */
export const GLOBAL_SAFETY_DISCLAIMER =
  "A file extension is just a naming hint chosen by whoever created the file — it is not a guarantee of what the file actually contains. Extensions can be spoofed, and a file can be renamed to look like any type. This tool describes the file *format* commonly associated with an extension; it cannot and does not verify the real contents of any specific file, and it cannot tell you whether a particular file is safe or malicious. Only open files from sources you trust, and use up-to-date antivirus software for anything downloaded from the internet.";
