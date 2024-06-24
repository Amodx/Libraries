export enum ThreadsMessageHeaders {
  internal = -999999999000,
}

export enum ThreadsInternalMessages {
  IsReady = -999999999,
  nameThread,
  connectPort,
  syncQueue,
  unSyncQueue,
  completeTasks,
  checkTasksResult,
  runTasks,
  checkTasks,
  message,
  SyncData,
  UnSyncData,
}
