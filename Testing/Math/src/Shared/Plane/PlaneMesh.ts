import { Scene, Mesh, Group, PlaneGeometry, Vector3, Quaternion } from "three";
import { PlaneMaterial } from "./PlaneMaterial";
import { Plane } from "@amodx/math/Geomtry/Plane";

export class PlaneMesh {
  private group = new Group();
  material: PlaneMaterial;

  constructor(public scene: Scene) {
    this.scene.add(this.group);
    this.material = new PlaneMaterial();
  }

  setPlane(plane: Plane, color: number = 0x049ef4) {
    this.clear();

    const geometry = new PlaneGeometry(4, 4, 1, 1);

    const mesh = new Mesh(geometry, this.material.material);

    this.material.setColor(color);
    const planeNormal = new Vector3(
      plane.normal.x,
      plane.normal.y,
      plane.normal.z
    ).normalize();
    const defaultNormal = new Vector3(0, 0, 1);
    const quaternion = new Quaternion().setFromUnitVectors(
      defaultNormal,
      planeNormal
    );
    mesh.setRotationFromQuaternion(quaternion);

    const position = planeNormal.clone().multiplyScalar(-plane.distance);
    mesh.position.copy(position);

    this.group.add(mesh);
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
