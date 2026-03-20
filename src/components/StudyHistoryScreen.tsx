import { useEffect, useState } from "react";
import { DailySentenceBarChart } from "./DailySentenceBarChart";
import type { DailySentenceCount, SentenceModeCount } from "../types/studyLog";
import { getStudyLogsSince } from "../db/studyLog";
import {
  aggregateDailySentenceCounts,
  aggregateSentenceModeCounts,
} from "../services/studyLogAggregation";
import { SentenceProgressGrid } from "./SentenceProgressGrid";

type StudyHistoryScreenProps = {
  onClose: () => void;
};

export const StudyHistoryScreen: React.FC<StudyHistoryScreenProps> = ({
  onClose,
}) => {
  const [data, setData] = useState<DailySentenceCount[]>([]);
  const [progressData, setProgressData] = useState<SentenceModeCount[]>([]);

  useEffect(() => {
    async function loadLast7days() {
      const days = 7;
      const today = new Date();

      const from = new Date(today);
      from.setDate(today.getDate() - (days - 1));
      from.setHours(0, 0, 0, 0);

      const logs = await getStudyLogsSince(from.getTime());
      const aggregated = aggregateDailySentenceCounts(logs, days, today);

      setData(aggregated);
      console.log("Aggregated daily sentence counts:", aggregated);
    }

    async function loadProgressData() {
      const days = 365;
      const today = new Date();

      const from = new Date(today);
      from.setDate(today.getDate() - (days - 1));
      from.setHours(0, 0, 0, 0);

      const logs = await getStudyLogsSince(from.getTime());
      const aggregated = aggregateSentenceModeCounts(logs);
      setProgressData(aggregated);
    }

    loadLast7days();
    loadProgressData();
  }, []);

  return (
    <div>
      <button onClick={onClose}>Close History</button>
      <h2>Last 7 Days</h2>
      <DailySentenceBarChart data={data} />

      <h2>Repeating Progress</h2>
      <SentenceProgressGrid
        counts={progressData}
        mode="repeating"
        totalSentences={560}
      />

      <h2>Shadowing Progress</h2>
      <SentenceProgressGrid
        counts={progressData}
        mode="shadowing"
        totalSentences={560}
      />
    </div>
  );
};
