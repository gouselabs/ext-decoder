// DOM rendering for a LookupResult. Deliberately built with createElement/
// textContent throughout (never innerHTML) so user-typed filenames can never
// be interpreted as markup, regardless of what characters they contain.

import type { LookupResult } from "../lib/lookup";
import { GLOBAL_SAFETY_DISCLAIMER } from "../lib/lookup";
import type { ExtensionEntry, DotfileEntry, NoExtensionEntry, RiskLevel } from "../lib/types";

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options?: { className?: string; text?: string },
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (options?.className) node.className = options.className;
  if (options?.text !== undefined) node.textContent = options.text;
  return node;
}

function riskLabel(risk: RiskLevel): string {
  switch (risk) {
    case "low":
      return "Generally low risk";
    case "medium":
      return "Use some caution";
    case "high":
      return "Handle with care";
  }
}

function editableLabel(status: ExtensionEntry["editable"]): string {
  switch (status) {
    case "yes":
      return "Yes, with common software";
    case "partial":
      return "Partially / with the right tool";
    case "no":
      return "Not really — it's a runnable or packaged format";
  }
}

function tagList(items: string[]): HTMLUListElement {
  const list = el("ul", { className: "tag-list" });
  for (const item of items) {
    const li = el("li", { text: item });
    list.appendChild(li);
  }
  return list;
}

function fact(term: string, valueNode: Node): HTMLDivElement {
  const wrapper = el("div", { className: "fact" });
  const dt = el("dt", { text: term });
  const dd = el("dd");
  dd.appendChild(valueNode);
  wrapper.append(dt, dd);
  return wrapper;
}

function factText(term: string, text: string): HTMLDivElement {
  const span = el("span", { text });
  return fact(term, span);
}

function safetyNotice(note: string): HTMLDivElement {
  const box = el("div", { className: "notice notice-safety" });
  box.appendChild(el("strong", { className: "notice-title", text: "Safety guidance (not a guarantee)" }));
  box.appendChild(el("p", { text: note }));
  return box;
}

function globalDisclaimer(): HTMLDivElement {
  const box = el("div", { className: "notice notice-info" });
  box.appendChild(el("strong", { className: "notice-title", text: "About this information" }));
  box.appendChild(el("p", { text: GLOBAL_SAFETY_DISCLAIMER }));
  return box;
}

function extensionEntryCard(entry: ExtensionEntry, opts: { badge?: string } = {}): HTMLDivElement {
  const card = el("div", { className: "result-card" });

  const heading = el("div", { className: "result-heading" });
  heading.appendChild(el("h2", { text: entry.name }));
  heading.appendChild(el("span", { className: "badge", text: entry.category }));
  if (opts.badge) {
    heading.appendChild(el("span", { className: "badge", text: opts.badge }));
  }
  card.appendChild(heading);

  card.appendChild(el("p", { className: "result-ext", text: `.${entry.ext}` }));
  card.appendChild(el("p", { className: "result-description", text: entry.description }));

  const grid = el("div", { className: "fact-grid" });
  grid.appendChild(fact("Commonly opened with", tagList(entry.software)));
  grid.appendChild(fact("Supported platforms", tagList(entry.platforms)));
  grid.appendChild(factText("Editable?", editableLabel(entry.editable)));
  grid.appendChild(factText("Viewable without special tools?", entry.viewable ? "Usually, yes" : "Not directly — needs the right app"));

  if (entry.conversions.length > 0) {
    grid.appendChild(fact("Commonly converted to", tagList(entry.conversions.map((c) => `.${c}`))));
  }

  const riskPill = el("span", { className: `risk-pill risk-${entry.riskLevel}` });
  riskPill.appendChild(el("span", { className: "risk-dot" }));
  riskPill.appendChild(document.createTextNode(riskLabel(entry.riskLevel)));
  grid.appendChild(fact("Inherent format risk", riskPill));

  card.appendChild(grid);
  card.appendChild(safetyNotice(entry.safetyNote));

  return card;
}

function dotfileCard(baseName: string, entry: DotfileEntry): HTMLDivElement {
  const card = el("div", { className: "result-card" });
  const heading = el("div", { className: "result-heading" });
  heading.appendChild(el("h2", { text: entry.name }));
  heading.appendChild(el("span", { className: "badge", text: entry.category }));
  heading.appendChild(el("span", { className: "badge", text: "Hidden file" }));
  card.appendChild(heading);

  card.appendChild(el("p", { className: "result-ext", text: baseName }));
  card.appendChild(el("p", { className: "result-description", text: entry.description }));

  const grid = el("div", { className: "fact-grid" });
  grid.appendChild(fact("Commonly used with", tagList(entry.software)));
  grid.appendChild(fact("Supported platforms", tagList(entry.platforms)));
  grid.appendChild(factText("Editable?", editableLabel(entry.editable)));
  const riskPill = el("span", { className: `risk-pill risk-${entry.riskLevel}` });
  riskPill.appendChild(el("span", { className: "risk-dot" }));
  riskPill.appendChild(document.createTextNode(riskLabel(entry.riskLevel)));
  grid.appendChild(fact("Inherent format risk", riskPill));
  card.appendChild(grid);

  card.appendChild(safetyNotice(entry.safetyNote));
  return card;
}

function unknownDotfileCard(baseName: string): HTMLDivElement {
  const card = el("div", { className: "result-card" });
  card.appendChild(el("h2", { text: "Unrecognized hidden file" }));
  card.appendChild(el("p", { className: "result-ext", text: baseName }));
  card.appendChild(
    el("p", {
      className: "result-description",
      text: `"${baseName}" starts with a dot, which usually means an app treats it as a hidden configuration file. This specific name isn't in our dataset yet, so we can't tell you which app created it or what it's for.`,
    }),
  );
  card.appendChild(globalDisclaimer());
  return card;
}

