import { Vector3Like } from "../Abstract";

export class Line {
  constructor(
    public origin: Vector3Like,
    public normal: Vector3Like
  ) {}
}
