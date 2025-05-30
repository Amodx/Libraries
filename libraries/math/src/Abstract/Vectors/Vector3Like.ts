import { Matrix3x3Like } from "../Matrices/Matrix3x3Like";
import { Mat3Array } from "../Matrices/Matrix.types";
import { Vec3Array } from "./Vector.types";
const encodeZigZag = (n: number) => {
  return n >= 0 ? 2 * n : -2 * n - 1;
};

const cantorPair = (a: number, b: number) => {
  return ((a + b) * (a + b + 1)) / 2 + b;
};

const temp: Vec3Array = [0, 0, 0];

export class Vector3Like {
  static Create(x = 0, y = 0, z = 0): Vector3Like {
    return { x, y, z };
  }

  static Deconstruct(input: Vec3Array | Vector3Like): Readonly<Vec3Array> {
    const isArray = Array.isArray(input);
    temp[0] = isArray ? input[0] : input.x;
    temp[1] = isArray ? input[1] : input.y;
    temp[2] = isArray ? input[2] : input.z;
    return temp;
  }

  /**
   * Creates a unique number hash from 3D coordinates (x, y, z) using ZigZag encoding
   * and Cantor pairing. The hash is guaranteed to be unique for each (x, y, z) combination,
   * including negative values.
   *
   * @param x - The x-coordinate (can be a negative or positive integer)
   * @param y - The y-coordinate (can be a negative or positive integer)
   * @param z - The z-coordinate (can be a negative or positive integer)
   * @returns A unique non-negative integer hash representing the (x, y, z) vector
   */
  static HashXYZ(x: number, y: number, z: number): number {
    // ZigZag encoding ensures that both negative and positive numbers
    // are mapped to unique non-negative integers.
    const a = encodeZigZag(x);
    const b = encodeZigZag(y);
    const c = encodeZigZag(z);

    // Cantor pairing function combines the two encoded numbers (a, b)
    // into a single unique number.
    const paired = cantorPair(a, b);

    // Cantor pairing is applied again to combine the previous result
    // with the third encoded number (c) to get the final unique hash.
    const finalHash = cantorPair(paired, c);

    // Return the final unique hash value.
    return finalHash;
  }

  static Hash(vector: Vector3Like) {
    return this.HashXYZ(vector.x, vector.y, vector.z);
  }

  static ApplyMatrix(matrix: Mat3Array, vec: Vector3Like): Vector3Like {
    return this.ApplyMatrixToRef(matrix, vec, Vector3Like.Create());
  }

  static ApplyMatrixInPlace(matrix: Mat3Array, vec: Vector3Like): Vector3Like {
    return this.ApplyMatrixToRef(matrix, vec, vec);
  }

