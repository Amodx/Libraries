import { Scene, Vector3, Curve, Quaternion } from "three";
import { LineMesh } from "Shared/Line/LineMesh";

class AngleArc extends Curve<Vector3> {
  constructor(
    private radius: number,
    private angle: number,
    private normal: Vector3
  ) {
    super();
  }

  getPoint(t: number): Vector3 {
    const q = new Quaternion().setFromAxisAngle(this.normal, this.angle * t);
    return new Vector3(this.radius, 0, 0).applyQuaternion(q);
  }
}

export class AngleMesh {
  private line?: LineMesh;

  constructor(public scene: Scene) {}

  setAngle(angle: number, colorValue = 0xffffff) {
    this.clear();

    const radius = 0.5;

    const normal = new Vector3(0, 0, 1); // You can make this customizable if needed

    const arc = new AngleArc(radius, angle, normal);
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
