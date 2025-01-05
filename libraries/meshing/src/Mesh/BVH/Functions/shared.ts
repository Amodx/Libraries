import { Vec3Array } from "@amodx/math";

// Define a simple Vector3 class to replace THREE.Vector3
export class Vector3 {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {}

  set(x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  min(v: Vector3): this {
    this.x = Math.min(this.x, v.x);
    this.y = Math.min(this.y, v.y);
    this.z = Math.min(this.z, v.z);
    return this;
  }

  max(v: Vector3): this {
    this.x = Math.max(this.x, v.x);
    this.y = Math.max(this.y, v.y);
    this.z = Math.max(this.z, v.z);
    return this;
  }

  copy(v: Vector3): this {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  add(v: Vector3): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  multiplyScalar(s: number): this {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }
  divideScalar(s: number): this {
    if (s !== 0) {
      this.x /= s;
      this.y /= s;
      this.z /= s;
    } else {
      this.set(0, 0, 0);
    }
    return this;
  }
}

// Define the BVH_FlatNode class
export class BVH_FlatNode {
  constructor(
    public idSelf = 0,
    public idPrimitive = -1,
    public idRightChild = 0,
    public idParent = 0,
    public minCorner = new Vector3(),
    public maxCorner = new Vector3()
  ) {}
}
