import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../../src/App";

const dummyTSV = `no\tjapanese\tenglish\taudio\tsection
1\tこんにちは\tHello\t1.mp3\t1
2\tありがとう\tThank you\t2.mp3\t1
3\tさようなら\tGoodbye\t3.mp3\t2
`;

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve(dummyTSV),
      })
    )
  );
});

describe("SECTION一覧", () => {
  it("設定ボタンを押すとモーダルウインドウが開く", () => {
    render(<App />);

    const openButton = screen.getByLabelText("設定");
    fireEvent.click(openButton);

    expect(screen.getByText("再生するSECTIONにチェック")).toBeInTheDocument();
  });

  it("閉じるボタンを押すとモーダルウインドウが閉じる", () => {
    render(<App />);

    const openButton = screen.getByLabelText("設定");
    fireEvent.click(openButton);

    expect(screen.queryByText("再生するSECTIONにチェック")).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: "閉じる" });
    fireEvent.click(closeButton);

    expect(screen.queryByText("再生するSECTIONにチェック")).toBe(null);
  });
});
