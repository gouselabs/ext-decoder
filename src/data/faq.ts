import type { ExtensionEntry, FAQItem } from "../lib/types";
import { SITE } from "../config/site";

export const GENERAL_FAQ: FAQItem[] = [
  {
    question: "Is it safe to trust a file just because of its extension?",
    answer:
      "No. An extension is just text the file's creator chose to put after the last dot in its name — it's not verified or enforced by anything. A file can be renamed to any extension regardless of its real content. Use antivirus scanning and your judgment about the source, not the extension, to assess safety.",
  },
  {
    question: "How does this tool handle something like archive.tar.gz?",
    answer:
      'It recognizes known "compound" extensions such as .tar.gz, .tar.bz2, and .tar.xz as a single unit rather than only looking at the final ".gz" — so you get accurate information about the combined format instead of a partial answer.',
  },
  {
    question: "What about filenames with lots of dots, like report.v2.final.docx?",
    answer:
      "Only extension combinations we specifically recognize (like .tar.gz) are treated as compound. Anything else falls back to the very last segment after the final dot, so report.v2.final.docx is correctly read as a .docx file, not \".final.docx\".",
  },
  {
    question: "What happens with hidden files like .gitignore or .env?",
    answer:
      "Files that start with a dot and have no other dot (like .gitignore) are recognized as \"dotfiles\" in their own right, since the whole name is their identity rather than a base name plus extension. Hidden files that do have a real extension, like .eslintrc.json, are still analyzed by that extension and flagged as hidden.",
  },
  {
    question: "What if my file has no extension at all, like Makefile or README?",
    answer:
      "We check the exact filename against a list of well-known extensionless conventions (Makefile, Dockerfile, README, LICENSE, and similar). If it's not on that list, we say so plainly rather than guessing — a name with no extension genuinely carries no format information.",
  },
  {
    question: "What if my extension isn't in your database?",
    answer:
      "You'll get a clear fallback explaining that the extension isn't recognized yet, along with a close-match suggestion if your input looks like a likely typo of a known extension. An unrecognized extension isn't inherently suspicious — it may just be rare or new.",
  },
  {
    question: "Does this tool upload my filename anywhere?",
    answer:
      "No. Everything — parsing the filename and looking up its extension — runs entirely in your browser using a bundled, static dataset. Nothing is sent to a server, logged, or stored.",
  },
];

/** About-the-site questions, shown after GENERAL_FAQ on the dedicated /faq/ page. */
export const SITE_FAQ: FAQItem[] = [
  {
    question: `What is ${SITE.name}?`,
    answer: `${SITE.name} is a free, browser-only tool that explains what a file extension means — its file type, typical purpose, common software, and safety guidance — without uploading anything or requiring an account.`,
  },
  {
    question: `Is ${SITE.name} free to use?`,
    answer: "Yes, completely free, with no account, subscription, or usage limit.",
  },
  {
    question: "Who built this and why?",
    answer: `${SITE.name} is built and maintained by ${SITE.parentBrand}, a small collection of practical, privacy-first web tools. It exists because "what does this file extension mean, and is it safe to open" is a genuinely common question that shouldn't require uploading a file anywhere to answer.`,
  },
  {
    question: "Do you store or track what I type into the search box?",
    answer:
      "No. There's no analytics tied to individual lookups, no server-side logging of filenames, and no cookies used for tracking. See our Privacy Policy for the full details.",
  },
  {
    question: "I found an incorrect or missing file extension — how do I report it?",
    answer: "Please reach out via the Contact page. The extension dataset is maintained by hand, so corrections and additions are genuinely useful.",
  },
];

export function buildExtensionFAQ(entry: ExtensionEntry): FAQItem[] {
  return [
    {
      question: `What is a .${entry.ext} file?`,
      answer: entry.description,
    },
    {
      question: `Can I edit a .${entry.ext} file?`,
      answer:
        entry.editable === "yes"
          ? `Yes — .${entry.ext} files are commonly editable with software such as ${entry.software[0]}.`
          : entry.editable === "partial"
            ? `Partially. .${entry.ext} files can be edited with the right tool (such as ${entry.software[0]}), but not with just any text editor.`
            : `Not directly as text — .${entry.ext} is a runnable or packaged format, not one meant for manual editing.`,
    },
    {
      question: `Does having a .${entry.ext} extension mean the file is safe?`,
      answer:
        "No single extension can guarantee that. " +
        entry.safetyNote +
        " Always consider where the file came from, not just its name.",
    },
  ];
}
