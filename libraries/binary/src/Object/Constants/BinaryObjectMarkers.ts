import { BinaryNumberTypes } from "../../Constants/BinaryTypes";
export enum BinaryObjectMarkers {
  Name,
  Object,
  ObjectEnd,
  Array,
  ArrayEnd,
  Int8,
  Uint8,
  Uint8Clamped,
  Int16,
  Uint16,
  Float32,
  Int32,
  Uint32,
  Float64,
  BigInt,
  BigUint,
  String,
  Boolean,
  Undefined,
  ArrayBuffer,
  TypedArray,
  Json,
  Blob,
}

export const MappedMarkertoPrimitive: Partial<
  Record<BinaryObjectMarkers, BinaryNumberTypes>
> = {
  [BinaryObjectMarkers.Int8]: BinaryNumberTypes.Int8,
  [BinaryObjectMarkers.Uint8]: BinaryNumberTypes.Uint8,
  [BinaryObjectMarkers.Uint8Clamped]: BinaryNumberTypes.Uint8Clamped,
  [BinaryObjectMarkers.Int16]: BinaryNumberTypes.Int16,
  [BinaryObjectMarkers.Uint16]: BinaryNumberTypes.Uint16,
  [BinaryObjectMarkers.Float32]: BinaryNumberTypes.Float32,
  [BinaryObjectMarkers.Int32]: BinaryNumberTypes.Int32,
  [BinaryObjectMarkers.Uint32]: BinaryNumberTypes.Uint32,
  [BinaryObjectMarkers.Float64]: BinaryNumberTypes.Float64,
  [BinaryObjectMarkers.BigInt]: BinaryNumberTypes.BigInt,
  [BinaryObjectMarkers.BigUint]: BinaryNumberTypes.BigUint,
};
