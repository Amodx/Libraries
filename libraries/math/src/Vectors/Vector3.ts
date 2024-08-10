import { Mat3Array, Matrix3x3Like } from "../Matrices/Matrix3x3Like";
import { Vec3Array } from "../Vector.types";
export class Vector3Like {
  static Create(x = 0, y = 0, z = 0): Vector3Like {
    return new Vector3Like(x, y, z);
  }

  static ApplyMatrix(matrix: Mat3Array, vec: Vector3Like): Vector3Like {
    return Matrix3x3Like.ApplyMatrix(matrix, vec);
  }

  static ApplyMatrixArray(matrix: Mat3Array, vec: Vec3Array): Vec3Array {
    return Matrix3x3Like.ApplyMatrixArray(matrix, vec);
  }

  static RotateAroundPivot(
    matrix: Mat3Array,
    vec: Vector3Like,
    pivot: Vector3Like
  ): Vector3Like {
    const translatedVec: Vector3Like = {
      x: vec.x - pivot.x,
      y: vec.y - pivot.y,
      z: vec.z - pivot.z,
    };
    const rotatedVec = Vector3Like.ApplyMatrix(matrix, translatedVec);
    return {
      x: rotatedVec.x + pivot.x,
      y: rotatedVec.y + pivot.y,
      z: rotatedVec.z + pivot.z,
    };
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
    const rotatedVec = Vector3Like.ApplyMatrixArray(matrix, translatedVec);
    return [
      rotatedVec[0] + pivot[0],
      rotatedVec[1] + pivot[1],
      rotatedVec[2] + pivot[2],
    ];
  }

  static FloorInPlace(v: Vector3Like): Vector3Like {
    v.x = Math.floor(v.x);
    v.y = Math.floor(v.y);
    v.z = Math.floor(v.z);
    return v;
  }
  static FloorArrayInPlace(v: Vec3Array): Vec3Array {
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
  static Add(v1: Vector3Like, v2: Vector3Like): Vector3Like {
    return { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z };
  }

  static AddToRef(v1: Vector3Like, v2: Vector3Like, ref: Vector3Like): void {
    ref.x = v1.x + v2.x;
    ref.y = v1.y + v2.y;
    ref.z = v1.z + v2.z;
  }

  static AddInPlace(v1: Vector3Like, v2: Vector3Like): void {
    v1.x += v2.x;
    v1.y += v2.y;
    v1.z += v2.z;
  }

  static AddArray(v1: Vec3Array, v2: Vec3Array): Vec3Array {
    return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
  }

  static AddArrayToRef(v1: Vec3Array, v2: Vec3Array, ref: Vec3Array): void {
    ref[0] = v1[0] + v2[0];
    ref[1] = v1[1] + v2[1];
    ref[2] = v1[2] + v2[2];
  }

  static AddArrayInPlace(v1: Vec3Array, v2: Vec3Array): void {
    v1[0] += v2[0];
    v1[1] += v2[1];
    v1[2] += v2[2];
  }

  static AddScalar(v: Vector3Like, scalar: number): Vector3Like {
    return { x: v.x + scalar, y: v.y + scalar, z: v.z + scalar };
  }

  static AddScalarToRef(
    v: Vector3Like,
    scalar: number,
    ref: Vector3Like
  ): void {
    ref.x = v.x + scalar;
    ref.y = v.y + scalar;
    ref.z = v.z + scalar;
  }

  static AddScalarInPlace(v: Vector3Like, scalar: number): void {
    v.x += scalar;
    v.y += scalar;
    v.z += scalar;
  }

  static AddScalarArray(v: Vec3Array, scalar: number): Vec3Array {
    return [v[0] + scalar, v[1] + scalar, v[2] + scalar];
  }

  static AddScalarArrayToRef(
    v: Vec3Array,
    scalar: number,
    ref: Vec3Array
  ): void {
    ref[0] = v[0] + scalar;
    ref[1] = v[1] + scalar;
    ref[2] = v[2] + scalar;
  }

  static AddScalarArrayInPlace(v: Vec3Array, scalar: number): void {
    v[0] += scalar;
    v[1] += scalar;
    v[2] += scalar;
  }

  static Subtract(v1: Vector3Like, v2: Vector3Like): Vector3Like {
    return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z };
  }

