export enum ThreadsMessageHeaders {
  internal = -99,
}

export enum ThreadsInternalMessages {
  IsReady = -99,
  nameThread = -98,
  connectPort = -97,
  syncQueue = -96,
  unSyncQueue = -95,
  completeTasks = -94,
  checkTasksResult = -93,
  runTasks = -98,
  checkTasks = -97,
  message = -95,
  SyncData = -990,
  UnSyncData = -980,
}
