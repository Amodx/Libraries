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

  static getBitValue(data: number, index: number, bitSize: number) {
    index *= bitSize;
    const mask = 2 ** bitSize - 1;
    return ((mask << index) & data) >>> index;
  }
  static setBitValue(
    data: number,
    index: number,
    value: number,
    bitSize: number
  ) {
    index *= bitSize;
    const mask = 2 ** bitSize - 1;
    return (data & ~(mask << index)) | ((value & mask) << index);
  }

  static getBitArrayIndex(
    data: DataView,
    byteIndex: number,
    arrayIndex: number
  ) {
    const arrayByteIndex = (arrayIndex / 8) >> 0;
    const arrayBitIndex = arrayIndex - arrayByteIndex * 8;
    const arrayByte = data.getUint8(arrayByteIndex + byteIndex);
    return this.getBitValue(arrayByte, arrayBitIndex, 1);
  }

  static setBitArrayIndex(
    data: DataView,
    byteIndex: number,
    arrayIndex: number,
    value: number
  ) {
    const arrayByteIndex = (arrayIndex / 8) >> 0;
    const arrayBitIndex = arrayIndex - arrayByteIndex * 8;
    const arrayByte = data.getUint8(arrayByteIndex + byteIndex);
    data.setUint8(
      arrayByteIndex + byteIndex,
      this.setBitValue(arrayByte, arrayBitIndex, value, 1)
    );
  }
}
