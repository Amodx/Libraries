import { Threads } from "@amodx/threads";
import { IndexDB } from "../IndexDB.js";

export class SecureIDBWrap {
  static dbs = new Map<string, IDBDatabase>();
  static clear(id: string) {
    const cdb = SecureIDBWrap.dbs.get(id)!;
    if (!cdb) return;
    cdb.close();
    SecureIDBWrap.dbs.delete(id)!;
  }
  connectionId = crypto.randomUUID();

  constructor(public id: string, public data: IDBDatabase) {
    if (SecureIDBWrap.dbs.get(id)) {
      const cdb = SecureIDBWrap.dbs.get(id)!;
      cdb.close();
    }
    SecureIDBWrap.dbs.set(this.id, data)!;

    IndexDB.core.dataBase.setData("meta", `${this.connectionId}-${id}`, {
      time: new Date().toLocaleTimeString(),
      dataBaseId: id,
      thread: {
        name: Threads.threadName,
        number: Threads.threadNumber,
        parent: Threads.parent.name,
      },
    });
  }

  get() {
    return this.data;
  }
  null() {
    SecureIDBWrap.clear(this.id);

    IndexDB.core.dataBase.removeData("meta", `${this.connectionId}-${this.id}`);
  }
}
