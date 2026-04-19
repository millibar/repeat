import { Card } from "./Card.tsx";
import { ToggleSVG } from "../common/ToggleSVG.tsx";
import { BookmarkSVG } from "../common/Svg";

type Props = {
  section: number;
  sentenceNo: number;
  english: string;
  japanese: string;
  bookmarked: boolean;
  onToggleBookmark: () => void;
};

export function SentenceViewer({
  section,
  sentenceNo,
  english,
  japanese,
  bookmarked,
  onToggleBookmark,
}: Props) {
  return (
    <section className="sentence">
      <h1>SECTION {section}</h1>

      <h2 className="bookmark">
        <ToggleSVG
          SVG={BookmarkSVG}
          checked={bookmarked}
          onChange={onToggleBookmark}
          text={`No. ${sentenceNo}`}
        />
      </h2>

      <Card sentence={english} language="english" />
      <Card sentence={japanese} language="japanese" />
    </section>
  );
}
