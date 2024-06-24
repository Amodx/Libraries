import { HTTPSServer } from "./HTTPSServer";

export class ServerLog {
  constructor(public server: HTTPSServer, public debugEnabled = true) {
  }

  log(...args: any[]) {
    console.log(`[SERVER ${this.server.port}]:`, args);
  }
  error(...args: any[]) {
    console.error(`[SERVER ERROR ${this.server.port}]:`, args);
  }
  debug(...args: any[]) {
    if (!this.debug) return;
    console.log(`[SERVER DEBUG ${this.server.port}]:`, args);
  }
}
