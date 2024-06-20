import type { RemoteBinaryStructData } from "../Types/RemoveBinaryStructData.types.js";
import { BinraryStructBase } from "./BinraryStructBase.js";

export class RemoteBinaryStruct extends BinraryStructBase {
  initData: RemoteBinaryStructData;
  constructor(public id: string) {
    super(id);
  }
  init(data: RemoteBinaryStructData) {
    this.data = new DataView(data.buffer);
    this.index = new DataView(data.indexBuffer);
    this.indexMap = data.indexMap;
    this.structArrayIndexes = data.structArrayLength;
    this.structSize = data.structSize;
    this.initData = data;
  }
}
