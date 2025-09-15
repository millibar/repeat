import { describe, it, expect } from "vitest";
import { makeSectionStats } from "../../src/utils";

describe("makeSectionStats", () => {
  it("各セクションに含まれる文の数を、{セクション番号: 文の数}の辞書にまとめる", () => {
    const sentences = [
      {
        no: 1,
        japanese: "こんにちは",
        english: "Hello",
        audio: "1.mp3",
        section: 1,
      },
      {
        no: 2,
        japanese: "ありがとう",
        english: "Thank you",
        audio: "2.mp3",
        section: 1,
      },
      {
        no: 3,
        japanese: "さようなら",
        english: "Goodbye",
        audio: "3.mp3",
        section: 2,
      },
    ];
    const result = makeSectionStats(sentences);
    expect(result).toEqual({ 1: 2, 2: 1 });
  });
});
