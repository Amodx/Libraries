import { GetEndPointData, GetPoint } from "./EndPoints/GetPoints";
import { PostEndPointData, PostPoint } from "./EndPoints/PostPoints";

export class HTTPAPI {
  GET = {
    _points: new Map<string, GetPoint>(),
    add: (data: GetEndPointData[]) => {
      for (const point of data) {
        const endPoint = new GetPoint(point);
        this.GET._points.set(`/${endPoint.data.path}`, endPoint);
      }
    },
    get: (path: string) => {
      return this.GET._points.get(path);
    },
  };
  POST = {
    _points: new Map<string, PostPoint>(),
    add: (data: PostEndPointData[]) => {
      for (const point of data) {
        const endPoint = new PostPoint(point);
        this.POST._points.set(`/${endPoint.data.path}`, endPoint);
      }
    },
    get: (path: string) => {
      return this.POST._points.get(path);
    },
  };
}
