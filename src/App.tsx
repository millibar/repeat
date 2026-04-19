import { useState } from "react";
import { PlayerScreen } from "./components/player/PlayerScreen";
import { StudyHistoryScreen } from "./components/history/StudyHistoryScreen";

function App() {
  type Screen = "player" | "history";

  const [screen, setScreen] = useState<Screen>("player");

  return (
    <main className={`app ${screen}`}>
      {screen === "player" ? (
        <PlayerScreen onOpenHistory={() => setScreen("history")} />
      ) : (
        <StudyHistoryScreen onClose={() => setScreen("player")} />
      )}
    </main>
  );
}

export default App;
