import { WebSocketServer, type WebSocket } from "ws";
import { ServerSocketConnection } from "./ServerSocketConnection";
import { randomUUID } from "crypto";
import { HTTPSServer } from "../Server/HTTPSServer";
import { Observable } from "@amodx/core/Observers";
/**# WSSServer
 * ---
 * Create a securre web socket server from a https server.
 */
export class WSSServer {
  _socketServer: WebSocketServer;
  _connection: ServerSocketConnection[] = [];
  _connectionMap = new Map<string, ServerSocketConnection>();
  id = randomUUID();

  observers = {
    connection: new Observable<ServerSocketConnection>(),
  };

  constructor(public httpsServer: HTTPSServer) {}

  open() {
    this._socketServer = new WebSocketServer({
      server: this.httpsServer._server,
    });
    this._socketServer.on("connection", (ws) => {
      const connection = new ServerSocketConnection(this, ws);
      this._connection.push(connection);
      this._connectionMap.set(connection.id, connection);
      this.observers.connection.notify(connection);
    });
  }

  broadCast(data: any) {
    for (const connection of this._connection) {
      connection.send(data);
    }
  }
}
