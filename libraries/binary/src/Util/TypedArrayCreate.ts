import { BinaryNumberTypes } from "../Constants/BinaryTypes";
import { TypedArrays } from "./TypedArrays";

export const TypedArrayCreate: Record<
  BinaryNumberTypes,
  (length: number, sharedMemory?: boolean) => TypedArrays
> = {
  [BinaryNumberTypes.Int8]: (length, sharedMemory = false) =>
    new Int8Array(
      sharedMemory
        ? new SharedArrayBuffer(length * Int8Array.BYTES_PER_ELEMENT)
        : new ArrayBuffer(length * Int8Array.BYTES_PER_ELEMENT)
    ),
  [BinaryNumberTypes.Uint8]: (length, sharedMemory = false) =>
    new Uint8Array(
      sharedMemory
        ? new SharedArrayBuffer(length * Uint8Array.BYTES_PER_ELEMENT)
        : new ArrayBuffer(length * Uint8Array.BYTES_PER_ELEMENT)
    ),
  [BinaryNumberTypes.Uint8Clamped]: (length, sharedMemory = false) =>
    new Uint8ClampedArray(
      sharedMemory
        ? new SharedArrayBuffer(length * Uint8ClampedArray.BYTES_PER_ELEMENT)
        : new ArrayBuffer(length * Uint8ClampedArray.BYTES_PER_ELEMENT)
    ),
  [BinaryNumberTypes.Int16]: (length, sharedMemory = false) =>
    new Int16Array(
      sharedMemory
        ? new SharedArrayBuffer(length * Int16Array.BYTES_PER_ELEMENT)
        : new ArrayBuffer(length * Int16Array.BYTES_PER_ELEMENT)
    ),
  [BinaryNumberTypes.Uint16]: (length, sharedMemory = false) =>
    new Uint16Array(
      sharedMemory
        ? new SharedArrayBuffer(length * Uint16Array.BYTES_PER_ELEMENT)
        : new ArrayBuffer(length * Uint16Array.BYTES_PER_ELEMENT)
    ),
  [BinaryNumberTypes.Int32]: (length, sharedMemory = false) =>
    new Int32Array(
      sharedMemory
        ? new SharedArrayBuffer(length * Int32Array.BYTES_PER_ELEMENT)
        : new ArrayBuffer(length * Int32Array.BYTES_PER_ELEMENT)
    ),
  [BinaryNumberTypes.Uint32]: (length, sharedMemory = false) =>
    new Uint32Array(
      sharedMemory
        ? new SharedArrayBuffer(length * Uint32Array.BYTES_PER_ELEMENT)
        : new ArrayBuffer(length * Uint32Array.BYTES_PER_ELEMENT)
    ),
  [BinaryNumberTypes.Float32]: (length, sharedMemory = false) =>
    new Float32Array(
      sharedMemory
        ? new SharedArrayBuffer(length * Float32Array.BYTES_PER_ELEMENT)
        : new ArrayBuffer(length * Float32Array.BYTES_PER_ELEMENT)
    ),
  [BinaryNumberTypes.Float64]: (length, sharedMemory = false) =>
    new Float64Array(
      sharedMemory
        ? new SharedArrayBuffer(length * Float64Array.BYTES_PER_ELEMENT)
        : new ArrayBuffer(length * Float64Array.BYTES_PER_ELEMENT)
    ),
  [BinaryNumberTypes.BigInt]: (length, sharedMemory = false) =>
    new BigInt64Array(
      sharedMemory
        ? new SharedArrayBuffer(length * BigInt64Array.BYTES_PER_ELEMENT)
        : new ArrayBuffer(length * BigInt64Array.BYTES_PER_ELEMENT)
    ),
  [BinaryNumberTypes.BigUint]: (length, sharedMemory = false) =>
    new BigUint64Array(
      sharedMemory
        ? new SharedArrayBuffer(length * BigUint64Array.BYTES_PER_ELEMENT)
        : new ArrayBuffer(length * BigUint64Array.BYTES_PER_ELEMENT)
    ),
};
