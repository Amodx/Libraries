import { IndexDBCore } from "../Core/IndexDBCore.js";

import { ObjectStore } from "./ObjectStore.js";
import { IndexDBError } from "./Errors.js";
import { SecureIDBWrap } from "./SecureIDBWrap.js";
import { Transaction } from "./Transaction.js";
import {
  IndexDBDatabaseCreationData,
  IndexDBObjectStoreData,
} from "Types/Database.types.js";
import { IndexDBSchema } from "Types/Schema.types.js";

export class DataBase {
  dataBaseName = "";
  opened = false;
  __db = <SecureIDBWrap | null>null;

  states = {
    dataUpdating: false,
    objectStoreUpdate: false,
  };

  get db() {
    return this.__db;
  }
  set db(db: SecureIDBWrap | null) {
    if (this.__db != null && db != null) {
      throw new IndexDBError("Overrode active database.", {
        dataBaseID: this.dataBaseName,
        dataBase: this,
      });
    }
    this.__db = db;
  }
  _beingUpgrded = false;
  _openeed: number[] = [];
  _closed: number[] = [];

  _activeTransaction: IDBTransaction | null = null;

  constructor(
    public creationData: IndexDBDatabaseCreationData,
    public outsideIndexDB: boolean = false
  ) {
    this.dataBaseName = this.creationData.databaseName;
  }

  private __open(version?: number) {
    this._openeed.push(performance.now());
    if (this.db) this.close();
    this.db = null;
    SecureIDBWrap.clear(this.dataBaseName);
    return indexedDB.open(this.dataBaseName, version);
  }

  isOpen() {
    return this.db !== null;
  }

  open(): Promise<boolean> | boolean {
    if (this._beingUpgrded) {
      throw new IndexDBError("Tried opening while updating", {
        dataBase: this,
        dataBaseID: this.dataBaseName,
        functionName: this.open.name,
      });
    }

    if (this.isOpen()) return true;

    const prom: Promise<boolean> = new Promise((resolve, reject) => {
      const request = this.__open();
      request.onerror = (event) => {
        reject(false);
        throw new IndexDBError("Opening a database failed.", {
          dataBaseID: this.dataBaseName,
          event: event,
        });
      };
      request.onblocked = (event) => {
        reject(false);
        throw new IndexDBError("Opening a database was blocked", {
          blocked: true,
          dataBaseID: this.dataBaseName,
          event: event,
        });
      };
      request.onsuccess = (event) => {
        this.db = new SecureIDBWrap(this.dataBaseName, request.result);
        this.opened = true;
        resolve(true);
      };
    });
    return prom;
  }

  close(): boolean {
    this._closed.push(performance.now());
    if (!this.db) {
      return false;
    }
    this.opened = false;
    this.db.null();

    this.db = null;
    return true;
  }

  private _openAtVersion(version = 1) {
    const prom: Promise<boolean> = new Promise(async (resolve, reject) => {
      const request = this.__open(version);

      request.onerror = (event) => {
        reject(false);
        throw new IndexDBError("Opening a database failed.", {
          dataBaseID: this.dataBaseName,
          event: event,
          dataBase: this,
          functionName: this._openAtVersion.name,
        });
      };

      request.onblocked = (event) => {
        reject(false);
        throw new IndexDBError("Opening a database was blocked", {
          blocked: true,
          dataBaseID: this.dataBaseName,
          event: event,
          dataBase: this,
          functionName: this._openAtVersion.name,
        });
      };

      request.onsuccess = (event) => {
        this.db = new SecureIDBWrap(this.dataBaseName, request.result);
        this.opened = true;
        resolve(true);
      };
    });
    return prom;
  }

  async __create() {
    return await this.forceUpdate(undefined, true);
  }

