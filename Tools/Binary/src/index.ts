import "./core.css";
import { elm, useSignal } from "@amodx/elm";
import { BinaryNumberTypes, BinaryStruct } from "@amodx/binary";
import App from "App";
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



document.body.append(App())
