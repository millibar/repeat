import { SectionList } from "./SectionList";
import type { Sentence } from "../../types";

type Props = {
  isOpen: boolean;
  sentences: Sentence[];
  selectedSections: number[];
  onChange: (sections: number[]) => void;
  onClose: () => void;
};

export function SettingsModal({
  isOpen,
  sentences,
  selectedSections,
  onChange,
  onClose,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <menu className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>再生するSECTIONにチェック</h2>

        <SectionList
          sentences={sentences}
          selectedSections={selectedSections}
          onChange={onChange}
        />

        <button
          className="close"
          onClick={onClose}
          disabled={selectedSections.length === 0}
        >
          閉じる
        </button>
      </menu>
    </div>
  );
}
