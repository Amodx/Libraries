import "./core.css";

import App from "App";
import { Vector3Like } from "@amodx/math/";
import { Schema } from "@amodx/ncs/Schema/Schema";
import { NodeId } from "@amodx/ncs/Nodes/NodeId";
import { PropertyMetaData } from "@amodx/ncs/Schema/Property/Property.types";
document.body.append(App());
type TrasnformData = {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
};
class Trasnform {
  position = Vector3Like.Create();
  rotation = Vector3Like.Create();
  scale = Vector3Like.Create(1, 1, 1);
}
const transformSchema = Schema.FromObject(new Trasnform());
console.log(transformSchema);
/* const transformSchema = new Schema<TrasnformData>([
  {
    id: "position",
    value: { x: 0, y: 0, z: 0 },
  },
  {
    id: "rotation",
    value: { x: 0, y: 0, z: 0 },
  },
  {
    id: "scale",
    value: { x: 1, y: 1, z: 1 },
  },
]); */
const idSchema = new Schema<{
  nodeid: bigint;
}>([
  {
    id: "nodeid",
    value: 0n,
  },
]);

{
  const view = transformSchema.createObjectView("default");
  console.log("created object view");
  console.log(view);
  const cursor = view.createCursor();
  console.log("created object cursor");
  console.log(cursor);
  const data = view.createData();
  console.log("created object data");
  console.log(data);
  transformSchema.array.setData(0, data, "default");
  cursor.setInstance(0);
  console.log(cursor.position, cursor.rotation, cursor.scale);
  console.log(cursor.scale.x, cursor.scale.y, cursor.scale.z);
}
/* {
  const view = transformSchema.createTypedArrayView("typed-view","f32");
  console.log("created type array view");
  console.log(view);
  const cursor = view.createCursor();
  console.log("created type array cursor");
  console.log(cursor);
  const data = view.createData();
  console.log("created  type array data");
  console.log(data);
  cursor.setInstance(data);
  console.log(cursor.position, cursor.rotation, cursor.scale);
  console.log(cursor.scale.x, cursor.scale.y, cursor.scale.z);
}
{
  const i = transformSchema.index;

  function addVector3(
    object: Record<string, number>
  ): Record<number, PropertyMetaData> {
    return {
      [object["x"]]: { binary: { type: "f32" } },
      [object["y"]]: { binary: { type: "f32" } },
      [object["z"]]: { binary: { type: "f32" } },
    };
  }
  const view = transformSchema.createBinaryObjectView("binary-object",false, {
    ...addVector3(i.position),
    ...addVector3(i.rotation),
    ...addVector3(i.scale),
  });
  console.log("created binary object view");
  console.log(view);
  const cursor = view.createCursor();
  console.log("created binary object cursor");
  console.log(cursor);
  const data = view.createData();
  console.log("created binary object data");
  console.log(data);
  cursor.setInstance(data);
  console.log(cursor.position, cursor.rotation, cursor.scale);
  console.log(cursor.scale.x, cursor.scale.y, cursor.scale.z);
}

{
  const i = idSchema.index;
  const view = idSchema.createBinaryObjectView("binary-object",false, {
    [i.nodeid]: {
      binary: {
        type: "buffer",
        byteSize: 16,
        get(view, meta, index) {
          const high = view.getBigUint64(index, false);
          const low = view.getBigUint64(index + 8, false);
          return (high << 64n) | low;
        },
        set(view, meta, index, value) {
          value = BigInt(value);
          const high = value >> 64n;
          const low = value & 0xffffffffffffffffn;
          view.setBigUint64(index, high);
          view.setBigUint64(index + 8, low);
        },
      },
    },
  });
  console.log("created id binary object view");
  console.log(view);
  const cursor = view.createCursor();
  console.log("created binary object cursor");
  console.log(cursor);
  const data = view.createData();
  console.log("created id binary object data");
  console.log(data);
  cursor.setInstance(data);
  cursor.nodeid = NodeId.Create();
  console.log(cursor.nodeid);
}
 */
