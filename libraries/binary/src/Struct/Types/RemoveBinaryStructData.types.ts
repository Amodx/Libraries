import { BufferTypes } from "../../Util/BufferTypes";

export type RemoteBinaryStructData = {
  buffer: BufferTypes;
  bufferSize: number;
  indexBuffer: BufferTypes;
  indexMap: Map<string, number>;
  structArrayLength: number;
  structSize: number;
};
