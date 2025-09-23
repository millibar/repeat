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

  it("選択済みのセクション数と文の合計が表示される", async () => {
    render(<App />);
    const openButton = screen.getByLabelText("設定");
    fireEvent.click(openButton);
    const section1Checkbox = await screen.findByRole("checkbox", {
      name: "SECTION 1 (2)",
    });
    const section2Checkbox = await screen.findByRole("checkbox", {
      name: "SECTION 2 (1)",
    });

    // 最初は全て選択されている
    expect(await screen.findByText("選択済み：2 (3)")).toBeInTheDocument();

    // SECTION 1のチェックを外す
    fireEvent.click(section1Checkbox);
    await waitFor(() => {
      expect(screen.getByText("選択済み：1 (1)")).toBeInTheDocument();
    });

    // SECTION 2のチェックを外す
    fireEvent.click(section2Checkbox);
    await waitFor(() => {
      expect(screen.getByText("選択済み：0 (0)")).toBeInTheDocument();
    });

    // SECTION 1のチェックを入れる
    fireEvent.click(section1Checkbox);
    await waitFor(() => {
      expect(screen.getByText("選択済み：1 (2)")).toBeInTheDocument();
    });
  });

  it("1つ以上チェックされているとき、閉じるボタンを押すとモーダルウインドウが閉じる", async () => {
    render(<App />);
    const openButton = screen.getByLabelText("設定");
    fireEvent.click(openButton);
    expect(
      await screen.findByText("再生するSECTIONにチェック")
    ).toBeInTheDocument();

    // SECTION 1のチェックボックスがチェックされていることを確認
    const section1Checkbox = await screen.findByRole("checkbox", {
      name: "SECTION 1 (2)",
    });
    await waitFor(() => {
      expect(section1Checkbox).toBeChecked();
    });

    const closeButton = screen.getByRole("button", { name: "閉じる" });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByText("再生するSECTIONにチェック")
      ).not.toBeInTheDocument();
    });
  });

  it("1つもチェックされていないとき、閉じるボタンを押せない", async () => {
    render(<App />);
    const openButton = screen.getByLabelText("設定");
    fireEvent.click(openButton);
    expect(
      await screen.findByText("再生するSECTIONにチェック")
    ).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: "閉じる" });
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

    fireEvent.click(section1Checkbox);
    fireEvent.click(section2Checkbox);
    await waitFor(() => {
      expect(section1Checkbox).not.toBeChecked();
      expect(section2Checkbox).not.toBeChecked();
      expect(closeButton).toBeDisabled();
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

  it("全てのチェックボックスがONのとき、全選択をクリックすると、全てのチェックボックスがOFFになる", async () => {
    render(<App />);
    const openButton = screen.getByLabelText("設定");
    fireEvent.click(openButton);

    const selectAllCheckbox = await screen.findByRole("checkbox", {
      name: /選択済み/,
    });
    const section1Checkbox = await screen.findByRole("checkbox", {
      name: "SECTION 1 (2)",
    });
    const section2Checkbox = await screen.findByRole("checkbox", {
      name: "SECTION 2 (1)",
    });

    // 最初は全て選択されている
    await waitFor(() => {
      expect(selectAllCheckbox).toBeChecked();
      expect(section1Checkbox).toBeChecked();
      expect(section2Checkbox).toBeChecked();
    });

    // 全て解除する
    fireEvent.click(selectAllCheckbox);
    await waitFor(() => {
      expect(selectAllCheckbox).not.toBeChecked();
      expect(section1Checkbox).not.toBeChecked();
      expect(section2Checkbox).not.toBeChecked();
    });
  });

  it("１つ以上のチェックボックスがOFFのとき、全選択をクリックすると、全てのチェックボックスがONになる", async () => {
    render(<App />);
    const openButton = screen.getByLabelText("設定");
    fireEvent.click(openButton);

    const selectAllCheckbox = await screen.findByRole("checkbox", {
      name: /選択済み/,
    });
    const section1Checkbox = await screen.findByRole("checkbox", {
      name: "SECTION 1 (2)",
    });
    const section2Checkbox = await screen.findByRole("checkbox", {
      name: "SECTION 2 (1)",
    });

    // 最初はすべて選択されているので全て解除する
    fireEvent.click(section1Checkbox);
    fireEvent.click(section2Checkbox);
    await waitFor(() => {
      expect(section1Checkbox).not.toBeChecked();
      expect(section2Checkbox).not.toBeChecked();
    });

    fireEvent.click(selectAllCheckbox);
    await waitFor(() => {
      expect(selectAllCheckbox).toBeChecked();
      expect(section1Checkbox).toBeChecked();
      expect(section2Checkbox).toBeChecked();
    });

    // 1つだけ解除する
    fireEvent.click(section1Checkbox);
    await waitFor(() => {
      expect(section1Checkbox).not.toBeChecked();
      expect(section2Checkbox).toBeChecked();
    });

    fireEvent.click(selectAllCheckbox);
    await waitFor(() => {
      expect(selectAllCheckbox).toBeChecked();
      expect(section1Checkbox).toBeChecked();
      expect(section2Checkbox).toBeChecked();
    });
  });

  it("全てのチェックボックスをOFFにすると、全選択チェックボックスもOFFになる", async () => {
    render(<App />);
    const openButton = screen.getByLabelText("設定");
    fireEvent.click(openButton);

    const selectAllCheckbox = await screen.findByRole("checkbox", {
      name: /選択済み/,
    });
    const section1Checkbox = await screen.findByRole("checkbox", {
      name: "SECTION 1 (2)",
    });
    const section2Checkbox = await screen.findByRole("checkbox", {
      name: "SECTION 2 (1)",
    });

    // 最初は全て選択されている
    await waitFor(() => {
      expect(selectAllCheckbox).toBeChecked();
      expect(section1Checkbox).toBeChecked();
      expect(section2Checkbox).toBeChecked();
    });

    // 全て解除する
    fireEvent.click(section1Checkbox);
    fireEvent.click(section2Checkbox);
    await waitFor(() => {
      expect(selectAllCheckbox).not.toBeChecked();
      expect(section1Checkbox).not.toBeChecked();
      expect(section2Checkbox).not.toBeChecked();
    });
  });

  it("全てのチェックボックスをONにすると、全選択チェックボックスもONになる", async () => {
    render(<App />);
    const openButton = screen.getByLabelText("設定");
    fireEvent.click(openButton);

    const selectAllCheckbox = await screen.findByRole("checkbox", {
      name: /選択済み/,
    });
    const section1Checkbox = await screen.findByRole("checkbox", {
      name: "SECTION 1 (2)",
    });
    const section2Checkbox = await screen.findByRole("checkbox", {
      name: "SECTION 2 (1)",
    });

    // 全て解除する
    fireEvent.click(selectAllCheckbox);
    await waitFor(() => {
      expect(selectAllCheckbox).not.toBeChecked();
      expect(section1Checkbox).not.toBeChecked();
      expect(section2Checkbox).not.toBeChecked();
    });

    // 全て選択する
    fireEvent.click(section1Checkbox);
    fireEvent.click(section2Checkbox);
    await waitFor(() => {
      expect(selectAllCheckbox).toBeChecked();
    });
  });
});
