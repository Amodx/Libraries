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
  structArrayIndexes = 1,
  shared = false
) {
  const schema: BinaryPropertySchema = new Map();
  for (const node of schemaNodes) {
    schema.set(node.id, node);
  }
  const propertyDefaults: Record<string, any> = {};
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
  schema.forEach((property) => {
    if (property.default) propertyDefaults[property.id] = property.default;
    if (property.type == "header") {
      let Propertys = headers.get(property.numberType);
      if (!Propertys) {
        Propertys = [];
        headers.set(property.numberType, Propertys);
      }
      Propertys.push(property);
    }
    if (property.type == "boolean") {
      booleans.push(property);
    }
    if (property.type == "number") {
      const range = (property as BinaryNumberProperty).range;
      const bitSize = BinaryUtil.calculateBitsNeeded(range[0], range[1]);

      numbers[bitSize] ??= [];
      numbers[bitSize].push(property);
    }
    if (property.type == "typed-number") {
      let Propertys = typedNumbers.get(property.numberType);
      if (!Propertys) {
        Propertys = [];
        typedNumbers.set(property.numberType, Propertys);
      }
      Propertys.push(property);
    }
    if (property.type == "typed-number-array") {
      let arrayPropertys = typedNumbersArrays.get(property.numberType);
      if (!arrayPropertys) {
        arrayPropertys = [];
        typedNumbersArrays.set(property.numberType, arrayPropertys);
      }
      arrayPropertys.push(property);
    }
    if (property.type == "vector-2") {
      let vectorProperties = vector2s.get(property.numberType);
      if (!vectorProperties) {
        vectorProperties = [];
        vector2s.set(property.numberType, vectorProperties);
      }
      vectorProperties.push(property);
    }
    if (property.type == "vector-3") {
      let vectorProperties = vector3s.get(property.numberType);
      if (!vectorProperties) {
        vectorProperties = [];
        vector3s.set(property.numberType, vectorProperties);
      }
      vectorProperties.push(property);
    }
    if (property.type == "vector-4") {
      let vectorProperties = vector4s.get(property.numberType);
      if (!vectorProperties) {
        vectorProperties = [];
        vector4s.set(property.numberType, vectorProperties);
      }
      vectorProperties.push(property);
    }
    if (property.type == "bit-array") {
      bitArrays.push(property);
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
  const indexMap: Record<string, number> = {};
  const index = new DataView(indexBuffer);

  let indexBufferIndex = 0;

  let structSize = 0;
  let bitIndex = 0;
  let bitSize = 1;
  /*
[Headers]
*/
  headers.forEach((Propertys, type) => {
    const byteSise = BinaryUtil.getTypedSize(type);
    for (let i = 0; i < Propertys.length; i++) {
      const Property = Propertys[i];
      indexMap[Property.id] = indexBufferIndex;
      indexBufferIndex = setIndexData(
        index,
        indexBufferIndex,
        structSize,
        0,
        Property.numberType,
        StructPropertyTypes.TypedNumber
      );
      structSize += byteSise;
    }
  });

  /*
[Booleans]
*/
  bitSize = 1;
  for (let i = 0; i < booleans.length; i++) {
    const bool = booleans[i];
    indexMap[bool.id] = indexBufferIndex;
    indexBufferIndex = setIndexData(
      index,
      indexBufferIndex,
      structSize,
      bitIndex,
      bitSize,
      StructPropertyTypes.Boolean
    );
    bitIndex++;
    if (bitIndex >= 8) {
      structSize++;
      bitIndex = 0;
    }
  }

  /*
[Typed Numbers]
*/
  bitIndex = 0;
  structSize++;
  typedNumbers.forEach((Propertys, type) => {
    const byteSise = BinaryUtil.getTypedSize(type);
    for (let i = 0; i < Propertys.length; i++) {
      const Property = Propertys[i];
      indexMap[Property.id] = indexBufferIndex;
      indexBufferIndex = setIndexData(
        index,
        indexBufferIndex,
        structSize,
        0,
        Property.numberType,
        StructPropertyTypes.TypedNumber
      );
      structSize += byteSise;
    }
  });
  /*
[Typed Numbers Arrays]
*/
  structSize++;
  typedNumbersArrays.forEach((Propertys, type) => {
    const byteSise = BinaryUtil.getTypedSize(type);
    for (let i = 0; i < Propertys.length; i++) {
      const Property = Propertys[i];
      indexMap[Property.id] = indexBufferIndex;
      indexBufferIndex = setIndexData(
        index,
        indexBufferIndex,
        structSize,
        0,
        Property.numberType,
        StructPropertyTypes.TypedNumberArray
      );
      structSize += byteSise * Property.length;
    }
  });

  /*
[vector 2s]
*/
  structSize++;
  vector2s.forEach((Propertys, type) => {
    const byteSise = BinaryUtil.getTypedSize(type);
    for (let i = 0; i < Propertys.length; i++) {
      const Property = Propertys[i];
      indexMap[Property.id] = indexBufferIndex;
      indexBufferIndex = setIndexData(
        index,
        indexBufferIndex,
        structSize,
        0,
        Property.numberType,
        StructPropertyTypes.Vector2
      );
      structSize += byteSise * 2;
    }
  });

  /*
[vector 3s]
*/
  structSize++;
  vector3s.forEach((Propertys, type) => {
    const byteSise = BinaryUtil.getTypedSize(type);
    for (let i = 0; i < Propertys.length; i++) {
      const Property = Propertys[i];
      indexMap[Property.id] = indexBufferIndex;
      indexBufferIndex = setIndexData(
        index,
        indexBufferIndex,
        structSize,
        0,
        Property.numberType,
        StructPropertyTypes.Vector3
      );
      structSize += byteSise * 3;
    }
  });

  /*
[vector 4s]
*/
  structSize++;
  vector4s.forEach((Propertys, type) => {
    const byteSise = BinaryUtil.getTypedSize(type);
    for (let i = 0; i < Propertys.length; i++) {
      const Property = Propertys[i];
      indexMap[Property.id] = indexBufferIndex;
      indexBufferIndex = setIndexData(
        index,
        indexBufferIndex,
        structSize,
        0,
        Property.numberType,
        StructPropertyTypes.Vector4
      );
      structSize += byteSise * 4;
    }
  });
  /*
[bit arrays]
*/
  structSize++;
  bitArrays.forEach((Property) => {
    const byteSise = Math.ceil(Property.length / 8) + 1;
    indexMap[Property.id] = indexBufferIndex;
    indexBufferIndex = setIndexData(
      index,
      indexBufferIndex,
      structSize,
      0,
      byteSise,
      StructPropertyTypes.BitArray
    );
    structSize += byteSise;
  });

  /*
[Create Remote Property Manager Data]
*/
  const remoteData: BinaryStructData = {
    bufferSize: structSize * structArrayIndexes,
    buffer: new ArrayBuffer(0),
    indexBuffer,
    indexMap,
    propertyDefaults,
    structSize,
    structArrayIndexes,
  };
  return remoteData;
}
