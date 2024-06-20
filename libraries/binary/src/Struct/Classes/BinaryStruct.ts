import type {
  BinaryBooleanProperty,
  BinaryNumberProperty,
  BinaryTypedNumberProperty,
  BinaryPropertySchema,
  BinaryPropertyNodes,
  BinaryTypedNumberArrayProperty,
  BinaryHeaderProperty,
  BinaryBitArrayProperty,
} from "../Types/BinaryStructSchema.types";
import type { RemoteBinaryStructData } from "../Types/RemoveBinaryStructData.types";
import { BinaryUtil } from "../../Util/BinaryUtil.js";
import { BinraryStructBase } from "./BinraryStructBase";
import { BinaryNumberTypes, ByteCounts } from "../../Constants/BinaryTypes";
import { StructPropertyTypes } from "../Constants/StructPropertyTypes";

type PropertyManagerInitData = {
  indexBufferMode?: "normal" | "shared";
  numberOfIndexes?: number;
};
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

export class BinaryStruct extends BinraryStructBase {
  schema: BinaryPropertySchema = new Map();

  initData = <RemoteBinaryStructData>{};

  constructor(public id: string) {
    super(id);
  }

  registerProperty(...PropertyData: BinaryPropertyNodes[]) {
    PropertyData.forEach((_) => this.schema.set(_.id, _));
  }
  init(initData?: PropertyManagerInitData): RemoteBinaryStructData {
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
    const bitArrays: BinaryBitArrayProperty[] = [];
    this.schema.forEach((Property) => {
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
      if (Property.type == "bit-array") {
        bitArrays.push(Property);
      }
    });

    /*
[Build Index]
*/
    const indexSize = this.schema.size * PropertyIndexSize;
    let indexBuffer = new ArrayBuffer(indexSize);
    if (initData?.indexBufferMode == "shared") {
      indexBuffer = new SharedArrayBuffer(indexSize);
    }
    const index = new DataView(indexBuffer);

    this.index = index;
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
        this.indexMap.set(Property.id, indexBufferIndex);
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
      this.indexMap.set(bool.id, indexBufferIndex);
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
        this.indexMap.set(Property.id, indexBufferIndex);
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
        this.indexMap.set(Property.id, indexBufferIndex);
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
    byteIndex++;
    bitArrays.forEach((Property) => {
      const byteSise = Math.ceil(Property.length / 8) + 1;
      this.indexMap.set(Property.id, indexBufferIndex);
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
    let numberOfIndexes = 1;
    if (initData?.numberOfIndexes) {
      numberOfIndexes = initData.numberOfIndexes;
    }
    this.structArrayIndexes = numberOfIndexes;
    this.structSize = byteIndex;
    const remoteData: RemoteBinaryStructData = {
      bufferSize: byteIndex * numberOfIndexes,
      buffer: new ArrayBuffer(0),
      indexBuffer: indexBuffer,
      indexMap: this.indexMap,
      structSize: this.structSize,
      structArrayLength: numberOfIndexes,
    };
    this.initData = remoteData;
    return remoteData;
  }
}
