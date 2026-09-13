// Canonical category labels, defined once so dataset entries can't typo a category name.

export const CATEGORY = {
  IMAGE: "Image",
  VECTOR: "Vector Image",
  VIDEO: "Video",
  AUDIO: "Audio",
  DOCUMENT: "Document",
  SPREADSHEET: "Spreadsheet",
  PRESENTATION: "Presentation",
  EBOOK: "Ebook",
  ARCHIVE: "Archive",
  DISK_IMAGE: "Disk Image",
  EXECUTABLE: "Executable / Installer",
  SCRIPT: "Script",
  CODE: "Source Code",
  WEB: "Web",
  FONT: "Font",
  DATABASE: "Database",
  CONFIG: "Configuration",
  DATA: "Data",
  CAD: "3D & CAD",
  SUBTITLE: "Subtitle",
  BACKUP: "Backup",
  VM: "Virtual Machine",
  SECURITY: "Security & Certificates",
  TORRENT: "Torrent",
  GAME: "Game",
  DESIGN: "Design",
  MISC: "Generic / Miscellaneous",
} as const;

export type Category = (typeof CATEGORY)[keyof typeof CATEGORY];

export const PLATFORM = {
  WINDOWS: "Windows",
  MAC: "macOS",
  LINUX: "Linux",
  ANDROID: "Android",
  IOS: "iOS",
  WEB: "Web / Cross-platform",
} as const;
