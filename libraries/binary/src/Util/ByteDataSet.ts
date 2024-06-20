import { BinaryNumberTypes } from "../Constants/BinaryTypes";

export const ByteDataSet: Record<
  BinaryNumberTypes,
  (dv: DataView, index: number, value: number | bigint) => void
> = {
  [BinaryNumberTypes.Int8]: (dv, index, value) =>
    dv.setInt8(index, value as number),
  [BinaryNumberTypes.Uint8]: (dv, index, value) =>
    dv.setUint8(index, value as number),
  [BinaryNumberTypes.Uint8Clamped]: (dv, index, value) =>
    dv.setUint8(index, value as number),
  [BinaryNumberTypes.Int16]: (dv, index, value) =>
    dv.setInt16(index, value as number, true),
  [BinaryNumberTypes.Uint16]: (dv, index, value) =>
    dv.setUint16(index, value as number, true),
  [BinaryNumberTypes.Float32]: (dv, index, value) =>
    dv.setFloat32(index, value as number, true),
  [BinaryNumberTypes.Int32]: (dv, index, value) =>
    dv.setInt32(index, value as number, true),
  [BinaryNumberTypes.Uint32]: (dv, index, value) =>
    dv.setUint32(index, value as number, true),
  [BinaryNumberTypes.Float64]: (dv, index, value) =>
    dv.setFloat64(index, value as number, true),
  [BinaryNumberTypes.BigInt]: (dv, index, value) =>
    dv.setBigInt64(index, value as bigint, true),
  [BinaryNumberTypes.BigUint]: (dv, index, value) =>
    dv.setBigUint64(index, value as bigint, true),
};
