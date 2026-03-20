import React from "react";
import type { SentenceModeCount, PracticeMode } from "../types";
import "./SentenceProgressGrid.css";

type Props = {
  counts: SentenceModeCount[];
  mode: PracticeMode;
  totalSentences: number;
};

function getLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count < 3) return 1;
  if (count < 6) return 2;
  if (count < 10) return 3;
  return 4;
}

export const SentenceProgressGrid: React.FC<Props> = ({
  counts,
  mode,
  totalSentences,
}) => {
  const countMap = new Map(counts.map((c) => [c.sentenceNo, c]));

  const cells = [];
  for (let i = 1; i <= totalSentences; i++) {
    const data = countMap.get(i);

    const count =
      mode === "repeating" ? (data?.repeating ?? 0) : (data?.shadowing ?? 0);
    const level = getLevel(count);
    cells.push(
      <div
        key={i}
        className={`cell ${mode} level-${level}`}
        title={`No.${i}: ${count}回`}
      ></div>,
    );
  }

  return <div className="sentence-progress-grid">{cells}</div>;
};
