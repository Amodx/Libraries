import { Vector3Like } from "Abstract";

export interface BoundsMinMaxData {
  min: Vector3Like;
  max: Vector3Like;
}

export interface BoundsInterface {
  intersectsPoint(point: Vector3Like): boolean;
  intersectsMinMax(min: Vector3Like, max: Vector3Like): boolean;
  getMinMax(): BoundsMinMaxData;
}
