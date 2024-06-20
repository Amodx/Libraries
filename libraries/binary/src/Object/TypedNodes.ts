import { TypedNode } from "./Classes/TypedNode.js";
import { BinaryNumberTypes } from "../Constants/BinaryTypes.js";
import { BinaryObjectMarkers } from "./Constants/BinaryObjectMarkers.js";
import { TypedArrays } from "../Util/TypedArrays.js";

export class TypedNodes {
  static json<T>(data: T) {
    return new TypedNode<T>(BinaryObjectMarkers.Json, data);
  }

  static object<T>(data: T) {
    return new TypedNode<T>(BinaryObjectMarkers.Object, data);
  }

  static array<T>(data: T) {
    if (!Array.isArray(data))
      throw new Error("Data for array must be an array.");
    return new TypedNode<T>(BinaryObjectMarkers.Array, data);
  }

  static int8(value: number) {
    return new TypedNode<number>(BinaryObjectMarkers.Int8, value);
  }

  static uIint8(value: number) {
    return new TypedNode<number>(BinaryObjectMarkers.Uint8, value);
  }

  static int16(value: number) {
    return new TypedNode<number>(BinaryObjectMarkers.Int16, value);
  }

  static uint16(value: number) {
    return new TypedNode<number>(BinaryObjectMarkers.Uint16, value);
  }

  static uint32(value: number) {
    return new TypedNode<number>(BinaryObjectMarkers.Uint32, value);
  }

  static int32(value: number) {
    return new TypedNode<number>(BinaryObjectMarkers.Int32, value);
  }

  static float32(value: number) {
    return new TypedNode<number>(BinaryObjectMarkers.Float32, value);
  }

  static float64(value: number) {
    return new TypedNode<number>(BinaryObjectMarkers.Float64, value);
  }

  static bingInt(value: number) {
    return new TypedNode<number>(BinaryObjectMarkers.BigInt, value);
  }

  static bigUint(value: number) {
    return new TypedNode<number>(BinaryObjectMarkers.BigUint, value);
  }

  static boolean(value: boolean) {
    return new TypedNode<boolean>(BinaryObjectMarkers.Boolean, value);
  }

  static undefined() {
    return new TypedNode<undefined>(BinaryObjectMarkers.Undefined, undefined);
  }

  static arrayBuffer(value: ArrayBuffer|SharedArrayBuffer) {
    return new TypedNode<ArrayBuffer>(BinaryObjectMarkers.ArrayBuffer, value);
  }

  static typedArray(
    type: BinaryNumberTypes,
    value: number[] | ArrayBufferView
  ) {
    return new TypedNode<TypedArrays>(
      BinaryObjectMarkers.TypedArray,
      //@ts-ignore
      ArrayBuffer.isView(value) ? value : TypedArrayMap[type].from(value),
      type
    );
  }

  static string(value: string) {
    return new TypedNode<string>(BinaryObjectMarkers.String, value);
  }
}
