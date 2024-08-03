import type {
  BinaryBooleanProperty,
  BinaryNumberProperty,
  BinaryTypedNumberProperty,
  BinaryPropertySchema,
  BinaryTypedNumberArrayProperty,
  BinaryHeaderProperty,
  BinaryBitArrayProperty,
  BinaryTypedVector2Property,
  BinaryTypedVector3Property,
  BinaryTypedVector4Property,
  BinaryPropertyNodes,
} from "../Types/BinaryStructSchema.types";
import { BinaryUtil } from "../../Util/BinaryUtil.js";
import { BinaryNumberTypes, ByteCounts } from "../../Constants/BinaryTypes";
import { StructPropertyTypes } from "../Constants/StructPropertyTypes";
import { BinaryStructData } from "../Types";
const PropertyIndexSize = ByteCounts.Uint32 + ByteCounts.Uint8 * 3;

const setIndexData = (
  data: DataView,
  indexBufferIndex: number,
  byteIndex: number,
  bitOffSet: number,
  bitSize: number,
  type: number
) => {
  data.setUint32(indexBufferIndex, byteIndex);
  indexBufferIndex += ByteCounts.Uint32;
  data.setUint8(indexBufferIndex, bitOffSet);
  indexBufferIndex += ByteCounts.Uint8;
  data.setUint8(indexBufferIndex, bitSize);
  indexBufferIndex += ByteCounts.Uint8;
  data.setUint8(indexBufferIndex, type);
  indexBufferIndex += ByteCounts.Uint8;
  return indexBufferIndex;
};

