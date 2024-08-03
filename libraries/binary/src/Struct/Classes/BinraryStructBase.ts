import { BinaryUtil } from "../../Util/BinaryUtil.js";
import { StructPropertyTypes } from "../Constants/StructPropertyTypes.js";
import { BufferTypes } from "../../Util/BufferTypes.js";
import { InstantiatedStruct } from "./InstantiatedStruct.js";
import { GetIndexData } from "../../Struct/Functions/GetIndexData.js";
import { CreateInstance } from "../Functions/CreateInstance.js";
import { BinaryStructData } from "../Types/RemoveBinaryStructData.types.js";

export class BinraryStructBase {
  byteOffSet = 0;
  structSize = 0;
  structArrayIndexes = 0;
  structArrayIndex = 0;
  structData: BinaryStructData;
  data = new DataView(new ArrayBuffer(0));

  indexMap: Map<string, number> = new Map();
  index = new DataView(new ArrayBuffer(0));

  constructor(public id: string) {}

  setBuffer(data: BufferTypes | DataView) {
    if (data instanceof DataView) {
      this.data = data;
      return;
    }
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
    const byteIndex = this.indexMap.get(id);
    if (byteIndex === undefined) {
      throw new Error(`Tag with id: ${id} does not exist.`);
    }
    const indexData = GetIndexData(this.index, byteIndex);
    if (indexData[3] == StructPropertyTypes.Boolean) {
      return BinaryUtil.getBitValue(
        this.data.getUint8(indexData[0] + this.byteOffSet),
        indexData[1],
        indexData[2]
      );
    }
    if (indexData[3] == StructPropertyTypes.TypedNumber) {
      return BinaryUtil.getTypedNumber(
        this.data,
        indexData[0] + this.byteOffSet,
        indexData[2]
      );
    }
    return -Infinity;
  }

  setProperty(id: string, value: number) {
    const byteIndex = this.indexMap.get(id);

    if (byteIndex === undefined) {
      throw new Error(`Tag with id: ${id} does not exist.`);
    }
    const indexData = GetIndexData(this.index, byteIndex);

    if (indexData[3] == StructPropertyTypes.Boolean) {
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
    if (indexData[3] == StructPropertyTypes.TypedNumber) {
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
    const byteIndex = this.indexMap.get(id);
    if (byteIndex === undefined) {
      throw new Error(`Tag with id: ${id} does not exist.`);
    }
    const indexData = GetIndexData(this.index, byteIndex);
    if (indexData[3] == StructPropertyTypes.TypedNumberArray) {
      return BinaryUtil.getTypedNumber(
        this.data,
        indexData[0] +
          this.byteOffSet +
          index * BinaryUtil.getTypedSize(indexData[2]),
        indexData[2]
      );
    }
    if (indexData[3] == StructPropertyTypes.BitArray) {
      return BinaryUtil.getBitArrayIndex(
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
    const byteIndex = this.indexMap.get(id);
    if (byteIndex === undefined) {
      throw new Error(`Tag with id: ${id} does not exist.`);
    }
    const indexData = GetIndexData(this.index, byteIndex);
    if (indexData[3] == StructPropertyTypes.TypedNumberArray) {
      return (
        indexData[0] +
        this.byteOffSet +
        index * BinaryUtil.getTypedSize(indexData[2])
      );
    }
    return -Infinity;
  }

  setArrayPropertyValue(id: string, index: number, value: number) {
    const byteIndex = this.indexMap.get(id);
    if (byteIndex === undefined) {
      throw new Error(`Tag with id: ${id} does not exist.`);
    }
    const indexData = GetIndexData(this.index, byteIndex);
    if (indexData[3] == StructPropertyTypes.TypedNumberArray) {
      return BinaryUtil.setTypedNumber(
        this.data,
        indexData[0] +
          this.byteOffSet +
          index * BinaryUtil.getTypedSize(indexData[2]),
        indexData[2],
        value
      );
    }
    if (indexData[3] == StructPropertyTypes.BitArray) {
      return BinaryUtil.setBitArrayIndex(
        this.data,
        indexData[0] + this.byteOffSet,
        index,
        value
      );
    }
    return -Infinity;
  }

  loopThroughProperties(run: (id: string, value: number) => void) {
    this.indexMap.forEach((i, id) => {
      run(id, this.getProperty(id));
    });
  }
  loopThroughIndex(run: (data: number[]) => void) {
    this.indexMap.forEach((index, id) => {
      const indexData = GetIndexData(this.index, index);
      run(indexData);
    });
  }
  loopThroughAllIndexAndProperties(
    run: (id: string, value: number, index: number) => void
  ) {
    for (let index = 0; index < this.structArrayIndexes; index++) {
      this.setStructArrayIndex(index);
      this.indexMap.forEach((i, id) => {
        run(id, this.getProperty(id), index);
      });
    }
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
