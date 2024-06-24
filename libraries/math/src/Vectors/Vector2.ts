import { Mat3Array } from "../Matrices/Matrix3x3Like";
import { Vec2Array } from "../Vector.types";

export class Vector2Like {
  static ApplyMatrix(matrix: Mat3Array, vec: Vector2Like): Vector2Like {
    return {
      x: matrix[0] * vec.x + matrix[1] * vec.y + matrix[2],
      y: matrix[3] * vec.x + matrix[4] * vec.y + matrix[5],
    };
  }

  static ApplyMatrixArray(matrix: Mat3Array, vec: Vec2Array): Vec2Array {
    return [
      matrix[0] * vec[0] + matrix[1] * vec[1] + matrix[2],
      matrix[3] * vec[0] + matrix[4] * vec[1] + matrix[5],
    ];
  }

  static RotateAroundPivot(
    matrix: Mat3Array,
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

  static RotateAroundPivotArray(
    matrix: Mat3Array,
    vec: Vec2Array,
    pivot: Vec2Array
  ): Vec2Array {
    const translatedVec: Vec2Array = [vec[0] - pivot[0], vec[1] - pivot[1]];
    const rotatedVec = Vector2Like.ApplyMatrixArray(matrix, translatedVec);
    return [rotatedVec[0] + pivot[0], rotatedVec[1] + pivot[1]];
  }

  static Create(x = 0, y = 0): Vector2Like {
    return new Vector2Like(x, y);
  }

  static Add(v1: Vector2Like, v2: Vector2Like): Vector2Like {
    return { x: v1.x + v2.x, y: v1.y + v2.y };
  }

  static AddToRef(v1: Vector2Like, v2: Vector2Like, ref: Vector2Like): void {
    ref.x = v1.x + v2.x;
    ref.y = v1.y + v2.y;
  }

  static AddInPlace(v1: Vector2Like, v2: Vector2Like): void {
    v1.x += v2.x;
    v1.y += v2.y;
  }

  static AddArray(v1: Vec2Array, v2: Vec2Array): Vec2Array {
    return [v1[0] + v2[0], v1[1] + v2[1]];
  }

  static AddArrayToRef(v1: Vec2Array, v2: Vec2Array, ref: Vec2Array): void {
    ref[0] = v1[0] + v2[0];
    ref[1] = v1[1] + v2[1];
  }

  static AddArrayInPlace(v1: Vec2Array, v2: Vec2Array): void {
    v1[0] += v2[0];
    v1[1] += v2[1];
  }

  static AddScalar(v: Vector2Like, scalar: number): Vector2Like {
    return { x: v.x + scalar, y: v.y + scalar };
  }

  static AddScalarToRef(
    v: Vector2Like,
    scalar: number,
    ref: Vector2Like
  ): void {
    ref.x = v.x + scalar;
    ref.y = v.y + scalar;
  }

  static AddScalarInPlace(v: Vector2Like, scalar: number): void {
    v.x += scalar;
    v.y += scalar;
  }

  static AddScalarArray(v: Vec2Array, scalar: number): Vec2Array {
    return [v[0] + scalar, v[1] + scalar];
  }

  static AddScalarArrayToRef(
    v: Vec2Array,
    scalar: number,
    ref: Vec2Array
  ): void {
    ref[0] = v[0] + scalar;
    ref[1] = v[1] + scalar;
  }

  static AddScalarArrayInPlace(v: Vec2Array, scalar: number): void {
    v[0] += scalar;
    v[1] += scalar;
  }

  static Subtract(v1: Vector2Like, v2: Vector2Like): Vector2Like {
    return { x: v1.x - v2.x, y: v1.y - v2.y };
  }

  static SubtractToRef(
    v1: Vector2Like,
    v2: Vector2Like,
    ref: Vector2Like
  ): void {
    ref.x = v1.x - v2.x;
    ref.y = v1.y - v2.y;
  }

  static SubtractInPlace(v1: Vector2Like, v2: Vector2Like): void {
    v1.x -= v2.x;
    v1.y -= v2.y;
  }

  static SubtractArray(v1: Vec2Array, v2: Vec2Array): Vec2Array {
    return [v1[0] - v2[0], v1[1] - v2[1]];
  }

  static SubtractArrayToRef(
    v1: Vec2Array,
    v2: Vec2Array,
    ref: Vec2Array
  ): void {
    ref[0] = v1[0] - v2[0];
    ref[1] = v1[1] - v2[1];
  }

  static SubtractArrayInPlace(v1: Vec2Array, v2: Vec2Array): void {
    v1[0] -= v2[0];
    v1[1] -= v2[1];
  }

  static SubtractScalar(v: Vector2Like, scalar: number): Vector2Like {
    return { x: v.x - scalar, y: v.y - scalar };
  }

  static SubtractScalarToRef(
    v: Vector2Like,
    scalar: number,
    ref: Vector2Like
  ): void {
    ref.x = v.x - scalar;
    ref.y = v.y - scalar;
  }

  static SubtractScalarInPlace(v: Vector2Like, scalar: number): void {
    v.x -= scalar;
    v.y -= scalar;
  }

  static SubtractScalarArray(v: Vec2Array, scalar: number): Vec2Array {
    return [v[0] - scalar, v[1] - scalar];
  }

  static SubtractScalarArrayToRef(
    v: Vec2Array,
    scalar: number,
    ref: Vec2Array
  ): void {
    ref[0] = v[0] - scalar;
    ref[1] = v[1] - scalar;
  }

  static SubtractScalarArrayInPlace(v: Vec2Array, scalar: number): void {
    v[0] -= scalar;
    v[1] -= scalar;
  }

  static Multiply(v1: Vector2Like, v2: Vector2Like): Vector2Like {
    return { x: v1.x * v2.x, y: v1.y * v2.y };
  }

  static MultiplyToRef(
    v1: Vector2Like,
    v2: Vector2Like,
    ref: Vector2Like
  ): void {
    ref.x = v1.x * v2.x;
    ref.y = v1.y * v2.y;
  }

  static MultiplyInPlace(v1: Vector2Like, v2: Vector2Like): void {
    v1.x *= v2.x;
    v1.y *= v2.y;
  }

  static MultiplyArray(v1: Vec2Array, v2: Vec2Array): Vec2Array {
    return [v1[0] * v2[0], v1[1] * v2[1]];
  }

  static MultiplyArrayToRef(
    v1: Vec2Array,
    v2: Vec2Array,
    ref: Vec2Array
  ): void {
    ref[0] = v1[0] * v2[0];
    ref[1] = v1[1] * v2[1];
  }

  static MultiplyArrayInPlace(v1: Vec2Array, v2: Vec2Array): void {
    v1[0] *= v2[0];
    v1[1] *= v2[1];
  }

  static MultiplyScalar(v: Vector2Like, scalar: number): Vector2Like {
    return { x: v.x * scalar, y: v.y * scalar };
  }

  static MultiplyScalarToRef(
    v: Vector2Like,
    scalar: number,
    ref: Vector2Like
  ): void {
    ref.x = v.x * scalar;
    ref.y = v.y * scalar;
  }

  static MultiplyScalarInPlace(v: Vector2Like, scalar: number): void {
    v.x *= scalar;
    v.y *= scalar;
  }

  static MultiplyScalarArray(v: Vec2Array, scalar: number): Vec2Array {
    return [v[0] * scalar, v[1] * scalar];
  }

  static MultiplyScalarArrayToRef(
    v: Vec2Array,
    scalar: number,
    ref: Vec2Array
  ): void {
    ref[0] = v[0] * scalar;
    ref[1] = v[1] * scalar;
  }

  static MultiplyScalarArrayInPlace(v: Vec2Array, scalar: number): void {
    v[0] *= scalar;
    v[1] *= scalar;
  }

  static Divide(v1: Vector2Like, v2: Vector2Like): Vector2Like {
    return { x: v1.x / v2.x, y: v1.y / v2.y };
  }

  static DivideToRef(v1: Vector2Like, v2: Vector2Like, ref: Vector2Like): void {
    ref.x = v1.x / v2.x;
    ref.y = v1.y / v2.y;
  }

  static DivideInPlace(v1: Vector2Like, v2: Vector2Like): void {
    v1.x /= v2.x;
    v1.y /= v2.y;
  }

  static DivideArray(v1: Vec2Array, v2: Vec2Array): Vec2Array {
    return [v1[0] / v2[0], v1[1] / v2[1]];
  }

  static DivideArrayToRef(v1: Vec2Array, v2: Vec2Array, ref: Vec2Array): void {
    ref[0] = v1[0] / v2[0];
    ref[1] = v1[1] / v2[1];
  }

  static DivideArrayInPlace(v1: Vec2Array, v2: Vec2Array): void {
    v1[0] /= v2[0];
    v1[1] /= v2[1];
  }

  static DivideScalar(v: Vector2Like, scalar: number): Vector2Like {
    return { x: v.x / scalar, y: v.y / scalar };
  }

  static DivideScalarToRef(
    v: Vector2Like,
    scalar: number,
    ref: Vector2Like
  ): void {
    ref.x = v.x / scalar;
    ref.y = v.y / scalar;
  }

  static DivideScalarInPlace(v: Vector2Like, scalar: number): void {
    v.x /= scalar;
    v.y /= scalar;
  }

  static DivideScalarArray(v: Vec2Array, scalar: number): Vec2Array {
    return [v[0] / scalar, v[1] / scalar];
  }

  static DivideScalarArrayToRef(
    v: Vec2Array,
    scalar: number,
    ref: Vec2Array
  ): void {
    ref[0] = v[0] / scalar;
    ref[1] = v[1] / scalar;
  }

  static DivideScalarArrayInPlace(v: Vec2Array, scalar: number): void {
    v[0] /= scalar;
    v[1] /= scalar;
  }

  static Dot(v1: Vector2Like, v2: Vector2Like): number {
    return v1.x * v2.x + v1.y * v2.y;
  }

  static DotArray(v1: Vec2Array, v2: Vec2Array): number {
    return v1[0] * v2[0] + v1[1] * v2[1];
  }

  static Length(v: Vector2Like): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  static LengthArray(v: Vec2Array): number {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  }

  static Normalize(v: Vector2Like): Vector2Like {
    const len = Vector2Like.Length(v);
    if (len === 0) return { x: 0, y: 0 };
    return { x: v.x / len, y: v.y / len };
  }

  static NormalizeToRef(v: Vector2Like, ref: Vector2Like): void {
    const len = Vector2Like.Length(v);
    if (len === 0) {
      ref.x = 0;
      ref.y = 0;
    } else {
      ref.x = v.x / len;
      ref.y = v.y / len;
    }
  }

  static NormalizeInPlace(v: Vector2Like): void {
    const len = Vector2Like.Length(v);
    if (len === 0) {
      v.x = 0;
      v.y = 0;
    } else {
      v.x /= len;
      v.y /= len;
    }
  }

  static NormalizeArray(v: Vec2Array): Vec2Array {
    const len = Vector2Like.LengthArray(v);
    if (len === 0) return [0, 0];
    return [v[0] / len, v[1] / len];
  }

  static NormalizeArrayToRef(v: Vec2Array, ref: Vec2Array): void {
    const len = Vector2Like.LengthArray(v);
    if (len === 0) {
      ref[0] = 0;
      ref[1] = 0;
    } else {
      ref[0] = v[0] / len;
      ref[1] = v[1] / len;
    }
  }

  static NormalizeArrayInPlace(v: Vec2Array): void {
    const len = Vector2Like.LengthArray(v);
    if (len === 0) {
      v[0] = 0;
      v[1] = 0;
    } else {
      v[0] /= len;
      v[1] /= len;
    }
  }

  static Distance(v1: Vector2Like, v2: Vector2Like): number {
    return Vector2Like.Length(Vector2Like.Subtract(v1, v2));
  }

  static DistanceArray(v1: Vec2Array, v2: Vec2Array): number {
    return Vector2Like.LengthArray(Vector2Like.SubtractArray(v1, v2));
  }

  static Lerp(v1: Vector2Like, v2: Vector2Like, t: number): Vector2Like {
    return {
      x: v1.x + t * (v2.x - v1.x),
      y: v1.y + t * (v2.y - v1.y),
    };
  }

  static LerpToRef(
    v1: Vector2Like,
    v2: Vector2Like,
    t: number,
    ref: Vector2Like
  ): void {
    ref.x = v1.x + t * (v2.x - v1.x);
    ref.y = v1.y + t * (v2.y - v1.y);
  }

  static LerpInPlace(v1: Vector2Like, v2: Vector2Like, t: number): void {
    v1.x += t * (v2.x - v1.x);
    v1.y += t * (v2.y - v1.y);
  }

  static LerpArray(v1: Vec2Array, v2: Vec2Array, t: number): Vec2Array {
    return [v1[0] + t * (v2[0] - v1[0]), v1[1] + t * (v2[1] - v1[1])];
  }

  static LerpArrayToRef(
    v1: Vec2Array,
    v2: Vec2Array,
    t: number,
    ref: Vec2Array
  ): void {
    ref[0] = v1[0] + t * (v2[0] - v1[0]);
    ref[1] = v1[1] + t * (v2[1] - v1[1]);
  }

  static LerpArrayInPlace(v1: Vec2Array, v2: Vec2Array, t: number): void {
    v1[0] += t * (v2[0] - v1[0]);
    v1[1] += t * (v2[1] - v1[1]);
  }

  static Negate(v: Vector2Like): Vector2Like {
    return { x: -v.x, y: -v.y };
  }

  static NegateToRef(v: Vector2Like, ref: Vector2Like): void {
    ref.x = -v.x;
    ref.y = -v.y;
  }

  static NegateInPlace(v: Vector2Like): void {
    v.x = -v.x;
    v.y = -v.y;
  }

  static NegateArray(v: Vec2Array): Vec2Array {
    return [-v[0], -v[1]];
  }

  static NegateArrayToRef(v: Vec2Array, ref: Vec2Array): void {
    ref[0] = -v[0];
    ref[1] = -v[1];
  }

  static NegateArrayInPlace(v: Vec2Array): void {
    v[0] = -v[0];
    v[1] = -v[1];
  }

  static Equals(v1: Vector2Like, v2: Vector2Like): boolean {
    return v1.x === v2.x && v1.y === v2.y;
  }

  static EqualsArray(v1: Vec2Array, v2: Vec2Array): boolean {
    return v1[0] === v2[0] && v1[1] === v2[1];
  }

  static Clone(v: Vector2Like): Vector2Like {
    return { x: v.x, y: v.y };
  }

  static CloneArray(v: Vec2Array): Vec2Array {
    return [v[0], v[1]];
  }

  static Copy(target: Vector2Like, source: Vector2Like): Vector2Like {
    target.x = source.x;
    target.y = source.y;
    return target;
  }

  static CopyArray(target: Vec2Array, source: Vec2Array): Vec2Array {
    target[0] = source[0];
    target[1] = source[1];
    return target;
  }

  static CopyFromArray(target: Vector2Like, source: Vec2Array): Vector2Like {
    target.x = source[0];
    target.y = source[1];
    return target;
  }

  static CopyIntoArray(target: Vec2Array, source: Vector2Like): Vec2Array {
    target[0] = source.x;
    target[1] = source.y;
    return target;
  }

  static ToArray(v: Vector2Like): Vec2Array {
    return [v.x, v.y];
  }

  static FromArray(v: Vec2Array): Vector2Like {
    return new Vector2Like(v[0], v[1]);
  }

  private constructor(public x: number, public y: number) {}
}
