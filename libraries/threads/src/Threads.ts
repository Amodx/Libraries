//types
import type { ThreadPoolData } from "./Types/ThreadPool.types";

//classes
import { Thread } from "./Threads/Thread.js";
import { SyncedQueue } from "./Queue/SyncedQueue.js";
import { TasksManager } from "./Tasks/TaskManager.js";
import { DataSyncManager } from "./Data/DataSyncManager.js";
import { InternalTasks } from "./Internal/InternalTasks.js";
import { ThreadPool } from "./Threads/ThreadPool.js";

export class Threads {
  static threadNumber = 0;
  static threadName = "unamed-threadcomm-thread";
  static environment: "node" | "browser" = "browser";
  static _threads = new Map<string, Thread>();
  static _threadPools = new Map<string, ThreadPool>();

  static _queues = new Map<string, Map<string, SyncedQueue>>();

  static parent = new Thread("");
  static internal = InternalTasks;

  static __initalized = false;
  static __expectedPorts: Record<string, boolean> = {};

  static async init(threadName: string, threadParentName: string) {
    this.threadName = threadName;
    this.parent.name = threadParentName;
    const port = await this.getWorkerPort();
    this.parent.setPort(port);
    this.__initalized = true;
    this.addThread(this.parent);
  }

  static getSyncedQueue(threadId: string, queueId: string) {
    if (!this._queues.has(threadId)) return;
    return this._queues.get(threadId)?.get(queueId);
  }

  static addThread(thread: Thread) {
    this._threads.set(thread.name, thread);
  }

  static createThread<T>(name: string, mergeObject: T = <T>{}): T & Thread {
    const newThread = Object.assign<Thread, typeof mergeObject>(
      new Thread(name),
      mergeObject
    );
    this._threads.set(name, newThread);
    return newThread;
  }

  static createThreadPool(data: ThreadPoolData) {
    const newThreadPool = new ThreadPool(data);
    this._threadPools.set(data.name, newThreadPool);
    return newThreadPool;
  }

  static getThread(id: string) {
    const thread = this._threads.get(id);
    if (!thread) throw new Error(`Thread with id ${id} doest not exist`);
    return thread;
  }

  static getThreadPool(id: string) {
    const threadPool = this._threadPools.get(id);
    if (!threadPool)
      throw new Error(`Thread pool with id ${id} doest not exist`);
    return threadPool;
  }

  static async getWorkerPort() {
    if (this.environment == "browser") {
      return self;
    }
    if (this.environment == "node") {
      //@ts-ignore
      const { parentPort } = require("worker_threads");
      return parentPort;
    }
  }

  static registerTasks<T>(
    id: string | number,
    run: (data: T, onDone?: (data?: any, transfers?: any) => void) => void,
    mode: "async" | "deferred" = "async"
  ) {
    TasksManager.registerTasks(id, run, mode);
  }

  static onDataSync<T, K>(
    dataType: string | number,
    onSync?: (data: T) => void,
    onUnSync?: (data: K) => void
  ) {
    return DataSyncManager.registerDataSync(dataType, onSync, onUnSync);
  }
}
if (
  //@ts-ignore
  typeof process !== "undefined" &&
  typeof Worker === "undefined" &&
  typeof window === "undefined"
) {
  Threads.environment = "node";
}
