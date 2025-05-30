import { Vector3Like } from "../Abstract/Vectors/Vector3Like";

export class Axes {
  private static readonly _up = Object.freeze(Vector3Like.Create(0, 1, 0));
  static Up() {
    return Vector3Like.Create(0, 1, 0);
  }
  static UpReadOnly() {
    return this._up;
  }

  private static readonly _down = Object.freeze(Vector3Like.Create(0, -1, 0));
  static Down() {
    return Vector3Like.Create(0, -1, 0);
  }
  static DownReadOnly() {
    return this._down;
  }

  private static readonly _north = Object.freeze(Vector3Like.Create(0, 0, 1));
  static North() {
    return Vector3Like.Create(0, 0, 1);
  }
  static NorthReadOnly() {
    return this._north;
  }

  private static readonly _south = Object.freeze(Vector3Like.Create(0, 0, -1));
  static South() {
    return Vector3Like.Create(0, 0, -1);
  }
  static SouthReadOnly() {
    return this._south;
  }

  private static readonly _east = Object.freeze(Vector3Like.Create(1, 0, 0));
  static East() {
    return Vector3Like.Create(1, 0, 0);
  }
  static EastReadOnly() {
    return this._east;
  }

  private static readonly _west = Object.freeze(Vector3Like.Create(-1, 0, 0));
  static West() {
    return Vector3Like.Create(-1, 0, 0);
  }
  static WestReadOnly() {
    return this._west;
  }
}
