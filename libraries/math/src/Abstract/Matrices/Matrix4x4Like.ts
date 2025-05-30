import { Mat4Array } from "./Matrix.types";

export class Matrix4x4Like {
  /** Creates a 4x4 zero matrix  */
  static Zero(): Mat4Array {
    return new Array(16).fill(0) as Mat4Array;
  }

  /** Creates a 4x4 identity matrix  */
  static Identity(): Mat4Array {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  /** Creates a 4x4 scaling matrix  */
  static Scaling(sx: number, sy: number, sz: number): Mat4Array {
    return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
  }

  /** Creates a 4x4 translation matrix  */
  static Translate(tx: number, ty: number, tz: number): Mat4Array {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
  }

  /** Creates a 4x4 rotation transform matrix about the x axis. */
  static RotationX(angle: number): Mat4Array {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
  }

  /** Creates a 4x4 rotation transform matrix about the y axis. */
  static RotationY(angle: number): Mat4Array {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
  }

  /** Creates a 4x4 rotation transform matrix about the z axis. */
  static RotationZ(angle: number): Mat4Array {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  /** Multiplies two 4x4 matrices (column-major order) */
  static Multiply(m1: Mat4Array, m2: Mat4Array): Mat4Array {
    return this.MultiplyToRef(m1, m2, Matrix4x4Like.Zero());
  }

  static MultiplyToRef(
    m1: Mat4Array,
    m2: Mat4Array,
    ref: Mat4Array
  ): Mat4Array {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        let sum = 0;
        for (let i = 0; i < 4; i++) {
          sum += m1[i * 4 + row] * m2[col * 4 + i];
        }
        ref[col * 4 + row] = sum;
      }
    }
    return ref;
  }

  /** Transposes a 4x4 matrix */
  static Transpose(m: Mat4Array): Mat4Array {
    return this.TransposeToRef(m, Matrix4x4Like.Zero());
  }

  static TransposeToRef(m: Mat4Array, ref: Mat4Array): Mat4Array {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        ref[row * 4 + col] = m[col * 4 + row];
      }
    }
    return ref;
  }
}
