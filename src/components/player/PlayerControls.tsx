type Props = {
  phase: "idle" | "playing" | "waiting";
  currentPlayIndex: number;
  lastIndex: number;
  onPrev: () => void;
  onPlay: () => void;
  onStop: () => void;
  onNext: () => void;
};

export function PlayerControls({
  phase,
  currentPlayIndex,
  lastIndex,
  onPrev,
  onPlay,
  onStop,
  onNext,
}: Props) {
  return (
    <div className="controls">
      <button onClick={onPrev} disabled={currentPlayIndex === 0}>
        ＜
      </button>

      <button onClick={onPlay} disabled={phase !== "idle"}>
        ▶
      </button>

      <button onClick={onStop} disabled={phase === "idle"}>
        ■
      </button>

      <button onClick={onNext} disabled={currentPlayIndex === lastIndex}>
        ＞
      </button>
    </div>
  );
}
