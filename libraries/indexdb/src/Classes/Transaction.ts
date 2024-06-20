import { DataBase } from "./Database";

export class Transaction {
  private _isComplete = false;

  private objectStore: IDBObjectStore;
  constructor(
    public mode: IDBTransactionMode,
    public dataBase: DataBase,
    _transaction: IDBTransaction,
    public collectionName: string
  ) {
    _transaction.oncomplete = () => {
      this._isComplete = true;
      dataBase._activeTransaction = null;
    };
    this.objectStore = _transaction.objectStore(collectionName);
  }

  isComplete() {
    return this._isComplete;
  }

  get<T = any>(key: string) {
    return new Promise<T>((resolve, reject) => {
      const request: IDBRequest<T> = this.objectStore.get(key);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = (error) => {
        reject(error);
      };
    });
  }
  put(key: string, value: any) {
    return new Promise((resolve, reject) => {
      const request: IDBRequest = this.objectStore.put(key, value);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = (error) => {
        reject(error);
      };
    });
  }
  delete(key: string) {
    return new Promise((resolve, reject) => {
      const request: IDBRequest = this.objectStore.delete(key);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = (error) => {
        reject(error);
      };
    });
  }
}
