import type {
  StudyLog,
  DailySentenceCount,
  SentenceModeCount,
} from "../types/studyLog";

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
  const date2Counts = new Map<
    string,
    { shadowing: number; repeating: number }
  >();

  for (let i = 0; i < days; i++) {
    const baseDate = new Date(today);
    baseDate.setDate(today.getDate() - i);
    baseDate.setHours(0, 0, 0, 0);
    const dateStr = formatLocalDate(baseDate);
    date2Counts.set(dateStr, { shadowing: 0, repeating: 0 });
  }

  for (const log of logs) {
    const logDate = formatLocalDate(new Date(log.timestamp));

    if (date2Counts.has(logDate)) {
      if (log.mode === "repeating") {
        date2Counts.get(logDate)!.repeating++;
      } else if (log.mode === "shadowing") {
        date2Counts.get(logDate)!.shadowing++;
      }
    }
  }

  return Array.from(date2Counts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => ({
      date,
      shadowing: counts.shadowing,
      repeating: counts.repeating,
    }));
}

/**
 * StudyLogのリストから、sentenceNoごとにrepeatingとshadowingの回数を集計する
 * @param logs StudyLogのリスト
 * @returns sentenceNoごとにrepeatingとshadowingの回数を集計したSentenceModeCountのリスト
 */
export function aggregateSentenceModeCounts(
  logs: StudyLog[],
): SentenceModeCount[] {
  const map = new Map<number, SentenceModeCount>();
  for (const log of logs) {
    if (!map.has(log.sentenceNo)) {
      map.set(log.sentenceNo, {
        sentenceNo: log.sentenceNo,
        repeating: 0,
        shadowing: 0,
      });
    }
    const count = map.get(log.sentenceNo)!;
    if (log.mode === "repeating") {
      count.repeating++;
    } else if (log.mode === "shadowing") {
      count.shadowing++;
    }
  }
  return Array.from(map.values()).sort((a, b) => a.sentenceNo - b.sentenceNo);
}

/**
 * StudyLogのリストから、今日を含めた連続している日数を計算する
 * @param logs StudyLogのリスト
 * @param today 今日の日付
 * @returns 今日を含めた連続している日数
 */
export function getCurrentStreak(logs: StudyLog[], today: Date): number {
  const practicedDays = new Set<string>();

  for (const log of logs) {
    const d = new Date(log.timestamp);
    const key = formatLocalDate(d);
    practicedDays.add(key);
  }

  let streak = 0;
  const cursor = new Date(today);
  cursor.setHours(0, 0, 0, 0);

  // 今日やってなければ昨日から開始
  if (!practicedDays.has(formatLocalDate(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const key = formatLocalDate(cursor);

    if (practicedDays.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
