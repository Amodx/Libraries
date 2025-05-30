import type { Mat3Array } from "../Matrices/Matrix.types";
import { Vec3Array } from "./Vector.types";
export class Vec3ArrayLike {
  static Create(x = 0, y = 0, z = 0): Vec3Array {
    return [x, y, z];
  }

  static ApplyMatrix(matrix: Mat3Array, vec: Vec3Array): Vec3Array {
    return this.ApplyMatrixToRef(matrix, vec, Vec3ArrayLike.Create());
  }

  static ApplyMatrixInPlace(matrix: Mat3Array, vec: Vec3Array): Vec3Array {
    return this.ApplyMatrixToRef(matrix, vec, vec);
  }

  static ApplyMatrixToRef(
    matrix: Mat3Array,
    vec: Vec3Array,
    ref: Vec3Array
  ): Vec3Array {
    const [x, y, z] = vec;
    ref[0] = matrix[0] * x + matrix[3] * y + matrix[6] * z;
    ref[1] = matrix[1] * x + matrix[4] * y + matrix[7] * z;
    ref[2] = matrix[2] * x + matrix[5] * y + matrix[8] * z;
    return ref;
  }

  static RotateAroundPivotArray(
    matrix: Mat3Array,
    vec: Vec3Array,
    pivot: Vec3Array
  ): Vec3Array {
    const translatedVec: Vec3Array = [
      vec[0] - pivot[0],
      vec[1] - pivot[1],
      vec[2] - pivot[2],
    ];
    const rotatedVec = Vec3ArrayLike.ApplyMatrix(matrix, translatedVec);
    return [
      rotatedVec[0] + pivot[0],
      rotatedVec[1] + pivot[1],
      rotatedVec[2] + pivot[2],
    ];
  }

  static FloorInPlace(v: Vec3Array): Vec3Array {
    v[0] = Math.floor(v[0]);
    v[1] = Math.floor(v[1]);
    v[2] = Math.floor(v[2]);
    return v;
  }

  static RoundArrayInPlaceToScalar(v: Vec3Array, s: number): Vec3Array {
    v[0] = Math.round(v[0] * s) / s;
    v[1] = Math.round(v[1] * s) / s;
    v[2] = Math.round(v[2] * s) / s;
    return v;
  }

  static Add(v1: Vec3Array, v2: Vec3Array): Vec3Array {
    return this.AddToRef(v1, v2, Vec3ArrayLike.Create());
  }

  static AddInPlace(v1: Vec3Array, v2: Vec3Array) {
    return this.AddToRef(v1, v2, v1);
  }

  static AddToRef(v1: Vec3Array, v2: Vec3Array, ref: Vec3Array): Vec3Array {
    const [x1, y1, z1] = v1;
    const [x2, y2, z2] = v2;
    ref[0] = x1 + x2;
    ref[1] = y1 + y2;
    ref[2] = z1 + z2;
    return ref;
  }

  static AddScalar(v: Vec3Array, scalar: number): Vec3Array {
    return this.AddScalarToRef(v, scalar, Vec3ArrayLike.Create());
  }

  static AddScalarInPlace(v: Vec3Array, scalar: number): Vec3Array {
    return this.AddScalarToRef(v, scalar, v);
  }

  static AddScalarToRef(
    v: Vec3Array,
    scalar: number,
    ref: Vec3Array
  ): Vec3Array {
    const [x, y, z] = v;
    ref[0] = x + scalar;
    ref[1] = y + scalar;
    ref[2] = z + scalar;
    return ref;
  }

  static Subtract(v1: Vec3Array, v2: Vec3Array): Vec3Array {
    return this.SubtractToRef(v1, v2, this.Create());
  }

  static SubtractInPlace(v1: Vec3Array, v2: Vec3Array): Vec3Array {
    return this.SubtractToRef(v1, v2, v1);
  }

  static SubtractToRef(
    v1: Vec3Array,
    v2: Vec3Array,
    ref: Vec3Array
  ): Vec3Array {
    const [x1, y1, z1] = v1;
    const [x2, y2, z2] = v2;
    ref[0] = x1 - x2;
    ref[1] = y1 - y2;
    ref[2] = z1 - z2;
    return ref;
  }

  static SubtractScalar(v: Vec3Array, scalar: number): Vec3Array {
    return this.SubtractScalarToRef(v, scalar, Vec3ArrayLike.Create());
  }

  static SubtractScalarInPlace(v: Vec3Array, scalar: number): Vec3Array {
    return this.SubtractScalarToRef(v, scalar, v);
  }

  static SubtractScalarToRef(
    v: Vec3Array,
    scalar: number,
    ref: Vec3Array
  ): Vec3Array {
    const [x, y, z] = v;
    ref[0] = x - scalar;
    ref[1] = y - scalar;
    ref[2] = z - scalar;
    return ref;
  }

  static Multiply(v1: Vec3Array, v2: Vec3Array): Vec3Array {
    return this.MultiplyToRef(v1, v2, Vec3ArrayLike.Create());
  }

  static MultiplyInPlace(v1: Vec3Array, v2: Vec3Array): Vec3Array {
    return this.MultiplyToRef(v1, v2, v1);
  }

