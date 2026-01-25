import { dbPromise } from "./index.ts";
import type { StudyLog } from "../types/studyLog.ts";

export async function addStudyLog(log: StudyLog): Promise<void> {
  const db = await dbPromise;
  await db.add("studyLogs", log);
}

export async function getStudyLogsSince(
  fromTimestampMs: number,
): Promise<StudyLog[]> {
  const db = await dbPromise;
  const logs = await db.getAllFromIndex(
    "studyLogs",
    "by-timestamp",
    IDBKeyRange.lowerBound(fromTimestampMs),
  );
  return logs;
}
