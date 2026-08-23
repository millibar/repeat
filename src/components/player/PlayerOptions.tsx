import { ToggleSVG } from "../common/ToggleSVG";
import { RepeatOneSVG, ShuffleSVG } from "../common/Svg";

type PlayerOptionsProps = {
  current: number;
  total: number;
  isRepeatOne: boolean;
  isRandom: boolean;
  disabled: boolean;
  onRepeatOneChange: (checked: boolean) => void;
  onRandomChange: (checked: boolean) => void;
};

export function PlayerOptions({
  current,
  total,
  isRepeatOne,
  isRandom,
  disabled,
  onRepeatOneChange,
  onRandomChange,
}: PlayerOptionsProps) {
  return (
    <div className="options">
      <ToggleSVG
        SVG={RepeatOneSVG}
        checked={isRepeatOne}
        onChange={onRepeatOneChange}
        className="repeat-one"
        disabled={disabled}
      />
      <ToggleSVG
        SVG={ShuffleSVG}
        checked={isRandom}
        onChange={onRandomChange}
        className="shuffle"
        disabled={disabled}
      />
      <span>
        {current} / {total}
      </span>
    </div>
  );
}
