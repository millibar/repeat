import { useEffect, useRef, useState, useCallback } from "react";
import { parseTSV, shuffleArray, loadSettings, saveSettings } from "./utils";
import { ToggleSVG } from "./components/ToggleSVG";
import { Card } from "./components/Card";
import { SectionList } from "./components/SectionList";
import {
  SettingsButtonSVG,
  CalendarSVG,
  RepeatOneSVG,
  ShuffleSVG,
  BookmarkSVG,
} from "./components/Svg";
import type { Sentence, PracticeMode } from "./types/index.ts";

type Phase = "idle" | "playing" | "waiting";

function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [mode, setMode] = useState<PracticeMode>("repeating");
  const [phase, setPhase] = useState<Phase>("idle");
  const [isRepeatOne, setIsRepeatOne] = useState(false);
  const [isRandom, setIsRandom] = useState(false);

  const [sentences, setSentence] = useState<Sentence[]>([]);
  const [selectedSections, setSelectedSections] = useState<number[]>([]);
  const [playQueue, setPlayQueue] = useState<Sentence[]>([]);
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());

  const rafRef = useRef<number | null>(null); // requestAnimationFrameのIDを保持する
  const [progress, setProgress] = useState(0); // 進捗バーを管理する

  // 設定モーダル
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 文データ読み込み
  useEffect(() => {
    fetch("./sentences.tsv")
      .then((res) => res.text())
      .then((text) => {
        const parsed = parseTSV(text);
        setSentence(parsed);

        const allSections = Array.from(new Set(parsed.map((s) => s.section)));

        const saved = loadSettings();
        if (saved) {
          if (
            Array.isArray(saved.selectedSections) &&
            saved.selectedSections.length > 0
          ) {
            setSelectedSections(saved.selectedSections);
          }

          if (Array.isArray(saved.playQueue) && saved.playQueue.length > 0) {
            // saved.playQueueは文番号の配列なので、Sentence配列に変換する
            const restored = saved.playQueue
              .map((no) => parsed.find((s) => s.no === no))
              .filter(Boolean) as Sentence[];
            setPlayQueue(restored);
          }

          if (Array.isArray(saved.bookmarks) && saved.bookmarks.length > 0) {
            setBookmarks(new Set(saved.bookmarks));
          }

          if (typeof saved.isRandom === "boolean") {
            setIsRandom(saved.isRandom);
          }

          if (typeof saved.currentPlayIndex === "number") {
            setCurrentPlayIndex(saved.currentPlayIndex);
          }

          console.log("設定を復元しました:", saved);
          return;
        }

        // 保存データがない場合（returnされない）、全セクションを選択状態にする
        setSelectedSections(allSections);
      });
  }, []);

  const handleChange = useCallback((sections: number[]) => {
    setSelectedSections(sections);
  }, []);

  const updatePlayQueue = (isRandom: boolean) => {
    const filtered = sentences.filter((s) =>
      selectedSections.includes(s.section)
    );

    const queue = isRandom ? shuffleArray(filtered) : filtered;

    setPlayQueue(queue);
    setCurrentPlayIndex(0);

    saveSettings({
      playQueue: queue.map((s) => s.no),
      currentPlayIndex: 0,
    });
  };

  const currentSentence = playQueue[currentPlayIndex] ?? null;

  // アニメーションフレームをクリア
  const clearAnimation = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  // 再生中のプログレスバー更新ループ
  const startPlayAnimation = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.duration > 0) {
      const percent = (audio.currentTime / audio.duration) * 100;
      setProgress(Math.ceil(percent));
      rafRef.current = requestAnimationFrame(startPlayAnimation);
      if (percent >= 100) {
        clearAnimation();
      }
    }
  };

  const startWaitAnimation = (waitTime: number) => {
    clearAnimation();

    const startTime = performance.now();
    setProgress(0);

    // 待機中のプログレスバー更新ループ
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const percent = Math.min((elapsed / waitTime) * 100, 100);
      setProgress(Math.ceil(percent));

      if (elapsed < waitTime) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        clearAnimation();
        setProgress(100);
        handleNext();
      }
    };
    rafRef.current = requestAnimationFrame(animate);
  };

  const playAudio = (index: number) => {
    clearAnimation();

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
        startPlayAnimation();
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
    clearAnimation();
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

    if (waitTime > 0) {
      startWaitAnimation(waitTime);
    } else {
      handleNext();
    }
  };

  const updateIndex = (newIndex: number) => {
    setCurrentPlayIndex(newIndex);
    saveSettings({
      currentPlayIndex: newIndex,
    });
  };

  // 次の文を再生
  const handleNext = () => {
    if (isRepeatOne) {
      playAudio(currentPlayIndex);
      return;
    }

    if (currentPlayIndex < playQueue.length - 1) {
      const nextIndex = currentPlayIndex + 1;
      updateIndex(nextIndex);
      playAudio(nextIndex);
    } else {
      setPhase("idle");
      setProgress(0);
    }
  };

  const goToNext = () => {
    if (currentPlayIndex < playQueue.length - 1) {
      const nextIndex = currentPlayIndex + 1;
      updateIndex(nextIndex);
    }
  };

  // 前の文を再生
  const handlePrev = () => {
    if (currentPlayIndex > 0) {
      const prevIndex = currentPlayIndex - 1;
      updateIndex(prevIndex);
      playAudio(prevIndex);
    }
  };

  const goToPrev = () => {
    if (currentPlayIndex > 0) {
      const prevIndex = currentPlayIndex - 1;
      updateIndex(prevIndex);
    }
  };

  // ブックマークのON/OFF切り替え
  const toggleBookmark = (sentenceNo: number) => {
    setBookmarks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sentenceNo)) {
        newSet.delete(sentenceNo);
      } else {
        newSet.add(sentenceNo);
      }

      saveSettings({
        bookmarks: Array.from(newSet),
      });

      return newSet;
    });
  };

  return (
    <main className="app">
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
        className="calendar-button"
        disabled={phase !== "idle"}
        aria-label="学習履歴"
      >
        <CalendarSVG />
      </button>

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
            saveSettings({
              selectedSections,
            });
            updatePlayQueue(isRandom);
          }}
        >
          <menu className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>再生するSECTIONにチェック</h2>
            <SectionList
              sentences={sentences}
              selectedSections={selectedSections}
              onChange={handleChange}
            />

            <button
              className="close"
              onClick={() => {
                setIsSettingsOpen(false);
                saveSettings({
                  selectedSections,
                });
                updatePlayQueue(isRandom);
              }}
              disabled={selectedSections.length === 0}
            >
              閉じる
            </button>
          </menu>
        </div>
      )}

      <audio ref={audioRef} onEnded={handleEnded} preload="auto" />

      <div className="options">
        {currentPlayIndex + 1} / {playQueue.length}{" "}
        <ToggleSVG
          SVG={RepeatOneSVG}
          checked={isRepeatOne}
          onChange={setIsRepeatOne}
          className="repeat-one"
          disabled={phase !== "idle"}
        />
        <ToggleSVG
          SVG={ShuffleSVG}
          checked={isRandom}
          onChange={(b) => {
            setIsRandom(b);
            saveSettings({
              isRandom: b,
            });
            updatePlayQueue(b);
          }}
          className="shuffle"
          disabled={phase !== "idle"}
        />
      </div>

      <div className="progress">
        <progress className={phase} value={progress} max={100} />
      </div>

      <div className="controls">
        <button
          onClick={() => {
            if (phase !== "idle") {
              handlePrev();
            } else {
              goToPrev();
            }
          }}
          disabled={currentPlayIndex === 0}
        >
          ＜
        </button>
        <button onClick={handlePlayClick} disabled={phase !== "idle"}>
          ▶
        </button>
        <button onClick={handleStopClick} disabled={phase === "idle"}>
          ■
        </button>
        <button
          onClick={() => {
            goToNext();
            if (phase !== "idle") {
              playAudio(currentPlayIndex + 1);
            }
          }}
          disabled={currentPlayIndex === playQueue.length - 1}
        >
          ＞
        </button>
      </div>

      {currentSentence && (
        <section className="sentence">
          <h1>SECTION {currentSentence.section}</h1>
          <h2 className="bookmark">
            <ToggleSVG
              SVG={BookmarkSVG}
              checked={bookmarks.has(currentSentence.no)}
              onChange={() => toggleBookmark(currentSentence.no)}
              text={`No. ${currentSentence.no}`}
            />
          </h2>

          <Card sentence={currentSentence.english} language="english" />
          <Card sentence={currentSentence.japanese} language="japanese" />
        </section>
      )}
    </main>
  );
}

export default App;
