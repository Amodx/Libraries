import { Mat2Array, Mat3Array } from "../Matrices/Matrix.types";
import { Vec2Array } from "./Vector.types";

export class Vector2Like {
  static ApplyMatrix(matrix: Mat2Array, vec: Vector2Like): Vector2Like {
    return this.ApplyMatrixToRef(matrix, vec, Vector2Like.Create());
  }

  static ApplyMatrixInPlace(matrix: Mat2Array, vec: Vector2Like): Vector2Like {
    return this.ApplyMatrixToRef(matrix, vec, vec);
  }

  static ApplyMatrixToRef(
    matrix: Mat2Array,
    vec: Vector2Like,
    ref: Vector2Like
  ): Vector2Like {
    const { x, y } = vec;
    ref.x = matrix[0] * x + matrix[2] * y;
    ref.y = matrix[1] * x + matrix[3] * y;
    return ref;
  }

  static RotateAroundPivot(
    matrix: Mat2Array,
    vec: Vector2Like,
    pivot: Vector2Like
  ): Vector2Like {
    const translatedVec: Vector2Like = {
      x: vec.x - pivot.x,
      y: vec.y - pivot.y,
    };
    const rotatedVec = Vector2Like.ApplyMatrix(matrix, translatedVec);
    return { x: rotatedVec.x + pivot.x, y: rotatedVec.y + pivot.y };
  }

  static Create(x = 0, y = 0): Vector2Like {
    return { x, y };
  }

  static Add(v1: Vector2Like, v2: Vector2Like): Vector2Like {
    return this.AddToRef(v1, v2, Vector2Like.Create());
  }

  static AddInPlace(v1: Vector2Like, v2: Vector2Like) {
    return this.AddToRef(v1, v2, v1);
  }

  static AddToRef(
    v1: Vector2Like,
    v2: Vector2Like,
    ref: Vector2Like
  ): Vector2Like {
    const { x: x1, y: y1 } = v1;
    const { x: x2, y: y2 } = v2;
    ref.x = x1 + x2;
    ref.y = y1 + y2;
    return ref;
  }

  static AddScalar(v: Vector2Like, scalar: number): Vector2Like {
    return this.AddScalarToRef(v, scalar, Vector2Like.Create());
  }

  static AddScalarInPlace(v: Vector2Like, scalar: number): Vector2Like {
    return this.AddScalarToRef(v, scalar, v);
  }

  static AddScalarToRef(
    v: Vector2Like,
    scalar: number,
    ref: Vector2Like
  ): Vector2Like {
    const { x, y } = v;
    ref.x = x + scalar;
    ref.y = y + scalar;
    return ref;
  }

  static Subtract(v1: Vector2Like, v2: Vector2Like): Vector2Like {
    return this.SubtractToRef(v1, v2, this.Create());
  }

  static SubtractInPlace(v1: Vector2Like, v2: Vector2Like): Vector2Like {
    return this.SubtractToRef(v1, v2, v1);
  }

  static SubtractToRef(
    v1: Vector2Like,
    v2: Vector2Like,
    ref: Vector2Like
  ): Vector2Like {
    const { x: x1, y: y1 } = v1;
    const { x: x2, y: y2 } = v2;
    ref.x = x1 - x2;
    ref.y = y1 - y2;
    return ref;
  }

  static SubtractScalar(v: Vector2Like, scalar: number): Vector2Like {
    return this.SubtractScalarToRef(v, scalar, Vector2Like.Create());
  }

  static SubtractScalarInPlace(v: Vector2Like, scalar: number): Vector2Like {
    return this.SubtractScalarToRef(v, scalar, v);
  }

  static SubtractScalarToRef(
    v: Vector2Like,
    scalar: number,
    ref: Vector2Like
  ): Vector2Like {
    const { x, y } = v;
    ref.x = x - scalar;
    ref.y = y - scalar;
    return ref;
  }

  static Multiply(v1: Vector2Like, v2: Vector2Like): Vector2Like {
    return this.MultiplyToRef(v1, v2, Vector2Like.Create());
  }

  static MultiplyInPlace(v1: Vector2Like, v2: Vector2Like): Vector2Like {
    return this.MultiplyToRef(v1, v2, v1);
  }

  static MultiplyToRef(
    v1: Vector2Like,
    v2: Vector2Like,
    ref: Vector2Like
  ): Vector2Like {
    const { x: x1, y: y1 } = v1;
    const { x: x2, y: y2 } = v2;
    ref.x = x1 * x2;
    ref.y = y1 * y2;
    return ref;
  }

