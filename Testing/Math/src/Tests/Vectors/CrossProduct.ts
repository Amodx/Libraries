import { Vector3Like } from "@amodx/math";
import { addVector } from "Shared/GUI/Vectors";
import { VectorMesh } from "Shared/Vector/VectorMesh";
import { TestRegister } from "Tests/TestRegister";
import { Vector3 } from "three";
TestRegister.register("Cross Product", (nodes) => {
  const vector1 = Vector3Like.Create(0, 1, 0);
  const vector1Mesh = new VectorMesh(nodes.scene);

  const vector2 = Vector3Like.Create(1, 0, 0);
  const vector2Mesh = new VectorMesh(nodes.scene);

  const resultVector = Vector3Like.Create();
  const resultMesh = new VectorMesh(nodes.scene);

  nodes.camera.position.set(3, 3, 3);
  nodes.camera.lookAt(new Vector3(0, 0, 0));
  const resultDisplay = {
    result: `(${resultVector.x.toFixed(2)}, ${resultVector.y.toFixed(2)}, ${resultVector.z.toFixed(2)})`,
  };

  const update = () => {
    vector1Mesh.setPoints({ x: 0, y: 0, z: 0 }, vector1);
    vector2Mesh.setPoints({ x: 0, y: 0, z: 0 }, vector2);
    Vector3Like.CrossToRef(vector1, vector2, resultVector);
    resultMesh.setPoints({ x: 0, y: 0, z: 0 }, resultVector, 0xff0ff);
    resultDisplay.result = `(${resultVector.x.toFixed(2)}, ${resultVector.y.toFixed(2)}, ${resultVector.z.toFixed(2)})`;
  };
  update();
  const folder = nodes.gui.addFolder("Cross Product");
  addVector({
    name: "v1",
    onChange: update,
    gui: folder,
    vector: vector1,
  });

  addVector({
    name: "v2",
    onChange: update,
    gui:folder,
    vector: vector2,
  });
  folder.add(resultDisplay, "result").name("Result Vector").listen();
  folder.open();
  return () => {
    nodes.gui.removeFolder(folder);
    vector1Mesh.dispose();
    vector2Mesh.dispose();
    resultMesh.dispose();
  };
});
