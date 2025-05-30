import { Scene, Vector3, Curve, Quaternion } from "three";
import { LineMesh } from "Shared/Line/LineMesh";
import { Vector3Like } from "@amodx/math";

class ConnectingArc extends Curve<Vector3> {
  constructor(
    private from: Vector3,
    private to: Vector3
  ) {
    super();
  }

  getPoint(t: number): Vector3 {
    const vFrom = this.from.clone().normalize();
    const vTo = this.to.clone().normalize();

    const angle = vFrom.angleTo(vTo);
    const normal = new Vector3().crossVectors(vFrom, vTo).normalize();

    if (normal.lengthSq() === 0) {
      // Vectors are colinear; return linear interpolation
      return vFrom.clone().lerp(vTo, t).normalize();
    }

    const quaternion = new Quaternion().setFromAxisAngle(normal, angle * t);
    return vFrom
      .clone()
      .applyQuaternion(quaternion)
      .multiplyScalar(this.from.length());
  }
}

export class ArcMesh {
  private line?: LineMesh;

  constructor(public scene: Scene) {}

  setArc(point1: Vector3Like, point2: Vector3Like, colorValue = 0xffffff) {
    this.clear();

    const from = new Vector3(point1.x, point1.y, point1.z);
    const to = new Vector3(point2.x, point2.y, point2.z);

    if (from.lengthSq() === 0 || to.lengthSq() === 0) return;

    const arc = new ConnectingArc(from, to);
    const arcPoints = arc.getPoints(32);

    this.line = new LineMesh(this.scene, colorValue);
    this.line.setPoints(...arcPoints);
  }

  
  clear() {
    if (this.line) this.line.clear();
  }

  dispose() {
    if (this.line) {
      this.line.dispose();
      this.line = undefined;
    }
  }
}
