import { useEffect, useState } from "react";
import { BinaryObject } from "@amodx/binary/";

export function App() {
  useEffect(() => {
    console.log("parse binary object");
    /* 
   { const objectTest = {
      prop0: new ArrayBuffer(120),
      prop1: "what is up",
      prop2: new Uint16Array([1, 2, 3, 2, 4, 4423]),
      prop3: {
        prop1: "what is up",
        prop2: new Uint16Array([1, 2, 3, 2, 4, 4423]),
      },
      prop4: [
        {
          prop1: "what is up",
          prop2: new Uint16Array([1, 2, 3, 2, 4, 4423]),
        },
        {
          prop1: "what is up",
          prop2: new Uint16Array([1, 2, 3, 2, 4, 4423]),
        },
        {
          prop1: "what is up",
          prop2: new Uint16Array([1, 2, 3, 2, 4, 4423]),
        },
      ],
    };
    const objectBuffer = BinaryObject.objectToBuffer(objectTest);
    const objectParsed = BinaryObject.bufferToObject(objectBuffer);
    console.log(objectTest);

    console.log(objectBuffer);

    console.log(objectParsed);}
 */
    const objectTest = [
      "what is up",
      BinaryObject.nodes.float32(12),
      BinaryObject.nodes.float32(1200),
      BinaryObject.nodes.float32(12999),
      [
        ["what is up", new Uint16Array([1, 2, 3, 2, 4, 4423]), 100],
        ["what is up", new Float32Array([1, 2, 3, 2, 4, 4423]), undefined],
        ["what is up", new Int8Array([1, 2, 3, 2, 4, 4423])],
        ["what is up", new Uint16Array([1, 2, 3, 2, 4, 4423])],
      ],
      undefined,
      {
        prop2: new Uint16Array([1, 2, 3, 2, 4, 4423]),
        pro3: BinaryObject.nodes.float32(12999),
        prop3: {
          prop1: "what is up",
          prop2: new Uint16Array([1, 2, 3, 2, 4, 4423]),
        },
      },
    ];
    const objectBuffer = BinaryObject.objectToBuffer(objectTest);
    const objectParsed = BinaryObject.bufferToObject(objectBuffer);
    console.log(objectTest);

    console.log(objectBuffer);

    console.log(objectParsed);
  }, []);
  return <></>;
}
