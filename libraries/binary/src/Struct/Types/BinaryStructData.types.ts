import { BufferTypes } from "../../Util/BufferTypes";

export type BinaryStructData = {
  buffer: BufferTypes;
  bufferSize: number;
  indexBuffer: BufferTypes;
  indexMap: Record<string, number>;
  propertyDefaults: Record<string, any>;
  structArrayIndexes: number;
  structSize: number;
};
