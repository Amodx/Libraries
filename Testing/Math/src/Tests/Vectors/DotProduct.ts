import { Vector3Like } from "@amodx/math";
import { VectorMesh } from "Shared/Vector/VectorMesh";
import { AngleMesh } from "Shared/Angle/AngleMesh"; // Assuming same folder or adjust path
import { TestRegister } from "Tests/TestRegister";
import { Vector3 } from "three";
import { addVector } from "Shared/GUI/Vectors";

TestRegister.register("Dot Product", (nodes) => {
  const vector1 = Vector3Like.Create(0, 1, 0);
  const vector2 = Vector3Like.Create(1, 0, 0);

  const vector1Mesh = new VectorMesh(nodes.scene);
  const vector2Mesh = new VectorMesh(nodes.scene);
  const angleMesh = new AngleMesh(nodes.scene);

  nodes.camera.position.set(3, 3, 3);
  nodes.camera.lookAt(new Vector3(0, 0, 0));

  const resultDisplay = {
    dot: "0",
    angleDegrees: 0,
  };

  const update = () => {
    vector1Mesh.setPoints({ x: 0, y: 0, z: 0 }, vector1);
    vector2Mesh.setPoints({ x: 0, y: 0, z: 0 }, vector2);
    const dot = Vector3Like.Dot(vector1, vector2);
    resultDisplay.dot = `${dot.toFixed(4)}`;
    const angleRad = Vector3Like.DotAngle(vector1, vector2);
    const angleDeg = isNaN(angleRad) ? 0 : (angleRad * 180) / Math.PI;
    resultDisplay.angleDegrees = angleDeg;
    angleMesh.setAngle(angleRad, 0xffaa00);
  };

  update();

  const folder = nodes.gui.addFolder("Dot Product");

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
  folder.add(resultDisplay, "dot").name("Dot Product").listen();
  folder.add(resultDisplay, "angleDegrees").name("Angle (°)").listen();
  folder.open();

  return () => {
    nodes.gui.removeFolder(folder);
    vector1Mesh.dispose();
    vector2Mesh.dispose();
    angleMesh.dispose();
  };
});
