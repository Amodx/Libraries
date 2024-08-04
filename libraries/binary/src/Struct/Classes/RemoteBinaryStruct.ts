import type { BinaryStructData } from "../Types/BinaryStructData.types.js";
import { BinraryStructBase } from "./BinraryStructBase.js";

export class RemoteBinaryStruct extends BinraryStructBase {
  constructor(public id: string) {
    super(id);
  }
  init(data: BinaryStructData) {
    this.structData = data;
    this.data = new DataView(data.buffer);
    this.index = new DataView(data.indexBuffer);
    this.indexMap = data.indexMap;
    this.structArrayIndexes = data.structArrayIndexes;
    this.structSize = data.structSize;
  }
}
