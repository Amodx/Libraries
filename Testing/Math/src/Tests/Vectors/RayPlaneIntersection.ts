import { Vector3Like } from "@amodx/math";
import { TestRegister } from "Tests/TestRegister";
import { Vector3 } from "three";
import { addVector } from "Shared/GUI/Vectors";
import { Ray } from "@amodx/math/Geomtry/Ray";
import { RayMesh } from "Shared/Ray/RayMesh";
import { Plane } from "@amodx/math/Geomtry/Plane";
import { PlaneMesh } from "Shared/Plane/PlaneMesh";
import { PointMesh } from "Shared/Point/PointMesh";

TestRegister.register("Ray Plane Intersection", (nodes) => {
  const rayOrigin = Vector3Like.Create(0, 3, 0);
  const rayDirection = Vector3Like.Create(0, -1, 0);
  const ray = new Ray(rayOrigin, rayDirection, 4);

  const rayMesh = new RayMesh(nodes.scene);

  const planeNormal = Vector3Like.Create(0, 1, 0);
  const plane = new Plane(planeNormal, 0);
  const planeMesh = new PlaneMesh(nodes.scene);

  const pointMesh = new PointMesh(nodes.scene);

  nodes.camera.position.set(3, 3, 3);
  nodes.camera.lookAt(new Vector3(0, 0, 0));

  const update = () => {
    rayMesh.setRay(ray);
    planeMesh.setPlane(plane);
    const t = ray.intersectsPlane(plane);
    if (t) {
      pointMesh.setPoint(
        Vector3Like.Add(ray.origin, Vector3Like.MultiplyScalar(ray.normal, t)),
        0x00ff00
      );
    } else {
      pointMesh.setPoint(Vector3Like.Create(), 0xff0000);
    }
  };

  update();

  const folder = nodes.gui.addFolder("Ray Plane Intersection");

  addVector({
    name: "Ray Origin",
    onChange: update,
    gui: folder,
    vector: rayOrigin,
    range: [-5, 5],
  });

  addVector({
    name: "Ray Direction",
    onChange: update,
    gui: folder,
    vector: rayDirection,
  });

  addVector({
    name: "Plane Normal",
    onChange: update,
    gui: folder,
    vector: planeNormal,
  });

  folder.open();

  return () => {
    nodes.gui.removeFolder(folder);
    rayMesh.dispose();
    //planeMesh.dispose();
  };
});
