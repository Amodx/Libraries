import type { Mat2Array } from "../Matrices/Matrix.types";
import { Vec2Array } from "./Vector.types";

export class Vec2ArrayLike {
  static Create(x = 0, y = 0): Vec2Array {
    return [x, y];
  }

  static ApplyMatrix(matrix: Mat2Array, vec: Vec2Array): Vec2Array {
    return this.ApplyMatrixToRef(matrix, vec, Vec2ArrayLike.Create());
  }

  static ApplyMatrixInPlace(matrix: Mat2Array, vec: Vec2Array): Vec2Array {
    return this.ApplyMatrixToRef(matrix, vec, vec);
  }

  static ApplyMatrixToRef(
    matrix: Mat2Array,
    vec: Vec2Array,
    ref: Vec2Array
  ): Vec2Array {
    const [x, y] = vec;
    ref[0] = matrix[0] * x + matrix[2] * y;
    ref[1] = matrix[1] * x + matrix[3] * y;
    return ref;
  }

  static RotateAroundPivot(
    matrix: Mat2Array,
    vec: Vec2Array,
    pivot: Vec2Array
  ): Vec2Array {
    const translatedVec: Vec2Array = [vec[0] - pivot[0], vec[1] - pivot[1]];
    const rotatedVec = Vec2ArrayLike.ApplyMatrix(matrix, translatedVec);
    return [rotatedVec[0] + pivot[0], rotatedVec[1] + pivot[1]];
  }

  static Add(v1: Vec2Array, v2: Vec2Array): Vec2Array {
    return this.AddToRef(v1, v2, Vec2ArrayLike.Create());
  }

  static AddInPlace(v1: Vec2Array, v2: Vec2Array) {
    return this.AddToRef(v1, v2, v1);
  }

  static AddToRef(v1: Vec2Array, v2: Vec2Array, ref: Vec2Array): Vec2Array {
    const [x1, y1] = v1;
    const [x2, y2] = v2;
    ref[0] = x1 + x2;
    ref[1] = y1 + y2;
    return ref;
  }

  static AddScalar(v: Vec2Array, scalar: number): Vec2Array {
    return this.AddScalarToRef(v, scalar, Vec2ArrayLike.Create());
  }

  static AddScalarInPlace(v: Vec2Array, scalar: number): Vec2Array {
    return this.AddScalarToRef(v, scalar, v);
  }

  static AddScalarToRef(
    v: Vec2Array,
    scalar: number,
    ref: Vec2Array
  ): Vec2Array {
    const [x, y] = v;
    ref[0] = x + scalar;
    ref[1] = y + scalar;
    return ref;
  }

  static Subtract(v1: Vec2Array, v2: Vec2Array): Vec2Array {
    return this.SubtractToRef(v1, v2, this.Create());
  }

  static SubtractInPlace(v1: Vec2Array, v2: Vec2Array): Vec2Array {
    return this.SubtractToRef(v1, v2, v1);
  }

  static SubtractToRef(
    v1: Vec2Array,
    v2: Vec2Array,
    ref: Vec2Array
  ): Vec2Array {
    const [x1, y1] = v1;
    const [x2, y2] = v2;
    ref[0] = x1 - x2;
    ref[1] = y1 - y2;
    return ref;
  }

  static SubtractScalar(v: Vec2Array, scalar: number): Vec2Array {
    return this.SubtractScalarToRef(v, scalar, Vec2ArrayLike.Create());
  }

  static SubtractScalarInPlace(v: Vec2Array, scalar: number): Vec2Array {
    return this.SubtractScalarToRef(v, scalar, v);
  }

  static SubtractScalarToRef(
    v: Vec2Array,
    scalar: number,
    ref: Vec2Array
  ): Vec2Array {
    const [x, y] = v;
    ref[0] = x - scalar;
    ref[1] = y - scalar;
    return ref;
  }

  static Multiply(v1: Vec2Array, v2: Vec2Array): Vec2Array {
    return this.MultiplyToRef(v1, v2, Vec2ArrayLike.Create());
  }

  static MultiplyInPlace(v1: Vec2Array, v2: Vec2Array): Vec2Array {
    return this.MultiplyToRef(v1, v2, v1);
  }

  static MultiplyToRef(
    v1: Vec2Array,
    v2: Vec2Array,
    ref: Vec2Array
  ): Vec2Array {
    const [x1, y1] = v1;
    const [x2, y2] = v2;
    ref[0] = x1 * x2;
    ref[1] = y1 * y2;
    return ref;
  }

