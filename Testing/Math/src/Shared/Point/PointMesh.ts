import { Scene, Mesh, Group, SphereGeometry } from "three";
import { PointMaterial } from "./PointMaterial";
import { Vector3Like } from "@amodx/math";

export class PointMesh {
  private group = new Group();
  material: PointMaterial;
  mesh: Mesh;

  constructor(public scene: Scene) {
    this.scene.add(this.group);
    this.material = new PointMaterial();
  }

  setPoint(point: Vector3Like, color: number = 0x049ef4) {
    if (this.mesh) {
      this.material.setColor(color);
      return this.mesh.position.copy(point);
    }

    const geometry = new SphereGeometry(0.05, 8, 8);
    const mesh = new Mesh(geometry, this.material.material);
    this.material.setColor(color);
    mesh.position.copy(point);
    this.mesh = mesh;
    this.group.add(mesh);
  }

  dispose() {
    this.group.children.forEach((child) => {
      if (child instanceof Mesh) {
        child.geometry.dispose();
      }
    });
    this.group.clear();
    this.material.material.dispose();
    this.scene.remove(this.group);
  }
}
