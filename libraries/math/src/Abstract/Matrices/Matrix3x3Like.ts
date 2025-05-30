import { Mat3Array } from "./Matrix.types";
/** Matrix3x3Like
 
 * For 3x3  matrices stored in column major order.  */
export class Matrix3x3Like {
  /** Creates a 3x3 empty matrix stored*/
  static Zero(): Mat3Array {
    return [0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
  /** Creates a 3x3 identity matrix  */
  static Identity(): Mat3Array {
    return [1, 0, 0, 0, 1, 0, 0, 0, 1];
  }
  /** Creates a 3x3 rotation transform matrix about the x axis. */
  static RotationX(angle: number): Mat3Array {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [1, 0, 0, 0, c, s, 0, -s, c];
  }
  /** Creates a 3x3 rotation transform matrix about the y axis. */
  static RotationY(angle: number): Mat3Array {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [c, 0, -s, 0, 1, 0, s, 0, c];
  }
  /** Creates a 3x3 rotation transform matrix about the z axis. */
  static RotationZ(angle: number): Mat3Array {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [c, s, 0, -s, c, 0, 0, 0, 1];
  }
  /** Creates a 3x3 scaling transform matrix. */
  static Scaling(sx: number, sy: number, sz: number): Mat3Array {
    return [sx, 0, 0, 0, sy, 0, 0, 0, sz];
  }

  static Multiply(m1: Mat3Array, m2: Mat3Array): Mat3Array {
    return this.MultiplyToRef(m1, m2, Matrix3x3Like.Zero());
  }

  static MultiplyToRef(
    m1: Mat3Array,
    m2: Mat3Array,
    ref: Mat3Array
  ): Mat3Array {
    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 3; row++) {
        ref[col * 3 + row] =
          m1[0 * 3 + row] * m2[col * 3 + 0] +
          m1[1 * 3 + row] * m2[col * 3 + 1] +
          m1[2 * 3 + row] * m2[col * 3 + 2];
      }
    }
    return ref;
  }

  static Transpose(m: Mat3Array): Mat3Array {
    return this.TransposeToRef(m, Matrix3x3Like.Identity());
  }

  static TransposeToRef(m: Mat3Array, ref: Mat3Array): Mat3Array {
    ref[0] = m[0];
    ref[1] = m[3];
    ref[2] = m[6];
    ref[3] = m[1];
    ref[4] = m[4];
    ref[5] = m[7];
    ref[6] = m[2];
    ref[7] = m[5];
    ref[8] = m[8];
    return ref;
  }

  static Determinant(matrix: Mat3Array) {
    const [a, d, g, b, e, h, c, f, i] = matrix;

    const A = e * i - f * h;
    const B = f * g - d * i;
    const C = d * h - e * g;

    const det = a * A + b * B + c * C;
    return det;
  }

  static Inverse(m: Mat3Array): Mat3Array | null {
    return this.InverseToRef(m, Matrix3x3Like.Zero());
  }

  static InverseToRef(matrix: Mat3Array, ref: Mat3Array): Mat3Array | null {
    const [a, d, g, b, e, h, c, f, i] = matrix;

    const A = e * i - f * h;
    const B = f * g - d * i;
    const C = d * h - e * g;
    const D = c * h - b * i;
    const E = a * i - c * g;
    const F = b * g - a * h;
    const G = b * f - c * e;
    const H = c * d - a * f;
    const I = a * e - b * d;

    const det = a * A + b * B + c * C;
    if (det === 0) return null;

    const invDet = 1 / det;

    ref[0] = A * invDet;
    ref[1] = D * invDet;
    ref[2] = G * invDet;
    ref[3] = B * invDet;
    ref[4] = E * invDet;
    ref[5] = H * invDet;
    ref[6] = C * invDet;
    ref[7] = F * invDet;
    ref[8] = I * invDet;

    return ref;
  }
}