  static SubtractToRef(
    v1: Vector3Like,
    v2: Vector3Like,
    ref: Vector3Like
  ): void {
    ref.x = v1.x - v2.x;
    ref.y = v1.y - v2.y;
    ref.z = v1.z - v2.z;
  }

  static SubtractInPlace(v1: Vector3Like, v2: Vector3Like): Vector3Like {
    v1.x -= v2.x;
    v1.y -= v2.y;
    v1.z -= v2.z;
    return v1;
  }

  static SubtractArray(v1: Vec3Array, v2: Vec3Array): Vec3Array {
    return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
  }

  static SubtractArrayToRef(
    v1: Vec3Array,
    v2: Vec3Array,
    ref: Vec3Array
  ): void {
    ref[0] = v1[0] - v2[0];
    ref[1] = v1[1] - v2[1];
    ref[2] = v1[2] - v2[2];
  }

  static SubtractArrayInPlace(v1: Vec3Array, v2: Vec3Array): void {
    v1[0] -= v2[0];
    v1[1] -= v2[1];
    v1[2] -= v2[2];
  }

  static SubtractScalar(v: Vector3Like, scalar: number): Vector3Like {
    return { x: v.x - scalar, y: v.y - scalar, z: v.z - scalar };
  }

  static SubtractScalarToRef(
    v: Vector3Like,
    scalar: number,
    ref: Vector3Like
  ): void {
    ref.x = v.x - scalar;
    ref.y = v.y - scalar;
    ref.z = v.z - scalar;
  }

  static SubtractScalarInPlace(v: Vector3Like, scalar: number): void {
    v.x -= scalar;
    v.y -= scalar;
    v.z -= scalar;

  }

  static SubtractScalarArray(v: Vec3Array, scalar: number): Vec3Array {
    return [v[0] - scalar, v[1] - scalar, v[2] - scalar];
  }

  static SubtractScalarArrayToRef(
    v: Vec3Array,
    scalar: number,
    ref: Vec3Array
  ): void {
    ref[0] = v[0] - scalar;
    ref[1] = v[1] - scalar;
    ref[2] = v[2] - scalar;
  }

  static SubtractScalarArrayInPlace(v: Vec3Array, scalar: number): void {
    v[0] -= scalar;
    v[1] -= scalar;
    v[2] -= scalar;
  }

  static Multiply(v1: Vector3Like, v2: Vector3Like): Vector3Like {
    return { x: v1.x * v2.x, y: v1.y * v2.y, z: v1.z * v2.z };
  }

  static MultiplyToRef(
    v1: Vector3Like,
    v2: Vector3Like,
    ref: Vector3Like
  ): void {
    ref.x = v1.x * v2.x;
    ref.y = v1.y * v2.y;
    ref.z = v1.z * v2.z;
  }

  static MultiplyInPlace(v1: Vector3Like, v2: Vector3Like): void {
    v1.x *= v2.x;
    v1.y *= v2.y;
    v1.z *= v2.z;
  }

  static MultiplyArray(v1: Vec3Array, v2: Vec3Array): Vec3Array {
    return [v1[0] * v2[0], v1[1] * v2[1], v1[2] * v2[2]];
  }

  static MultiplyArrayToRef(
    v1: Vec3Array,
    v2: Vec3Array,
    ref: Vec3Array
  ): void {
    ref[0] = v1[0] * v2[0];
    ref[1] = v1[1] * v2[1];
    ref[2] = v1[2] * v2[2];
  }

  static MultiplyArrayInPlace(v1: Vec3Array, v2: Vec3Array): void {
    v1[0] *= v2[0];
    v1[1] *= v2[1];
    v1[2] *= v2[2];
  }

  static MultiplyScalar(v: Vector3Like, scalar: number): Vector3Like {
    return { x: v.x * scalar, y: v.y * scalar, z: v.z * scalar };
  }

