import { useEffect, useState } from "react";
import { DailySentenceBarChart } from "./DailySentenceBarChart";
import type { DailySentenceCount, SentenceModeCount } from "../types/studyLog";
import { getStudyLogsSince } from "../db/studyLog";
import {
  aggregateDailySentenceCounts,
  aggregateSentenceModeCounts,
  getCurrentStreak,
} from "../services/studyLogAggregation";
import { SentenceProgressGrid } from "./SentenceProgressGrid";
import { DailyActivityGrid } from "./DailyActivityGrid";

type StudyHistoryScreenProps = {
  onClose: () => void;
};

export const StudyHistoryScreen: React.FC<StudyHistoryScreenProps> = ({
  onClose,
}) => {
  const [data, setData] = useState<DailySentenceCount[]>([]);
  const [progressData, setProgressData] = useState<SentenceModeCount[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    async function loadLastXdays(days: number) {
      const today = new Date();

      const from = new Date(today);
      from.setDate(today.getDate() - (days - 1));
      from.setHours(0, 0, 0, 0);

      const logs = await getStudyLogsSince(from.getTime());
      return aggregateDailySentenceCounts(logs, days, today);
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
      setStreak(getCurrentStreak(logs, today));
    }

    async function load() {
      const allDays = 28 * 7;
      const aggregated = await loadLastXdays(allDays);
      setData(aggregated);
    }

    load();
    loadProgressData();
  }, []);

  const last7days = data.slice(-7);

  return (
    <>
      <button onClick={onClose}>Close History</button>
      <h1>Study History</h1>
      <h2>
        {streak === 0 ? "Start your streak today!" : `${streak}-Day Streak`}
      </h2>

      <h2>Last 7 Days</h2>
      <DailySentenceBarChart data={last7days} />

      <h2>
        Daily Activity <small>at least once a day</small>
      </h2>
      <DailyActivityGrid data={data} />

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
    </>
  );
};
