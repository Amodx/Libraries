import { Observable } from "@amodx/core/Observers";

export type SocketConnectionDataTypes = string | ArrayBufferLike | Blob | ArrayBufferView;
export abstract class SocketConnectonBase<T extends SocketConnectionDataTypes = string> {
  observers = {
    closed: new Observable<void>(),
    opened: new Observable<void>(),
    error: new Observable<Event>(),
    message: new Observable<T>(),
  };

  abstract open(): Promise<boolean>;
  abstract send(data: T): boolean;
  abstract close(): boolean;
}
