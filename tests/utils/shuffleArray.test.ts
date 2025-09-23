import { describe, it, expect, vi } from "vitest";
import { shuffleArray } from "../../src/utils";

describe("shuffleArray", () => {
  it("配列の要素をランダムに並べ替える", () => {
    // Math.random() を常に 0.5 を返すようにモック
    vi.spyOn(Math, "random").mockReturnValue(0.5);

    const input = [1, 2, 3, 4];

    const result = shuffleArray(input);

    expect(result).toEqual([1, 4, 2, 3]); // 期待される並び順

    // モックを元に戻す
    vi.restoreAllMocks();
  });

  it("配列の要素が１つだけなら不変", () => {
    const input = [1];

    const result = shuffleArray(input);

    expect(result).toEqual([1]); // 期待される並び順
  });

  it("引数の配列は変わらない", () => {
    const input = [1, 2, 3, 4, 5];

    shuffleArray(input);

    expect(input).toEqual([1, 2, 3, 4, 5]); // 期待される並び順
  });
});
