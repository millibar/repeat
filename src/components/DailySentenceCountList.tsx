import React from "react";
import type { DailySentenceCount } from "../types/studyLog";

type Props = {
  data: DailySentenceCount[];
};

export const DailySentenceCountList: React.FC<Props> = ({ data }: Props) => {
  return (
    <ul>
      {data.map(({ date, count }) => (
        <li key={date}>
          <span>{date}</span>: <span>{count}</span>回
        </li>
      ))}
    </ul>
  );
};
