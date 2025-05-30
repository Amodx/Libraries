import type { Mat4Array } from "../Matrices/Matrix.types";
import { Vec4Array } from "./Vector.types";

export class Vec4ArrayLike {
  static Create(x = 0, y = 0, z = 0, w = 0): Vec4Array {
    return [x, y, z, w];
  }

  static ApplyMatrix(matrix: Mat4Array, vec: Vec4Array): Vec4Array {
    return [
      matrix[0] * vec[0] +
        matrix[1] * vec[1] +
        matrix[2] * vec[2] +
        matrix[3] * vec[3],
      matrix[4] * vec[0] +
        matrix[5] * vec[1] +
        matrix[6] * vec[2] +
        matrix[7] * vec[3],
      matrix[8] * vec[0] +
        matrix[9] * vec[1] +
        matrix[10] * vec[2] +
        matrix[11] * vec[3],
      matrix[12] * vec[0] +
        matrix[13] * vec[1] +
        matrix[14] * vec[2] +
        matrix[15] * vec[3],
    ];
  }

  static RotateAroundPivot(
    matrix: Mat4Array,
    vec: Vec4Array,
    pivot: Vec4Array
  ): Vec4Array {
    const translatedVec: Vec4Array = [
      vec[0] - pivot[0],
      vec[1] - pivot[1],
      vec[2] - pivot[2],
      vec[3] - pivot[3],
    ];
    const rotatedVec = Vec4ArrayLike.ApplyMatrix(matrix, translatedVec);
    return [
      rotatedVec[0] + pivot[0],
      rotatedVec[1] + pivot[1],
      rotatedVec[2] + pivot[2],
      rotatedVec[3] + pivot[3],
    ];
  }

  static Add(v1: Vec4Array, v2: Vec4Array): Vec4Array {
    return this.AddToRef(v1, v2, Vec4ArrayLike.Create());
  }

  static AddInPlace(v1: Vec4Array, v2: Vec4Array) {
    return this.AddToRef(v1, v2, v1);
  }

  static AddToRef(v1: Vec4Array, v2: Vec4Array, ref: Vec4Array): Vec4Array {
    const [x1, y1, z1, w1] = v1;
    const [x2, y2, z2, w2] = v2;
    ref[0] = x1 + x2;
    ref[1] = y1 + y2;
    ref[2] = z1 + z2;
    ref[3] = w1 + w2;
    return ref;
  }

  static AddScalar(v: Vec4Array, scalar: number): Vec4Array {
    return this.AddScalarToRef(v, scalar, Vec4ArrayLike.Create());
  }

  static AddScalarInPlace(v: Vec4Array, scalar: number): Vec4Array {
    return this.AddScalarToRef(v, scalar, v);
  }

  static AddScalarToRef(
    v: Vec4Array,
    scalar: number,
    ref: Vec4Array
  ): Vec4Array {
    const [x, y, z, w] = v;
    ref[0] = x + scalar;
    ref[1] = y + scalar;
    ref[2] = z + scalar;
    ref[3] = w + scalar;
    return ref;
  }

  static Subtract(v1: Vec4Array, v2: Vec4Array): Vec4Array {
    return this.SubtractToRef(v1, v2, Vec4ArrayLike.Create());
  }

  static SubtractInPlace(v1: Vec4Array, v2: Vec4Array): Vec4Array {
    return this.SubtractToRef(v1, v2, v1);
  }

  static SubtractToRef(
    v1: Vec4Array,
    v2: Vec4Array,
    ref: Vec4Array
  ): Vec4Array {
    const [x1, y1, z1, w1] = v1;
    const [x2, y2, z2, w2] = v2;
    ref[0] = x1 - x2;
    ref[1] = y1 - y2;
    ref[2] = z1 - z2;
    ref[3] = w1 - w2;
    return ref;
  }

  static SubtractScalar(v: Vec4Array, scalar: number): Vec4Array {
    return this.SubtractScalarToRef(v, scalar, Vec4ArrayLike.Create());
  }

  static SubtractScalarInPlace(v: Vec4Array, scalar: number): Vec4Array {
    return this.SubtractScalarToRef(v, scalar, v);
  }

  static SubtractScalarToRef(
    v: Vec4Array,
    scalar: number,
    ref: Vec4Array
  ): Vec4Array {
    const [x, y, z, w] = v;
    ref[0] = x - scalar;
    ref[1] = y - scalar;
    ref[2] = z - scalar;
    ref[3] = w - scalar;
    return ref;
  }

  static Multiply(v1: Vec4Array, v2: Vec4Array): Vec4Array {
    return this.MultiplyToRef(v1, v2, Vec4ArrayLike.Create());
  }

  static MultiplyInPlace(v1: Vec4Array, v2: Vec4Array): Vec4Array {
    return this.MultiplyToRef(v1, v2, v1);
  }

  static MultiplyToRef(
    v1: Vec4Array,
    v2: Vec4Array,
    ref: Vec4Array
  ): Vec4Array {
    const [x1, y1, z1, w1] = v1;
    const [x2, y2, z2, w2] = v2;
    ref[0] = x1 * x2;
    ref[1] = y1 * y2;
    ref[2] = z1 * z2;
    ref[3] = w1 * w2;
    return ref;
  }

