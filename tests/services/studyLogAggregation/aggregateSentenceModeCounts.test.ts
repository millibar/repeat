import { describe, it, expect } from "vitest";
import { aggregateSentenceModeCounts } from "../../../src/services/studyLogAggregation";
import { StudyLog } from "../../../src/types/studyLog";

describe("aggregateSentenceModeCounts関数", () => {
  it("sentenceNoごとにmode別回数を集計する", () => {
    const studyLogs: StudyLog[] = [
      {
        id: 1, // indexedDBのautoIncrement用
        sentenceNo: 1, // Sentence.no
        section: 1,
        mode: "repeating",
        timestamp: 1,
        durationMs: 5000, // 再生時間（ミリ秒）
      },
      {
        id: 2,
        sentenceNo: 1,
        section: 1,
        mode: "shadowing",
        timestamp: 2,
        durationMs: 5000,
      },
      {
        id: 3,
        sentenceNo: 1,
        section: 1,
        mode: "repeating",
        timestamp: 3,
        durationMs: 5000,
      },
      {
        id: 4,
        sentenceNo: 2,
        section: 1,
        mode: "shadowing",
        timestamp: 4,
        durationMs: 5000,
      },
    ];

    const result = aggregateSentenceModeCounts(studyLogs);

    expect(result).toEqual([
      { sentenceNo: 1, repeating: 2, shadowing: 1 },
      { sentenceNo: 2, repeating: 0, shadowing: 1 },
    ]);
  });

  it("ログが空なら空配列を返す", () => {
    const studyLogs: StudyLog[] = [];

    const result = aggregateSentenceModeCounts(studyLogs);

    expect(result).toEqual([]);
  });
});
