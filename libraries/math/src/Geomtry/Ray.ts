import { Vector3Like } from "../Abstract";
import { Plane } from "./Plane";

export class Ray {
  constructor(
    public origin: Vector3Like,
    public normal: Vector3Like,
    public length: number
  ) {}

  /**Returns 0 if it does not intersect otherwise returns the distance. */
  intersectsPlane(plane: Plane): number {
    const denom = Vector3Like.Dot(this.normal, plane.normal);

    if (Math.abs(denom) < Number.EPSILON) {
      return 0;
    }

    const num = -(Vector3Like.Dot(plane.normal, this.origin) + plane.distance);
    const t = num / denom;

    if (t >= 0 && t <= this.length) return t;
    return 0;
  }
}