  async forceUpdate(removeObjectStores?: string[], newDB = false) {
    let version = newDB ? 1 : await this.getDatabaeVersion();
    if (this._beingUpgrded) {
      throw new IndexDBError("Tried updating while already updating", {
        dataBase: this,
        dataBaseID: this.dataBaseName,
        functionName: this.forceUpdate.name,
      });
    }
    this._beingUpgrded = true;
    this.close();
    return new Promise((resolve, reject) => {
      const request = this.__open(version + 1);
      request.onerror = (event) => {
        this._beingUpgrded = false;
        reject(false);
        throw new IndexDBError("Force update ran into an error.", {
          dataBaseID: this.dataBaseName,
          event: event,
          dataBase: this,
          functionName: this.forceUpdate.name,
        });
      };
      request.onblocked = (event) => {
        this._beingUpgrded = false;
        reject(false);
        throw new IndexDBError("Force update was blocked.", {
          blocked: true,
          dataBaseID: this.dataBaseName,
          event: event,
          dataBase: this,
          functionName: this.forceUpdate.name,
        });
      };

      request.onupgradeneeded = (event) => {
        const db = new SecureIDBWrap(this.dataBaseName, request.result);
        this.db = db;
        if (!this.outsideIndexDB) {
          IndexDBCore.updateDatBaseData(this.creationData);
        }
        if (removeObjectStores) {
          for (const objectStoreName of removeObjectStores) {
            db.get().deleteObjectStore(objectStoreName);
          }
        }
        for (const objectStoreData of this.creationData.objectStores) {
          if (db.get().objectStoreNames.contains(objectStoreData.name))
            continue;
          this._processObjectStoreScehma(
            db.get().createObjectStore(objectStoreData.name),
            objectStoreData.schema
          );
        }
      };

      request.onsuccess = (event) => {
        if (!this.db)
          this.db = new SecureIDBWrap(this.dataBaseName, request.result);
        this.close();
        resolve(true);
        this._beingUpgrded = false;
      };
    });
  }

  private _processObjectStoreScehma(
    objectStore: IDBObjectStore,
    schema: IndexDBSchema
  ) {
    this.__traverseObjectStoreScehma(objectStore, schema);
  }

  private __traverseObjectStoreScehma(
    objectStore: IDBObjectStore,
    schema: IndexDBSchema
  ) {
    for (const node of schema) {
      if (Array.isArray(node)) {
        this.__traverseObjectStoreScehma(objectStore, node as any);
        continue;
      }
      if (node.index) {
        objectStore.createIndex(node.name, node.name, {
          unique: node.isUnique,
        });
      }
      if (node.children) {
        this.__traverseObjectStoreScehma(objectStore, node.children as any);
      }
    }
  }

  async getObjectStore<T = any>(id: string) {
    if (!this.isOpen()) await this.open();
    if (!this.db?.get().objectStoreNames.contains(id)) {
      throw new Error(
        `${id} does not exists in database ${this.creationData.databaseName}`
      );
    }
    return new ObjectStore<T>(this, id);
  }

  async addObjectStore(...data: IndexDBObjectStoreData[]) {
    if (this._beingUpgrded) {
      throw new IndexDBError("Tried adding object store while updating", {
        dataBase: this,
        dataBaseID: this.dataBaseName,
        functionName: this.addObjectStore.name,
      });
    }
    try {
      if (!this.isOpen()) await this.open();
      let count = 0;
      for (const store of data) {
        if (this.db!.get().objectStoreNames.contains(store.name)) continue;
        this.creationData.objectStores.push(store);
        count++;
      }
      this.close();
      if (count) await this.forceUpdate();
      return true;
    } catch (error: any) {
      console.error(error);
      return false;
    }
  }

  async removeObjectStore(objectStoreName: string | string[]) {
    if (this._beingUpgrded) {
      throw new IndexDBError("Tried removing object store while updating", {
        dataBase: this,
        dataBaseID: this.dataBaseName,
        functionName: this.removeObjectStore.name,
      });
    }
    try {
      let deleteObjectStores: string[] = [];
      if (typeof objectStoreName == "string") {
        deleteObjectStores.push(objectStoreName);
      } else {
        deleteObjectStores.push(...objectStoreName);
      }
      const objectStores: any[] = [];
      for (const store of this.creationData.objectStores) {
        if (!deleteObjectStores.includes(store.name)) {
          objectStores.push(store);
        }
      }
      this.creationData.objectStores = objectStores;

      await this.forceUpdate(deleteObjectStores);
      return true;
    } catch (error: any) {
      console.log(
        `Failed making a new object store with the name ${objectStoreName}`
      );
      console.error(error);
      return false;
    }
  }

