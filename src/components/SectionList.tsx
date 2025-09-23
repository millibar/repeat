import { useMemo } from "react";
import { makeSectionStats } from "../utils";
import type { Sentence } from "../types/index.ts";

type SectionListProps = {
  sentences: Sentence[];
  selectedSections: number[];
  onChange: (sections: number[]) => void;
};

export function SectionList({
  sentences,
  selectedSections,
  onChange,
}: SectionListProps) {
  // セクションごとの文数を集計
  const sectionStats = useMemo(() => makeSectionStats(sentences), [sentences]);

  // セクションの選択・解除
  const toggleSection = (section: number) => {
    const updated = selectedSections.includes(section)
      ? selectedSections.filter((s) => s !== section) // 選択解除
      : [...selectedSections, section]; // 選択
    onChange(updated); // 親コンポーネントに通知
  };

  const allSections = Object.keys(sectionStats).map((s) => Number(s));
  const selectedCount = selectedSections.length;
  const selectedSentences = selectedSections.reduce(
    (sum, sec) => sum + (sectionStats[sec] || 0),
    0
  );
  const allSelected = selectedCount === allSections.length;

  const handleToggleAll = () => {
    onChange(allSelected ? [] : allSections); // 親コンポーネントに通知
  };

  return (
    <>
      <label className="select-all">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={handleToggleAll}
        />{" "}
        選択済み：
        {selectedCount} ({selectedSentences})
      </label>
      <ul>
        {Object.entries(sectionStats).map(([section, count]) => {
          const sectionNum = Number(section);
          return (
            <li key={section}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedSections.includes(sectionNum)}
                  onChange={() => toggleSection(sectionNum)}
                />{" "}
                SECTION {section} ({count})
              </label>
            </li>
          );
        })}
      </ul>
    </>
  );
}
