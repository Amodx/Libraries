import https from "https";
import http from "http";
import type { IncomingMessage, ServerResponse } from "http";
import fs from "fs/promises";
import { createReadStream, statSync } from "fs";
import { WSSServer } from "../WS/WSSServer";
import { ServerLog } from "./ServerLog";
import * as zlib from "zlib";
import { FileContentMap } from "./FileContentMap";
import { HTTPAPI } from "./HTTPAPI";

export interface HTTPSServerOptions {
  certKeyPath?: string;
  certCrtPath?: string;
  compress?: boolean;
  port?: number;
  filePath?: string;
}

export interface HTTPSServer extends HTTPSServerOptions {}
export class HTTPSServer {
  host = "localhost";
  port = 8080;
  secure = false;
  compress = false;
  certKeyPath = "./cert/cert.key";
  certCrtPath = "./cert/cert.crt";
  filePath = "./public/";
  _wsServers: WSSServer[] = [];
  _wsServerMap = new Map<string, WSSServer>();
  _logger = new ServerLog(this);
  _server: https.Server | http.Server;

  getBaseURL() {
    return `https://${this.host}:${this.port}`;
  }

  api = new HTTPAPI();

  constructor(options: HTTPSServerOptions) {
    return Object.assign(this, options);
  }

  addSocketServer() {
    const server = new WSSServer(this);
    this._wsServers.push(server);
    this._wsServerMap.set(server.id, server);
    return server;
  }

  async open() {
    const cert = await this._getCert();
    if (!cert) {
      this._logger.error("Could not start https server.");
      this.secure = false;
    } else {
      this.secure = true;
      this._logger.log("Certs found starting https server.");
    }
    if (this.secure && cert) {
      this._server = https.createServer(cert, (req, res) => {
        this._hanldeMessage(req, res);
      });
      this._server.listen(this.port, this.host, () => {
        this._logger.log(
          `Server is running on https://${this.host}:${this.port}`
        );
      });
      this._server.on("upgrade", (request, socket, head) => {
        this._handleUpgrade(request, socket, head);
      });
    }
    if (!this.secure) {
      this._server = http.createServer((req, res) => {
        this._hanldeMessage(req, res);
      });
      this._server.listen(this.port, this.host, () => {
        this._logger.log(
          `Server is running on http://${this.host}:${this.port}`
        );
      });
      this._server.on("upgrade", (request, socket, head) => {
        this._handleUpgrade(request, socket, head);
      });
    }
  }

  private _getFile(path: string) {
    const truePath = `${this.filePath}${path}`;
    try {
      const stat = statSync(truePath);

      return { stat, stream: createReadStream(truePath) };
    } catch (e) {
      this._logger.debug(`Could not find file`, truePath);
      return false;
    }
  }
  private async _getCert() {
    try {
      const key = await fs.readFile(this.certKeyPath);
      const cert = await fs.readFile(this.certCrtPath);
      if (!key || !cert) return false;
      return {
        key,
        cert,
      };
    } catch (error) {
      this._logger.error("Could not load https certs.");
      return false;
    }
  }
  async _handleUpgrade(request: IncomingMessage, socket: any, head: Buffer) {
    //  this._logger.debug("Handle upgrade", request, socket);
  }
  private _hanldeMessage(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & {
      req: IncomingMessage;
    }
  ) {
    const rawURL = req.url!;

    if (!rawURL) {
      res.statusCode = 404;
      res.end(false);
      return;
    }
    const url = new URL(`${this.getBaseURL()}${rawURL}`);
    const baseURL = new URL(url);
    baseURL.search = "";
    let baseURLString = baseURL.toString().replace(this.getBaseURL(), "");

    get: if (req.method == "GET") {
      const point = this.api.GET.get(req.url!.trim());
      if (!point) break get;
      return point.data.run(url, req, res);
    }
    if (req.method == "POST") {
      let body = "";
      const point = this.api.POST.get(req.url!.trim());
      if (!point) {
        res.statusCode = 404;
        res.end(false);
        return this._logger.error(
          `POST point with url ${req.url} does not exist`
        );
      }
      const contentType = req.headers["content-type"] || "";
      res.statusCode = 200;
      if (contentType.includes("@divinevoxel/data")) {
        req.setEncoding("utf8");
      }
      req.on("data", (data) => {
        body += data;
      });
      req.on("end", async () => {
        await point.run(body, req, res);
      });
      return;
    }

    if (baseURLString.split("/").pop()?.indexOf(".") == -1) {
      try {
        const file = this._getFile(
          `.${baseURLString.split("/").join("/")}/index.html`
        );
        if (!file) return res.writeHead(404).end();
        res.setHeader("Connection", "keep-alive");
        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.writeHead(200, {
          "Content-Type": "text/html",
          "Content-Length": file.stat.size,
        });
        return file.stream.pipe(res);
      } catch (error) {
        return res.writeHead(404).end();
      }
    }

    try {
      const fileExtension = req.url!.split(".").pop()!;
      const file = this._getFile(req.url!);

      let contentType = FileContentMap[fileExtension];
      if (!contentType) contentType = "application/octet-stream";

      if (file) {
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("Accept-Ranges", "bytes");
        if (contentType != "application/octet-stream" && this.compress) {
          res.writeHead(200, {
            "Content-Encoding": "gzip",
            "Content-Type": contentType,
            "Content-Length": file.stat.size,
          });
          return file.stream.pipe(zlib.createGzip()).pipe(res);
        }
        res.writeHead(200, {
          "Content-Type": contentType,
          "Content-Length": file.stat.size,
        });
        return file.stream.pipe(res);
      }

      res.writeHead(404);
      res.end(new Uint8Array(0));
    } catch (error) {
      res.writeHead(404);
      res.end(new Uint8Array(0));
    }
  }
}
