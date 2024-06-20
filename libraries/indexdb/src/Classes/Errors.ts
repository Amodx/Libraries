import { IndexDB } from "../IndexDB.js";
import { Threads } from "@amodx/threads";

export class IndexDBError extends Error {
  constructor(
    message: string,
    data: {
      blocked?: boolean;
      collection?: string;
      dataBaseID?: string;
      event?: any;
      dataBase?: any;
      functionName?: string;
    }
  ) {
    super();
    console.group();
    console.error(
      `[ZDB ERROR: ${new Date().toLocaleTimeString()}]
   [THREAD: name: ${Threads.threadName} number: ${
        Threads.threadName
      } parent : ${Threads.parent.name}]
   ${message}`,
      data
    );
    console.table(IndexDB.core.loadedDatabases);
    console.groupEnd();
  }
}