  getDatabaeVersion() {
    if (this.db) return this.db.get().version;
    const prom: Promise<number> = new Promise((resolve, reject) => {
      const request = this.__open();
      request.onsuccess = (event) => {
        const version = request.result.version;
        this.db = new SecureIDBWrap(this.dataBaseName, request.result);
        this.close();
        resolve(version);
      };
      request.onerror = (event) => {
        reject(false);
        throw new IndexDBError("Get version ran into an error.", {
          dataBaseID: this.dataBaseName,
          event: event,
          dataBase: this,
          functionName: this.getDatabaeVersion.name,
        });
      };
      request.onblocked = (event) => {
        this._beingUpgrded = false;
        reject(false);
        this.getDatabaeVersion.name;
        throw new IndexDBError("Get version was blocked.", {
          blocked: true,
          dataBaseID: this.dataBaseName,
          event: event,
          dataBase: this,
          functionName: this.getDatabaeVersion.name,
        });
      };
    });
    return prom;
  }

  doesObjectStoreExist(objectStoreName: string): boolean {
    if (!this.db) {
      throw new Error(`Database ${this.dataBaseName} is not opened.`);
    }
    if (this.db.get().objectStoreNames.contains(objectStoreName)) {
      return true;
    } else {
      return false;
    }
  }

  waitTillTranscationDone() {
    return new Promise((resolve) => {
      const inte = setInterval(() => {
        if (this._activeTransaction) return;
        clearInterval(inte);
        resolve(true);
      }, 10);
    });
  }
  waitTillUpdatingDone() {
    return new Promise((resolve) => {
      const inte = setInterval(() => {
        if (this._beingUpgrded) return;
        clearInterval(inte);
        resolve(true);
      }, 10);
    });
  }

  getTransaction(mode: IDBTransactionMode, objectStoreName: string) {
    return new Promise<Transaction>(async (resolve, reject) => {
      await this.waitTillUpdatingDone();

      await this.waitTillTranscationDone();

      if (!this.isOpen()) await this.open();

      const transaction = this.db!.get().transaction([objectStoreName], mode);

      this._activeTransaction = transaction;
      resolve(new Transaction(mode, this, transaction, objectStoreName));
    });
  }

  getData<T>(objectStoreName: string, key: string): Promise<T | false> {
    return new Promise(async (resolve, reject) => {
      //   await this.waitTillUpdatingDone();
      //   await this.waitTillTranscationDone();
      if (!this.isOpen()) await this.open();
      const transaction = this.db!.get().transaction(
        [objectStoreName],
        "readonly"
      );
      const objectStore = transaction.objectStore(objectStoreName);
   //   this._activeTransaction = transaction;
      const request: IDBRequest<T> = objectStore.get(key);
      request.onsuccess = (event) => {
        resolve(request.result);
      };
      request.onerror = (event) => {
        reject(false);
     //   this._activeTransaction = null;
        throw new IndexDBError("Error while getting data.", {
          dataBaseID: this.dataBaseName,
          event: event,
          dataBase: this,
          functionName: "getData",
        });
      };

      /*       transaction.oncomplete = () => {
        this._activeTransaction = null;
        if (!request.result) {
          resolve(false);
        } else {
          resolve(request.result);
        }
      }; */
    });
  }

  getAllData<T>(objectStoreName: string): Promise<T[] | false> {
    return new Promise(async (resolve, reject) => {
      await this.waitTillUpdatingDone();
      await this.waitTillTranscationDone();
      if (!this.isOpen()) await this.open();
      const transaction = this.db!.get().transaction(
        [objectStoreName],
        "readonly"
      );
      const request: IDBRequest<T[]> = transaction
        .objectStore(objectStoreName)
        .getAll();
      this._activeTransaction = transaction;
      request.onerror = (event) => {
        reject(false);
        throw new IndexDBError("Error while getting all data.", {
          dataBaseID: this.dataBaseName,
          event: event,
          dataBase: this,
          functionName: "getAllData",
        });
      };
      transaction.oncomplete = () => {
        this._activeTransaction = null;
        if (!request.result) {
          resolve(false);
        } else {
          resolve(request.result);
        }
      };
    });
  }

  getAllKeys(objectStoreName: string): Promise<IDBValidKey[] | false> {
    return new Promise(async (resolve, reject) => {
      await this.waitTillUpdatingDone();
      await this.waitTillTranscationDone();
      if (!this.isOpen()) await this.open();
      const transaction = this.db!.get().transaction(
        [objectStoreName],
        "readonly"
      );
      const request: IDBRequest<IDBValidKey[]> = transaction
        .objectStore(objectStoreName)
        .getAllKeys();
      this._activeTransaction = transaction;
      request.onerror = (event) => {
        reject(false);
        throw new IndexDBError("Error while getting all keys.", {
          dataBaseID: this.dataBaseName,
          event: event,
          dataBase: this,
          functionName: "getAllKeys",
        });
      };
      transaction.oncomplete = () => {
        this._activeTransaction = null;
        if (!request.result) {
          resolve(false);
        } else {
          resolve(request.result);
        }
      };
    });
  }