  static MultiplyScalar(v: Vec4Array, scalar: number): Vec4Array {
    return this.MultiplyScalarToRef(v, scalar, Vec4ArrayLike.Create());
  }

  static MultiplyScalarInPlace(v: Vec4Array, scalar: number): Vec4Array {
    return this.MultiplyScalarToRef(v, scalar, v);
  }

  static MultiplyScalarToRef(
    v: Vec4Array,
    scalar: number,
    ref: Vec4Array
  ): Vec4Array {
    const [x, y, z, w] = v;
    ref[0] = x * scalar;
    ref[1] = y * scalar;
    ref[2] = z * scalar;
    ref[3] = w * scalar;
    return ref;
  }

  static Divide(v1: Vec4Array, v2: Vec4Array): Vec4Array {
    return this.DivideToRef(v1, v2, Vec4ArrayLike.Create());
  }

  static DivideInPlace(v1: Vec4Array, v2: Vec4Array): Vec4Array {
    return this.DivideToRef(v1, v2, v1);
  }

  static DivideToRef(v1: Vec4Array, v2: Vec4Array, ref: Vec4Array): Vec4Array {
    const [x1, y1, z1, w1] = v1;
    const [x2, y2, z2, w2] = v2;
    ref[0] = x1 / x2;
    ref[1] = y1 / y2;
    ref[2] = z1 / z2;
    ref[3] = w1 / w2;
    return ref;
  }

  static DivideScalar(v: Vec4Array, scalar: number): Vec4Array {
    return this.DivideScalarToRef(v, scalar, Vec4ArrayLike.Create());
  }

  static DivideScalarInPlace(v: Vec4Array, scalar: number): Vec4Array {
    return this.DivideScalarToRef(v, scalar, v);
  }

  static DivideScalarToRef(
    v: Vec4Array,
    scalar: number,
    ref: Vec4Array
  ): Vec4Array {
    const [x, y, z, w] = v;
    ref[0] = x / scalar;
    ref[1] = y / scalar;
    ref[2] = z / scalar;
    ref[3] = w / scalar;
    return ref;
  }

  static Normalize(v: Vec4Array): Vec4Array {
    return this.NormalizeToRef(v, Vec4ArrayLike.Create());
  }
  static NormalizeInPlace(v: Vec4Array): Vec4Array {
    return this.NormalizeToRef(v, v);
  }

  static NormalizeToRef(v: Vec4Array, ref: Vec4Array): Vec4Array {
    const len = Vec4ArrayLike.Length(v);
    const [x, y, z, w] = v;
    if (len === 0) {
      ref[0] = 0;
      ref[1] = 0;
      ref[2] = 0;
      ref[3] = 0;
    } else {
      ref[0] = x / len;
      ref[1] = y / len;
      ref[2] = z / len;
      ref[3] = w / len;
    }
    return ref;
  }

  static Lerp(v1: Vec4Array, v2: Vec4Array, t: number): Vec4Array {
    return this.LerpToRef(v1, v2, t, Vec4ArrayLike.Create());
  }

  static LerpToRef(
    v1: Vec4Array,
    v2: Vec4Array,
    t: number,
    ref: Vec4Array
  ): Vec4Array {
    const [x1, y1, z1, w1] = v1;
    const [x2, y2, z2, w2] = v2;
    ref[0] = x1 + t * (x2 - x1);
    ref[1] = y1 + t * (y2 - y1);
    ref[2] = z1 + t * (z2 - z1);
    ref[3] = w1 + t * (w2 - w1);
    return ref;
  }

  static Negate(v: Vec4Array): Vec4Array {
    return this.NegateToRef(v, Vec4ArrayLike.Create());
  }

  static NegateInPlace(v: Vec4Array): Vec4Array {
    return this.NegateToRef(v, v);
  }

  static NegateToRef(v: Vec4Array, ref: Vec4Array): Vec4Array {
    const [x, y, z, w] = v;
    ref[0] = -x;
    ref[1] = -y;
    ref[2] = -z;
    ref[3] = -w;
    return ref;
  }

  static Dot(v1: Vec4Array, v2: Vec4Array): number {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2] + v1[3] * v2[3];
  }

  static Length(v: Vec4Array): number {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3]);
  }
  static Distance(v1: Vec4Array, v2: Vec4Array): number {
    return Vec4ArrayLike.Length(Vec4ArrayLike.Subtract(v1, v2));
  }

  static Equals(v1: Vec4Array, v2: Vec4Array): boolean {
    return (
      v1[0] === v2[0] && v1[1] === v2[1] && v1[2] === v2[2] && v1[3] === v2[3]
    );
  }

  static Clone(v: Vec4Array): Vec4Array {
    return [v[0], v[1], v[2], v[3]];
  }

  static Copy(target: Vec4Array, source: Vec4Array): Vec4Array {
    target[0] = source[0];
    target[1] = source[1];
    target[2] = source[2];
    return target;
  }
}
