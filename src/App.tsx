import { useEffect, useRef, useState, useMemo } from "react";
import { makeSectionStats, parseTSV } from "./utils";
import { Card } from "./components/Card";
import { SectionList } from "./components/SectionList";
import { SettingsButtonSVG } from "./components/Svg";

export type Sentence = {
  no: number;
  japanese: string;
  english: string;
  audio: string;
  section: number;
};

type PracticeMode = "repeating" | "shadowing";
type Phase = "idle" | "playing" | "waiting";

function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // audio再生後の待機時間を管理する

  const [mode, setMode] = useState<PracticeMode>("repeating");
  const [phase, setPhase] = useState<Phase>("idle");
  const [sentences, setSentence] = useState<Sentence[]>([]);
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);

  const [progress, setProgress] = useState(0); // 進捗バーを管理する
  const waitTimeRef = useRef<ReturnType<typeof setTimeout> | null>(null); // audio再生後の待機時間の進捗バーを管理する

  // 設定モーダル
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 文データ読み込み
  useEffect(() => {
    fetch("./sentences.tsv")
      .then((res) => res.text())
      .then((text) => setSentence(parseTSV(text)));
  }, []);

  // セクションごとの文数を集計
  const sectionStats = useMemo(() => makeSectionStats(sentences), [sentences]);

  // 選択したセクションを管理
  const [selectedSections, setSelectedSections] = useState<number[]>([]);

  // 初回読み込み時に全セクションを選択状態にする
  useEffect(() => {
    if (sectionStats && Object.keys(sectionStats).length > 0) {
      const allSections = Object.keys(sectionStats).map((s) => Number(s));
      setSelectedSections(allSections);
    }
  }, [sectionStats]);

  // 選択したセクションの文だけを再生キューにする
  const playQueue = useMemo(() => {
    return sentences.filter((s) => selectedSections.includes(s.section));
  }, [sentences, selectedSections]);

  const currentSentence = playQueue[currentPlayIndex];

  // 再生キューが変わったらインデックスをリセット
  useEffect(() => {
    setCurrentPlayIndex(0);
  }, [selectedSections]);

  // セクションの選択・解除
  const toggleSection = (section: number) => {
    setSelectedSections(
      (prev) =>
        prev.includes(section)
          ? prev.filter((s) => s !== section) // 選択解除
          : [...prev, section] // 選択
    );
  };

  // 再生中のインジケーター更新
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration > 0) {
        const percent = (audio.currentTime / audio.duration) * 100;
        setProgress(Math.ceil(percent));
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  // 停止中の待ち時間インジケーター更新
  const startWaitTimeProgress = (waitTime: number) => {
    if (waitTimeRef.current) {
      clearTimeout(waitTimeRef.current);
    }

    let elapsed = 0;
    const interval = 130; // 130msごとに更新
    setProgress(0);

    waitTimeRef.current = setInterval(() => {
      elapsed += interval;
      const percent = Math.min((elapsed / waitTime) * 100, 100);
      setProgress(Math.ceil(percent));

      if (elapsed >= waitTime && waitTimeRef.current) {
        clearInterval(waitTimeRef.current);
        waitTimeRef.current = null;
      }
    }, interval);
  };

  const playAudio = (index: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (waitTimeRef.current) {
      clearInterval(waitTimeRef.current);
      waitTimeRef.current = null;
    }

    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.src = `./audio/${playQueue[index].audio}`;

    audio
      .play()
      .then(() => {
        audio.currentTime = 0;
        setProgress(0);
        setPhase("playing");
        console.log(`No.${playQueue[index].no} を再生開始しました`);
      })
      .catch((err) => {
        console.error("再生できませんでした:", err);
      });
  };

  // ボタン押下で再生
  const handlePlayClick = () => {
    playAudio(currentPlayIndex);
  };

  // ボタン押下で停止して最初に戻る
  const handleStopClick = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (waitTimeRef.current) {
      clearInterval(waitTimeRef.current);
      waitTimeRef.current = null;
    }

    setPhase("idle");
    setProgress(0);
    console.log("再生を停止しました");
  };

  // 最後まで再生したら次の文を再生
  const handleEnded = () => {
    console.log("再生が終了しました");
    setPhase("waiting");

    const audio = audioRef.current;
    if (!audio) return;

    // 再生後に次の文を出すまでの待機時間
    // repeatingモードでは音声ファイルの最後に若干の無音があるため、1秒短くする
    // shadowingモードではすぐに次の文を再生する
    const waitTime =
      mode === "repeating" ? Math.ceil(audio.duration * 1000 - 1000) : 0;

    startWaitTimeProgress(waitTime);

    timeoutRef.current = setTimeout(() => {
      handleNext();
      timeoutRef.current = null;
    }, waitTime);
  };

  // 次の文を再生
  const handleNext = () => {
    if (currentPlayIndex < playQueue.length - 1) {
      setCurrentPlayIndex(currentPlayIndex + 1);
      playAudio(currentPlayIndex + 1);
    }
  };

  // 前の文を再生
  const handlePrev = () => {
    if (currentPlayIndex > 0) {
      setCurrentPlayIndex(currentPlayIndex - 1);
      playAudio(currentPlayIndex - 1);
    }
  };

  return (
    <main className="app">
      <h1>
        りぴーと！ <span>- Repeating &amp; Shadowing -</span>
      </h1>

      <div className="mode">
        <label>
          <input
            type="radio"
            name="mode"
            value="repeating"
            checked={mode === "repeating"}
            onChange={() => setMode("repeating")}
            disabled={phase !== "idle"}
          />
          Repeating
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="shadowing"
            checked={mode === "shadowing"}
            onChange={() => setMode("shadowing")}
            disabled={phase !== "idle"}
          />
          Shadowing
        </label>
      </div>

      <button
        className="settings-button"
        onClick={() => setIsSettingsOpen(true)}
        disabled={phase !== "idle"}
        aria-label="設定"
      >
        <SettingsButtonSVG />
      </button>
      {isSettingsOpen && (
        <div
          className="modal-overlay"
          onClick={() => {
            if (selectedSections.length > 0) {
              setIsSettingsOpen(false);
            }
          }}
        >
          <menu className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>再生するSECTIONにチェック</h2>
            <SectionList
              sectionStats={sectionStats}
              selectedSections={selectedSections}
              toggleSection={toggleSection}
              setSelectedSections={setSelectedSections}
            />
            <label>
              <input type="checkbox" /> ランダムに再生する
            </label>
            <button
              className="close"
              onClick={() => setIsSettingsOpen(false)}
              disabled={selectedSections.length === 0}
            >
              閉じる
            </button>
          </menu>
        </div>
      )}

      <audio ref={audioRef} onEnded={handleEnded} preload="auto" />

      <div className="progress">
        <progress className={phase} value={progress} max={100} />
      </div>

      <div className="controls">
        <button onClick={handlePrev} disabled={currentPlayIndex === 0}>
          ＜
        </button>
        <button onClick={handlePlayClick} disabled={phase !== "idle"}>
          ▶
        </button>
        <button onClick={handleStopClick} disabled={phase === "idle"}>
          ■
        </button>
        <button
          onClick={handleNext}
          disabled={currentPlayIndex === playQueue.length - 1}
        >
          ＞
        </button>
      </div>

      {currentSentence && (
        <section className="sentence">
          <h2>SECTION {currentSentence.section}</h2>
          <h3>No. {currentSentence.no}</h3>

          <Card sentence={currentSentence.english} language="english" />
          <Card sentence={currentSentence.japanese} language="japanese" />
        </section>
      )}
    </main>
  );
}

export default App;
