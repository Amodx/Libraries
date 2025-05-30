import { Vector3Like } from "@amodx/math";
import {
  Scene,
  Vector3,
  Mesh,
  MeshBasicMaterial,
  CylinderGeometry,
  Group,
} from "three";
import { LineMaterial } from "./LineMaterial";

export class LineMesh {
  private group = new Group();

  material: LineMaterial;
  constructor(
    public scene: Scene,
    color: number
  ) {
    this.scene.add(this.group);
    this.material = new LineMaterial(color);
  }

  setPoints(...vectors: Vector3Like[]) {
    this.clear();
    for (let i = 0; i < vectors.length - 1; i++) {
      const start = new Vector3(vectors[i].x, vectors[i].y, vectors[i].z);
      const end = new Vector3(
        vectors[i + 1].x,
        vectors[i + 1].y,
        vectors[i + 1].z
      );

      const dir = new Vector3().subVectors(end, start);
      const length = dir.length();
      const mid = new Vector3().addVectors(start, end).multiplyScalar(0.5);

      const geometry = new CylinderGeometry(0.02, 0.02, length, 4);

      const mesh = new Mesh(geometry, this.material.material);

      mesh.position.copy(mid);
      mesh.quaternion.setFromUnitVectors(
        new Vector3(0, 1, 0),
        dir.clone().normalize()
      );

      this.group.add(mesh);
    }
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
