import { VectorMesh } from "Shared/Vector/VectorMesh";
import { TestRegister } from "Tests/TestRegister";
import { Vector3 } from "three";
TestRegister.register("Axes", (nodes) => {
  const xAxes = new VectorMesh(nodes.scene);
  xAxes.setPoints({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 });

  const yAxes = new VectorMesh(nodes.scene);
  yAxes.setPoints({ x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 });

  const zAxes = new VectorMesh(nodes.scene);
  zAxes.setPoints({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 });

  nodes.camera.position.set(3, 3, 3);
  nodes.camera.lookAt(new Vector3(0, 0, 0));
  return () => {
    xAxes.dispose();
    yAxes.dispose();
    zAxes.dispose();
  };
});
