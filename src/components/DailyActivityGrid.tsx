import React from "react";
import type { DailySentenceCount } from "../types/studyLog";
import "./DailyActivityGrid.css";

type Props = {
  data: DailySentenceCount[];
};

export const DailyActivityGrid: React.FC<Props> = ({ data }) => {
  const grid = Array.from({ length: 7 }, () => Array(28).fill(null));

  data.forEach((d, i) => {
    const col = Math.floor(i / 7); // 週
    const row = new Date(d.date).getDay(); // 曜日

    grid[row][col] = d;
  });

  return (
    <div className="daily-activity-grid">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const hasActivity =
            cell && (cell.repeating > 0 || cell.shadowing > 0);

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`cell ${hasActivity ? "active" : ""}`}
              title={cell?.date ?? ""}
            />
          );
        }),
      )}
    </div>
  );
};
