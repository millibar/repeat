import React from "react";
import { BookmarkSVG } from "./Svg";

type BookmarkProps = {
  currentSentenceNo: number;
  //   isBookmarked: boolean;
};

export const Bookmark: React.FC<BookmarkProps> = ({
  currentSentenceNo,
  //   isBookmarked,
}) => {
  return (
    <h3 className="bookmark">
      <label>
        <input type="checkbox" />
        <BookmarkSVG />
        <span>No. {currentSentenceNo}</span>
      </label>
    </h3>
  );
};
