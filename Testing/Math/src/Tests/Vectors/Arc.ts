import { Vector3Like } from "@amodx/math";
import { VectorMesh } from "Shared/Vector/VectorMesh";
import { AngleMesh } from "Shared/Angle/AngleMesh"; // Assuming same folder or adjust path
import { TestRegister } from "Tests/TestRegister";
import { Vector3 } from "three";
import { ArcMesh } from "Shared/Arc/ArcMesh";
import { addVector } from "Shared/GUI/Vectors";

TestRegister.register("Arc", (nodes) => {
  const vector1 = Vector3Like.Create(0, 1, 0);
  const vector2 = Vector3Like.Create(1, 0, 0);

  const vector1Mesh = new VectorMesh(nodes.scene);
  const vector2Mesh = new VectorMesh(nodes.scene);

  const arcMesh = new ArcMesh(nodes.scene);
  nodes.camera.position.set(3, 3, 3);
  nodes.camera.lookAt(new Vector3(0, 0, 0));

  const update = () => {
    vector1Mesh.setPoints({ x: 0, y: 0, z: 0 }, vector1);
    vector2Mesh.setPoints({ x: 0, y: 0, z: 0 }, vector2);
    arcMesh.setArc(vector1, vector2, 0xffaa00);
  };

  update();

  const folder = nodes.gui.addFolder("Arc");
  addVector({
    name: "v1",
    onChange: update,
    gui: folder,
    vector: vector1,
  });

  addVector({
    name: "v2",
    onChange: update,
    gui: folder,
    vector: vector2,
  });
  folder.open();

  return () => {
    nodes.gui.removeFolder(folder);
    vector1Mesh.dispose();
    vector2Mesh.dispose();
    arcMesh.dispose();
  };
});
