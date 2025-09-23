type SectionListProps = {
  sectionStats: Record<number, number>;
  selectedSections: number[];
  toggleSection: (section: number) => void;
  setSelectedSections: (sections: number[]) => void;
};

export function SectionList({
  sectionStats,
  selectedSections,
  toggleSection,
  setSelectedSections,
}: SectionListProps) {
  const allSections = Object.keys(sectionStats).map((s) => Number(s));
  const selectedCount = selectedSections.length;
  const selectedSentences = selectedSections.reduce(
    (sum, sec) => sum + (sectionStats[sec] || 0),
    0
  );
  const allSelected = selectedCount === allSections.length;

  const handleToggleAll = () => {
    if (allSelected) {
      setSelectedSections([]); // 全ての選択を解除
    } else {
      setSelectedSections(allSections); // 全てを選択
    }
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
