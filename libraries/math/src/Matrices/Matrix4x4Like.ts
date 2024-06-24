import { Vec4Array } from "Vector.types";

export type Mat4Array = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
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

export class Matrix4x4Like {
  static Create(): Mat4Array {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; // Identity matrix
  }

  static Add(m1: Mat4Array, m2: Mat4Array): Mat4Array {
    return m1.map((v, i) => v + m2[i]) as Mat4Array;
  }

  static AddToRef(m1: Mat4Array, m2: Mat4Array, ref: Mat4Array): void {
    m1.forEach((v, i) => (ref[i] = v + m2[i]));
  }

  static Multiply(m1: Mat4Array, m2: Mat4Array): Mat4Array {
    const result: Mat4Array = new Array(16) as Mat4Array;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[i * 4 + j] = 0;
        for (let k = 0; k < 4; k++) {
          result[i * 4 + j] += m1[i * 4 + k] * m2[k * 4 + j];
        }
      }
    }
    return result;
  }

  static MultiplyToRef(m1: Mat4Array, m2: Mat4Array, ref: Mat4Array): void {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        ref[i * 4 + j] = 0;
        for (let k = 0; k < 4; k++) {
          ref[i * 4 + j] += m1[i * 4 + k] * m2[k * 4 + j];
        }
      }
    }
  }

  static Transpose(m: Mat4Array): Mat4Array {
    return [
      m[0],
      m[4],
      m[8],
      m[12],
      m[1],
      m[5],
      m[9],
      m[13],
      m[2],
      m[6],
      m[10],
      m[14],
      m[3],
      m[7],
      m[11],
      m[15],
    ];
  }

  static TransposeToRef(m: Mat4Array, ref: Mat4Array): void {
    [
      ref[0],
      ref[1],
      ref[2],
      ref[3],
      ref[4],
      ref[5],
      ref[6],
      ref[7],
      ref[8],
      ref[9],
      ref[10],
      ref[11],
      ref[12],
      ref[13],
      ref[14],
      ref[15],
    ] = [
      m[0],
      m[4],
      m[8],
      m[12],
      m[1],
      m[5],
      m[9],
      m[13],
      m[2],
      m[6],
      m[10],
      m[14],
      m[3],
      m[7],
      m[11],
      m[15],
    ];
  }

  static RotationX(angle: number): Mat4Array {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1];
  }

  static RotationY(angle: number): Mat4Array {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1];
  }

  static RotationZ(angle: number): Mat4Array {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  static ApplyToVec4Array(matrix: Mat4Array, vec: Vec4Array): Vec4Array {
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
    const rotatedVec = Matrix4x4Like.ApplyToVec4Array(matrix, translatedVec);
    return [
      rotatedVec[0] + pivot[0],
      rotatedVec[1] + pivot[1],
      rotatedVec[2] + pivot[2],
      rotatedVec[3] + pivot[3],
    ];
  }

  static Scaling(sx: number, sy: number, sz: number): Mat4Array {
    return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
  }

  static Transform(tx: number, ty: number, tz: number): Mat4Array {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
  }
}
