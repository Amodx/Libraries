import { BufferTypes } from "../../Util/BufferTypes";

export type BinaryStructData = {
  buffer: BufferTypes;
  bufferSize: number;
  indexBuffer: BufferTypes;
  indexMap: Map<string, number>;
  structArrayIndexes: number;
  structSize: number;
};
