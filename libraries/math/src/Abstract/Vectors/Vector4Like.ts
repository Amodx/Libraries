import { Mat4Array } from "../Matrices/Matrix.types";
import { Vec4Array } from "./Vector.types";

export class Vector4Like {
  static Create(x = 0, y = 0, z = 0, w = 0): Vector4Like {
    return { x, y, z, w };
  }

  static ApplyMatrix(matrix: Mat4Array, vec: Vector4Like): Vector4Like {
    return {
      x:
        matrix[0] * vec.x +
        matrix[1] * vec.y +
        matrix[2] * vec.z +
        matrix[3] * vec.w,
      y:
        matrix[4] * vec.x +
        matrix[5] * vec.y +
        matrix[6] * vec.z +
        matrix[7] * vec.w,
      z:
        matrix[8] * vec.x +
        matrix[9] * vec.y +
        matrix[10] * vec.z +
        matrix[11] * vec.w,
      w:
        matrix[12] * vec.x +
        matrix[13] * vec.y +
        matrix[14] * vec.z +
        matrix[15] * vec.w,
    };
  }

  static RotateAroundPivot(
    matrix: Mat4Array,
    vec: Vector4Like,
    pivot: Vector4Like
  ): Vector4Like {
    const translatedVec: Vector4Like = {
      x: vec.x - pivot.x,
      y: vec.y - pivot.y,
      z: vec.z - pivot.z,
      w: vec.w - pivot.w,
    };
    const rotatedVec = Vector4Like.ApplyMatrix(matrix, translatedVec);
    return {
      x: rotatedVec.x + pivot.x,
      y: rotatedVec.y + pivot.y,
      z: rotatedVec.z + pivot.z,
      w: rotatedVec.w + pivot.w,
    };
  }

  static Add(v1: Vector4Like, v2: Vector4Like): Vector4Like {
    return this.AddToRef(v1, v2, Vector4Like.Create());
  }

  static AddInPlace(v1: Vector4Like, v2: Vector4Like) {
    return this.AddToRef(v1, v2, v1);
  }

  static AddToRef(
    v1: Vector4Like,
    v2: Vector4Like,
    ref: Vector4Like
  ): Vector4Like {
    const { x: x1, y: y1, z: z1, w: w1 } = v1;
    const { x: x2, y: y2, z: z2, w: w2 } = v2;
    ref.x = x1 + x2;
    ref.y = y1 + y2;
    ref.z = z1 + z2;
    ref.w = w1 + w2;
    return ref;
  }

  static AddScalar(v: Vector4Like, scalar: number): Vector4Like {
    return this.AddScalarToRef(v, scalar, Vector4Like.Create());
  }

  static AddScalarInPlace(v: Vector4Like, scalar: number): Vector4Like {
    return this.AddScalarToRef(v, scalar, v);
  }

  static AddScalarToRef(
    v: Vector4Like,
    scalar: number,
    ref: Vector4Like
  ): Vector4Like {
    const { x, y, z, w } = v;
    ref.x = x + scalar;
    ref.y = y + scalar;
    ref.z = z + scalar;
    ref.w = w + scalar;
    return ref;
  }

  static Subtract(v1: Vector4Like, v2: Vector4Like): Vector4Like {
    return this.SubtractToRef(v1, v2, this.Create());
  }

  static SubtractInPlace(v1: Vector4Like, v2: Vector4Like): Vector4Like {
    return this.SubtractToRef(v1, v2, v1);
  }

  static SubtractToRef(
    v1: Vector4Like,
    v2: Vector4Like,
    ref: Vector4Like
  ): Vector4Like {
    const { x: x1, y: y1, z: z1, w: w1 } = v1;
    const { x: x2, y: y2, z: z2, w: w2 } = v2;
    ref.x = x1 - x2;
    ref.y = y1 - y2;
    ref.z = z1 - z2;
    ref.w = w1 - w2;
    return ref;
  }

  static SubtractScalar(v: Vector4Like, scalar: number): Vector4Like {
    return this.SubtractScalarToRef(v, scalar, Vector4Like.Create());
  }

  static SubtractScalarInPlace(v: Vector4Like, scalar: number): Vector4Like {
    return this.SubtractScalarToRef(v, scalar, v);
  }

  static SubtractScalarToRef(
    v: Vector4Like,
    scalar: number,
    ref: Vector4Like
  ): Vector4Like {
    const { x, y, z, w } = v;
    ref.x = x - scalar;
    ref.y = y - scalar;
    ref.z = z - scalar;
    ref.w = w - scalar;
    return ref;
  }

  static Multiply(v1: Vector4Like, v2: Vector4Like): Vector4Like {
    return this.MultiplyToRef(v1, v2, Vector4Like.Create());
  }

  static MultiplyInPlace(v1: Vector4Like, v2: Vector4Like): Vector4Like {
    return this.MultiplyToRef(v1, v2, v1);
  }

  static MultiplyToRef(
    v1: Vector4Like,
    v2: Vector4Like,
    ref: Vector4Like
  ): Vector4Like {
    const { x: x1, y: y1, z: z1, w: w1 } = v1;
    const { x: x2, y: y2, z: z2, w: w2 } = v2;
    ref.x = x1 * x2;
    ref.y = y1 * y2;
    ref.z = z1 * z2;
    ref.w = w1 * w2;
    return ref;
  }

