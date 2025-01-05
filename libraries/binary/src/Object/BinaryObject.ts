import { TypedNodes } from "./TypedNodes.js";
import { TypedNode } from "./Classes/TypedNode.js";
import { BufferToObject } from "./Functions/BufferToObject.js";
import { ObjectToTypedNodes } from "./Functions/ObjectToTypedNodes.js";
import { TypedNodesToBuffer } from "./Functions/TypedNodesToBuffer.js";

export class BinaryObject {
  static nodes = TypedNodes;

  static setUseSharedMemory(useSharedMemory: boolean) {
    BufferToObject.setUseSharedMemory(useSharedMemory);
  }

  static bufferToObject<T>(
    buffer: ArrayBufferLike,
    byteOffSet: number = 0,
    byteLength: number = 0
  ) {
    return BufferToObject.toObject<T>(buffer, byteOffSet, byteLength);
  }

  static objectToBuffer(obj: any) {
    return ObjectToTypedNodes.toBuffer(obj);
  }

  static objectToTypedNodes(object: any) {
    return ObjectToTypedNodes.tokTypedNodes(object);
  }

  static typedNodeToBuffer(data: TypedNode<any>) {
    return TypedNodesToBuffer.toBuffer(data);
  }

  static bufferToTypedNodes<T>(
    buffer: ArrayBufferLike,
    byteOffSet: number = 0,
    byteLength: number = 0
  ): TypedNode<T> {
    return BufferToObject.toTypedNodes(buffer, byteOffSet, byteLength);
  }
}
