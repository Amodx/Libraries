import type { CommPortTypes, NodeWorker } from "../Types/Thread.types.js";
import type { MessageFunction, MessageRecord } from "../Types/Util.types.js";
import type { ThreadPool } from "./ThreadPool.js";
import { Threads } from "../Threads.js";
import {
  ThreadsMessageHeaders,
  ThreadsInternalMessages,
} from "../Internal/Messages.js";
import { PromiseTasks } from "../Tasks/PromiseTasks.js";
import { InternalTasks } from "../Internal/InternalTasks.js";

export class Thread {
  environment: "node" | "browser" = "browser";
  __ready = false;
  port: CommPortTypes | null = null;
  messageFunctions: MessageRecord = {};
  _pool: ThreadPool | null = null;
  constructor(
    public name: string,
    public managerName = "worker",
    threadPool: ThreadPool | null = null
  ) {
    this._pool = threadPool;
  }

  destroy() {
    if (!this.port) return;
    if ("terminate" in this.port) {
      this.port.terminate();
    }
  }

  isReady() {
    return this.isPortSet();
  }

  private __sendReadySignal() {
    this.sendMessage(ThreadsMessageHeaders.internal, [
      ThreadsInternalMessages.IsReady,
      Threads.threadName,
    ]);
  }

  private __onSetPortRun: (port: CommPortTypes) => void = (port) => {};

  isPortSet() {
    return Boolean(this.port);
  }

  onSetPort(set: (port: CommPortTypes) => void) {
    this.__onSetPortRun = set;
  }

  private __handleMessage(data: any, event: any) {
    this.onMessage(data, event);

    if (InternalTasks.isInternal(data)) {
      return InternalTasks.runInternal(data, event);
    }
    if (this._pool) {
      if (this._pool.__isManagerMessage(data)) {
        this._pool.__handleManagerMessage(data, event);
        return;
      }
    }
    const message = data[0];
    if (this.messageFunctions[message]) {
      this.messageFunctions[message].forEach((_) => _(data, event));
      return;
    }
  }

  setPort(port: CommPortTypes) {
    if (!port) {
      return this.__throwError("Port or worker must not be null.");
    }
    this.port = port;
    this.__onSetPortRun(port);
    if (this.environment == "browser") {
      (port as MessagePort).onmessage = (event: MessageEvent) => {
        this.__handleMessage(event.data, event);
      };
      (port as MessagePort).onmessageerror = (event: MessageEvent) => {
        this.__throwError("Error occured.");
      };
    }
    if (this.environment == "node") {
      (port as NodeWorker).on("message", (data: any[]) => {
        this.__handleMessage(data, data);
      });
      (port as NodeWorker).on("error", (data: any[]) => {
        this.__throwError("Error occured.");
      });
    }
    this.__sendReadySignal();
  }

  private __throwError(message: string) {
    throw new Error(`[ThreadComm: ${this.name}] ${message}`);
  }

  sendMessage(message: string | number, data: any[] = [], transfers?: any[]) {
    if (!this.port) {
      return this.__throwError("Port is not set.");
    }
    if (this.environment == "browser" && transfers) {
      this.port.postMessage([message, ...data], transfers);
      return;
    }
    this.port.postMessage([message, ...data]);
  }

  listenForMessage(message: string | number, run: MessageFunction) {
    this.messageFunctions[message] ??= [];
    this.messageFunctions[message].push(run);
  }

  connectToThread(otherThread: Thread) {
    const channel = new MessageChannel();
    otherThread.__sendInternalMessage(
      ThreadsInternalMessages.connectPort,
      [this.name, this.managerName, channel.port1],
      [channel.port1]
    );

    this.__sendInternalMessage(
      ThreadsInternalMessages.connectPort,
      [otherThread.name, otherThread.managerName, channel.port2],
      [channel.port2]
    );
  }

  runTasks<T>(
    id: string | number,
    data: T,
    transfers: any[] = [],
    queueId?: string
  ) {
    let mode = 0;
    let tid = "";
    if (queueId) {
      mode = 2;
      tid = queueId;
    }
    this.__sendInternalMessage(
      ThreadsInternalMessages.runTasks,
      [id, Threads.threadName, mode, tid, data],
      transfers
    );
  }

  waitTillTasksExist(id: string) {
    return new Promise((resolve) => {
      const inte = setInterval(() => {
        this.tasksExist(id, (exists) => {
          if (exists) {
            resolve(true);
            clearInterval(inte);
          }
        });
      }, 10);
    });
  }

  tasksExist(id: string, onDone: (exist: boolean) => void) {
    const promiseId = `${this.name}-${id}-${Date.now()}`;

    this.__sendInternalMessage(ThreadsInternalMessages.checkTasks, [
      id,
      Threads.threadName,
      promiseId,
    ]);

    PromiseTasks.addPromiseTakss("tasks-check", promiseId, (data: boolean) => {
      onDone(data);
    });
  }

  runPromiseTasks<T>(
    id: string | number,
    data: T,
    transfers: any[] = [],
    onDone: (data: any) => void
  ) {
    const requestsID = crypto.randomUUID();
    PromiseTasks.addPromiseTakss(id, requestsID, onDone);
    this.__sendInternalMessage(
      ThreadsInternalMessages.runTasks,
      [id, Threads.threadName, 1, requestsID, data],
      transfers
    );
  }

  runAsyncTasks<T = any, K = any>(
    id: string | number,
    data: T,
    transfers: any[] = []
  ): Promise<K> {
    return new Promise<K>((resolve) => {
      this.runPromiseTasks(id, data, transfers, (data) => {
        resolve(data);
      });
    });
  }

  private __sendInternalMessage(
    id: number,
    data: any = [],
    transfers: any = []
  ) {
    this.sendMessage(ThreadsMessageHeaders.internal, [id, ...data], transfers);
  }

  syncData<T>(dataType: string | number, data: T, transfers?: any[]) {
    this.__sendInternalMessage(
      ThreadsInternalMessages.SyncData,
      [dataType, data],
      transfers
    );
  }

  unSyncData<T>(dataType: string | number, data: T, transfers?: any[]) {
    this.__sendInternalMessage(
      ThreadsInternalMessages.UnSyncData,
      [dataType, data],
      transfers
    );
  }

  waitTillReady() {
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

  //meant to be over-ridden for debugging or custom behavior
  onMessage(data: any, event: any) {}
}
