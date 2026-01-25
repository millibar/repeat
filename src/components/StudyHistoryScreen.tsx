import { useEffect, useState } from "react";
import { DailySentenceCountList } from "./DailySentenceCountList";
import type { DailySentenceCount } from "../types/studyLog";
import { getStudyLogsSince } from "../db/studyLog";
import { aggregateDailySentenceCounts } from "../services/studyLogAggregation";

type StudyHistoryScreenProps = {
  onClose: () => void;
};

export const StudyHistoryScreen: React.FC<StudyHistoryScreenProps> = ({
  onClose,
}) => {
  const [data, setData] = useState<DailySentenceCount[]>([]);

  useEffect(() => {
    async function load() {
      const days = 7;
      const today = new Date();

      const from = new Date(today);
      from.setDate(today.getDate() - (days - 1));
      from.setHours(0, 0, 0, 0);

      const logs = await getStudyLogsSince(from.getTime());
      const aggregated = aggregateDailySentenceCounts(logs, days, today);

      setData(aggregated);
    }
    load();
  }, []);

  return (
    <div>
      <DailySentenceCountList data={data} />
      <button onClick={onClose}>Close History</button>
      {/* Additional history screen content goes here */}
    </div>
  );
};
