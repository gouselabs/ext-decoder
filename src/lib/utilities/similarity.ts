// Small, dependency-free Levenshtein edit distance, used only to power
// "did you mean .jpg?" suggestions for unrecognized extensions.

export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let previousRow = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 0; i < a.length; i++) {
    const currentRow = [i + 1];
    for (let j = 0; j < b.length; j++) {
      const insertCost = currentRow[j] + 1;
      const deleteCost = previousRow[j + 1] + 1;
      const substituteCost = previousRow[j] + (a[i] === b[j] ? 0 : 1);
      currentRow.push(Math.min(insertCost, deleteCost, substituteCost));
    }
    previousRow = currentRow;
  }

  return previousRow[b.length];
}

/**
 * Returns known keys within a small edit-distance budget of `input`,
 * closest first. Skips very short inputs/keys where "closeness" stops being meaningful.
 */
export function findClosestMatches(input: string, knownKeys: readonly string[], maxSuggestions = 3): string[] {
  if (input.length < 2) return [];

  const maxDistance = input.length <= 4 ? 1 : 2;

  const scored = knownKeys
    .filter((key) => key.length >= 2)
    .map((key) => ({ key, distance: levenshteinDistance(input, key) }))
    .filter(({ distance }) => distance > 0 && distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);

  const seen = new Set<string>();
  const result: string[] = [];
  for (const { key } of scored) {
    if (!seen.has(key)) {
      seen.add(key);
      result.push(key);
    }
    if (result.length >= maxSuggestions) break;
  }
  return result;
}
