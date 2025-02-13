import { BinaryUtil } from "../../Util/BinaryUtil.js";
import { StructPropertyTypes } from "../Constants/StructPropertyTypes.js";
import { BufferTypes } from "../../Util/BufferTypes.js";
import { InstantiatedStruct } from "./InstantiatedStruct.js";
import { GetIndexData } from "../../Struct/Functions/GetIndexData.js";
import { CreateInstance } from "../Functions/CreateInstance.js";
import { BinaryStructData } from "../Types/BinaryStructData.types.js";
import { BinaryArrays } from "../../Util/BinaryArrays.js";

export class BinraryStructBase {
  byteOffSet = 0;
  structSize = 0;
  structArrayIndexes = 0;
  structArrayIndex = 0;
  structData: BinaryStructData;
  data = new DataView(new ArrayBuffer(0));

  indexMap: Record<string, number> = {};
  index = new DataView(new ArrayBuffer(0));

  constructor(public id: string) {}

  setData(data: DataView) {
    this.data = data;
  }

  setBuffer(data: BufferTypes) {
    this.data = new DataView(data);
  }

  getBuffer() {
    if (this.data instanceof DataView) {
      return this.data.buffer;
    }
    return this.data;
  }

  setStructArrayIndex(index: number) {
    this.structArrayIndex = index;
    this.byteOffSet = index * this.structSize;
  }

  getProperty(id: string): number {
    const byteIndex = this.indexMap[id];
    if (byteIndex === undefined) {
      throw new Error(`Tag with id: ${id} does not exist.`);
    }
    const indexData = GetIndexData(this.index, byteIndex);
    if (indexData[4] == StructPropertyTypes.Boolean) {
      return BinaryUtil.getBitValue(
        this.data.getUint8(indexData[0] + this.byteOffSet),
        indexData[1],
        indexData[2]
      );
    }
    if (indexData[4] == StructPropertyTypes.TypedNumber) {
      return BinaryUtil.getTypedNumber(
        this.data,
        indexData[0] + this.byteOffSet,
        indexData[2]
      );
    }
    return -Infinity;
  }

  setProperty(id: string, value: number) {
    const byteIndex = this.indexMap[id];

    if (byteIndex === undefined) {
      throw new Error(`Tag with id: ${id} does not exist.`);
    }
    const indexData = GetIndexData(this.index, byteIndex);

    if (indexData[4] == StructPropertyTypes.Boolean) {
      this.data.setUint8(
        indexData[0] + this.byteOffSet,
        BinaryUtil.setBitValue(
          this.data.getUint8(indexData[0] + this.byteOffSet),
          indexData[1],
          value,
          indexData[2]
        )
      );
      return true;
    }
    if (indexData[4] == StructPropertyTypes.TypedNumber) {
      BinaryUtil.setTypedNumber(
        this.data,
        indexData[0] + this.byteOffSet,
        indexData[2],
        value
      );
      return true;
    }
    return false;
  }

  getArrayPropertyValue(id: string, index: number) {
    const byteIndex = this.indexMap[id];
    if (byteIndex === undefined) {
      throw new Error(`Tag with id: ${id} does not exist.`);
    }
    const indexData = GetIndexData(this.index, byteIndex);
    if (indexData[4] == StructPropertyTypes.TypedNumberArray) {
      return BinaryUtil.getTypedNumber(
        this.data,
        indexData[0] +
          this.byteOffSet +
          index * BinaryUtil.getTypedSize(indexData[2]),
        indexData[2]
      );
    }
    if (indexData[4] == StructPropertyTypes.BitArray) {
      return BinaryArrays.getBitArrayIndexView(
        this.data,
        indexData[0] + this.byteOffSet,
        index
      );
    }
    throw new Error(`Tag with id: ${id} is not an array.`);
  }

  /**## getArrayTagByteIndex
   *  Get the actual byte index for the provided index of the array.
   * @param id
   * @param index
   * @returns
   */
  getArrayPropertyByteIndex(id: string, index: number) {
    const byteIndex = this.indexMap[id];
    if (byteIndex === undefined) {
      throw new Error(`Tag with id: ${id} does not exist.`);
    }
    const indexData = GetIndexData(this.index, byteIndex);
    if (indexData[4] == StructPropertyTypes.TypedNumberArray) {
      return (
        indexData[0] +
        this.byteOffSet +
        index * BinaryUtil.getTypedSize(indexData[2])
      );
    }
    return -Infinity;
  }

  setArrayPropertyValue(id: string, index: number, value: number) {
    const byteIndex = this.indexMap[id];
    if (byteIndex === undefined) {
      throw new Error(`Tag with id: ${id} does not exist.`);
    }
    const indexData = GetIndexData(this.index, byteIndex);
    if (indexData[4] == StructPropertyTypes.TypedNumberArray) {
      return BinaryUtil.setTypedNumber(
        this.data,
        indexData[0] +
          this.byteOffSet +
          index * BinaryUtil.getTypedSize(indexData[2]),
        indexData[2],
        value
      );
    }
    if (indexData[4] == StructPropertyTypes.BitArray) {
      return BinaryArrays.setBitArrayIndexView(
        this.data,
        indexData[0] + this.byteOffSet,
        index,
        value
      );
    }
    return -Infinity;
  }

  /**## instantiate
   * Creates an object to read/write to the struct buffer.
   * @param structArrayIndex - Default is the current index.
   * @returns
   */
  instantiate<T extends any>(): T & InstantiatedStruct<T> {
    const instance = CreateInstance<T>(this.structData);
    instance.setBuffer(this.getBuffer());
    instance.setIndex(this.structArrayIndex);
    return instance;
  }
}
