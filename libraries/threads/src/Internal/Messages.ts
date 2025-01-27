export enum ThreadsInternalMessageIds {
  setReady,
  connectPort,
  runTask,
  completeTasks,
  checkTasks,
  checkTasksResult,
}

export type InternalHeader = "__internal__";

export type ThreadsInternalMessageData<
  Message extends ThreadsInternalMessageIds,
  Data extends any = any,
> = [internalHeader: InternalHeader, message: Message, data: Data];

export type SetReadyTasksData = ThreadsInternalMessageData<
  ThreadsInternalMessageIds.setReady,
  [threadName: string, threadNumber: number]
>;

export type ConnectPortTasksData = ThreadsInternalMessageData<
  ThreadsInternalMessageIds.connectPort,
  [name: string, threadPoolName: string, messagePort: MessagePort]
>;

export type RunRemoteTasksData<TaskData extends any = any> =
  ThreadsInternalMessageData<
    ThreadsInternalMessageIds.runTask,
    [id: string | number, promiseId: number, data: TaskData]
  >;

export type CompleteRemoteTasksData<ReturnData extends any = any> =
  ThreadsInternalMessageData<
    ThreadsInternalMessageIds.completeTasks,
    [id: string | number, promiseId: number, data: ReturnData]
  >;

export type ChecktaskExistData = ThreadsInternalMessageData<
  ThreadsInternalMessageIds.checkTasks,
  [taskId: string, promiseId: number]
>;

export type ChecktaskExistResultData = ThreadsInternalMessageData<
  ThreadsInternalMessageIds.checkTasksResult,
  [exist: boolean, promiseId: number]
>;
