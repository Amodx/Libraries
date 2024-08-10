import { ByteDataGet } from "./ByteDataGet";
import { BinaryNumberTypes, MappedByteCounts } from "../Constants/BinaryTypes";
import { ByteDataSet } from "../Util/ByteDataSet";

export class BinaryUtil {
  static setTypedNumber(
    data: DataView,
    index: number,
    numberType: BinaryNumberTypes,
    value: number
  ) {
    return ByteDataSet[numberType](data, index, value);
  }
  static getTypedNumber(
    data: DataView,
    index: number,
    numberType: BinaryNumberTypes
  ) {
    return ByteDataGet[numberType](data, index);
  }
  static calculateBitsNeeded(min: number, max: number) {
    let range = max - min;
    return Math.ceil(Math.log2(range));
  }

  static getTypedSize(type: BinaryNumberTypes) {
    return MappedByteCounts[type];
  }

  static getBitValue(data: number, bitIndex: number, bitSize: number) {
    const mask = 2 ** bitSize - 1;
    return ((mask << bitIndex) & data) >>> bitIndex;
  }
  static setBitValue(
    data: number,
    bitIndex: number,
    value: number,
    bitSize: number
  ) {
    const mask = 2 ** bitSize - 1;
    return (data & ~(mask << bitIndex)) | ((value & mask) << bitIndex);
  }

}