export function CreateIndex(
  schemaNodes: BinaryPropertyNodes[],
  indexes = 1,
  shared = false
) {
  const schema: BinaryPropertySchema = new Map();
  for (const node of schemaNodes) {
    schema.set(node.id, node);
  }

  /*
[Process Propertys]
*/
  const headers: Map<BinaryNumberTypes, BinaryHeaderProperty[]> = new Map();
  const booleans: BinaryBooleanProperty[] = [];
  const numbers: BinaryNumberProperty[][] = [];
  const typedNumbers: Map<BinaryNumberTypes, BinaryTypedNumberProperty[]> =
    new Map();
  const typedNumbersArrays: Map<
    BinaryNumberTypes,
    BinaryTypedNumberArrayProperty[]
  > = new Map();
  const vector2s: Map<BinaryNumberTypes, BinaryTypedVector2Property[]> =
    new Map();
  const vector3s: Map<BinaryNumberTypes, BinaryTypedVector3Property[]> =
    new Map();
  const vector4s: Map<BinaryNumberTypes, BinaryTypedVector4Property[]> =
    new Map();
  const bitArrays: BinaryBitArrayProperty[] = [];
  schema.forEach((Property) => {
    if (Property.type == "header") {
      let Propertys = headers.get(Property.numberType);
      if (!Propertys) {
        Propertys = [];
        headers.set(Property.numberType, Propertys);
      }
      Propertys.push(Property);
    }
    if (Property.type == "boolean") {
      booleans.push(Property);
    }
    if (Property.type == "number") {
      const range = (Property as BinaryNumberProperty).range;
      const bitSize = BinaryUtil.calculateBitsNeeded(range[0], range[1]);

      numbers[bitSize] ??= [];
      numbers[bitSize].push(Property);
    }
    if (Property.type == "typed-number") {
      let Propertys = typedNumbers.get(Property.numberType);
      if (!Propertys) {
        Propertys = [];
        typedNumbers.set(Property.numberType, Propertys);
      }
      Propertys.push(Property);
    }
    if (Property.type == "typed-number-array") {
      let arrayPropertys = typedNumbersArrays.get(Property.numberType);
      if (!arrayPropertys) {
        arrayPropertys = [];
        typedNumbersArrays.set(Property.numberType, arrayPropertys);
      }
      arrayPropertys.push(Property);
    }
    if (Property.type == "vector-2") {
      let vectorProperties = vector2s.get(Property.numberType);
      if (!vectorProperties) {
        vectorProperties = [];
        vector2s.set(Property.numberType, vectorProperties);
      }
      vectorProperties.push(Property);
    }
    if (Property.type == "vector-3") {
      let vectorProperties = vector3s.get(Property.numberType);
      if (!vectorProperties) {
        vectorProperties = [];
        vector3s.set(Property.numberType, vectorProperties);
      }
      vectorProperties.push(Property);
    }
    if (Property.type == "vector-4") {
      let vectorProperties = vector4s.get(Property.numberType);
      if (!vectorProperties) {
        vectorProperties = [];
        vector4s.set(Property.numberType, vectorProperties);
      }
      vectorProperties.push(Property);
    }
    if (Property.type == "bit-array") {
      bitArrays.push(Property);
    }
  });

  /*
[Build Index]
*/
  const indexSize = schema.size * PropertyIndexSize;
  let indexBuffer = new ArrayBuffer(indexSize);
  if (shared) {
    indexBuffer = new SharedArrayBuffer(indexSize);
  }
  const indexMap = new Map<string, number>();
  const index = new DataView(indexBuffer);


  let indexBufferIndex = 0;

  let byteIndex = 0;
  let bitIndex = 0;
  let bitSize = 1;
  /*
[Headers]
*/
  headers.forEach((Propertys, type) => {
    const byteSise = BinaryUtil.getTypedSize(type);
    for (let i = 0; i < Propertys.length; i++) {
      const Property = Propertys[i];
      indexMap.set(Property.id, indexBufferIndex);
      indexBufferIndex = setIndexData(
        index,
        indexBufferIndex,
        byteIndex,
        0,
        Property.numberType,
        StructPropertyTypes.TypedNumber
      );
      byteIndex += byteSise;
    }
  });

  /*
[Booleans]
*/
  bitSize = 1;
  for (let i = 0; i < booleans.length; i++) {
    const bool = booleans[i];
    indexMap.set(bool.id, indexBufferIndex);
    indexBufferIndex = setIndexData(
      index,
      indexBufferIndex,
      byteIndex,
      bitIndex,
      bitSize,
      StructPropertyTypes.Boolean
    );
    bitIndex++;
    if (bitIndex >= 8) {
      byteIndex++;
      bitIndex = 0;
    }
  }

  /*
[Typed Numbers]
*/
  bitIndex = 0;
  byteIndex++;
  typedNumbers.forEach((Propertys, type) => {
    const byteSise = BinaryUtil.getTypedSize(type);
    for (let i = 0; i < Propertys.length; i++) {
      const Property = Propertys[i];
      indexMap.set(Property.id, indexBufferIndex);
      indexBufferIndex = setIndexData(
        index,
        indexBufferIndex,
        byteIndex,
        0,
        Property.numberType,
        StructPropertyTypes.TypedNumber
      );
      byteIndex += byteSise;
    }
  });
  /*
[Typed Numbers Arrays]
*/
  byteIndex++;
  typedNumbersArrays.forEach((Propertys, type) => {
    const byteSise = BinaryUtil.getTypedSize(type);
    for (let i = 0; i < Propertys.length; i++) {
      const Property = Propertys[i];
      indexMap.set(Property.id, indexBufferIndex);
      indexBufferIndex = setIndexData(
        index,
        indexBufferIndex,
        byteIndex,
        0,
        Property.numberType,
        StructPropertyTypes.TypedNumberArray
      );
      byteIndex += byteSise * Property.length;
    }
  });

  /*
[vector 2s]
*/
  byteIndex++;
  vector2s.forEach((Propertys, type) => {
    const byteSise = BinaryUtil.getTypedSize(type);
    for (let i = 0; i < Propertys.length; i++) {
      const Property = Propertys[i];
      indexMap.set(Property.id, indexBufferIndex);
      indexBufferIndex = setIndexData(
        index,
        indexBufferIndex,
        byteIndex,
        0,
        Property.numberType,
        StructPropertyTypes.Vector2
      );
      byteIndex += byteSise * 2;
    }
  });

  /*
[vector 3s]
*/
  byteIndex++;
  vector3s.forEach((Propertys, type) => {
    const byteSise = BinaryUtil.getTypedSize(type);
    for (let i = 0; i < Propertys.length; i++) {
      const Property = Propertys[i];
      indexMap.set(Property.id, indexBufferIndex);
      indexBufferIndex = setIndexData(
        index,
        indexBufferIndex,
        byteIndex,
        0,
        Property.numberType,
        StructPropertyTypes.Vector3
      );
      byteIndex += byteSise * 3;
    }
  });

  /*
[vector 4s]
*/
  byteIndex++;
  vector4s.forEach((Propertys, type) => {
    const byteSise = BinaryUtil.getTypedSize(type);
    for (let i = 0; i < Propertys.length; i++) {
      const Property = Propertys[i];
      indexMap.set(Property.id, indexBufferIndex);
      indexBufferIndex = setIndexData(
        index,
        indexBufferIndex,
        byteIndex,
        0,
        Property.numberType,
        StructPropertyTypes.Vector4
      );
      byteIndex += byteSise * 4;
    }
  });
  /*
[bit arrays]
*/
  byteIndex++;
  bitArrays.forEach((Property) => {
    const byteSise = Math.ceil(Property.length / 8) + 1;
    indexMap.set(Property.id, indexBufferIndex);
    indexBufferIndex = setIndexData(
      index,
      indexBufferIndex,
      byteIndex,
      0,
      byteSise,
      StructPropertyTypes.BitArray
    );
    byteIndex += byteSise;
  });

  /*
[Create Remote Property Manager Data]
*/
  const remoteData: BinaryStructData = {
    bufferSize: byteIndex * indexes,
    buffer: new ArrayBuffer(0),
    indexBuffer: indexBuffer,
    indexMap: indexMap,
    structSize: byteIndex,
    structArrayIndexes: indexes,
  };
  return remoteData;
}
