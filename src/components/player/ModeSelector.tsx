import type { PracticeMode } from "../../types";

type Props = {
  mode: PracticeMode;
  disabled: boolean;
  onChange: (mode: PracticeMode) => void;
};

export function ModeSelector({ mode, disabled, onChange }: Props) {
  return (
    <div className="mode">
      <label>
        <input
          type="radio"
          name="mode"
          value="repeating"
          checked={mode === "repeating"}
          onChange={() => onChange("repeating")}
          disabled={disabled}
        />
        Repeating
      </label>

      <label>
        <input
          type="radio"
          name="mode"
          value="shadowing"
          checked={mode === "shadowing"}
          onChange={() => onChange("shadowing")}
          disabled={disabled}
        />
        Shadowing
      </label>
    </div>
  );
}
