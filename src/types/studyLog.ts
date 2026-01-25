import type { PracticeMode } from "./practice";

export type StudyLog = {
  id?: number; // indexedDBのautoIncrement用
  sentenceNo: number; // Sentence.no
  section: number;
  mode: PracticeMode;
  timestamp: number; // Unix timestamp in milliseconds
  durationMs: number; // 再生時間（ミリ秒）
};

export type DailySentenceCount = {
  date: string; // YYYY-MM-DD形式の日付
  count: number; // その日に学習した文の数
};
