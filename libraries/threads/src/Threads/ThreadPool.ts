//types
import type { ThreadPortTypes } from "../Thread.types.js";
//classes
import { Thread } from "./Thread.js";
import { Threads } from "../Threads.js";

export class ThreadPool {
  private _totalThreads = 0;
  private _currentThread = 0;
  private __threads: Thread[] = [];

  constructor(public name: string) {}

  getThreads() {
    return this.__threads;
  }

  connectToThread(threadToConnectTo: Thread) {
    for (const thread of this.__threads) {
      thread.connectToThread(threadToConnectTo);
    }
  }

  destroyAll() {
    for (const thread of this.__threads) {
      thread.destroy();
    }
  }

  isReady() {
    let ready = true;
    for (const thread of this.__threads) {
      if (!thread.isPortSet) ready = false;
    }
    return ready;
  }

  waitTillAllAreReady() {
    return new Promise<boolean>((resolve, reject) => {
      const inte = setInterval(() => {
        if (this.isReady()) {
          clearInterval(inte);
          resolve(true);
        }
      }, 1);
    });
  }

  addPort(port: ThreadPortTypes) {
    const newCommName = `${this.name}-${this._totalThreads}`;
    const newComm = new Thread(
      newCommName,
      this._totalThreads,
      this.name,
      this
    );
    Threads.addThread(newComm);
    newComm.setPort(port);

    this.__threads.push(newComm);
    this._totalThreads++;
  }
 
  runTaskForAll<TaskData extends any>(
    id: string,
    data: TaskData,
    transfers?: any[] | null
  ) {
    for (let i = 0; i < this.__threads.length; i++) {
      this.__threads[i].runTask(id, data, transfers);
    }
  }

  runTask<TaskData extends any, ReturnData extends any>(
    id: string | number,
    data: TaskData,
    transfers?: any[] | null,
    onDone?: (data: ReturnData) => void | null,
    threadNumber?: number | null,
    excludeThread?: number | null
  ) {
    if (typeof threadNumber !== "number") {
      if (this._currentThread == excludeThread) {
        this.__handleCount();
      }
      const thread = this.__threads[this._currentThread];
      thread.runTask(id, data, transfers, onDone);
      return this.__handleCount();
    } else {
      const thread = this.__threads[threadNumber];
      thread.runTask(id, data, transfers, onDone);
      return threadNumber;
    }
  }

  runTaskAsync<TaskData extends any, ReturnData extends any>(
    id: string | number,
    data: TaskData,
    transfers?: any[] | null,
    threadNumber?: number | null,
    excludeThread?: number | null
  ): Promise<ReturnData> {
    return new Promise<ReturnData>((resolve) => {
      this.runTask<TaskData, ReturnData>(
        id,
        data,
        transfers,
        resolve,
        threadNumber,
        excludeThread
      );
    });
  }

  private __handleCount() {
    let countReturn = this._currentThread;
    this._currentThread++;
    if (this._currentThread >= this._totalThreads) {
      this._currentThread = 0;
    }
    return countReturn;
  }
}
