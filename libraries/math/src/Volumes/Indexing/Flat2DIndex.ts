import { Vec2Array } from "../../Abstract/Vectors/Vector.types";

export class Flat2DIndex {
  private position: Vec2Array;
  private bounds: Vec2Array;

  constructor(
    private _getIndex: (position: Vec2Array, bounds: Vec2Array) => number,
    private _getXY: (
      index: number,
      bounds: Vec2Array,
      position: Vec2Array
    ) => void
  ) {
    this.position = [0, 0];
    this.bounds = [1, 1];
  }

  static GetXYOrder(): Flat2DIndex {
    return new Flat2DIndex(
      (position, bounds) => position[0] + position[1] * bounds[0],
      (index, bounds, position) => {
        position[1] = Math.floor(index / bounds[0]);
        position[0] = Math.floor(index % bounds[0]);
      }
    );
  }

  get size(): number {
    return this.bounds[0] * this.bounds[1];
  }

  getIndex(position: Vec2Array): number {
    return this._getIndex(position, this.bounds);
  }

  getIndexVec2Array(position: Vec2Array): number {
    this.position[0] = position[0];
    this.position[1] = position[1];
    return this._getIndex(this.position, this.bounds);
  }

  getIndexXY(x: number, y: number): number {
    this.position[0] = x;
    this.position[1] = y;
    return this._getIndex(this.position, this.bounds);
  }

  output: Vec2Array = [0, 0];
  getXY(index: number) {
    this._getXY(index, this.bounds, this.output);
    return this.output;
  }
  getBounds(): Readonly<Vec2Array> {
    return this.bounds;
  }
  setBounds(x: number, y: number): void {
    this.bounds[0] = x;
    this.bounds[1] = y;
  }
}
