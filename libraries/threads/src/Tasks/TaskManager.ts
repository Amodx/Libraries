import { Task } from "./Tasks.js";

export class TasksManager {
  static _tasks = new Map<string | number, Task<any>>();

  static registerTasks<T>(
    id: string | number,
    run: (data: T, onDone?: (data?: any, transfers?: any) => void) => void,
    mode: "async" | "deferred" = "async"
  ) {
    const tasks = new Task<T>(id, run, mode);
    this._tasks.set(id, tasks);
    return tasks;
  }

  static getTasks(id: string | number) {
    const tasks = this._tasks.get(id);
    if (!tasks) return false;
    return tasks;
  }
}
