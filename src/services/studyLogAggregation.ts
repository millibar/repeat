import type { StudyLog, DailySentenceCount } from "../types/studyLog";

function formatLocalDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function aggregateDailySentenceCounts(
  logs: StudyLog[],
  days: number,
  today: Date,
): DailySentenceCount[] {
  const date2Counts: Map<string, Array<number>> = new Map(); // YYYY-MM-DD -> sentenceNoの配列

  for (let i = 0; i < days; i++) {
    const baseDate = new Date(today);
    baseDate.setDate(today.getDate() - i);
    baseDate.setHours(0, 0, 0, 0);
    const dateStr = formatLocalDate(baseDate);
    date2Counts.set(dateStr, []);
  }

  for (const log of logs) {
    const logDate = formatLocalDate(new Date(log.timestamp));

    if (date2Counts.has(logDate)) {
      date2Counts.get(logDate)!.push(log.sentenceNo);
    }
  }

  return Array.from(date2Counts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, sentenceNos]) => ({
      date,
      count: sentenceNos.length,
    }));
}
