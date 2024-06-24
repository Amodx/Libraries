import type http from "http";
export interface PostEndPointData {
  path: string;
  run(
    data:any,
    request: http.IncomingMessage,
    response: http.ServerResponse<http.IncomingMessage>
  ): Promise<any>;
}

export interface PostPoint extends PostEndPointData {}
export class PostPoint {
  constructor(public data: PostEndPointData) {
    return Object.assign(this, data);
  }
}
