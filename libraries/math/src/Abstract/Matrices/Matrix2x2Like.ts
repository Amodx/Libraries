import { Mat2Array } from "./Matrix.types";
/** Matrix2x2Like
 
 * For 2x2 matrices stored in column major order.  */
export class Matrix2x2Like {
  /** Creates a 2x2 zero matrix  */
  static Zero(): Mat2Array {
    return [0, 0, 0, 0];
  }
  /** Creates a 2x2 identity matrix  */
  static Identity(): Mat2Array {
    return [1, 0, 0, 1];
  }
  /** Creates a 2x2 rotation matrix  */
  static Rotation(angle: number): Mat2Array {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [c, s, -s, c];
  }

  static Multiply(m1: Mat2Array, m2: Mat2Array): Mat2Array {
    return this.MultiplyToRef(m1, m2, Matrix2x2Like.Zero());
  }

  static MultiplyToRef(
    m1: Mat2Array,
    m2: Mat2Array,
    ref: Mat2Array
  ): Mat2Array {
    ref[0] = m1[0] * m2[0] + m1[2] * m2[1];
    ref[1] = m1[1] * m2[0] + m1[3] * m2[1];
    ref[2] = m1[0] * m2[2] + m1[2] * m2[3];
    ref[3] = m1[1] * m2[2] + m1[3] * m2[3];
    return ref;
  }

  static Transpose(m: Mat2Array): Mat2Array {
    return this.TransposeToRef(m, Matrix2x2Like.Zero());
  }

  static TransposeToRef(m: Mat2Array, ref: Mat2Array): Mat2Array {
    ref[0] = m[0];
    ref[1] = m[2];
    ref[2] = m[1];
    ref[3] = m[3];
    return ref;
  }

  static Determinant(matrix: Mat2Array) {
    return matrix[0] * matrix[3] - matrix[2] * matrix[1];
  }

  static Inverse(m: Mat2Array): Mat2Array | null {
    return this.InverseToRef(m, Matrix2x2Like.Zero());
  }

  static InverseToRef(matrix: Mat2Array, ref: Mat2Array) {
    const det = this.Determinant(matrix);
    if (det === 0) return null;
    const invDet = 1 / det;
    ref[0] = matrix[3] * invDet;
    ref[1] = -matrix[1] * invDet;
    ref[2] = -matrix[2] * invDet;
    ref[3] = matrix[0] * invDet;
    return ref;
  }
}
