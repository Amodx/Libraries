import { RemoteBinaryStruct } from "./Classes/RemoteBinaryStruct.js";
import { BinaryStruct } from "./Classes/BinaryStruct.js";
export class BinaryTags {
  static createTagManager(id: string) {
    return new BinaryStruct(id);
  }
  static createRemoteTagManager(id: string) {
    return new RemoteBinaryStruct(id);
  }
}
