import {
  ChecktaskExistData,
  ChecktaskExistResultData,
  CompleteRemoteTasksData,
  ConnectPortTasksData,
  InternalHeader,
  SetReadyTasksData,
  RunRemoteTasksData,
  ThreadsInternalMessageIds,
} from "./Messages.js";
import { Threads } from "../Threads.js";
import { Thread } from "../Threads/Thread.js";
import { TaskRunFunction } from "../Thread.types.js";

type messageFunction<MessageData extends any> = (
  data: MessageData,
  thread: Thread,
  event: MessageEvent
) => void;
const m = <MessageData extends any>(
  m: messageFunction<MessageData>
): messageFunction<MessageData> => m;
let count = 0;
export class InternalTasks {
  static INTERNAL_CODE: InternalHeader = "__internal__";

  static _tasks = new Map<string | number, TaskRunFunction<any, any>>();
  static _waiting = new Map<
    string | number,
    Map<number, (data: any) => void>
  >();
  static getTasks(id: string | number) {
    const tasks = this._tasks.get(id);
    if (!tasks) return false;
    return tasks;
  }

  static isInternal(data: any) {
    if (!Array.isArray(data)) return false;
    if (data[0] != InternalTasks.INTERNAL_CODE) return false;
    if (typeof data[1] !== "number") return false;
    if (!(MessageFunctions as any)[data[1]]) return false;
    return true;
  }
  static getInternal(data: any) {
    if (!(MessageFunctions as any)[data[1]]) return false;
    return (MessageFunctions as any)[data[1]];
  }
  static runInternal(data: any, thread: Thread, event: any) {
    const tasks = this.getInternal(data);
    if (!tasks) {
      return;
    }
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

const MessageFunctions: Record<
  ThreadsInternalMessageIds,
  messageFunction<any>
> = {
  [ThreadsInternalMessageIds.connectPort]: m<ConnectPortTasksData>(
    (data, thread, event) => {
      const taskData = data[2];
      const threadName = taskData[0];
      const threadManager = taskData[1];

      let port: MessagePort;
      if (Threads.environment == "browser") {
        port = (event as MessageEvent).ports[0];
      } else {
        port = taskData[2];
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
  ),
  [ThreadsInternalMessageIds.setReady]: m<SetReadyTasksData>((data, thread) => {
    const taskData = data[2];
    Thread.readySet.add(thread);
    thread.name = taskData[0];
    thread.index = taskData[1];
  }),

  [ThreadsInternalMessageIds.runTask]: m<RunRemoteTasksData>(
    async (data, thread, event) => {
      const taskData = data[2];
      const tasksId = taskData[0];
      const takss = InternalTasks.getTasks(tasksId);
      if (!takss) {
        console.warn(
          `Tried running task ${tasksId} | Thread ${Threads.threadName} | Origin Thread ${thread.name}`
        );
        return;
      }

      const promiseId = taskData[1];
      const runData = taskData[2];

      const taskReturn = takss(runData, thread, event);
      //not expecting a return
      if (promiseId < 0) return;
      let taskReturnData = null;
      if (taskReturn instanceof Promise) {
        taskReturnData = await taskReturn;
      } else {
        taskReturnData = taskReturn;
      }
      let returnData: any = null;
      let transfers: any = null;
      if (Array.isArray(taskReturnData)) {
        returnData = taskReturnData[0];
        transfers = taskReturnData[1];
      }

      MessageCursors.completeTasks[2][0] = tasksId;
      MessageCursors.completeTasks[2][1] = promiseId;
      MessageCursors.completeTasks[2][2] = returnData;

      thread.sendMessage<CompleteRemoteTasksData>(
        MessageCursors.completeTasks,
        transfers
      );
      MessageCursors.completeTasks[2][2] = null;
    }
  ),
  [ThreadsInternalMessageIds.completeTasks]: m<CompleteRemoteTasksData>(
    (data, thread) => {
      const taskData = data[2];
      const tasksId = taskData[0];
      const promiseId = taskData[1];
      const tasksData = taskData[2];
      InternalTasks.completePromiseTasks(tasksId, promiseId, tasksData);
    }
  ),
  [ThreadsInternalMessageIds.checkTasks]: m<ChecktaskExistData>(
    (data, thread) => {
      const taskData = data[2];
      MessageCursors.cehckTasksResult[2][0] = InternalTasks.getTasks(
        taskData[0]
      )
        ? true
        : false;
      MessageCursors.cehckTasksResult[2][1] = taskData[1];
      thread.sendMessage<ChecktaskExistResultData>(
        MessageCursors.cehckTasksResult
      );
    }
  ),
  [ThreadsInternalMessageIds.checkTasksResult]: m<ChecktaskExistResultData>(
    (data) => {
      const result = data[2][0];
      const promiseId = data[2][1];
      InternalTasks.completePromiseTasks("tasks-check", promiseId, result);
    }
  ),
};
export const MessageCursors = {
  runTask: <RunRemoteTasksData>[
    InternalTasks.INTERNAL_CODE,
    ThreadsInternalMessageIds.runTask,
    ["", 0, null],
  ],
  completeTasks: <CompleteRemoteTasksData>[
    InternalTasks.INTERNAL_CODE,
    ThreadsInternalMessageIds.completeTasks,
    ["", 0, null],
  ],

  checkTasks: <ChecktaskExistData>[
    InternalTasks.INTERNAL_CODE,
    ThreadsInternalMessageIds.checkTasks,
    ["", 0],
  ],
  cehckTasksResult: <ChecktaskExistResultData>[
    InternalTasks.INTERNAL_CODE,
    ThreadsInternalMessageIds.checkTasksResult,
    [false, 0],
  ],
};