  static MultiplyScalar(v: Vector4Like, scalar: number): Vector4Like {
    return this.MultiplyScalarToRef(v, scalar, Vector4Like.Create());
  }

  static MultiplyScalarInPlace(v: Vector4Like, scalar: number): Vector4Like {
    return this.MultiplyScalarToRef(v, scalar, v);
  }

  static MultiplyScalarToRef(
    v: Vector4Like,
    scalar: number,
    ref: Vector4Like
  ): Vector4Like {
    const { x, y, z, w } = v;
    ref.x = x * scalar;
    ref.y = y * scalar;
    ref.z = z * scalar;
    ref.w = w * scalar;
    return ref;
  }

  static Divide(v1: Vector4Like, v2: Vector4Like): Vector4Like {
    return this.DivideToRef(v1, v2, Vector4Like.Create());
  }

  static DivideInPlace(v1: Vector4Like, v2: Vector4Like): Vector4Like {
    return this.DivideToRef(v1, v2, v1);
  }

  static DivideToRef(
    v1: Vector4Like,
    v2: Vector4Like,
    ref: Vector4Like
  ): Vector4Like {
    const { x: x1, y: y1, z: z1, w: w1 } = v1;
    const { x: x2, y: y2, z: z2, w: w2 } = v2;
    ref.x = x1 / x2;
    ref.y = y1 / y2;
    ref.z = z1 / z2;
    ref.w = w1 / w2;
    return ref;
  }

  static DivideScalar(v: Vector4Like, scalar: number): Vector4Like {
    return this.DivideScalarToRef(v, scalar, Vector4Like.Create());
  }

  static DivideScalarInPlace(v: Vector4Like, scalar: number): Vector4Like {
    return this.DivideScalarToRef(v, scalar, v);
  }

  static DivideScalarToRef(
    v: Vector4Like,
    scalar: number,
    ref: Vector4Like
  ): Vector4Like {
    const { x, y, z, w } = v;
    ref.x = x / scalar;
    ref.y = y / scalar;
    ref.z = z / scalar;
    ref.w = w / scalar;
    return ref;
  }

  static Length(v: Vector4Like): number {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  }

  static Normalize(v: Vector4Like): Vector4Like {
    return this.NormalizeToRef(v, Vector4Like.Create());
  }
  static NormalizeInPlace(v: Vector4Like): Vector4Like {
    return this.NormalizeToRef(v, v);
  }

  static NormalizeToRef(v: Vector4Like, ref: Vector4Like): Vector4Like {
    const len = Vector4Like.Length(v);
    const { x, y, z, w } = v;
    if (len === 0) {
      ref.x = 0;
      ref.y = 0;
      ref.z = 0;
      ref.w = 0;
    } else {
      ref.x = x / len;
      ref.y = y / len;
      ref.z = z / len;
      ref.w = w / len;
    }
    return ref;
  }

  static Lerp(v1: Vector4Like, v2: Vector4Like, t: number): Vector4Like {
    return this.LerpToRef(v1, v2, t, Vector4Like.Create());
  }

  static LerpToRef(
    v1: Vector4Like,
    v2: Vector4Like,
    t: number,
    ref: Vector4Like
  ): Vector4Like {
    const { x: x1, y: y1, z: z1, w: w1 } = v1;
    const { x: x2, y: y2, z: z2, w: w2 } = v2;
    ref.x = x1 + t * (x2 - x1);
    ref.y = y1 + t * (y2 - y1);
    ref.z = z1 + t * (z2 - z1);
    ref.w = w1 + t * (w2 - w1);
    return ref;
  }

  static Negate(v: Vector4Like): Vector4Like {
    return this.NegateToRef(v, Vector4Like.Create());
  }

  static NegateInPlace(v: Vector4Like): Vector4Like {
    return this.NegateToRef(v, v);
  }

  static NegateToRef(v: Vector4Like, ref: Vector4Like): Vector4Like {
    const { x, y, z, w } = v;
    ref.x = -x;
    ref.y = -y;
    ref.z = -z;
    ref.w = -w;
    return ref;
  }

  static Dot(v1: Vector4Like, v2: Vector4Like): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w;
  }

  static Distance(v1: Vector4Like, v2: Vector4Like): number {
    return Vector4Like.Length(Vector4Like.Subtract(v1, v2));
  }

  static Equals(v1: Vector4Like, v2: Vector4Like): boolean {
    return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z && v1.w === v2.w;
  }

  static Clone(v: Vector4Like): Vector4Like {
    return { x: v.x, y: v.y, z: v.z, w: v.w };
  }

  static Copy(target: Vector4Like, source: Vector4Like): Vector4Like {
    target.x = source.x;
    target.y = source.y;
    target.z = source.z;
    target.w = source.w;
    return target;
  }

  static CopyFromArray(target: Vector4Like, source: Vec4Array): Vector4Like {
    target.x = source[0];
    target.y = source[1];
    target.z = source[2];
    target.w = source[3];
    return target;
  }

  static ToArray(v: Vector4Like): Vec4Array {
    return [v.x, v.y, v.z, v.w];
  }

  static FromArray(v: Vec4Array): Vector4Like {
    return new Vector4Like(v[0], v[1], v[2], v[3]);
  }

  private constructor(
    public x: number,
    public y: number,
    public z: number,
    public w: number
  ) {}
}