function noExtensionCard(baseName: string, knownFile: NoExtensionEntry | null): HTMLDivElement {
  const card = el("div", { className: "result-card" });

  if (knownFile) {
    const heading = el("div", { className: "result-heading" });
    heading.appendChild(el("h2", { text: knownFile.name }));
    heading.appendChild(el("span", { className: "badge", text: knownFile.category }));
    heading.appendChild(el("span", { className: "badge", text: "No extension" }));
    card.appendChild(heading);
    card.appendChild(el("p", { className: "result-ext", text: baseName }));
    card.appendChild(el("p", { className: "result-description", text: knownFile.description }));

    const grid = el("div", { className: "fact-grid" });
    grid.appendChild(fact("Commonly used with", tagList(knownFile.software)));
    grid.appendChild(fact("Supported platforms", tagList(knownFile.platforms)));
    grid.appendChild(factText("Editable?", editableLabel(knownFile.editable)));
    card.appendChild(grid);
    card.appendChild(safetyNotice(knownFile.safetyNote));
  } else {
    card.appendChild(el("h2", { text: "No extension found" }));
    card.appendChild(el("p", { className: "result-ext", text: baseName || "(empty)" }));
    card.appendChild(
      el("p", {
        className: "result-description",
        text: "This filename has no extension, so its type can't be determined from the name alone. Extensionless files are common — README, LICENSE, and Dockerfile are typical examples — but this particular name isn't one we recognize. The actual file type depends entirely on its contents, not its name.",
      }),
    );
    card.appendChild(globalDisclaimer());
  }

  return card;
}

function ambiguousCard(baseName: string, extension: string, isHidden: boolean, candidates: ExtensionEntry[]): HTMLDivElement {
  const card = el("div", { className: "result-card" });
  card.appendChild(el("h2", { text: `.${extension} has more than one common meaning` }));
  card.appendChild(el("p", { className: "result-ext", text: baseName }));
  card.appendChild(
    el("p", {
      className: "result-description",
      text: `A filename ending in .${extension}${isHidden ? " (in a hidden file)" : ""} could reasonably be either of the formats below. There's no way to tell which one just from the name — you'd need to inspect the actual file content.`,
    }),
  );

  const list = el("div", { className: "candidate-list" });
  for (const candidate of candidates) {
    const wrapper = el("div", { className: "candidate-card" });
    wrapper.appendChild(extensionEntryCard(candidate));
    list.appendChild(wrapper);
  }
  card.appendChild(list);
  card.appendChild(globalDisclaimer());
  return card;
}

function unknownExtensionCard(baseName: string, extension: string, isHidden: boolean, suggestions: string[]): HTMLDivElement {
  const card = el("div", { className: "result-card" });
  card.appendChild(el("h2", { text: `We don't recognize .${extension}` }));
  card.appendChild(el("p", { className: "result-ext", text: baseName }));

  const description = isHidden
    ? `"${baseName}" is a hidden file with the extension .${extension}, which isn't in our dataset yet.`
    : `".${extension}" isn't in our dataset yet — it may be rare, newly created, application-specific, or simply a typo.`;
  card.appendChild(el("p", { className: "result-description", text: description }));

  if (suggestions.length > 0) {
    const suggestionPara = el("p", { className: "result-description" });
    suggestionPara.appendChild(document.createTextNode("Did you mean: "));
    suggestions.forEach((s, i) => {
      const code = el("code", { text: `.${s}` });
      suggestionPara.appendChild(code);
      if (i < suggestions.length - 1) suggestionPara.appendChild(document.createTextNode(", "));
    });
    suggestionPara.appendChild(document.createTextNode("?"));
    card.appendChild(suggestionPara);
  }

  const notice = el("div", { className: "notice notice-unknown" });
  notice.appendChild(el("strong", { className: "notice-title", text: "An unrecognized extension proves nothing either way" }));
  notice.appendChild(
    el("p", {
      text: "A file extension not being in our dataset doesn't make it suspicious — it just means we don't have curated information about it yet. Conversely, a familiar-looking extension doesn't guarantee the file is what it claims to be. The extension is only a label chosen by whoever created the file.",
    }),
  );
  card.appendChild(notice);
  card.appendChild(globalDisclaimer());
  return card;
}

function emptyStateCard(): HTMLDivElement {
  const card = el("div", { className: "result-card" });
  card.appendChild(el("h2", { text: "Type a filename above to get started" }));
  card.appendChild(
    el("p", {
      className: "result-description",
      text: "Try something like photo.heic, archive.tar.gz, .gitignore, or Dockerfile — results appear instantly as you type, entirely in your browser.",
    }),
  );
  return card;
}

export function renderResult(container: HTMLElement, result: LookupResult): void {
  container.replaceChildren();

  switch (result.type) {
    case "empty":
      container.appendChild(emptyStateCard());
      return;

    case "known": {
      const badge = result.isHidden ? "Hidden file" : result.isCompound ? "Compound extension" : undefined;
      container.appendChild(extensionEntryCard(result.entry, { badge }));
      return;
    }

    case "ambiguous":
      container.appendChild(ambiguousCard(result.baseName, result.extension, result.isHidden, result.candidates));
      return;

    case "unknown":
      container.appendChild(unknownExtensionCard(result.baseName, result.extension, result.isHidden, result.suggestions));
      return;

    case "dotfile":
      container.appendChild(result.entry ? dotfileCard(result.baseName, result.entry) : unknownDotfileCard(result.baseName));
      return;

    case "no-extension":
      container.appendChild(noExtensionCard(result.baseName, result.knownFile));
      return;
  }
}
