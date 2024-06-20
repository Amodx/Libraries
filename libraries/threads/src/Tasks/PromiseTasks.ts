export class PromiseTasks {
  static _waiting = new Map<
    string | number,
    Map<string | number, (data: any) => void>
  >();

  static addPromiseTakss(
    tasksId: string | number,
    tasksRequestsId: string | number,
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
    tasksRequestsId: string | number,
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
