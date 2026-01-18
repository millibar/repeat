import { openDB } from "idb";

export const dbPromise = openDB("practice-db", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("studyLogs")) {
      const store = db.createObjectStore("studyLogs", {
        keyPath: "id",
        autoIncrement: true,
      });

      store.createIndex("by-timestamp", "timestamp");
      store.createIndex("by-sentenceNo", "sentenceNo");
      store.createIndex("by-section", "section");
    }
  },
});
