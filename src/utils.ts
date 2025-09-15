import type { Sentence } from "./App";

export function makeSectionStats(
  sentences: Sentence[]
): Record<number, number> {
  const stats: Record<number, number> = {};
  sentences.forEach((s) => {
    stats[s.section] = (stats[s.section] || 0) + 1;
  });
  return stats;
}
