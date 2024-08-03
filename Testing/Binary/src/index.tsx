//import { Approutes } from "Routes";
import { createRoot } from "react-dom/client";
import "./core.css";
import { App } from "App";
import { elm, useSignal } from "@amodx/elm";
import { BinaryNumberTypes, BinaryStruct } from "@amodx/binary";
{
  const TestStruct = new BinaryStruct("chunk-tags");
  TestStruct.registerProperty(
    {
      id: "num",
      type: "typed-number",
      numberType: BinaryNumberTypes.Float64,
    },
    {
      id: "bool",
      type: "boolean",
    },
    {
    id: "test",
    type: "vector-3",
    numberType: BinaryNumberTypes.Float64,
  });
  TestStruct.init();
  console.log(TestStruct);
  const buffer = new ArrayBuffer(TestStruct.structData.bufferSize);
  TestStruct.setBuffer(buffer);

  const instance = TestStruct.instantiate<{
    test: { x: number; y: number; z: number };
  }>();
  instance.test.x = 10;
  instance.test.y = 12;
  instance.test.z = 2;

  console.log(instance.test.x, instance.test.y, instance.test.z);
}

/* {
   const WorldDataStructProperties = {
    header: "#dve_header",
    dataType: "#dve_data_type",
    dimensionId: "#dve_dimension_id",
    positionX: "#dve_p_x",
    positionY: "#dve_p_y",
    positionZ: "#dve_p_z",
  };

   const ChunkStructProperties = {
    minHeight: "#dve_min_height",
    maxHeight: "#dve_max_height",
    heightMap: "#dve_height_map",
    dirtyMap: "#dve_dirty_map",
    voxelIDSegment: "#dve_voxel_id",
    voxelLightSegment: "#dve_voxel_light",
    voxelStateSegment: "#dve_voxel_state",
    voxelSecondaryIDSegment: "#dve_voxel_secondary_id",
  };

   const ChunkStatStruct = new BinaryStruct("chunk-tags");
  ChunkStatStruct.registerProperty(
    {
      id: WorldDataStructProperties.header,
      type: "header",
      numberType: BinaryNumberTypes.Uint16,
    },
    {
      id: WorldDataStructProperties.dataType,
      type: "header",
      numberType: BinaryNumberTypes.Uint16,
    },
    {
      id: WorldDataStructProperties.dimensionId,
      type: "typed-number",
      numberType: BinaryNumberTypes.Uint16,
    },
    {
      id: WorldDataStructProperties.positionX,
      type: "typed-number",
      numberType: BinaryNumberTypes.Int32,
    },
    {
      id: WorldDataStructProperties.positionY,
      type: "typed-number",
      numberType: BinaryNumberTypes.Int32,
    },
    {
      id: WorldDataStructProperties.positionZ,
      type: "typed-number",
      numberType: BinaryNumberTypes.Int32,
    },
    {
      id: ChunkStructProperties.minHeight,
      type: "typed-number",
      numberType: BinaryNumberTypes.Uint8,
    },
    {
      id: ChunkStructProperties.maxHeight,
      type: "typed-number",
      numberType: BinaryNumberTypes.Uint8,
    },
    {
      id: "#dve_has_rich_data",
      type: "boolean",
    },
    {
      id: "#dve_has_entity_data",
      type: "boolean",
    },
    {
      id: "#dve_is_stored",
      type: "boolean",
    },
    {
      id: "#dve_is_world_gen_done",
      type: "boolean",
    },
    {
      id: "#dve_is_world_decor_done",
      type: "boolean",
    },
    {
      id: "#dve_is_world_sun_done",
      type: "boolean",
    },
    {
      id: "#dve_is_world_propagation_done",
      type: "boolean",
    },
    {
      id: "#dve_is_dirty",
      type: "boolean",
    },
    {
      id: "#dve_persistent",
      type: "boolean",
    }
  );
  ChunkStatStruct.init();
  console.log(ChunkStatStruct);
  const buffer = new ArrayBuffer(ChunkStatStruct.structData.bufferSize);
  ChunkStatStruct.setBuffer(buffer);

  const instance = ChunkStatStruct.instantiate();
  console.log(instance);

  ChunkStatStruct.setProperty("#dve_is_world_propagation_done", 1);

  console.log(ChunkStatStruct.getProperty("#dve_is_world_propagation_done"));
}
 */

/* const root = createRoot(document.getElementById("root")!);
document.getElementById("root")!.classList.add("bp5-dark");

const C = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <p>Count: {count} </p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      {count > 5 && <C />}
    </div>
  );
};

root.render(
  <>
    < C />
  </>
);
 */
