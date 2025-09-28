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

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// localStorage関連
const USE_LOCAL_STORAGE = true; // localStorageに設定を保存するか（開発時のフラグ）

const STORAGE_KEY = "appState";

export type AppSettings = {
  isRandom: boolean;
  selectedSections: number[];
};

export function saveSettings(settings: AppSettings) {
  if (!USE_LOCAL_STORAGE) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    console.log("設定を保存しました:", settings);
  } catch (e) {
    console.error("設定の保存に失敗しました:", e);
  }
}

export function loadSettings(): AppSettings | null {
  if (!USE_LOCAL_STORAGE) return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as AppSettings;
    }
  } catch (e) {
    console.error("設定の復元に失敗しました:", e);
  }
  return null;
}
