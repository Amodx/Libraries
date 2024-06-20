import { DataSync } from "./DataSync.js";

export class DataSyncManager {
  static _onDataSync = new Map<string | number, DataSync<any, any>>();

  static registerDataSync<T, K>(
    dataType: string | number,
    onSync?: (data: T) => void,
    onUnSync?: (data: K) => void
  ) {
    const sync = new DataSync<T, K>();
    if (onSync) {
      sync.addOnSync(onSync);
    }
    if (onUnSync) {
      sync.addOnUnSync(onUnSync);
    }
    this._onDataSync.set(dataType, sync);
    return sync;
  }

  static getDataSync(id: string | number) {
    const dataSync = this._onDataSync.get(id);
    if (!dataSync) return false;
    return dataSync;
  }
}
