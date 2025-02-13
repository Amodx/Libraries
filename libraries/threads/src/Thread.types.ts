import { Thread } from "./Threads/Thread";

export interface PortInterface {
  postMessage: (data: any, transfers?: any) => void;
  terminate?: () => void;
}
export interface NodeThreadPort {
  postMessage: (data: any, transfers?: any) => void;
  on(event: "close", listener: () => void): this;
  on(event: "message", listener: (value: any) => void): this;
  on(event: "messageerror", listener: (error: Error) => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this;
}

export type ThreadPortTypes = PortInterface | NodeThreadPort;
export type TaskRunFunction<
  MessageData extends any = any,
  ReturnData extends any = any,
> = (
  data: MessageData,
  thread: Thread,
  event: MessageEvent
) =>
  | void
  | Promise<void>
  | [data: ReturnData, transfers?: any[]]
  | Promise<[data: ReturnData, transfers?: any[]]>;

export type BinaryTaskRunFunction = (
  data: DataView,
  thread: Thread,
  event: MessageEvent
) => void | Promise<void>;

export type BinaryTaskOptions = {
  id: string;
  pool?: boolean;
};

export enum BinaryTaskTypes {
  Task,
  Internal,
}

export class BinaryTaskType {
  static HeaderSize =
    //task type
    4 +
    //task id
    4 +
    //promise id
    4 +
    //meta
    4;
  static TaskTypeOffset = 0;
  static TaskIdOffset = 4;
  static PromiseIdOffset = 8;
  static MetaOffset = 12;

  view: DataView;
  setView(view: DataView) {
    this.view = view;
  }
  get taskType(): BinaryTaskTypes {
    return this.view.getUint32(BinaryTaskType.TaskTypeOffset);
  }
  set taskType(value: BinaryTaskTypes) {
    this.view.setUint32(BinaryTaskType.TaskTypeOffset, value);
  }

  get taskId() {
    return this.view.getUint32(BinaryTaskType.TaskIdOffset);
  }
  set taskId(value: number) {
    this.view.setUint32(BinaryTaskType.TaskIdOffset, value);
  }

  get promiseId() {
    return this.view.getUint32(BinaryTaskType.PromiseIdOffset);
  }
  set promiseId(value: number) {
    this.view.setUint32(BinaryTaskType.PromiseIdOffset, value);
  }

  get meta() {
    return this.view.getUint32(BinaryTaskType.MetaOffset);
  }
  set meta(value: number) {
    this.view.setUint32(BinaryTaskType.MetaOffset, value);
  }

  clear() {
    this.taskType = 0;
    this.taskId = 0;
    this.promiseId = 0;
    this.meta = 0;
  }
}
