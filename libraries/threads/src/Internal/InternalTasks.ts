import {
  ChecktaskExistData,
  ChecktaskExistResultData,
  CompleteRemoteTasksData,
  ConnectPortTasksData,
  SetReadyTasksData,
  RunRemoteTasksData,
  ThreadsInternalMessageIds,
} from "./Messages.js";
import { Threads } from "../Threads.js";
import { Thread } from "../Threads/Thread.js";
import {
  BinaryTaskOptions,
  BinaryTaskRunFunction,
  BinaryTaskType,
  BinaryTaskTypes,
  TaskRunFunction,
} from "../Thread.types.js";

type messageFunction<MessageData extends any> = (
  data: MessageData,
  thread: Thread,
  event: MessageEvent
) => void;
const tempTransfer: any[] = [];
function hashMurmur3(key: string, seed = 0) {
  let h = seed ^ key.length;
  for (let i = 0; i < key.length; i++) {
    let k = key.charCodeAt(i);
    k = Math.imul(k, 0xcc9e2d51);
    k = (k << 15) | (k >>> 17);
    k = Math.imul(k, 0x1b873593);
    h ^= k;
    h = (h << 13) | (h >>> 19);
    h = Math.imul(h, 5) + 0xe6546b64;
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0; // Convert to uint32
}
let count = 0;
class BinaryTaskPool {
  pooled = new Map<number, ArrayBuffer[]>();
  get(size: number) {
    return !this.pooled.get(size)?.length
      ? new ArrayBuffer(BinaryTaskType.HeaderSize + size)
      : this.pooled.get(size)!.shift()!;
  }
  return(buffer: ArrayBuffer) {
    const size = buffer.byteLength - BinaryTaskType.HeaderSize;
    let pooled = this.pooled.get(size);
    if (!pooled) {
      pooled = [];
      this.pooled.set(size, pooled);
    }
    pooled.push(buffer);
  }
}

export class InternalTasks {
  static _tasks = new Map<string, TaskRunFunction<any, any>>();
  static _binryTasks = new Map<string, BinaryTaskRunFunction>();
  static _taskMap = new Map<number, BinaryTaskRunFunction>();
  static _taskPalette = new Map<string, number>();
  static _taskRecord = new Map<number, string>();
  static _taskPools = new BinaryTaskPool();

  static _waiting = new Map<
    string | number,
    Map<number, (data: any) => void>
  >();

  static registerTask(id: string, run: TaskRunFunction<any, any>) {
    InternalTasks._tasks.set(id, run);
  }

  static getHashedTaskId(id: string) {
    if (this._taskPalette.has(id)) return this._taskPalette.get(id)!;

    const value = hashMurmur3(id);
    this._taskPalette.set(id, value);
    this._taskRecord.set(value, id);

    return value;
  }

  static registerBinaryTask(
    options: BinaryTaskOptions,
    run: BinaryTaskRunFunction
  ) {
    const id = options.id;
    const hashed = this.getHashedTaskId(id);
    InternalTasks._binryTasks.set(id, run);
    InternalTasks._taskMap.set(hashed, run);
    InternalTasks._taskPalette.set(id, hashed);
    InternalTasks._taskRecord.set(hashed, id);
  }
  static getTasks(id: string) {
    const tasks = this._tasks.get(id);
    if (!tasks) return false;
    return tasks;
  }

  static runInternal(data: any, thread: Thread, event: any) {
    if (data instanceof ArrayBuffer) {
      const view = new DataView(data);
      runBinaryTask(view, thread, event);
      return;
    }
    if (!Array.isArray(data)) {
      console.warn("Threads: Unkown data sent: ", data);
      return;
    }
    const tasks = (MessageFunctions as any)[data[0]];
    if (!tasks) return;
    tasks(data, thread, event);
  }

  static getPromiseId() {
    count++;
    return count;
  }

  static addPromiseTakss(
    tasksId: string | number,
    tasksRequestsId: number,
    onDone: (data: any) => void
  ) {
    let requestsMap = this._waiting.get(tasksId);
    if (!requestsMap) {
      requestsMap = new Map();
      this._waiting.set(tasksId, requestsMap);
    }
    requestsMap.set(tasksRequestsId, onDone);
  }

  static completePromiseTasks(
    tasksId: string | number,
    tasksRequestsId: number,
    data: any
  ) {
    let requestsMap = this._waiting.get(tasksId);
    if (!requestsMap) return;

    const run = requestsMap.get(tasksRequestsId);
    requestsMap.delete(tasksRequestsId);
    if (!run) return;
    run(data);
  }
}
const binaryTaskType = new BinaryTaskType();
function runBinaryTask(view: DataView, thread: Thread, event: MessageEvent) {
  binaryTaskType.setView(view);
  if (binaryTaskType.taskType == BinaryTaskTypes.Internal) {
    if (binaryTaskType.taskId == ThreadsInternalMessageIds.completeTasks) {
      const trueTaskId = InternalTasks._taskRecord.get(binaryTaskType.meta)!;
      InternalTasks.completePromiseTasks(
        trueTaskId,
        binaryTaskType.promiseId,
        view
      );
      InternalTasks._taskPools.return(view.buffer as any);
    }

    return;
  }

  const id = binaryTaskType.taskId;
  const task = InternalTasks._taskMap.get(id);
  if (!task)
    throw new Error(
      `Could not find task for binary task ${id} ${InternalTasks._taskRecord.get(id)}`
    );
  const promiseId = view.getUint32(4);

  const taskReturn = task(view, thread, event);
  //not expecting a return
  if (promiseId < 0) return;
  if (taskReturn instanceof Promise) {
    return taskReturn.then(() => {
      completeBinaryTask(view, thread);
    });
  }
  completeBinaryTask(view, thread);
}
function completeBinaryTask(view: DataView, thread: Thread) {
  binaryTaskType.setView(view);
  binaryTaskType.taskType = BinaryTaskTypes.Internal;
  binaryTaskType.meta = binaryTaskType.taskId;
  binaryTaskType.taskId = ThreadsInternalMessageIds.completeTasks;
  tempTransfer[0] = view.buffer;
  thread.sendMessage(view.buffer, tempTransfer);
  tempTransfer[0] = null;
}

function completeTask(
  thread: Thread,
  tasksId: string,
  promiseId: number,
  taskReturnData: any | [data: any, tranfers: any]
) {
  let returnData: any = null;
  let transfers: any = null;
  if (Array.isArray(taskReturnData)) {
    returnData = taskReturnData[0];
    transfers = taskReturnData[1];
  }
  MessageCursors.completeTasks[1] = tasksId;
  MessageCursors.completeTasks[2] = promiseId;
  MessageCursors.completeTasks[3] = returnData;

  thread.sendMessage<CompleteRemoteTasksData>(
    MessageCursors.completeTasks,
    transfers
  );
  MessageCursors.completeTasks[3] = null;
}

const messageFunction = <MessageData extends any>(
  m: messageFunction<MessageData>
): messageFunction<MessageData> => m;
const MessageFunctions: Record<
  ThreadsInternalMessageIds,
  messageFunction<any>
> = {
  [ThreadsInternalMessageIds.connectPort]:
    messageFunction<ConnectPortTasksData>((data, thread, event) => {
      const threadName = data[1];
      const threadManager = data[2];

      let port: MessagePort;
      if (Threads.environment == "browser") {
        port = (event as MessageEvent).ports[0];
      } else {
        port = data[3];
      }
      if (threadManager == "worker") {
        const thread = Threads.getThread(threadName);
        if (thread) thread.setPort(port);
      }
      if (threadManager != "worker") {
        const thread = Threads.getThreadPool(threadManager);
        if (thread) thread.addPort(port);
      }
    }),
  [ThreadsInternalMessageIds.setReady]: messageFunction<SetReadyTasksData>(
    (data, thread) => {
      Thread.readySet.add(thread);
      thread.name = data[1];
      thread.index = data[2];
    }
  ),

  [ThreadsInternalMessageIds.runTask]: messageFunction<RunRemoteTasksData>(
    (data, thread, event) => {
      const tasksId = data[1];
      const takss = InternalTasks.getTasks(tasksId);
      if (!takss) {
        console.warn(
          `Tried running task ${tasksId} | Thread ${Threads.threadName} | Origin Thread ${thread.name}`
        );
        return;
      }

      const promiseId = data[2];
      const runData = data[3];

      const taskReturn = takss(runData, thread, event);
      //not expecting a return
      if (promiseId < 0) return;
      if (taskReturn instanceof Promise) {
        return taskReturn.then((taskReturnData) => {
          completeTask(thread, tasksId, promiseId, taskReturnData);
        });
      }
      completeTask(thread, tasksId, promiseId, taskReturn);
    }
  ),
  [ThreadsInternalMessageIds.completeTasks]:
    messageFunction<CompleteRemoteTasksData>((data, thread) => {
      const tasksId = data[1];
      const promiseId = data[2];
      const tasksData = data[3];
      InternalTasks.completePromiseTasks(tasksId, promiseId, tasksData);
    }),
  [ThreadsInternalMessageIds.checkTasks]: messageFunction<ChecktaskExistData>(
    (data, thread) => {
      MessageCursors.cehckTasksResult[1] = InternalTasks.getTasks(data[1])
        ? true
        : false;
      MessageCursors.cehckTasksResult[2] = data[2];
      thread.sendMessage<ChecktaskExistResultData>(
        MessageCursors.cehckTasksResult
      );
    }
  ),
  [ThreadsInternalMessageIds.checkTasksResult]:
    messageFunction<ChecktaskExistResultData>((data) => {
      const result = data[1];
      const promiseId = data[2];
      InternalTasks.completePromiseTasks("tasks-check", promiseId, result);
    }),
};
export const MessageCursors = {
  runTask: <RunRemoteTasksData>[ThreadsInternalMessageIds.runTask, "", 0, null],
  completeTasks: <CompleteRemoteTasksData>[
    ThreadsInternalMessageIds.completeTasks,
    "",
    0,
    null,
  ],
  checkTasks: <ChecktaskExistData>[ThreadsInternalMessageIds.checkTasks, "", 0],
  cehckTasksResult: <ChecktaskExistResultData>[
    ThreadsInternalMessageIds.checkTasksResult,
    false,
    0,
  ],
};
