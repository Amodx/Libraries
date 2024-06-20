import { BinaryNumberTypes } from "../Constants/BinaryTypes";
import { TypedArrayClasses } from "./TypedArrays";

export const TypedArrayClassMap: Record<BinaryNumberTypes, TypedArrayClasses> =
  {
    [BinaryNumberTypes.Int8]: Int8Array,
    [BinaryNumberTypes.Uint8]: Uint8Array,
    [BinaryNumberTypes.Uint8Clamped]: Uint8ClampedArray,
    [BinaryNumberTypes.Int16]: Int16Array,
    [BinaryNumberTypes.Uint16]: Uint16Array,
    [BinaryNumberTypes.Float32]: Float32Array,
    [BinaryNumberTypes.Int32]: Int32Array,
    [BinaryNumberTypes.Uint32]: Uint32Array,
    [BinaryNumberTypes.Float64]: Float64Array,
    [BinaryNumberTypes.BigInt]: BigInt64Array,
    [BinaryNumberTypes.BigUint]: BigUint64Array,
  };

export const TypedArrayClassRecord = new Map<
  TypedArrayClasses,
  BinaryNumberTypes
>([
  [Int8Array, BinaryNumberTypes.Int8],
  [Uint8Array, BinaryNumberTypes.Uint8],
  [Uint8ClampedArray, BinaryNumberTypes.Uint8Clamped],
  [Int16Array, BinaryNumberTypes.Int16],
  [Uint16Array, BinaryNumberTypes.Uint16],
  [Int32Array, BinaryNumberTypes.Int32],
  [Uint32Array, BinaryNumberTypes.Uint32],
  [Float32Array, BinaryNumberTypes.Float32],
  [Float64Array, BinaryNumberTypes.Float64],
  [BigInt64Array, BinaryNumberTypes.BigInt],
  [BigUint64Array, BinaryNumberTypes.BigUint],
]);
