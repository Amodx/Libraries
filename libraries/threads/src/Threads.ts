//classes
import { Thread } from "./Threads/Thread.js";
import { ThreadPool } from "./Threads/ThreadPool.js";
import { TaskRunFunction, ThreadPortTypes } from "./Thread.types.js";
import { InternalTasks } from "./Internal/InternalTasks.js";

let initalized = false;

export class Threads {
  static threadNumber = 0;
  static threadName = "unamed-threadcomm-thread";
  static environment: "node" | "browser" = "browser";
  static _threads = new Map<string, Thread>();
  static _threadPools = new Map<string, ThreadPool>();

  static parent = new Thread("parent", 0);

  static get isInitalized() {
    return initalized;
  }

  static async init(
    threadName: string,
    parentPort: ThreadPortTypes,
    threadParentName: string = "window"
  ) {
    this.threadName = threadName;
    this.parent.name = threadParentName;
    this.parent.setPort(parentPort);
    initalized = true;
    this.addThread(this.parent);
  }

  static addThread(thread: Thread) {
    this._threads.set(thread.name, thread);
  }

  static createThread<T>(name: string, mergeObject: T = <T>{}): T & Thread {
    const newThread = Object.assign<Thread, typeof mergeObject>(
      new Thread(name, 0),
      mergeObject
    );
    this._threads.set(name, newThread);
    return newThread;
  }

  static createThreadPool(id: string) {
    const newThreadPool = new ThreadPool(id);
    this._threadPools.set(id, newThreadPool);
    return newThreadPool;
  }

  static getThread(id: string) {
    const thread = this._threads.get(id);
    if (!thread) return null;
    return thread;
  }

  static getThreadPool(id: string) {
    const threadPool = this._threadPools.get(id);
    if (!threadPool) return null;
    return threadPool;
  }

  static registerTask<TaskData = any, ReturnData = any>(
    id: string | number,
    run: TaskRunFunction<TaskData, ReturnData>
  ) {
    InternalTasks._tasks.set(id, run);
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
