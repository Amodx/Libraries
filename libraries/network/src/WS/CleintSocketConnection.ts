import {
  SocketConnectionDataTypes,
  SocketConnectonBase,
} from "./SocketConnectionBase";

export class CleintSocketConnection<
  T extends SocketConnectionDataTypes = string
> extends SocketConnectonBase<T> {
  private socket: WebSocket;
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
  constructor(
    public data: {
      url: string;
      binaryType?: "arraybuffer" | "blob";
      protocols?: string | string[] | undefined;
    }
  ) {
    super();
    this.socket = new WebSocket(this.data.url, this.data.protocols);
    if (this.data.binaryType) {
      this.socket.binaryType = this.data.binaryType;
    }
  }

  open() {
    return new Promise<boolean>((resolve, reject) => {
      try {
        this.socket.onerror = (ev) => {
          if (!this._opened) reject(false);
          this.observers.error.notify(ev);
        };
        this.socket.onopen = () => {
          this.observers.opened.notify();
          this._opened = true;
          resolve(true);
        };
        this.socket.onclose = () => {
          this.observers.closed.notify();
        };
        this.socket.onmessage = (ev) => {
          this.observers.message.notify(ev.data as T);
        };
      } catch (error) {
        console.error("Error opening web socket", error);
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
