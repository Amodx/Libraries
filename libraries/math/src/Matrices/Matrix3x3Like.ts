import { Vec3Array } from "Vector.types";
import { Vector3Like, Vector4Like } from "Vectors";

export type Mat3Array = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

export class Matrix3x3Like {
  static Create(): Mat3Array {
    return [1, 0, 0, 0, 1, 0, 0, 0, 1]; // Identity matrix
  }

  static Add(m1: Mat3Array, m2: Mat3Array): Mat3Array {
    return m1.map((v, i) => v + m2[i]) as Mat3Array;
  }

  static AddToRef(m1: Mat3Array, m2: Mat3Array, ref: Mat3Array): void {
    m1.forEach((v, i) => (ref[i] = v + m2[i]));
  }

  static Multiply(m1: Mat3Array, m2: Mat3Array): Mat3Array {
    const result: Mat3Array = new Array(9) as Mat3Array;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        result[i * 3 + j] = 0;
        for (let k = 0; k < 3; k++) {
          result[i * 3 + j] += m1[i * 3 + k] * m2[k * 3 + j];
        }
      }
    }
    return result;
  }

  static MultiplyToRef(m1: Mat3Array, m2: Mat3Array, ref: Mat3Array): void {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        ref[i * 3 + j] = 0;
        for (let k = 0; k < 3; k++) {
          ref[i * 3 + j] += m1[i * 3 + k] * m2[k * 3 + j];
        }
      }
    }
  }

  static Transpose(m: Mat3Array): Mat3Array {
    return [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]];
  }

  static TransposeToRef(m: Mat3Array, ref: Mat3Array): void {
    [ref[0], ref[1], ref[2], ref[3], ref[4], ref[5], ref[6], ref[7], ref[8]] = [
      m[0],
      m[3],
      m[6],
      m[1],
      m[4],
      m[7],
      m[2],
      m[5],
      m[8],
    ];
  }

  static Inverse(m: Mat3Array): Mat3Array | null {
    const det =
      m[0] * (m[4] * m[8] - m[7] * m[5]) -
      m[1] * (m[3] * m[8] - m[6] * m[5]) +
      m[2] * (m[3] * m[7] - m[6] * m[4]);
    if (det === 0) return null;
    const invDet = 1 / det;
    return [
      (m[4] * m[8] - m[7] * m[5]) * invDet,
      (m[2] * m[7] - m[1] * m[8]) * invDet,
      (m[1] * m[5] - m[2] * m[4]) * invDet,
      (m[5] * m[6] - m[3] * m[8]) * invDet,
      (m[0] * m[8] - m[2] * m[6]) * invDet,
      (m[2] * m[3] - m[0] * m[5]) * invDet,
      (m[3] * m[7] - m[4] * m[6]) * invDet,
      (m[1] * m[6] - m[0] * m[7]) * invDet,
      (m[0] * m[4] - m[1] * m[3]) * invDet,
    ];
  }

  static InverseToRef(m: Mat3Array, ref: Mat3Array): boolean {
    const inv = this.Inverse(m);
    if (inv === null) return false;
    inv.forEach((v, i) => (ref[i] = v));
    return true;
  }

  static RotationX(angle: number): Mat3Array {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [1, 0, 0, 0, c, -s, 0, s, c];
  }

  static RotationY(angle: number): Mat3Array {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [c, 0, s, 0, 1, 0, -s, 0, c];
  }

  static RotationZ(angle: number): Mat3Array {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [c, -s, 0, s, c, 0, 0, 0, 1];
  }


  static Scaling(sx: number, sy: number, sz: number): Mat3Array {
    return [sx, 0, 0, 0, sy, 0, 0, 0, sz];
  }
  
  static Transform(tx: number, ty: number, tz: number): Mat3Array {
    return [1, 0, 0, 0, 1, 0, tx, ty, tz];
  }

  static ApplyMatrix(matrix: Mat3Array, vec: Vector3Like): Vector3Like {
    return {
      x: matrix[0] * vec.x + matrix[1] * vec.y + matrix[2] * vec.z,
      y: matrix[3] * vec.x + matrix[4] * vec.y + matrix[5] * vec.z,
      z: matrix[6] * vec.x + matrix[7] * vec.y + matrix[8] * vec.z,
    };
  }
  
  static ApplyMatrixArray(matrix: Mat3Array, vec: Vec3Array): Vec3Array {
    return [
      matrix[0] * vec[0] + matrix[1] * vec[1] + matrix[2] * vec[2],
      matrix[3] * vec[0] + matrix[4] * vec[1] + matrix[5] * vec[2],
      matrix[6] * vec[0] + matrix[7] * vec[1] + matrix[8] * vec[2],
    ];
  }
}