  static MultiplyScalarToRef(
    v: Vector3Like,
    scalar: number,
    ref: Vector3Like
  ): void {
    ref.x = v.x * scalar;
    ref.y = v.y * scalar;
    ref.z = v.z * scalar;
  }

  static MultiplyScalarInPlace(v: Vector3Like, scalar: number): void {
    v.x *= scalar;
    v.y *= scalar;
    v.z *= scalar;
  }

  static MultiplyScalarArray(v: Vec3Array, scalar: number): Vec3Array {
    return [v[0] * scalar, v[1] * scalar, v[2] * scalar];
  }

  static MultiplyScalarArrayToRef(
    v: Vec3Array,
    scalar: number,
    ref: Vec3Array
  ): void {
    ref[0] = v[0] * scalar;
    ref[1] = v[1] * scalar;
    ref[2] = v[2] * scalar;
  }

  static MultiplyScalarArrayInPlace(v: Vec3Array, scalar: number): void {
    v[0] *= scalar;
    v[1] *= scalar;
    v[2] *= scalar;
  }

  static Divide(v1: Vector3Like, v2: Vector3Like): Vector3Like {
    return { x: v1.x / v2.x, y: v1.y / v2.y, z: v1.z / v2.z };
  }

  static DivideToRef(v1: Vector3Like, v2: Vector3Like, ref: Vector3Like): void {
    ref.x = v1.x / v2.x;
    ref.y = v1.y / v2.y;
    ref.z = v1.z / v2.z;
  }

  static DivideInPlace(v1: Vector3Like, v2: Vector3Like): Vector3Like {
    v1.x /= v2.x;
    v1.y /= v2.y;
    v1.z /= v2.z;
    return v1;
  }

  static DivideArray(v1: Vec3Array, v2: Vec3Array): Vec3Array {
    return [v1[0] / v2[0], v1[1] / v2[1], v1[2] / v2[2]];
  }

  static DivideArrayToRef(v1: Vec3Array, v2: Vec3Array, ref: Vec3Array): void {
    ref[0] = v1[0] / v2[0];
    ref[1] = v1[1] / v2[1];
    ref[2] = v1[2] / v2[2];
  }

  static DivideArrayInPlace(v1: Vec3Array, v2: Vec3Array): void {
    v1[0] /= v2[0];
    v1[1] /= v2[1];
    v1[2] /= v2[2];
  }

  static DivideScalar(v: Vector3Like, scalar: number): Vector3Like {
    return { x: v.x / scalar, y: v.y / scalar, z: v.z / scalar };
  }

  static DivideScalarToRef(
    v: Vector3Like,
    scalar: number,
    ref: Vector3Like
  ): void {
    ref.x = v.x / scalar;
    ref.y = v.y / scalar;
    ref.z = v.z / scalar;
  }

  static DivideScalarInPlace(v: Vector3Like, scalar: number): void {
    v.x /= scalar;
    v.y /= scalar;
    v.z /= scalar;
  }

  static DivideScalarArray(v: Vec3Array, scalar: number): Vec3Array {
    return [v[0] / scalar, v[1] / scalar, v[2] / scalar];
  }

  static DivideScalarArrayToRef(
    v: Vec3Array,
    scalar: number,
    ref: Vec3Array
  ): void {
    ref[0] = v[0] / scalar;
    ref[1] = v[1] / scalar;
    ref[2] = v[2] / scalar;
  }

  static DivideScalarArrayInPlace(v: Vec3Array, scalar: number): void {
    v[0] /= scalar;
    v[1] /= scalar;
    v[2] /= scalar;
  }

