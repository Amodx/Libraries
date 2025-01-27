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
