import React from "react";
import type { DailySentenceCount } from "../types/studyLog";
import "./DailySentenceBarChart.css";

type Props = {
  data: DailySentenceCount[];
};

export const DailySentenceBarChart: React.FC<Props> = ({ data }) => {
  const maxCount = Math.max(
    ...data.map((d) => Math.max(d.repeating, d.shadowing)),
    10, // 最小値を10にして、グラフが極端に小さくならないようにする
  );

  return (
    <div className="daily-sentence-bar-chart">
      {data.map((d) => {
        const repeatingHeight = (d.repeating / maxCount) * 100;
        const shadowingHeight = (d.shadowing / maxCount) * 100;

        return (
          <div key={d.date} className="bar-container">
            <div className="bar">
              <div
                className="repeating"
                style={{ height: `${repeatingHeight}%` }}
              />
              <div
                className="shadowing"
                style={{ height: `${shadowingHeight}%` }}
              />
            </div>
            <div className="label">{d.date.slice(5)}</div>
          </div>
        );
      })}
    </div>
  );
};
