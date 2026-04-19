import { CalendarSVG, SettingsButtonSVG } from "../common/Svg";

type Props = {
  disabled?: boolean;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
};

export function Navigation({
  disabled = false,
  onOpenHistory,
  onOpenSettings,
}: Props) {
  return (
    <>
      <button
        className="calendar-button"
        disabled={disabled}
        aria-label="学習履歴"
        onClick={onOpenHistory}
      >
        <CalendarSVG />
      </button>

      <button
        className="settings-button"
        disabled={disabled}
        aria-label="設定"
        onClick={onOpenSettings}
      >
        <SettingsButtonSVG />
      </button>
    </>
  );
}
