import type {
  BinaryPropertySchema,
  BinaryPropertyNodes,
} from "../Types/BinaryStructSchema.types";
import type { BinaryStructData } from "../Types/BinaryStructData.types";
import { BinraryStructBase } from "./BinraryStructBase";
import { CreateIndex } from "../Functions/CreateIndex";

type PropertyManagerInitData = {
  indexBufferMode?: "normal" | "shared";
  numberOfIndexes?: number;
};

export class BinaryStruct extends BinraryStructBase {
  properties: BinaryPropertyNodes[] = [];


  constructor(public id: string) {
    super(id);
  }

  registerProperty(...PropertyData: BinaryPropertyNodes[]) {
    PropertyData.forEach((_) => this.properties.push(_));
  }
  init(initData?: PropertyManagerInitData): BinaryStructData {
    const data = CreateIndex(
      this.properties,
      initData?.numberOfIndexes,
      initData?.indexBufferMode == "shared"
    );
    this.structData = data;
    this.data = new DataView(data.buffer);
    this.index = new DataView(data.indexBuffer);
    this.indexMap = data.indexMap;
    this.structArrayIndexes = data.structArrayIndexes;
    this.structSize = data.structSize;
    return data;
  }
}
