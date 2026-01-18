import { dbPromise } from "./index.ts";
import type { StudyLog } from "../types/studyLog.ts";

export async function addStudyLog(log: StudyLog): Promise<void> {
  const db = await dbPromise;
  await db.add("studyLogs", log);
}
