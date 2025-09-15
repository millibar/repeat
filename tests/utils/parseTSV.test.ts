import { describe, it, expect } from "vitest";
import { parseTSV } from "../../src/utils";

describe("parseTSV", () => {
  it("sentence.tsvをSentence型の配列に変換する", () => {
    const input = `
No\tJapanese\tEnglish\taudio\tsection
1\tおはよう。\tGood morning.\t1.mp3\t1
2\tこんにちは。\tHello.\t2.mp3\t1
3\tさようなら\tGood bye.\t3.mp3\t2`;
    const result = parseTSV(input);
    expect(result).toEqual([
      {
        no: 1,
        japanese: "おはよう。",
        english: "Good morning.",
        audio: "1.mp3",
        section: 1,
      },
      {
        no: 2,
        japanese: "こんにちは。",
        english: "Hello.",
        audio: "2.mp3",
        section: 1,
      },
      {
        no: 3,
        japanese: "さようなら",
        english: "Good bye.",
        audio: "3.mp3",
        section: 2,
      },
    ]);
  });
});