  static ApplyMatrixToRef(
    matrix: Mat3Array,
    vec: Vector3Like,
    ref: Vector3Like
  ): Vector3Like {
    const { x, y, z } = vec;
    ref.x = matrix[0] * x + matrix[3] * y + matrix[6] * z;
    ref.y = matrix[1] * x + matrix[4] * y + matrix[7] * z;
    ref.z = matrix[2] * x + matrix[5] * y + matrix[8] * z;
    return ref;
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

  static FloorInPlace(v: Vector3Like): Vector3Like {
    v.x = Math.floor(v.x);
    v.y = Math.floor(v.y);
    v.z = Math.floor(v.z);
    return v;
  }

  static Add(v1: Vector3Like, v2: Vector3Like): Vector3Like {
    return this.AddToRef(v1, v2, Vector3Like.Create());
  }

  static AddInPlace(v1: Vector3Like, v2: Vector3Like) {
    return this.AddToRef(v1, v2, v1);
  }

  static AddToRef(
    v1: Vector3Like,
    v2: Vector3Like,
    ref: Vector3Like
  ): Vector3Like {
    const { x: x1, y: y1, z: z1 } = v1;
    const { x: x2, y: y2, z: z2 } = v2;
    ref.x = x1 + x2;
    ref.y = y1 + y2;
    ref.z = z1 + z2;
    return ref;
  }

  static AddScalar(v: Vector3Like, scalar: number): Vector3Like {
    return this.AddScalarToRef(v, scalar, Vector3Like.Create());
  }

  static AddScalarInPlace(v: Vector3Like, scalar: number): Vector3Like {
    return this.AddScalarToRef(v, scalar, v);
  }

  static AddScalarToRef(
    v: Vector3Like,
    scalar: number,
    ref: Vector3Like
  ): Vector3Like {
    const { x, y, z } = v;
    ref.x = x + scalar;
    ref.y = y + scalar;
    ref.z = z + scalar;
    return ref;
  }

  static Subtract(v1: Vector3Like, v2: Vector3Like): Vector3Like {
    return this.SubtractToRef(v1, v2, this.Create());
  }

  static SubtractInPlace(v1: Vector3Like, v2: Vector3Like): Vector3Like {
    return this.SubtractToRef(v1, v2, v1);
  }

  static SubtractToRef(
    v1: Vector3Like,
    v2: Vector3Like,
    ref: Vector3Like
  ): Vector3Like {
    const { x: x1, y: y1, z: z1 } = v1;
    const { x: x2, y: y2, z: z2 } = v2;
    ref.x = x1 - x2;
    ref.y = y1 - y2;
    ref.z = z1 - z2;
    return ref;
  }

  static SubtractScalar(v: Vector3Like, scalar: number): Vector3Like {
    return this.SubtractScalarToRef(v, scalar, Vector3Like.Create());
  }

  static SubtractScalarInPlace(v: Vector3Like, scalar: number): Vector3Like {
    return this.SubtractScalarToRef(v, scalar, v);
  }

  static SubtractScalarToRef(
    v: Vector3Like,
    scalar: number,
    ref: Vector3Like
  ): Vector3Like {
    const { x, y, z } = v;
    ref.x = x - scalar;
    ref.y = y - scalar;
    ref.z = z - scalar;
    return ref;
  }

  static Multiply(v1: Vector3Like, v2: Vector3Like): Vector3Like {
    return this.MultiplyToRef(v1, v2, Vector3Like.Create());
  }

  static MultiplyInPlace(v1: Vector3Like, v2: Vector3Like): Vector3Like {
    return this.MultiplyToRef(v1, v2, v1);
  }

  static MultiplyToRef(
    v1: Vector3Like,
    v2: Vector3Like,
    ref: Vector3Like
  ): Vector3Like {
    const { x: x1, y: y1, z: z1 } = v1;
    const { x: x2, y: y2, z: z2 } = v2;
    ref.x = x1 * x2;
    ref.y = y1 * y2;
    ref.z = z1 * z2;
    return ref;
  }

  static MultiplyScalar(v: Vector3Like, scalar: number): Vector3Like {
    return this.MultiplyScalarToRef(v, scalar, Vector3Like.Create());
  }

  static MultiplyScalarInPlace(v: Vector3Like, scalar: number): Vector3Like {
    return this.MultiplyScalarToRef(v, scalar, v);
  }

  static MultiplyScalarToRef(
    v: Vector3Like,
    scalar: number,
    ref: Vector3Like
  ): Vector3Like {
    const { x, y, z } = v;
    ref.x = x * scalar;
    ref.y = y * scalar;
    ref.z = z * scalar;
    return ref;
  }

  static Divide(v1: Vector3Like, v2: Vector3Like): Vector3Like {
    return this.DivideToRef(v1, v2, Vector3Like.Create());
  }

  static DivideInPlace(v1: Vector3Like, v2: Vector3Like): Vector3Like {
    return this.DivideToRef(v1, v2, v1);
  }

  static DivideToRef(
    v1: Vector3Like,
    v2: Vector3Like,
    ref: Vector3Like
  ): Vector3Like {
    const { x: x1, y: y1, z: z1 } = v1;
    const { x: x2, y: y2, z: z2 } = v2;
    ref.x = x1 / x2;
    ref.y = y1 / y2;
    ref.z = z1 / z2;
    return ref;
  }

  static DivideScalar(v: Vector3Like, scalar: number): Vector3Like {
    return this.DivideScalarToRef(v, scalar, Vector3Like.Create());
  }

  static DivideScalarInPlace(v: Vector3Like, scalar: number): Vector3Like {
    return this.DivideScalarToRef(v, scalar, v);
  }

  static DivideScalarToRef(
    v: Vector3Like,
    scalar: number,
    ref: Vector3Like
  ): Vector3Like {
    const { x, y, z } = v;
    ref.x = x / scalar;
    ref.y = y / scalar;
    ref.z = z / scalar;
    return ref;
  }

  static Length(v: Vector3Like): number {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  }

  static Normalize(v: Vector3Like): Vector3Like {
    return this.NormalizeToRef(v, Vector3Like.Create());
  }
  static NormalizeInPlace(v: Vector3Like): Vector3Like {
    return this.NormalizeToRef(v, v);
  }

  static NormalizeToRef(v: Vector3Like, ref: Vector3Like): Vector3Like {
    const len = Vector3Like.Length(v);
    const { x, y, z } = v;
    if (len === 0) {
      ref.x = 0;
      ref.y = 0;
      ref.z = 0;
    } else {
      ref.x = x / len;
      ref.y = y / len;
      ref.z = z / len;
    }
    return ref;
  }

  static Distance(v1: Vector3Like, v2: Vector3Like): number {
    return Vector3Like.Length(Vector3Like.Subtract(v1, v2));
  }

  static Lerp(v1: Vector3Like, v2: Vector3Like, t: number): Vector3Like {
    return this.LerpToRef(v1, v2, t, Vector3Like.Create());
  }

  static LerpToRef(
    v1: Vector3Like,
    v2: Vector3Like,
    t: number,
    ref: Vector3Like
  ): Vector3Like {
    const { x: x1, y: y1, z: z1 } = v1;
    const { x: x2, y: y2, z: z2 } = v2;
    ref.x = x1 + t * (x2 - x1);
    ref.y = y1 + t * (y2 - y1);
    ref.z = z1 + t * (z2 - z1);
    return ref;
  }

  static Negate(v: Vector3Like): Vector3Like {
    return this.NegateToRef(v, Vector3Like.Create());
  }

  static NegateInPlace(v: Vector3Like): Vector3Like {
    return this.NegateToRef(v, v);
  }

  static NegateToRef(v: Vector3Like, ref: Vector3Like): Vector3Like {
    const { x, y, z } = v;
    ref.x = -x;
    ref.y = -y;
    ref.z = -z;
    return ref;
  }

  /** Get the dot product between two vectors. */
  static Dot(v1: Vector3Like, v2: Vector3Like): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  }

