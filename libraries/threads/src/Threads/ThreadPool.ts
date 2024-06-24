//types
import type { CommPortTypes } from "../Types/Thread.types.js";
import type { MessageFunction, MessageRecord } from "../Types/Util.types.js";
import type { ThreadPoolData } from "../Types/ThreadPool.types.js";
//constants
import {
  ThreadsMessageHeaders,
  ThreadsInternalMessages,
} from "../Internal/Messages.js";
//classes
import { Thread } from "./Thread.js";
import { QueueManager } from "../Queue/QueueManager.js";
import { Threads } from "../Threads.js";

export class ThreadPool {
  private _totalThreads = 0;
  private _currentThread = 0;
  name = "";
  private __threads: Thread[] = [];
  private __data: ThreadPoolData = {
    name: "",
    onPortSet: (port, threadName) => {},
  };
  private __queues: Record<string, QueueManager<any>> = {};
  messageFunctions: MessageRecord = {};

  constructor(data: ThreadPoolData) {
    this.__data = data;
    this.name = data.name;
  }

  getThreads() {
    return this.__threads;
  }

  private __throwError(message: string) {
    throw new Error(`[ThreadCommManager : ${this.__data.name}] ${message}`);
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
      if (!thread.isPortSet()) ready = false;
    }
    return ready;
  }

  waitTillAllAreReady() {
    const self = this;
    return new Promise<boolean>((resolve, reject) => {
      const inte = setInterval(() => {
        if (this.isReady()) {
          clearInterval(inte);
          resolve(true);
        }
      }, 1);
    });
  }

  addPort(port: CommPortTypes) {
    this._totalThreads++;
    const newCommName = `${this.__data.name}-${this._totalThreads}`;
    const newComm = new Thread(newCommName, this.__data.name, this);
    Threads.addThread(newComm);
    newComm.setPort(port);
    this.__data.onPortSet(port, newCommName);

    this.__threads.push(newComm);
    newComm.sendMessage(ThreadsMessageHeaders.internal, [
      ThreadsInternalMessages.nameThread,
      newCommName,
      this._totalThreads,
    ]);
  }
  addPorts(ports: CommPortTypes[]) {
    for (const port of ports) {
      this.addPort(port);
    }
  }
  addComms(threads: Thread[]) {
    this._totalThreads += threads.length;
    this.__threads.push(...threads);
  }

  __isManagerMessage(data: any) {
    return this.messageFunctions[data[0]] !== undefined;
  }

  __handleManagerMessage(data: any, event: any) {
    if (!this.messageFunctions[data[0]]) return;
    this.messageFunctions[data[0]].forEach((_) => _(data, event));
  }

  listenForMessage(message: string | number, run: MessageFunction) {
    this.messageFunctions[message] ??= [];
    this.messageFunctions[message].push(run);
  }

  sendMessageToAll(
    message: string | number,
    data: any[] = [],
    transfers?: any[]
  ) {
    for (const thread of this.__threads) {
      thread.sendMessage(message, data, transfers);
    }
  }

  runTasksForAll<T>(
    id: string,
    data: T,
    transfers: any[] = [],
    queueId?: string
  ) {
    for (const thread of this.__threads) {
      thread.runTasks(id, data, transfers, queueId);
    }
  }

  runTask<T>(
    id: string | number,
    data: T,
    transfers: any[] = [],
    threadNumber = -1,
    queueId?: string
  ) {
    if (threadNumber < 0) {
      const thread = this.__threads[this._currentThread];
      thread.runTasks(id, data, transfers, queueId);
      return this.__handleCount();
    } else {
      const thread = this.__threads[threadNumber];
      thread.runTasks(id, data, transfers, queueId);
      return threadNumber;
    }
  }

  runPromiseTasks<T>(
    id: string | number,
    data: T,
    transfers: any[] = [],
    onDone: (data: any) => void,
    threadNumber?: number,
    excludeThread = -1
  ) {
    if (typeof threadNumber === "undefined") {
      if (this._currentThread == excludeThread) {
        this.__handleCount();
      }
      const thread = this.__threads[this._currentThread];
      thread.runPromiseTasks(id, data, transfers, onDone);
      return this.__handleCount();
    } else {
      const thread = this.__threads[threadNumber];
      thread.runPromiseTasks(id, data, transfers, onDone);
      return threadNumber;
    }
  }

  runAsyncTasks<T = any, K = any>(
    id: string | number,
    data: T,
    transfers: any[] = [],
    threadNumber?: number,
    excludeThread = -1
  ): Promise<K> {
    return new Promise<K>((resolve) => {
      this.runPromiseTasks(
        id,
        data,
        transfers,
        (data) => {
          resolve(data);
        },
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

  addQueue<T>(
    id: string | number,
    associatedTasksId: string | number,
    getQueueKey: ((data: T) => string) | null = null,
    beforeRun: (data: T) => T = (data: T) => data,
    afterRun: (data: T, thread: number) => void = (
      data: T,
      thread: number
    ) => {},
    getThread: (data: T) => number = (data: T) => -1,
    getTransfers: (data: T) => any[] = (data) => []
  ) {
    if (this.__queues[id]) {
      this.__throwError(`Queue with ${id} already exists.`);
    }
    const newQueue = new QueueManager<T>(
      id,
      (data, queueId) => {
        data = beforeRun(data);
        const thread = this.runTask(
          associatedTasksId,
          data,
          getTransfers(data),
          getThread(data),
          queueId
        );
        afterRun(data, thread);
      },
      this,
      getQueueKey
    );
    this.__queues[id] = newQueue;
    return newQueue;
  }

  getQueue<T>(id: string | number) {
    const queue = this.__queues[id];
    if (!queue) {
      this.__throwError(`Queue with ${id} does not exists.`);
    }
    return <QueueManager<T>>queue;
  }



  syncData<T>(dataType: string | number, data: T) {
    for (const thread of this.__threads) {
      thread.syncData(dataType, data);
    }
  }

  unSyncData<T>(dataType: string | number, data: T) {
    for (const thread of this.__threads) {
      thread.unSyncData(dataType, data);
    }
  }
}
