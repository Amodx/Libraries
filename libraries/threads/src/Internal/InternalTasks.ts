import { ThreadsInternalMessages, ThreadsMessageHeaders } from "./Messages.js";
import type { MessageFunction } from "../Types/Util.types.js";
import { Threads } from "../Threads.js";
import { PromiseTasks } from "../Tasks/PromiseTasks.js";
import { SyncedQueue } from "../Queue/SyncedQueue.js";
import { TasksManager } from "../Tasks/TaskManager.js";
import { DataSyncManager } from "../Data/DataSyncManager.js";
export class InternalTasks {
  static _tasks = new Map<number, Map<number, MessageFunction>>();

  static registerTasks(headID: number, taskId: number, run: MessageFunction) {
    let map = this._tasks.get(headID);
    if (!map) {
      map = new Map();
      this._tasks.set(headID, map);
    }
    map.set(taskId, run);
  }

  static isInternal(data: any) {
    const headerId = data[0];
    const tasksId = data[1];
    if (typeof headerId !== "number" || typeof tasksId !== "number")
      return false;
    const map = this._tasks.get(headerId);
    if (!map) return false;
    const tasks = map.get(tasksId);
    if (!tasks) return false;
    return true;
  }

  static runInternal(data: any, event: any) {
    const headerId = data[0];
    const tasksId = data[1];
    const map = this._tasks.get(headerId);
    if (!map) return false;
    const tasks = map.get(tasksId);
    if (!tasks) return false;
    data.shift();
    data.shift();
    tasks(data, event);
  }
}

InternalTasks.registerTasks(
  ThreadsMessageHeaders.internal,
  ThreadsInternalMessages.connectPort,
  (data, event) => {
    const threadName = data[0];
    const threadManager = data[1];

    let port: MessagePort;
    if (Threads.environment == "browser") {
      port = (event as MessageEvent).ports[0];
    } else {
      port = data[2];
    }
    if (threadManager == "worker") {
      const thread = Threads.getThread(threadName);
      if (thread) thread.setPort(port);
    }
    if (threadManager != "worker") {
      const thread = Threads.getThreadPool(threadManager);
      if (thread) thread.addPort(port);
    }
  }
);
InternalTasks.registerTasks(
  ThreadsMessageHeaders.internal,
  ThreadsInternalMessages.IsReady,
  (data, event) => {
    const name = data[0];
    const comm = Threads.getThread(name);
    if (!comm) return;
    comm.__ready = true;
  }
);

InternalTasks.registerTasks(
  ThreadsMessageHeaders.internal,
  ThreadsInternalMessages.nameThread,
  (data, event) => {
    const name = data[0];
    const number = data[1];
    Threads.threadName = name;
    Threads.threadNumber = number;
  }
);

InternalTasks.registerTasks(
  ThreadsMessageHeaders.internal,
  ThreadsInternalMessages.syncQueue,
  (data, event) => {
    const threadName = data[0];
    const queueId = data[1];
    const queueSAB = data[2];
    if (!Threads._queues.has(threadName)) {
      Threads._queues.set(threadName, new Map());
    }
    //@ts-ignore
    Threads._queues
      .get(threadName)
      .set(queueId, new SyncedQueue(queueId, queueSAB));
  }
);

InternalTasks.registerTasks(
  ThreadsMessageHeaders.internal,
  ThreadsInternalMessages.unSyncQueue,
  (data, event) => {
    const threadName = data[0];
    const queueId = data[1];
    if (!Threads._queues.has(threadName)) {
      return;
    }
    Threads._queues.get(threadName)!.delete(queueId);
  }
);
InternalTasks.registerTasks(
  ThreadsMessageHeaders.internal,
  ThreadsInternalMessages.completeTasks,
  (data, event) => {
    const tasksId = data[0];
    const requestsId = data[1];
    const tasksData = data[2];
    PromiseTasks.completePromiseTasks(tasksId, requestsId, tasksData);
  }
);
InternalTasks.registerTasks(
  ThreadsMessageHeaders.internal,
  ThreadsInternalMessages.checkTasksResult,
  (data, event) => {
    const result = data[0];
    const promiseId = data[1];

    PromiseTasks.completePromiseTasks("tasks-check", promiseId, result);
  }
);

const __handleTasksDone = (
  tasksId: string,
  mode: number,
  threadId: string,
  tid: string,
  tasksData: any,
  transfers: any
) => {
  if (mode == 1) {
    const thread = Threads.getThread(threadId);
    thread &&
      thread.sendMessage(
        ThreadsMessageHeaders.internal,
        [ThreadsInternalMessages.completeTasks, tasksId, tid, tasksData],
        transfers
      );
  }
  if (mode == 2) {
    //complete queue
    if (tid && threadId) {
      const queue = Threads.getSyncedQueue(threadId, tid);
      if (queue) {
        queue.subtractFromCount();
      }
    }
  }
};
InternalTasks.registerTasks(
  ThreadsMessageHeaders.internal,
  ThreadsInternalMessages.runTasks,
  async (data, event) => {
    //remove tasks id
    const tasksId = data.shift();
    //remove thread id
    const threadId = data.shift();
    //remove queue id
    const mode = data.shift();
    //remove queue id
    const tid = data.shift();

    const takss = TasksManager.getTasks(tasksId);
    if (!takss) return;

    if (takss.mode == "async") {
      const tasksData = await takss.run(data[0]);
      __handleTasksDone(tasksId, mode, threadId, tid, tasksData, []);
    }
    if (takss.mode == "deferred") {
      await takss.run(data[0], (tasksData: any, transfers: any) => {
        __handleTasksDone(tasksId, mode, threadId, tid, tasksData, transfers);
      });
    }
  }
);

InternalTasks.registerTasks(
  ThreadsMessageHeaders.internal,
  ThreadsInternalMessages.checkTasks,
  async (data, event) => {
    //remove tasks id
    const tasksId = data.shift();
    //remove thread id
    const threadId = data.shift();
    //remove promise id
    const promiseId = data.shift();

    const thread = Threads.getThread(threadId);
    const takss = TasksManager.getTasks(tasksId);

    if (!takss) return;

    if (takss && thread) {
      thread.sendMessage(ThreadsMessageHeaders.internal, [
        ThreadsInternalMessages.checkTasksResult,
        true,
        promiseId,
      ]);
    }
    if (!takss && thread) {
      thread.sendMessage(ThreadsMessageHeaders.internal, [
        ThreadsInternalMessages.checkTasksResult,
        false,
        promiseId,
      ]);
    }
  }
);

InternalTasks.registerTasks(
  ThreadsMessageHeaders.internal,
  ThreadsInternalMessages.SyncData,
  async (data, event) => {
    //remove tasks id
    const dataTypeId = data.shift();
    const dataSync = DataSyncManager.getDataSync(dataTypeId);
    if (!dataSync) return false;
    const syncData = data.shift();
    dataSync.sync(syncData);
  }
);

InternalTasks.registerTasks(
  ThreadsMessageHeaders.internal,
  ThreadsInternalMessages.UnSyncData,
  async (data, event) => {
    //remove tasks id
    const dataTypeId = data.shift();
    const dataSync = DataSyncManager.getDataSync(dataTypeId);
    if (!dataSync) return false;
    const unSyncData = data.shift();
    dataSync.unSync(unSyncData);
  }
);
