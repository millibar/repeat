import { describe, it, expect } from "vitest";
import { aggregateDailySentenceCounts } from "../../src/services/studyLogAggregation";
import { StudyLog } from "../../src/types/studyLog";

describe("studyLogAggregationサービス", () => {
  describe("aggregateDailySentenceCounts関数", () => {
    it("日付ごとに学習回数を集計する", () => {
      const studyLogs: StudyLog[] = [
        {
          id: 1, // indexedDBのautoIncrement用
          sentenceNo: 1, // Sentence.no
          section: 1,
          mode: "repeating",
          timestamp: 1696118400000, // 2023-10-01 00:00:00 UTC
          durationMs: 5000, // 再生時間（ミリ秒）
        },
        {
          id: 2,
          sentenceNo: 2,
          section: 1,
          mode: "repeating",
          timestamp: 1696118500000, // 2023-10-01 00:01:40 UTC
          durationMs: 5000,
        },
        {
          id: 2,
          sentenceNo: 2,
          section: 1,
          mode: "repeating",
          timestamp: 1696204800000, // 2023-10-02 00:00:00 UTC
          durationMs: 5000,
        },
      ];

      const result = aggregateDailySentenceCounts(
        studyLogs,
        2,
        new Date(1696204800000),
      ); // 2023-10-02

      expect(result).toEqual([
        { date: "2023-10-01", count: 2 },
        { date: "2023-10-02", count: 1 },
      ]);
    });

    it("学習ログのない日は0とする", () => {
      const studyLogs: StudyLog[] = [
        {
          id: 1, // indexedDBのautoIncrement用
          sentenceNo: 1, // Sentence.no
          section: 1,
          mode: "repeating",
          timestamp: 1696118400000, // 2023-10-01 00:00:00 UTC
          durationMs: 5000, // 再生時間（ミリ秒）
        },
        {
          id: 2,
          sentenceNo: 2,
          section: 1,
          mode: "repeating",
          timestamp: 1696118500000, // 2023-10-01 00:01:40 UTC
          durationMs: 5000,
        },
      ];

      const result = aggregateDailySentenceCounts(
        studyLogs,
        2,
        new Date(1696204800000),
      ); // 2023-10-02

      expect(result).toEqual([
        { date: "2023-10-01", count: 2 },
        { date: "2023-10-02", count: 0 },
      ]);
    });
  });
});
