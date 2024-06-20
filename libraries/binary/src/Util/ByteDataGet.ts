import { BinaryNumberTypes } from "../Constants/BinaryTypes";

export const ByteDataGet: Record<
  BinaryNumberTypes,
  (dv: DataView, index: number) => number
> = {
  [BinaryNumberTypes.Int8]: (dv, index) => dv.getInt8(index),
  [BinaryNumberTypes.Uint8]: (dv, index) => dv.getUint8(index),
  [BinaryNumberTypes.Uint8Clamped]: (dv, index) => dv.getUint8(index),
  [BinaryNumberTypes.Int16]: (dv, index) => dv.getInt16(index, true),
  [BinaryNumberTypes.Uint16]: (dv, index) => dv.getUint16(index, true),
  [BinaryNumberTypes.Float32]: (dv, index) => dv.getFloat32(index, true),
  [BinaryNumberTypes.Int32]: (dv, index) => dv.getInt32(index, true),
  [BinaryNumberTypes.Uint32]: (dv, index) => dv.getUint32(index, true),
  [BinaryNumberTypes.Float64]: (dv, index) => dv.getFloat64(index, true),
  [BinaryNumberTypes.BigInt]: (dv, index) => dv.getBigInt64(index, true) as any,
  [BinaryNumberTypes.BigUint]: (dv, index) =>
    dv.getBigUint64(index, true) as any,
};