  static MultiplyToRef(
    v1: Vec3Array,
    v2: Vec3Array,
    ref: Vec3Array
  ): Vec3Array {
    const [x1, y1, z1] = v1;
    const [x2, y2, z2] = v2;
    ref[0] = x1 * x2;
    ref[1] = y1 * y2;
    ref[2] = z1 * z2;
    return ref;
  }

  static MultiplyScalar(v: Vec3Array, scalar: number): Vec3Array {
    return this.MultiplyScalarToRef(v, scalar, Vec3ArrayLike.Create());
  }

  static MultiplyScalarInPlace(v: Vec3Array, scalar: number): Vec3Array {
    return this.MultiplyScalarToRef(v, scalar, v);
  }

  static MultiplyScalarToRef(
    v: Vec3Array,
    scalar: number,
    ref: Vec3Array
  ): Vec3Array {
    const [x, y, z] = v;
    ref[0] = x * scalar;
    ref[1] = y * scalar;
    ref[2] = z * scalar;
    return ref;
  }

  static Divide(v1: Vec3Array, v2: Vec3Array): Vec3Array {
    return this.DivideToRef(v1, v2, Vec3ArrayLike.Create());
  }

  static DivideInPlace(v1: Vec3Array, v2: Vec3Array): Vec3Array {
    return this.DivideToRef(v1, v2, v1);
  }

  static DivideToRef(v1: Vec3Array, v2: Vec3Array, ref: Vec3Array): Vec3Array {
    const [x1, y1, z1] = v1;
    const [x2, y2, z2] = v2;
    ref[0] = x1 / x2;
    ref[1] = y1 / y2;
    ref[2] = z1 / z2;
    return ref;
  }

  static DivideScalar(v: Vec3Array, scalar: number): Vec3Array {
    return this.DivideScalarToRef(v, scalar, Vec3ArrayLike.Create());
  }

  static DivideScalarInPlace(v: Vec3Array, scalar: number): Vec3Array {
    return this.DivideScalarToRef(v, scalar, v);
  }

  static DivideScalarToRef(
    v: Vec3Array,
    scalar: number,
    ref: Vec3Array
  ): Vec3Array {
    const [x, y, z] = v;
    ref[0] = x / scalar;
    ref[1] = y / scalar;
    ref[2] = z / scalar;
    return ref;
  }

  static Normalize(v: Vec3Array): Vec3Array {
    return this.NormalizeToRef(v, Vec3ArrayLike.Create());
  }
  static NormalizeInPlace(v: Vec3Array): Vec3Array {
    return this.NormalizeToRef(v, v);
  }

  static NormalizeToRef(v: Vec3Array, ref: Vec3Array): Vec3Array {
    const len = Vec3ArrayLike.Length(v);
    const [x, y, z] = v;
    if (len === 0) {
      ref[0] = 0;
      ref[1] = 0;
      ref[2] = 0;
    } else {
      ref[0] = x / len;
      ref[1] = y / len;
      ref[2] = z / len;
    }
    return ref;
  }

  static Lerp(v1: Vec3Array, v2: Vec3Array, t: number): Vec3Array {
    return this.LerpToRef(v1, v2, t, Vec3ArrayLike.Create());
  }

  static LerpToRef(
    v1: Vec3Array,
    v2: Vec3Array,
    t: number,
    ref: Vec3Array
  ): Vec3Array {
    const [x1, y1, z1] = v1;
    const [x2, y2, z2] = v2;
    ref[0] = x1 + t * (x2 - x1);
    ref[1] = y1 + t * (y2 - y1);
    ref[2] = z1 + t * (z2 - z1);
    return ref;
  }

  static Negate(v: Vec3Array): Vec3Array {
    return this.NegateToRef(v, Vec3ArrayLike.Create());
  }

  static NegateInPlace(v: Vec3Array): Vec3Array {
    return this.NegateToRef(v, v);
  }

  static NegateToRef(v: Vec3Array, ref: Vec3Array): Vec3Array {
    const [x, y, z] = v;
    ref[0] = -x;
    ref[1] = -y;
    ref[2] = -z;
    return ref;
  }

  static Distance(v1: Vec3Array, v2: Vec3Array): number {
    return Vec3ArrayLike.Length(Vec3ArrayLike.Subtract(v1, v2));
  }

  static Dot(v1: Vec3Array, v2: Vec3Array): number {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
  }

  static Cross(v1: Vec3Array, v2: Vec3Array): Vec3Array {
    return this.CrossArrayToRef(v1, v2, Vec3ArrayLike.Create());
  }

  static CrossArrayToRef(
    v1: Vec3Array,
    v2: Vec3Array,
    ref: Vec3Array
  ): Vec3Array {
    ref[0] = v1[1] * v2[2] - v1[2] * v2[1];
    ref[1] = v1[2] * v2[0] - v1[0] * v2[2];
    ref[2] = v1[0] * v2[1] - v1[1] * v2[0];
    return ref;
  }

  static Length(v: Vec3Array): number {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  }

  static Equals(v1: Vec3Array, v2: Vec3Array): boolean {
    return v1[0] === v2[0] && v1[1] === v2[1] && v1[2] === v2[2];
  }

  static Clone(v: Vec3Array): Vec3Array {
    return [v[0], v[1], v[2]];
  }

  static Copy(target: Vec3Array, source: Vec3Array): Vec3Array {
    target[0] = source[0];
    target[1] = source[1];
    target[2] = source[2];
    return target;
  }
}