  static MultiplyScalar(v: Vec2Array, scalar: number): Vec2Array {
    return this.MultiplyScalarToRef(v, scalar, Vec2ArrayLike.Create());
  }

  static MultiplyScalarInPlace(v: Vec2Array, scalar: number): Vec2Array {
    return this.MultiplyScalarToRef(v, scalar, v);
  }

  static MultiplyScalarToRef(
    v: Vec2Array,
    scalar: number,
    ref: Vec2Array
  ): Vec2Array {
    const [x, y] = v;
    ref[0] = x * scalar;
    ref[1] = y * scalar;
    return ref;
  }

  static Divide(v1: Vec2Array, v2: Vec2Array): Vec2Array {
    return this.DivideToRef(v1, v2, Vec2ArrayLike.Create());
  }

  static DivideInPlace(v1: Vec2Array, v2: Vec2Array): Vec2Array {
    return this.DivideToRef(v1, v2, v1);
  }

  static DivideToRef(v1: Vec2Array, v2: Vec2Array, ref: Vec2Array): Vec2Array {
    const [x1, y1] = v1;
    const [x2, y2] = v2;
    ref[0] = x1 / x2;
    ref[1] = y1 / y2;
    return ref;
  }

  static DivideScalar(v: Vec2Array, scalar: number): Vec2Array {
    return this.DivideScalarToRef(v, scalar, Vec2ArrayLike.Create());
  }

  static DivideScalarInPlace(v: Vec2Array, scalar: number): Vec2Array {
    return this.DivideScalarToRef(v, scalar, v);
  }

  static DivideScalarToRef(
    v: Vec2Array,
    scalar: number,
    ref: Vec2Array
  ): Vec2Array {
    const [x, y] = v;
    ref[0] = x / scalar;
    ref[1] = y / scalar;
    return ref;
  }

  static Normalize(v: Vec2Array): Vec2Array {
    return this.NormalizeToRef(v, Vec2ArrayLike.Create());
  }
  static NormalizeInPlace(v: Vec2Array): Vec2Array {
    return this.NormalizeToRef(v, v);
  }

  static NormalizeToRef(v: Vec2Array, ref: Vec2Array): Vec2Array {
    const len = Vec2ArrayLike.Length(v);
    const [x, y] = v;
    if (len === 0) {
      ref[0] = 0;
      ref[1] = 0;
    } else {
      ref[0] = x / len;
      ref[1] = y / len;
    }
    return ref;
  }

  static Lerp(v1: Vec2Array, v2: Vec2Array, t: number): Vec2Array {
    return this.LerpToRef(v1, v2, t, Vec2ArrayLike.Create());
  }

  static LerpToRef(
    v1: Vec2Array,
    v2: Vec2Array,
    t: number,
    ref: Vec2Array
  ): Vec2Array {
    const [x1, y1] = v1;
    const [x2, y2] = v2;
    ref[0] = x1 + t * (x2 - x1);
    ref[1] = y1 + t * (y2 - y1);
    return ref;
  }

  static Negate(v: Vec2Array): Vec2Array {
    return this.NegateToRef(v, Vec2ArrayLike.Create());
  }

  static NegateInPlace(v: Vec2Array): Vec2Array {
    return this.NegateToRef(v, v);
  }

  static NegateToRef(v: Vec2Array, ref: Vec2Array): Vec2Array {
    const [x, y] = v;
    ref[0] = -x;
    ref[1] = -y;
    return ref;
  }

  static Dot(v1: Vec2Array, v2: Vec2Array): number {
    return v1[0] * v2[0] + v1[1] * v2[1];
  }

  static Length(v: Vec2Array): number {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  }
  static Distance(v1: Vec2Array, v2: Vec2Array): number {
    return Vec2ArrayLike.Length(Vec2ArrayLike.Subtract(v1, v2));
  }

  static Equals(v1: Vec2Array, v2: Vec2Array): boolean {
    return v1[0] === v2[0] && v1[1] === v2[1];
  }

  static Clone(v: Vec2Array): Vec2Array {
    return [v[0], v[1]];
  }

  static Copy(target: Vec2Array, source: Vec2Array): Vec2Array {
    target[0] = source[0];
    target[1] = source[1];
    return target;
  }
}
