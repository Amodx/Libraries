import type { ThreadPortTypes, NodeThreadPort } from "../Thread.types.js";
import type { ThreadPool } from "./ThreadPool.js";
import { Threads } from "../Threads.js";
import {
  ChecktaskExistData,
  ConnectPortTasksData,
  SetReadyTasksData,
  RunRemoteTasksData,
  ThreadsInternalMessageIds,
} from "../Internal/Messages.js";
import { InternalTasks, MessageCursors } from "../Internal/InternalTasks.js";

export class Thread {
  static readySet = new Set();

  get isRemoteReady() {
    return Thread.readySet.has(this);
  }
  get isPortSet() {
    return Boolean(this.port);
  }
  port: ThreadPortTypes | null = null;
  _pool: ThreadPool | null = null;
  constructor(
    public name: string,
    public index: number,
    public threadPoolName = "worker",
    threadPool: ThreadPool | null = null
  ) {
    this._pool = threadPool;
  }

  setPort(port: ThreadPortTypes) {
    this.port = port;
    if (Threads.environment == "browser") {
      const p = port as MessagePort;
      p.onmessage = (event: MessageEvent) => {
        if (InternalTasks.isInternal(event.data)) {
          return InternalTasks.runInternal(event.data, this, event);
        }
      };
      p.onmessageerror = (event: MessageEvent) => {
        console.error(`Error occured in from thread ${this.name}`);
        console.log(event.data);
        console.log(event);
      };
    }
    if (Threads.environment == "node") {
      const p = port as NodeThreadPort;
      p.on("message", (data: any[]) => {
        if (InternalTasks.isInternal(data)) {
          return InternalTasks.runInternal(data, this, data);
        }
      });
      p.on("error", (data: any[]) => {
        console.error(`Error occured in from thread ${this.name}`);
        console.log(data);
      });
    }
    this.sendMessage<SetReadyTasksData>([
      InternalTasks.INTERNAL_CODE,
      ThreadsInternalMessageIds.setReady,
      [this.name, this.index],
    ]);
  }

  sendMessage<Data extends any>(data: Data, transfers?: any[] | null) {
    if (!this.port) {
      throw new Error(
        `Cannot send message to thread [${this.name}] port is not set`
      );
    }
    this.port.postMessage(
      data,
      Threads.environment == "browser" && transfers ? transfers : undefined
    );
  }

  connectToThread(otherThread: Thread) {
    const channel = new MessageChannel();

    otherThread.sendMessage<ConnectPortTasksData>(
      [
        InternalTasks.INTERNAL_CODE,
        ThreadsInternalMessageIds.connectPort,
        [this.name, this.threadPoolName, channel.port1],
      ],
      [channel.port1]
    );

    this.sendMessage<ConnectPortTasksData>(
      [
        InternalTasks.INTERNAL_CODE,
        ThreadsInternalMessageIds.connectPort,
        [otherThread.name, otherThread.threadPoolName, channel.port2],
      ],
      [channel.port2]
    );
  }

  waitTillTaskExist(id: string, checkInterval = 50) {
    let readyToGo = false;
    return new Promise((resolve) => {
      const onExist = (exists: boolean) => {
        if (readyToGo) {
          return clearTimeout(t);
        }
        if (exists) {
          readyToGo = true;
          resolve(true);
          clearTimeout(t);
        } else {
          setTimeout(checkIfExists, checkInterval);
        }
      };
      const checkIfExists = () => {
        this.taskExist(id, onExist);
      };
      let t = setTimeout(checkIfExists, checkInterval);
    });
  }

  taskExist(id: string, onDone: (exist: boolean) => void) {
    const promiseId = InternalTasks.getPromiseId();
    MessageCursors.checkTasks[2][0] = id;
    MessageCursors.checkTasks[2][1] = promiseId;
    this.sendMessage<ChecktaskExistData>(MessageCursors.checkTasks);
    InternalTasks.addPromiseTakss("tasks-check", promiseId, (data: boolean) => {
      onDone(data);
    });
  }

  runTask<TaskData = any, ReturnData = any>(
    id: string | number,
    data: TaskData,
    transfers?: any[] | null,
    onDone?: (data: ReturnData) => void | null
  ) {
    const promiseId = onDone ? InternalTasks.getPromiseId() : -1;
    if (onDone) InternalTasks.addPromiseTakss(id, promiseId, onDone);

    MessageCursors.runTask[2][0] = id;
    MessageCursors.runTask[2][1] = promiseId;
    MessageCursors.runTask[2][2] = data;

    this.sendMessage<RunRemoteTasksData<TaskData>>(
      MessageCursors.runTask,
      transfers
    );

    MessageCursors.runTask[2][2] = null;
  }

  runTaskAsync<TaskData = any, ReturnData = any>(
    id: string | number,
    data: TaskData,
    transfers?: any[] | null
  ): Promise<ReturnData> {
    return new Promise<ReturnData>((resolve) => {
      this.runTask(id, data, transfers, (data) => {
        resolve(data);
      });
    });
  }

  waitTillReady() {
    return new Promise<boolean>((resolve, reject) => {
      const inte = setInterval(() => {
        if (this.isPortSet) {
          clearInterval(inte);
          resolve(true);
        }
      }, 1);
    });
  }

  destroy() {
    Thread.readySet.delete(this);
    if (!this.port) return;
    if ("terminate" in this.port) {
      this.port.terminate!();
    }
  }
}
