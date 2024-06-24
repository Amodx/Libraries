import { type WebSocket, type RawData } from "ws";
import { randomUUID } from "crypto";
import { WSSServer } from "./WSSServer";
import {
  SocketConnectionDataTypes,
  SocketConnectonBase,
} from "./SocketConnectionBase";
export class ServerSocketConnection<
  T extends SocketConnectionDataTypes = string
> extends SocketConnectonBase<T> {
  id = randomUUID();
  broadCast = false;
  get __socket() {
    return this.socket;
  }
  private _closed = false;
  get closed() {
    return this._closed;
  }
  private _opened = false;
  get opened() {
    return this._opened;
  }
  constructor(public server: WSSServer, private socket: WebSocket) {
    super();
    this.server.httpsServer._logger.debug("Connection opened", this.id);
  }

  open() {
    return new Promise<boolean>((resolve, reject) => {
      try {
        this.socket.on("error", (ev) => {
          if (!this._opened) reject(false);
          this.observers.error.notify(ev as any);
        });
        this.socket.on("open", () => {
          this.observers.opened.notify();
          this._opened = true;
          resolve(true);
        });
        this.socket.on("close", (ev) => {
          this.observers.closed.notify();
        });
        this.socket.on("message", (ev) => {
          this.observers.message.notify(ev as T);
        });
        if (this.socket.OPEN) return resolve(true);
      } catch (error: any) {
        reject(false);
      }
    });
  }

  send(data: T) {
    if (this.closed) return false;
    this.socket.send(data as any);
    return true;
  }

  close() {
    if (this.closed) return false;
    this.socket.close();
    return true;
  }
}
