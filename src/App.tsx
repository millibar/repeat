import { useState } from "react";
import { PlayerScreen } from "./components/PlayerScreen";
import { StudyHistoryScreen } from "./components/StudyHistoryScreen";

function App() {
  type Screen = "player" | "history";

  const [screen, setScreen] = useState<Screen>("player");

  return (
    <main className="app">
      {screen === "player" ? (
        <PlayerScreen onOpenHistory={() => setScreen("history")} />
      ) : (
        <StudyHistoryScreen onClose={() => setScreen("player")} />
      )}
    </main>
  );
}

export default App;
