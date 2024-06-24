import { Mat4Array } from "../Matrices/Matrix4x4Like";
import { Vec4Array } from "../Vector.types";

export class Vector4Like {
  static Create(x = 0, y = 0, z = 0, w = 0): Vector4Like {
    return new Vector4Like(x, y, z, w);
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

  static ApplyMatrixArray(matrix: Mat4Array, vec: Vec4Array): Vec4Array {
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

  static RotateAroundPivotArray(
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
    const rotatedVec = Vector4Like.ApplyMatrixArray(matrix, translatedVec);
    return [
      rotatedVec[0] + pivot[0],
      rotatedVec[1] + pivot[1],
      rotatedVec[2] + pivot[2],
      rotatedVec[3] + pivot[3],
    ];
  }

  static Add(v1: Vector4Like, v2: Vector4Like): Vector4Like {
    return { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z, w: v1.w + v2.w };
  }

  static AddToRef(v1: Vector4Like, v2: Vector4Like, ref: Vector4Like): void {
    ref.x = v1.x + v2.x;
    ref.y = v1.y + v2.y;
    ref.z = v1.z + v2.z;
    ref.w = v1.w + v2.w;
  }

  static AddInPlace(v1: Vector4Like, v2: Vector4Like): void {
    v1.x += v2.x;
    v1.y += v2.y;
    v1.z += v2.z;
    v1.w += v2.w;
  }

  static AddArray(v1: Vec4Array, v2: Vec4Array): Vec4Array {
    return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2], v1[3] + v2[3]];
  }

  static AddArrayToRef(v1: Vec4Array, v2: Vec4Array, ref: Vec4Array): void {
    ref[0] = v1[0] + v2[0];
    ref[1] = v1[1] + v2[1];
    ref[2] = v1[2] + v2[2];
    ref[3] = v1[3] + v2[3];
  }

  static AddArrayInPlace(v1: Vec4Array, v2: Vec4Array): void {
    v1[0] += v2[0];
    v1[1] += v2[1];
    v1[2] += v2[2];
    v1[3] += v2[3];
  }

  static AddScalar(v: Vector4Like, scalar: number): Vector4Like {
    return {
      x: v.x + scalar,
      y: v.y + scalar,
      z: v.z + scalar,
      w: v.w + scalar,
    };
  }

  static AddScalarToRef(
    v: Vector4Like,
    scalar: number,
    ref: Vector4Like
  ): void {
    ref.x = v.x + scalar;
    ref.y = v.y + scalar;
    ref.z = v.z + scalar;
    ref.w = v.w + scalar;
  }

  static AddScalarInPlace(v: Vector4Like, scalar: number): void {
    v.x += scalar;
    v.y += scalar;
    v.z += scalar;
    v.w += scalar;
  }

  static AddScalarArray(v: Vec4Array, scalar: number): Vec4Array {
    return [v[0] + scalar, v[1] + scalar, v[2] + scalar, v[3] + scalar];
  }

  static AddScalarArrayToRef(
    v: Vec4Array,
    scalar: number,
    ref: Vec4Array
  ): void {
    ref[0] = v[0] + scalar;
    ref[1] = v[1] + scalar;
    ref[2] = v[2] + scalar;
    ref[3] = v[3] + scalar;
  }

  static AddScalarArrayInPlace(v: Vec4Array, scalar: number): void {
    v[0] += scalar;
    v[1] += scalar;
    v[2] += scalar;
    v[3] += scalar;
  }

