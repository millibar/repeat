import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
  it("設定ボタンを押すとモーダルウインドウが開く", async () => {
    render(<App />);

    const openButton = screen.getByLabelText("設定");
    fireEvent.click(openButton);

    expect(
      await screen.findByText("再生するSECTIONにチェック")
    ).toBeInTheDocument();
  });

  it("閉じるボタンを押すとモーダルウインドウが閉じる", async () => {
    render(<App />);
    const openButton = screen.getByLabelText("設定");
    fireEvent.click(openButton);
    expect(
      await screen.findByText("再生するSECTIONにチェック")
    ).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: "閉じる" });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByText("再生するSECTIONにチェック")
      ).not.toBeInTheDocument();
    });
  });

  it("初期状態では全SECTIONのチェックボックスがオン", async () => {
    render(<App />);
    const openButton = screen.getByLabelText("設定");
    fireEvent.click(openButton);

    const section1Checkbox = await screen.findByRole("checkbox", {
      name: "SECTION 1 (2)",
    });
    const section2Checkbox = await screen.findByRole("checkbox", {
      name: "SECTION 2 (1)",
    });

    await waitFor(() => {
      expect(section1Checkbox).toBeChecked();
      expect(section2Checkbox).toBeChecked();
    });
  });

  it("チェックボックスをクリックすると選択状態が変わる", async () => {
    render(<App />);
    const openButton = screen.getByLabelText("設定");
    fireEvent.click(openButton);

    const section1Checkbox = await screen.findByRole("checkbox", {
      name: "SECTION 1 (2)",
    });

    await waitFor(() => {
      expect(section1Checkbox).toBeChecked();
    });

    fireEvent.click(section1Checkbox);

    expect(section1Checkbox).not.toBeChecked();
  });

  it("SECTION 1が選択されているとき、最初の文「こんにちは」が表示されている", async () => {
    render(<App />);
    const openButton = screen.getByLabelText("設定");
    fireEvent.click(openButton);

    const section1Checkbox = await screen.findByRole("checkbox", {
      name: "SECTION 1 (2)",
    });

    await waitFor(() => {
      expect(section1Checkbox).toBeChecked();
      expect(screen.getByText("こんにちは")).toBeInTheDocument();
    });
  });

  it("SECTION 2のみが選択されているとき、最初の文「さようなら」が表示されている", async () => {
    render(<App />);
    const openButton = screen.getByLabelText("設定");
    fireEvent.click(openButton);

    const section1Checkbox = await screen.findByRole("checkbox", {
      name: "SECTION 1 (2)",
    });
    fireEvent.click(section1Checkbox);

    await waitFor(() => {
      expect(section1Checkbox).not.toBeChecked();
      expect(screen.queryByText("こんにちは")).not.toBeInTheDocument();
      expect(screen.getByText("さようなら")).toBeInTheDocument();
    });
  });
});