  /** Get the angle (in radians) between two vectors from the dot product */
  static DotAngle(v1: Vector3Like, v2: Vector3Like): number {
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
    const dot = this.Dot(v1, v2);

    // Prevent floating point errors from breaking acos
    const normalizedDot = Math.min(Math.max(dot / (mag1 * mag2), -1), 1);
    return Math.acos(normalizedDot);
  }

  static Cross(v1: Vector3Like, v2: Vector3Like): Vector3Like {
    return this.CrossToRef(v1, v2, Vector3Like.Create());
  }

  static CrossToRef(
    v1: Vector3Like,
    v2: Vector3Like,
    ref: Vector3Like
  ): Vector3Like {
    ref.x = v1.y * v2.z - v1.z * v2.y;
    ref.y = v1.z * v2.x - v1.x * v2.z;
    ref.z = v1.x * v2.y - v1.y * v2.x;
    return ref;
  }

  static Equals(v1: Vector3Like, v2: Vector3Like): boolean {
    return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
  }

  static EqualsArray(v1: Vector3Like, v2: Vec3Array): boolean {
    return v1.x === v2[0] && v1.y === v2[1] && v1.z === v2[2];
  }

  static Clone(v: Vector3Like): Vector3Like {
    return { x: v.x, y: v.y, z: v.z };
  }

  static Copy(target: Vector3Like, source: Vector3Like): Vector3Like {
    target.x = source.x;
    target.y = source.y;
    target.z = source.z;
    return target;
  }

  static CopyFromArray(target: Vector3Like, source: Vec3Array): Vector3Like {
    target.x = source[0];
    target.y = source[1];
    target.z = source[2];
    return target;
  }

  static ToArray(v: Vector3Like): Vec3Array {
    return [v.x, v.y, v.z];
  }

  static FromArray(v: Vec3Array): Vector3Like {
    return { x: v[0], y: v[1], z: v[2] };
  }

  private constructor(
    public x: number,
    public y: number,
    public z: number
  ) {}
}
