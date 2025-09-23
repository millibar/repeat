import type { Sentence } from "../src/types";

export function makeSectionStats(
  sentences: Sentence[]
): Record<number, number> {
  const stats: Record<number, number> = {};
  sentences.forEach((s) => {
    stats[s.section] = (stats[s.section] || 0) + 1;
  });
  return stats;
}

export function parseTSV(data: string): Sentence[] {
  const lines = data.trim().split("\n");
  lines.shift(); // ヘッダー行を削除
  return lines.map((line) => {
    const [no, japanese, english, audio, section] = line.split("\t");
    return {
      no: parseInt(no, 10),
      japanese,
      english,
      audio,
      section: parseInt(section, 10),
    };
  });
}