  static MultiplyScalar(v: Vector2Like, scalar: number): Vector2Like {
    return this.MultiplyScalarToRef(v, scalar, Vector2Like.Create());
  }

  static MultiplyScalarInPlace(v: Vector2Like, scalar: number): Vector2Like {
    return this.MultiplyScalarToRef(v, scalar, v);
  }

  static MultiplyScalarToRef(
    v: Vector2Like,
    scalar: number,
    ref: Vector2Like
  ): Vector2Like {
    const { x, y } = v;
    ref.x = x * scalar;
    ref.y = y * scalar;
    return ref;
  }

  static Divide(v1: Vector2Like, v2: Vector2Like): Vector2Like {
    return this.DivideToRef(v1, v2, Vector2Like.Create());
  }

  static DivideInPlace(v1: Vector2Like, v2: Vector2Like): Vector2Like {
    return this.DivideToRef(v1, v2, v1);
  }

  static DivideToRef(
    v1: Vector2Like,
    v2: Vector2Like,
    ref: Vector2Like
  ): Vector2Like {
    const { x: x1, y: y1 } = v1;
    const { x: x2, y: y2 } = v2;
    ref.x = x1 / x2;
    ref.y = y1 / y2;
    return ref;
  }

  static DivideScalar(v: Vector2Like, scalar: number): Vector2Like {
    return this.DivideScalarToRef(v, scalar, Vector2Like.Create());
  }

  static DivideScalarInPlace(v: Vector2Like, scalar: number): Vector2Like {
    return this.DivideScalarToRef(v, scalar, v);
  }

  static DivideScalarToRef(
    v: Vector2Like,
    scalar: number,
    ref: Vector2Like
  ): Vector2Like {
    const { x, y } = v;
    ref.x = x / scalar;
    ref.y = y / scalar;
    return ref;
  }

  static Length(v: Vector2Like): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  static Normalize(v: Vector2Like): Vector2Like {
    return this.NormalizeToRef(v, Vector2Like.Create());
  }
  static NormalizeInPlace(v: Vector2Like): Vector2Like {
    return this.NormalizeToRef(v, v);
  }

  static NormalizeToRef(v: Vector2Like, ref: Vector2Like): Vector2Like {
    const len = Vector2Like.Length(v);
    const { x, y } = v;
    if (len === 0) {
      ref.x = 0;
      ref.y = 0;
    } else {
      ref.x = x / len;
      ref.y = y / len;
    }
    return ref;
  }

  static Distance(v1: Vector2Like, v2: Vector2Like): number {
    return Vector2Like.Length(Vector2Like.Subtract(v1, v2));
  }

  static Lerp(v1: Vector2Like, v2: Vector2Like, t: number): Vector2Like {
    return this.LerpToRef(v1, v2, t, Vector2Like.Create());
  }

  static LerpToRef(
    v1: Vector2Like,
    v2: Vector2Like,
    t: number,
    ref: Vector2Like
  ): Vector2Like {
    const { x: x1, y: y1 } = v1;
    const { x: x2, y: y2 } = v2;
    ref.x = x1 + t * (x2 - x1);
    ref.y = y1 + t * (y2 - y1);
    return ref;
  }

  static Negate(v: Vector2Like): Vector2Like {
    return this.NegateToRef(v, Vector2Like.Create());
  }

  static NegateInPlace(v: Vector2Like): Vector2Like {
    return this.NegateToRef(v, v);
  }

  static NegateToRef(v: Vector2Like, ref: Vector2Like): Vector2Like {
    const { x, y } = v;
    ref.x = -x;
    ref.y = -y;
    return ref;
  }

  static Dot(v1: Vector2Like, v2: Vector2Like): number {
    return v1.x * v2.x + v1.y * v2.y;
  }

  static Equals(v1: Vector2Like, v2: Vector2Like): boolean {
    return v1.x === v2.x && v1.y === v2.y;
  }

  static Clone(v: Vector2Like): Vector2Like {
    return { x: v.x, y: v.y };
  }

  static Copy(target: Vector2Like, source: Vector2Like): Vector2Like {
    target.x = source.x;
    target.y = source.y;
    return target;
  }

  static ToArray(v: Vector2Like): Vec2Array {
    return [v.x, v.y];
  }

  static FromArray(v: Vec2Array): Vector2Like {
    return new Vector2Like(v[0], v[1]);
  }

  private constructor(
    public x: number,
    public y: number
  ) {}
}