  static Dot(v1: Vector3Like, v2: Vector3Like): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  }

  static DotArray(v1: Vec3Array, v2: Vec3Array): number {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
  }

  static Cross(v1: Vector3Like, v2: Vector3Like): Vector3Like {
    return {
      x: v1.y * v2.z - v1.z * v2.y,
      y: v1.z * v2.x - v1.x * v2.z,
      z: v1.x * v2.y - v1.y * v2.x,
    };
  }

  static CrossToRef(v1: Vector3Like, v2: Vector3Like, ref: Vector3Like): void {
    ref.x = v1.y * v2.z - v1.z * v2.y;
    ref.y = v1.z * v2.x - v1.x * v2.z;
    ref.z = v1.x * v2.y - v1.y * v2.x;
  }

  static CrossInPlace(v1: Vector3Like, v2: Vector3Like): void {
    const x = v1.y * v2.z - v1.z * v2.y;
    const y = v1.z * v2.x - v1.x * v2.z;
    const z = v1.x * v2.y - v1.y * v2.x;
    v1.x = x;
    v1.y = y;
    v1.z = z;
  }

  static CrossArray(v1: Vec3Array, v2: Vec3Array): Vec3Array {
    return [
      v1[1] * v2[2] - v1[2] * v2[1],
      v1[2] * v2[0] - v1[0] * v2[2],
      v1[0] * v2[1] - v1[1] * v2[0],
    ];
  }

  static CrossArrayToRef(v1: Vec3Array, v2: Vec3Array, ref: Vec3Array): void {
    ref[0] = v1[1] * v2[2] - v1[2] * v2[1];
    ref[1] = v1[2] * v2[0] - v1[0] * v2[2];
    ref[2] = v1[0] * v2[1] - v1[1] * v2[0];
  }

  static CrossArrayInPlace(v1: Vec3Array, v2: Vec3Array): void {
    const x = v1[1] * v2[2] - v1[2] * v2[1];
    const y = v1[2] * v2[0] - v1[0] * v2[2];
    const z = v1[0] * v2[1] - v1[1] * v2[0];
    v1[0] = x;
    v1[1] = y;
    v1[2] = z;
  }

  static Length(v: Vector3Like): number {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  }

  static LengthArray(v: Vec3Array): number {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  }

  static Normalize(v: Vector3Like): Vector3Like {
    const len = Vector3Like.Length(v);
    if (len === 0) return { x: 0, y: 0, z: 0 };
    return { x: v.x / len, y: v.y / len, z: v.z / len };
  }

  static NormalizeToRef(v: Vector3Like, ref: Vector3Like): void {
    const len = Vector3Like.Length(v);
    if (len === 0) {
      ref.x = 0;
      ref.y = 0;
      ref.z = 0;
    } else {
      ref.x = v.x / len;
      ref.y = v.y / len;
      ref.z = v.z / len;
    }
  }

  static NormalizeInPlace(v: Vector3Like): void {
    const len = Vector3Like.Length(v);
    if (len === 0) {
      v.x = 0;
      v.y = 0;
      v.z = 0;
    } else {
      v.x /= len;
      v.y /= len;
      v.z /= len;
    }
  }

  static NormalizeArray(v: Vec3Array): Vec3Array {
    const len = Vector3Like.LengthArray(v);
    if (len === 0) return [0, 0, 0];
    return [v[0] / len, v[1] / len, v[2] / len];
  }

  static NormalizeArrayToRef(v: Vec3Array, ref: Vec3Array): void {
    const len = Vector3Like.LengthArray(v);
    if (len === 0) {
      ref[0] = 0;
      ref[1] = 0;
      ref[2] = 0;
    } else {
      ref[0] = v[0] / len;
      ref[1] = v[1] / len;
      ref[2] = v[2] / len;
    }
  }

  static NormalizeArrayInPlace(v: Vec3Array): void {
    const len = Vector3Like.LengthArray(v);
    if (len === 0) {
      v[0] = 0;
      v[1] = 0;
      v[2] = 0;
    } else {
      v[0] /= len;
      v[1] /= len;
      v[2] /= len;
    }
  }

  static Distance(v1: Vector3Like, v2: Vector3Like): number {
    return Vector3Like.Length(Vector3Like.Subtract(v1, v2));
  }

  static DistanceArray(v1: Vec3Array, v2: Vec3Array): number {
    return Vector3Like.LengthArray(Vector3Like.SubtractArray(v1, v2));
  }

  static Lerp(v1: Vector3Like, v2: Vector3Like, t: number): Vector3Like {
    return {
      x: v1.x + t * (v2.x - v1.x),
      y: v1.y + t * (v2.y - v1.y),
      z: v1.z + t * (v2.z - v1.z),
    };
  }

  static LerpToRef(
    v1: Vector3Like,
    v2: Vector3Like,
    t: number,
    ref: Vector3Like
  ): void {
    ref.x = v1.x + t * (v2.x - v1.x);
    ref.y = v1.y + t * (v2.y - v1.y);
    ref.z = v1.z + t * (v2.z - v1.z);
  }

  static LerpInPlace(v1: Vector3Like, v2: Vector3Like, t: number): void {
    v1.x += t * (v2.x - v1.x);
    v1.y += t * (v2.y - v1.y);
    v1.z += t * (v2.z - v1.z);
  }

  static LerpArray(v1: Vec3Array, v2: Vec3Array, t: number): Vec3Array {
    return [
      v1[0] + t * (v2[0] - v1[0]),
      v1[1] + t * (v2[1] - v1[1]),
      v1[2] + t * (v2[2] - v1[2]),
    ];
  }

  static LerpArrayToRef(
    v1: Vec3Array,
    v2: Vec3Array,
    t: number,
    ref: Vec3Array
  ): void {
    ref[0] = v1[0] + t * (v2[0] - v1[0]);
    ref[1] = v1[1] + t * (v2[1] - v1[1]);
    ref[2] = v1[2] + t * (v2[2] - v1[2]);
  }

  static LerpArrayInPlace(v1: Vec3Array, v2: Vec3Array, t: number): void {
    v1[0] += t * (v2[0] - v1[0]);
    v1[1] += t * (v2[1] - v1[1]);
    v1[2] += t * (v2[2] - v1[2]);
  }

  static Negate(v: Vector3Like): Vector3Like {
    return { x: -v.x, y: -v.y, z: -v.z };
  }

  static NegateToRef(v: Vector3Like, ref: Vector3Like): void {
    ref.x = -v.x;
    ref.y = -v.y;
    ref.z = -v.z;
  }

  static NegateInPlace(v: Vector3Like): void {
    v.x = -v.x;
    v.y = -v.y;
    v.z = -v.z;
  }

  static NegateArray(v: Vec3Array): Vec3Array {
    return [-v[0], -v[1], -v[2]];
  }

  static NegateArrayToRef(v: Vec3Array, ref: Vec3Array): void {
    ref[0] = -v[0];
    ref[1] = -v[1];
    ref[2] = -v[2];
  }

  static NegateArrayInPlace(v: Vec3Array): void {
    v[0] = -v[0];
    v[1] = -v[1];
    v[2] = -v[2];
  }

  static Equals(v1: Vector3Like, v2: Vector3Like): boolean {
    return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
  }

  static EqualsArray(v1: Vec3Array, v2: Vec3Array): boolean {
    return v1[0] === v2[0] && v1[1] === v2[1] && v1[2] === v2[2];
  }

  static Clone(v: Vector3Like): Vector3Like {
    return { x: v.x, y: v.y, z: v.z };
  }

  static CloneArray(v: Vec3Array): Vec3Array {
    return [v[0], v[1], v[2]];
  }

  static Copy(target: Vector3Like, source: Vector3Like): Vector3Like {
    target.x = source.x;
    target.y = source.y;
    target.z = source.z;
    return target;
  }

  static CopyArray(target: Vec3Array, source: Vec3Array): Vec3Array {
    target[0] = source[0];
    target[1] = source[1];
    target[2] = source[2];
    return target;
  }

  static CopyFromArray(target: Vector3Like, source: Vec3Array): Vector3Like {
    target.x = source[0];
    target.y = source[1];
    target.z = source[2];
    return target;
  }

  static CopyIntoArray(target: Vec3Array, source: Vector3Like): Vec3Array {
    target[0] = source.x;
    target[1] = source.y;
    target[2] = source.z;
    return target;
  }

  static ToArray(v: Vector3Like): Vec3Array {
    return [v.x, v.y, v.z];
  }

  static FromArray(v: Vec3Array): Vector3Like {
    return new Vector3Like(v[0], v[1], v[2]);
  }

  private constructor(public x: number, public y: number, public z: number) {}
}
