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
import { SetIndexData } from "./GetIndexData";
const PropertyIndexSize = ByteCounts.Uint32 * 2 + ByteCounts.Uint8 * 3;

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
[Process properties]
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
      let properties = headers.get(property.numberType);
      if (!properties) {
        properties = [];
        headers.set(property.numberType, properties);
      }
      properties.push(property);
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
      let properties = typedNumbers.get(property.numberType);
      if (!properties) {
        properties = [];
        typedNumbers.set(property.numberType, properties);
      }
      properties.push(property);
    }
    if (property.type == "typed-number-array") {
      let arrayproperties = typedNumbersArrays.get(property.numberType);
      if (!arrayproperties) {
        arrayproperties = [];
        typedNumbersArrays.set(property.numberType, arrayproperties);
      }
      arrayproperties.push(property);
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
  headers.forEach((structProperties, type) => {
    const byteSise = BinaryUtil.getTypedSize(type);
    for (let i = 0; i < structProperties.length; i++) {
      const headerProperties = structProperties[i];
      indexMap[headerProperties.id] = indexBufferIndex;
      indexBufferIndex = SetIndexData(
        index,
        indexBufferIndex,
        structSize,
        0,
        headerProperties.numberType,
        0,
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
    const booleanProperty = booleans[i];
    indexMap[booleanProperty.id] = indexBufferIndex;
    indexBufferIndex = SetIndexData(
      index,
      indexBufferIndex,
      structSize,
      bitIndex,
      bitSize,
      0,
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
  typedNumbers.forEach((properties, type) => {
    const byteSise = BinaryUtil.getTypedSize(type);
    for (let i = 0; i < properties.length; i++) {
      const typedNumberProperty = properties[i];
      indexMap[typedNumberProperty.id] = indexBufferIndex;
      indexBufferIndex = SetIndexData(
        index,
        indexBufferIndex,
        structSize,
        0,
        typedNumberProperty.numberType,
        0,
        StructPropertyTypes.TypedNumber
      );
      structSize += byteSise;
    }
  });
  /*
[Typed Numbers Arrays]
*/
  structSize++;
  typedNumbersArrays.forEach((properties, type) => {
    const byteSise = BinaryUtil.getTypedSize(type);
    for (let i = 0; i < properties.length; i++) {
      const typedNumberArrayProperty = properties[i];
      indexMap[typedNumberArrayProperty.id] = indexBufferIndex;
      indexBufferIndex = SetIndexData(
        index,
        indexBufferIndex,
        structSize,
        0,
        typedNumberArrayProperty.numberType,
        typedNumberArrayProperty.length,
        StructPropertyTypes.TypedNumberArray
      );
      structSize += byteSise * typedNumberArrayProperty.length;
    }
  });

  /*
[vector 2s]
*/
  structSize++;
  vector2s.forEach((properties, type) => {
    const byteSise = BinaryUtil.getTypedSize(type);
    for (let i = 0; i < properties.length; i++) {
      const vector2Propeerty = properties[i];
      indexMap[vector2Propeerty.id] = indexBufferIndex;
      indexBufferIndex = SetIndexData(
        index,
        indexBufferIndex,
        structSize,
        0,
        vector2Propeerty.numberType,
        2,
        StructPropertyTypes.Vector2
      );
      structSize += byteSise * 2;
    }
  });

  /*
[vector 3s]
*/
  structSize++;
  vector3s.forEach((properties, type) => {
    const byteSise = BinaryUtil.getTypedSize(type);
    for (let i = 0; i < properties.length; i++) {
      const Property = properties[i];
      indexMap[Property.id] = indexBufferIndex;
      indexBufferIndex = SetIndexData(
        index,
        indexBufferIndex,
        structSize,
        0,
        Property.numberType,
        3,
        StructPropertyTypes.Vector3
      );
      structSize += byteSise * 3;
    }
  });

  /*
[vector 4s]
*/
  structSize++;
  vector4s.forEach((properties, type) => {
    const byteSise = BinaryUtil.getTypedSize(type);
    for (let i = 0; i < properties.length; i++) {
      const Property = properties[i];
      indexMap[Property.id] = indexBufferIndex;
      indexBufferIndex = SetIndexData(
        index,
        indexBufferIndex,
        structSize,
        0,
        Property.numberType,
        4,
        StructPropertyTypes.Vector4
      );
      structSize += byteSise * 4;
    }
  });
  /*
[bit arrays]
*/
  structSize++;
  bitArrays.forEach((properties) => {
    const byteSise = Math.ceil(properties.length / 8) + 1;
    indexMap[properties.id] = indexBufferIndex;
    indexBufferIndex = SetIndexData(
      index,
      indexBufferIndex,
      structSize,
      0,
      byteSise,
      properties.length,
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
