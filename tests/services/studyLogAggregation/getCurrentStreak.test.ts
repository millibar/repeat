import { describe, it, expect } from "vitest";
import { getCurrentStreak } from "../../../src/services/studyLogAggregation";
import { StudyLog } from "../../../src/types/studyLog";

function createLog(dateStr: string): StudyLog {
  return {
    sentenceNo: 1,
    section: 1,
    mode: "repeating",
    timestamp: new Date(`${dateStr}T12:00:00`).getTime(),
    durationMs: 3000,
  };
}

describe("getCurrentStreak関数", () => {
  const today = new Date("2026-04-18T12:00:00");

  it("昨日練習しており、今日練習していない場合、ストリークが1になる", () => {
    const logs = [createLog("2026-04-17")];
    expect(getCurrentStreak(logs, today)).toBe(1);
  });
  it("昨日練習しており、今日も練習している場合、ストリークが2になる", () => {
    const logs = [createLog("2026-04-17"), createLog("2026-04-18")];
    expect(getCurrentStreak(logs, today)).toBe(2);
  });
  it("昨日練習しておらず、今日練習していない場合、ストリークが0になる", () => {
    const logs = [createLog("2026-04-16")];
    expect(getCurrentStreak(logs, today)).toBe(0);
  });
  it("昨日練習しておらず、今日練習している場合、ストリークが1になる", () => {
    const logs = [createLog("2026-04-18")];
    expect(getCurrentStreak(logs, today)).toBe(1);
  });
  it("昨日練習しておらず、今日練習している場合、ストリークが1になる", () => {
    const logs = [createLog("2026-04-16"), createLog("2026-04-18")];
    expect(getCurrentStreak(logs, today)).toBe(1);
  });
  it("○○[×] -> 2", () => {
    const logs = [createLog("2026-04-16"), createLog("2026-04-17")];
    expect(getCurrentStreak(logs, today)).toBe(2);
  });

  it("○○[○] -> 3", () => {
    const logs = [
      createLog("2026-04-16"),
      createLog("2026-04-17"),
      createLog("2026-04-18"),
    ];
    expect(getCurrentStreak(logs, today)).toBe(3);
  });

  it("○×[○] -> 1", () => {
    const logs = [createLog("2026-04-16"), createLog("2026-04-18")];
    expect(getCurrentStreak(logs, today)).toBe(1);
  });

  it("○×[×] -> 0", () => {
    const logs = [createLog("2026-04-16")];
    expect(getCurrentStreak(logs, today)).toBe(0);
  });

  it("×○[×] -> 1", () => {
    const logs = [createLog("2026-04-17")];
    expect(getCurrentStreak(logs, today)).toBe(1);
  });

  it("×○[○] -> 2", () => {
    const logs = [createLog("2026-04-17"), createLog("2026-04-18")];
    expect(getCurrentStreak(logs, today)).toBe(2);
  });

  it("××[×] -> 0", () => {
    const logs: StudyLog[] = [];
    expect(getCurrentStreak(logs, today)).toBe(0);
  });

  it("××[○] -> 1", () => {
    const logs = [createLog("2026-04-18")];
    expect(getCurrentStreak(logs, today)).toBe(1);
  });
});
