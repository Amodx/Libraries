import type http from "http";
export interface GetEndPointData {
  path: string;
  run(
    url:URL,
    request: http.IncomingMessage,
    response: http.ServerResponse<http.IncomingMessage>
  ): Promise<any>;
}

export interface GetPoint extends GetEndPointData {}
export class GetPoint {
  constructor(public data: GetEndPointData) {
    return Object.assign(this, data);
  }
}
