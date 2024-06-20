import { Threads } from "@amodx/threads/";
import { IndexDBCore } from "./IndexDBCore.js";

export default function() {
  Threads.registerTasks<string>(
    "zdb-close-database",
    async (dbId, onDone) => {
      const db = IndexDBCore.loadedDatabases[dbId];
      if (!db) return;
      await db.waitTillTranscationDone();
      db.close();
      if (onDone) onDone();
    },
    "deferred"
  );
  Threads.registerTasks<string>(
    "zdb-open-database",
    async (dbId, onDone) => {
      const db = IndexDBCore.loadedDatabases[dbId];
      if (!db) return;
      await db.waitTillTranscationDone();
      db.open();
      if (onDone) onDone();
    },
    "deferred"
  );
}
