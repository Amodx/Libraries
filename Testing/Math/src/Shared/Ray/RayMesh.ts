import { Scene, Vector3, Curve, Quaternion } from "three";

import { VectorMesh } from "Shared/Vector/VectorMesh";

import { Ray } from "@amodx/math/Geomtry/Ray";
import { Vector3Like } from "@amodx/math";

export class RayMesh {
  private _vector?: VectorMesh;

  constructor(public scene: Scene) {}

  setRay(ray: Ray, colorValue?: number) {
    this.clear();

    this._vector = new VectorMesh(this.scene);
    this._vector.setPoints(
      ray.origin,
      Vector3Like.Add(
        ray.origin,
        Vector3Like.MultiplyScalar(ray.normal, ray.length)
      ),
      colorValue
    );
  }

  clear() {
    if (this._vector) this._vector.clear();
  }

  dispose() {
    if (this._vector) {
      this._vector.dispose();
      this._vector = undefined;
    }
  }
}
