import type { PracticeMode } from "./practice";

export type StudyLog = {
  id?: number; // indexedDBのautoIncrement用
  sentenceNo: number; // Sentence.no
  section: number;
  mode: PracticeMode;
  timestamp: number; // Unix timestamp in milliseconds
  durationMs: number; // 再生時間（ミリ秒）
};