  removeData(objectStoreName: string, key: string): Promise<boolean> {
    this.states.dataUpdating = true;
    return new Promise(async (resolve, reject) => {
      await this.waitTillUpdatingDone();
      await this.waitTillTranscationDone();
      if (!this.isOpen()) await this.open();
      const transaction = this.db!.get().transaction(
        [objectStoreName],
        "readwrite"
      );
      const request = transaction.objectStore(objectStoreName).delete(key);
      this._activeTransaction = transaction;

      request.onerror = (event) => {
        reject(false);
        this._activeTransaction = null;
        throw new IndexDBError("Error while removing data.", {
          dataBaseID: this.dataBaseName,
          event: event,
          dataBase: this,
          functionName: "removeData",
        });
      };
      transaction.oncomplete = () => {
        resolve(true);
        this._activeTransaction = null;
      };
    });
  }

  removeAllData(objectStoreName: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      await this.waitTillUpdatingDone();
      await this.waitTillTranscationDone();
      if (!this.isOpen()) await this.open();
      const transaction = this.db!.get().transaction(
        [objectStoreName],
        "readwrite"
      );
      const request = transaction.objectStore(objectStoreName).clear();
      this._activeTransaction = transaction;

      request.onerror = (event) => {
        this._activeTransaction = null;
        reject(false);
        throw new IndexDBError("Error while removing all data.", {
          dataBaseID: this.dataBaseName,
          event: event,
          dataBase: this,
          functionName: "removeAllData",
        });
      };
      transaction.oncomplete = () => {
        resolve(true);
        this._activeTransaction = null;
      };
    });
  }

  setData<T>(
    objectStoreName: string,
    key: string,
    setData: T
  ): Promise<boolean> {
    this.states.dataUpdating = true;
    return new Promise(async (resolve, reject) => {
      await this.waitTillUpdatingDone();
      await this.waitTillTranscationDone();
      if (!this.isOpen()) await this.open();
      const transaction = this.db!.get().transaction(
        [objectStoreName],
        "readwrite"
      );
      const request = transaction
        .objectStore(objectStoreName)
        .put(setData, key);
      this._activeTransaction = transaction;

      request.onerror = (event) => {
        reject(false);
        this._activeTransaction = null;
        throw new IndexDBError("Error while setting data.", {
          dataBaseID: this.dataBaseName,
          event: event,
          dataBase: this,
          functionName: "setData",
        });
      };
      transaction.oncomplete = () => {
        resolve(true);
        this._activeTransaction = null;
      };
    });
  }

  updateData<T>(
    objectStoreName: string,
    key: string,
    updateFunction: (data: T) => T
  ): Promise<boolean> {
    this.states.dataUpdating = true;

    return new Promise(async (resolve, reject) => {
      await this.waitTillUpdatingDone();
      await this.waitTillTranscationDone();
      if (!this.isOpen()) await this.open();
      const transaction = this.db!.get().transaction(
        [objectStoreName],
        "readwrite"
      );
      const objectStore = transaction.objectStore(objectStoreName);
      const request = objectStore.get(key);
      this._activeTransaction = transaction;

      request.onerror = (event) => {
        reject(false);
        this._activeTransaction = null;
        throw new IndexDBError("Error while updating data.", {
          dataBaseID: this.dataBaseName,
          event: event,
          dataBase: this,
          functionName: "updateData",
        });
      };
      request.onsuccess = (event) => {
        this._activeTransaction = null;
        //@ts-ignore
        const data = event.target.result;
        if (!data) {
          resolve(false);
          transaction.commit();
          return;
        }

        const newData = updateFunction(data);
        const requestUpdate = objectStore.put(newData);
        requestUpdate.onerror = (event) => {
          this._activeTransaction = null;
          reject(false);
          throw new IndexDBError("Error while updating data.", {
            dataBaseID: this.dataBaseName,
            event: event,
            dataBase: this,
            functionName: "updateData",
          });
        };
        transaction.oncomplete = () => {
          this._activeTransaction = null;
          resolve(true);
        };
      };
    });
  }
}
