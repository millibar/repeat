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
  repeating: number; // その日にリピーティングした文の数
  shadowing: number; // その日にシャドーイングした文の数
};

export type SentenceModeCount = {
  sentenceNo: number;
  repeating: number; // 繰り返しモードで学習した回数
  shadowing: number; // シャドーイングモードで学習した回数
};
