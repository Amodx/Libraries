import { Vec2Array } from "Vector.types";
import { Vector2Like } from "Vectors";

export type Mat2Array = [number, number, number, number];

export class Matrix2x2Like {

  static Create(): Mat2Array {
    return [1, 0, 0, 1]; 
  }


  static Add(m1: Mat2Array, m2: Mat2Array): Mat2Array {
    return m1.map((v, i) => v + m2[i]) as Mat2Array;
  }


  static AddToRef(m1: Mat2Array, m2: Mat2Array, ref: Mat2Array): void {
    m1.forEach((v, i) => (ref[i] = v + m2[i]));
  }

  static Multiply(m1: Mat2Array, m2: Mat2Array): Mat2Array {
    return [
      m1[0] * m2[0] + m1[1] * m2[2], 
      m1[0] * m2[1] + m1[1] * m2[3], 
      m1[2] * m2[0] + m1[3] * m2[2], 
      m1[2] * m2[1] + m1[3] * m2[3],
    ];
  }


  static MultiplyToRef(m1: Mat2Array, m2: Mat2Array, ref: Mat2Array): void {
    ref[0] = m1[0] * m2[0] + m1[1] * m2[2];
    ref[1] = m1[0] * m2[1] + m1[1] * m2[3];
    ref[2] = m1[2] * m2[0] + m1[3] * m2[2];
    ref[3] = m1[2] * m2[1] + m1[3] * m2[3];
  }

  static Rotation(angle: number): Mat2Array {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [c, -s, s, c];
  }

  static ApplyMatrix(matrix: Mat2Array, vec: Vector2Like): Vector2Like {
    return {
      x: matrix[0] * vec.x + matrix[1] * vec.y,
      y: matrix[2] * vec.x + matrix[3] * vec.y,
    };
  }

  static ApplyMatrixArray(matrix: Mat2Array, vec: Vec2Array): Vec2Array {
    return [
      matrix[0] * vec[0] + matrix[1] * vec[1],
      matrix[2] * vec[0] + matrix[3] * vec[1],
    ];
  }
  static Transpose(m: Mat2Array): Mat2Array {
    return [m[0], m[2], m[1], m[3]];
  }

  static TransposeToRef(m: Mat2Array, ref: Mat2Array): void {
    ref[0] = m[0];
    ref[1] = m[2];
    ref[2] = m[1];
    ref[3] = m[3];
  }

  static Inverse(m: Mat2Array): Mat2Array | null {
    const det = m[0] * m[3] - m[1] * m[2];
    if (det === 0) return null;
    const invDet = 1 / det;
    return [
      m[3] * invDet,
      -m[1] * invDet,
      -m[2] * invDet,
      m[0] * invDet,
    ];
  }

  static InverseToRef(m: Mat2Array, ref: Mat2Array): boolean {
    const inv = this.Inverse(m);
    if (inv === null) return false;
    inv.forEach((v, i) => (ref[i] = v));
    return true;
  }
}