  static Subtract(v1: Vector4Like, v2: Vector4Like): Vector4Like {
    return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z, w: v1.w - v2.w };
  }

  static SubtractToRef(
    v1: Vector4Like,
    v2: Vector4Like,
    ref: Vector4Like
  ): void {
    ref.x = v1.x - v2.x;
    ref.y = v1.y - v2.y;
    ref.z = v1.z - v2.z;
    ref.w = v1.w - v2.w;
  }

  static SubtractInPlace(v1: Vector4Like, v2: Vector4Like): void {
    v1.x -= v2.x;
    v1.y -= v2.y;
    v1.z -= v2.z;
    v1.w -= v2.w;
  }

  static SubtractArray(v1: Vec4Array, v2: Vec4Array): Vec4Array {
    return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2], v1[3] - v2[3]];
  }

  static SubtractArrayToRef(
    v1: Vec4Array,
    v2: Vec4Array,
    ref: Vec4Array
  ): void {
    ref[0] = v1[0] - v2[0];
    ref[1] = v1[1] - v2[1];
    ref[2] = v1[2] - v2[2];
    ref[3] = v1[3] - v2[3];
  }

  static SubtractArrayInPlace(v1: Vec4Array, v2: Vec4Array): void {
    v1[0] -= v2[0];
    v1[1] -= v2[1];
    v1[2] -= v2[2];
    v1[3] -= v2[3];
  }

  static SubtractScalar(v: Vector4Like, scalar: number): Vector4Like {
    return {
      x: v.x - scalar,
      y: v.y - scalar,
      z: v.z - scalar,
      w: v.w - scalar,
    };
  }

  static SubtractScalarToRef(
    v: Vector4Like,
    scalar: number,
    ref: Vector4Like
  ): void {
    ref.x = v.x - scalar;
    ref.y = v.y - scalar;
    ref.z = v.z - scalar;
    ref.w = v.w - scalar;
  }

  static SubtractScalarInPlace(v: Vector4Like, scalar: number): void {
    v.x -= scalar;
    v.y -= scalar;
    v.z -= scalar;
    v.w -= scalar;
  }

  static SubtractScalarArray(v: Vec4Array, scalar: number): Vec4Array {
    return [v[0] - scalar, v[1] - scalar, v[2] - scalar, v[3] - scalar];
  }

  static SubtractScalarArrayToRef(
    v: Vec4Array,
    scalar: number,
    ref: Vec4Array
  ): void {
    ref[0] = v[0] - scalar;
    ref[1] = v[1] - scalar;
    ref[2] = v[2] - scalar;
    ref[3] = v[3] - scalar;
  }

  static SubtractScalarArrayInPlace(v: Vec4Array, scalar: number): void {
    v[0] -= scalar;
    v[1] -= scalar;
    v[2] -= scalar;
    v[3] -= scalar;
  }

  static Multiply(v1: Vector4Like, v2: Vector4Like): Vector4Like {
    return { x: v1.x * v2.x, y: v1.y * v2.y, z: v1.z * v2.z, w: v1.w * v2.w };
  }

  static MultiplyToRef(
    v1: Vector4Like,
    v2: Vector4Like,
    ref: Vector4Like
  ): void {
    ref.x = v1.x * v2.x;
    ref.y = v1.y * v2.y;
    ref.z = v1.z * v2.z;
    ref.w = v1.w * v2.w;
  }

  static MultiplyInPlace(v1: Vector4Like, v2: Vector4Like): void {
    v1.x *= v2.x;
    v1.y *= v2.y;
    v1.z *= v2.z;
    v1.w *= v2.w;
  }

  static MultiplyArray(v1: Vec4Array, v2: Vec4Array): Vec4Array {
    return [v1[0] * v2[0], v1[1] * v2[1], v1[2] * v2[2], v1[3] * v2[3]];
  }

  static MultiplyArrayToRef(
    v1: Vec4Array,
    v2: Vec4Array,
    ref: Vec4Array
  ): void {
    ref[0] = v1[0] * v2[0];
    ref[1] = v1[1] * v2[1];
    ref[2] = v1[2] * v2[2];
    ref[3] = v1[3] * v2[3];
  }

  static MultiplyArrayInPlace(v1: Vec4Array, v2: Vec4Array): void {
    v1[0] *= v2[0];
    v1[1] *= v2[1];
    v1[2] *= v2[2];
    v1[3] *= v2[3];
  }

  static MultiplyScalar(v: Vector4Like, scalar: number): Vector4Like {
    return {
      x: v.x * scalar,
      y: v.y * scalar,
      z: v.z * scalar,
      w: v.w * scalar,
    };
  }

  static MultiplyScalarToRef(
    v: Vector4Like,
    scalar: number,
    ref: Vector4Like
  ): void {
    ref.x = v.x * scalar;
    ref.y = v.y * scalar;
    ref.z = v.z * scalar;
    ref.w = v.w * scalar;
  }

  static MultiplyScalarInPlace(v: Vector4Like, scalar: number): void {
    v.x *= scalar;
    v.y *= scalar;
    v.z *= scalar;
    v.w *= scalar;
  }

  static MultiplyScalarArray(v: Vec4Array, scalar: number): Vec4Array {
    return [v[0] * scalar, v[1] * scalar, v[2] * scalar, v[3] * scalar];
  }

  static MultiplyScalarArrayToRef(
    v: Vec4Array,
    scalar: number,
    ref: Vec4Array
  ): void {
    ref[0] = v[0] * scalar;
    ref[1] = v[1] * scalar;
    ref[2] = v[2] * scalar;
    ref[3] = v[3] * scalar;
  }

  static MultiplyScalarArrayInPlace(v: Vec4Array, scalar: number): void {
    v[0] *= scalar;
    v[1] *= scalar;
    v[2] *= scalar;
    v[3] *= scalar;
  }

  static Divide(v1: Vector4Like, v2: Vector4Like): Vector4Like {
    return { x: v1.x / v2.x, y: v1.y / v2.y, z: v1.z / v2.z, w: v1.w / v2.w };
  }

  static DivideToRef(v1: Vector4Like, v2: Vector4Like, ref: Vector4Like): void {
    ref.x = v1.x / v2.x;
    ref.y = v1.y / v2.y;
    ref.z = v1.z / v2.z;
    ref.w = v1.w / v2.w;
  }

  static DivideInPlace(v1: Vector4Like, v2: Vector4Like): void {
    v1.x /= v2.x;
    v1.y /= v2.y;
    v1.z /= v2.z;
    v1.w /= v2.w;
  }

  static DivideArray(v1: Vec4Array, v2: Vec4Array): Vec4Array {
    return [v1[0] / v2[0], v1[1] / v2[1], v1[2] / v2[2], v1[3] / v2[3]];
  }

  static DivideArrayToRef(v1: Vec4Array, v2: Vec4Array, ref: Vec4Array): void {
    ref[0] = v1[0] / v2[0];
    ref[1] = v1[1] / v2[1];
    ref[2] = v1[2] / v2[2];
    ref[3] = v1[3] / v2[3];
  }

  static DivideArrayInPlace(v1: Vec4Array, v2: Vec4Array): void {
    v1[0] /= v2[0];
    v1[1] /= v2[1];
    v1[2] /= v2[2];
    v1[3] /= v2[3];
  }

  static DivideScalar(v: Vector4Like, scalar: number): Vector4Like {
    return {
      x: v.x / scalar,
      y: v.y / scalar,
      z: v.z / scalar,
      w: v.w / scalar,
    };
  }

  static DivideScalarToRef(
    v: Vector4Like,
    scalar: number,
    ref: Vector4Like
  ): void {
    ref.x = v.x / scalar;
    ref.y = v.y / scalar;
    ref.z = v.z / scalar;
    ref.w = v.w / scalar;
  }

  static DivideScalarInPlace(v: Vector4Like, scalar: number): void {
    v.x /= scalar;
    v.y /= scalar;
    v.z /= scalar;
    v.w /= scalar;
  }

  static DivideScalarArray(v: Vec4Array, scalar: number): Vec4Array {
    return [v[0] / scalar, v[1] / scalar, v[2] / scalar, v[3] / scalar];
  }

  static DivideScalarArrayToRef(
    v: Vec4Array,
    scalar: number,
    ref: Vec4Array
  ): void {
    ref[0] = v[0] / scalar;
    ref[1] = v[1] / scalar;
    ref[2] = v[2] / scalar;
    ref[3] = v[3] / scalar;
  }

  static DivideScalarArrayInPlace(v: Vec4Array, scalar: number): void {
    v[0] /= scalar;
    v[1] /= scalar;
    v[2] /= scalar;
    v[3] /= scalar;
  }

  static Dot(v1: Vector4Like, v2: Vector4Like): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w;
  }

  static DotArray(v1: Vec4Array, v2: Vec4Array): number {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2] + v1[3] * v2[3];
  }

  static Length(v: Vector4Like): number {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z + v.w * v.w);
  }

  static LengthArray(v: Vec4Array): number {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3]);
  }

  static Normalize(v: Vector4Like): Vector4Like {
    const len = Vector4Like.Length(v);
    if (len === 0) return { x: 0, y: 0, z: 0, w: 0 };
    return { x: v.x / len, y: v.y / len, z: v.z / len, w: v.w / len };
  }

  static NormalizeToRef(v: Vector4Like, ref: Vector4Like): void {
    const len = Vector4Like.Length(v);
    if (len === 0) {
      ref.x = 0;
      ref.y = 0;
      ref.z = 0;
      ref.w = 0;
    } else {
      ref.x = v.x / len;
      ref.y = v.y / len;
      ref.z = v.z / len;
      ref.w = v.w / len;
    }
  }

  static NormalizeInPlace(v: Vector4Like): void {
    const len = Vector4Like.Length(v);
    if (len === 0) {
      v.x = 0;
      v.y = 0;
      v.z = 0;
      v.w = 0;
    } else {
      v.x /= len;
      v.y /= len;
      v.z /= len;
      v.w /= len;
    }
  }

  static NormalizeArray(v: Vec4Array): Vec4Array {
    const len = Vector4Like.LengthArray(v);
    if (len === 0) return [0, 0, 0, 0];
    return [v[0] / len, v[1] / len, v[2] / len, v[3] / len];
  }

  static NormalizeArrayToRef(v: Vec4Array, ref: Vec4Array): void {
    const len = Vector4Like.LengthArray(v);
    if (len === 0) {
      ref[0] = 0;
      ref[1] = 0;
      ref[2] = 0;
      ref[3] = 0;
    } else {
      ref[0] = v[0] / len;
      ref[1] = v[1] / len;
      ref[2] = v[2] / len;
      ref[3] = v[3] / len;
    }
  }

  static NormalizeArrayInPlace(v: Vec4Array): void {
    const len = Vector4Like.LengthArray(v);
    if (len === 0) {
      v[0] = 0;
      v[1] = 0;
      v[2] = 0;
      v[3] = 0;
    } else {
      v[0] /= len;
      v[1] /= len;
      v[2] /= len;
      v[3] /= len;
    }
  }

  static Distance(v1: Vector4Like, v2: Vector4Like): number {
    return Vector4Like.Length(Vector4Like.Subtract(v1, v2));
  }

  static DistanceArray(v1: Vec4Array, v2: Vec4Array): number {
    return Vector4Like.LengthArray(Vector4Like.SubtractArray(v1, v2));
  }

  static Lerp(v1: Vector4Like, v2: Vector4Like, t: number): Vector4Like {
    return {
      x: v1.x + t * (v2.x - v1.x),
      y: v1.y + t * (v2.y - v1.y),
      z: v1.z + t * (v2.z - v1.z),
      w: v1.w + t * (v2.w - v1.w),
    };
  }

  static LerpToRef(
    v1: Vector4Like,
    v2: Vector4Like,
    t: number,
    ref: Vector4Like
  ): void {
    ref.x = v1.x + t * (v2.x - v1.x);
    ref.y = v1.y + t * (v2.y - v1.y);
    ref.z = v1.z + t * (v2.z - v1.z);
    ref.w = v1.w + t * (v2.w - v1.w);
  }

  static LerpInPlace(v1: Vector4Like, v2: Vector4Like, t: number): void {
    v1.x += t * (v2.x - v1.x);
    v1.y += t * (v2.y - v1.y);
    v1.z += t * (v2.z - v1.z);
    v1.w += t * (v2.w - v1.w);
  }

  static LerpArray(v1: Vec4Array, v2: Vec4Array, t: number): Vec4Array {
    return [
      v1[0] + t * (v2[0] - v1[0]),
      v1[1] + t * (v2[1] - v1[1]),
      v1[2] + t * (v2[2] - v1[2]),
      v1[3] + t * (v2[3] - v1[3]),
    ];
  }

  static LerpArrayToRef(
    v1: Vec4Array,
    v2: Vec4Array,
    t: number,
    ref: Vec4Array
  ): void {
    ref[0] = v1[0] + t * (v2[0] - v1[0]);
    ref[1] = v1[1] + t * (v2[1] - v1[1]);
    ref[2] = v1[2] + t * (v2[2] - v1[2]);
    ref[3] = v1[3] + t * (v2[3] - v1[3]);
  }

  static LerpArrayInPlace(v1: Vec4Array, v2: Vec4Array, t: number): void {
    v1[0] += t * (v2[0] - v1[0]);
    v1[1] += t * (v2[1] - v1[1]);
    v1[2] += t * (v2[2] - v1[2]);
    v1[3] += t * (v2[3] - v1[3]);
  }

  static Negate(v: Vector4Like): Vector4Like {
    return { x: -v.x, y: -v.y, z: -v.z, w: -v.w };
  }

  static NegateToRef(v: Vector4Like, ref: Vector4Like): void {
    ref.x = -v.x;
    ref.y = -v.y;
    ref.z = -v.z;
    ref.w = -v.w;
  }

  static NegateInPlace(v: Vector4Like): void {
    v.x = -v.x;
    v.y = -v.y;
    v.z = -v.z;
    v.w = -v.w;
  }

  static NegateArray(v: Vec4Array): Vec4Array {
    return [-v[0], -v[1], -v[2], -v[3]];
  }

  static NegateArrayToRef(v: Vec4Array, ref: Vec4Array): void {
    ref[0] = -v[0];
    ref[1] = -v[1];
    ref[2] = -v[2];
    ref[3] = -v[3];
  }

  static NegateArrayInPlace(v: Vec4Array): void {
    v[0] = -v[0];
    v[1] = -v[1];
    v[2] = -v[2];
    v[3] = -v[3];
  }

  static Equals(v1: Vector4Like, v2: Vector4Like): boolean {
    return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z && v1.w === v2.w;
  }

  static EqualsArray(v1: Vec4Array, v2: Vec4Array): boolean {
    return (
      v1[0] === v2[0] && v1[1] === v2[1] && v1[2] === v2[2] && v1[3] === v2[3]
    );
  }

  static Clone(v: Vector4Like): Vector4Like {
    return { x: v.x, y: v.y, z: v.z, w: v.w };
  }

  static CloneArray(v: Vec4Array): Vec4Array {
    return [v[0], v[1], v[2], v[3]];
  }

  static Copy(target: Vector4Like, source: Vector4Like): Vector4Like {
    target.x = source.x;
    target.y = source.y;
    target.z = source.z;
    return target;
  }

  static CopyArray(target: Vec4Array, source: Vec4Array): Vec4Array {
    target[0] = source[0];
    target[1] = source[1];
    target[2] = source[2];
    return target;
  }

  static CopyFromArray(target: Vector4Like, source: Vec4Array): Vector4Like {
    target.x = source[0];
    target.y = source[1];
    target.z = source[2];
    return target;
  }

  static CopyIntoArray(target: Vec4Array, source: Vector4Like): Vec4Array {
    target[0] = source.x;
    target[1] = source.y;
    target[2] = source.z;
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
