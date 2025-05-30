import { Vector3Like } from "@amodx/math";
import {
  Scene,
  Vector3,
  Mesh,
  CylinderGeometry,
  ConeGeometry,
  Group,
  Color,
} from "three";
import { VectorMaterial } from "./VectorMaterial";

export class VectorMesh {
  private group = new Group();
  material: VectorMaterial;

  constructor(public scene: Scene) {
    this.scene.add(this.group);
    this.material = new VectorMaterial();
  }

  setPoints(start: Vector3Like, end: Vector3Like, color?: number) {
    this.clear();

    const dir = new Vector3().subVectors(end, start);
    const length = dir.length();
    const normalized = dir.clone().normalize();

    this.material.setColor(
      color
        ? new Color(color)
        : new Color()
            .setRGB(
              (normalized.x + 1) / 2 + 0.2,
              (normalized.y + 1) / 2 + 0.2,
              (normalized.z + 1) / 2 + 0.2
            )
            .convertSRGBToLinear()
    );

    // Line body (cylinder)
    const cylinderLength = length * 0.9;
    const cylinderMid = new Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5)
      .addScaledVector(normalized, -length * 0.05); // move slightly back

    const cylinderGeometry = new CylinderGeometry(
      0.02,
      0.02,
      cylinderLength,
      4
    );
    const cylinder = new Mesh(cylinderGeometry, this.material.material);
    cylinder.position.copy(cylinderMid);
    cylinder.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), normalized);
    this.group.add(cylinder);

    // Arrowhead (cone)
    const coneLength = length * 0.1;
    const coneGeometry = new ConeGeometry(0.04, coneLength, 8);
    const cone = new Mesh(coneGeometry, this.material.material);
    const d = 0.1;
    cone.position.copy(
      new Vector3(
        end.x - normalized.x * d,
        end.y - normalized.y * d,
        end.z - normalized.z * d
      )
    );
    cone.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), normalized);
    this.group.add(cone);
  }

  clear() {
    this.group.children.forEach((child) => {
      if (child instanceof Mesh) {
        child.geometry.dispose();
      }
    });
    this.group.clear();
  }

  dispose() {
    this.clear();
    this.material.material.dispose();
    this.scene.remove(this.group);
  }
}
