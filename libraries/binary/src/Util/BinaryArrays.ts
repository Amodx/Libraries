import { BinaryUtil } from "./BinaryUtil";

export class BinaryArrays {
  static getBitArrayIndexView(
    data: DataView,
    byteOffset: number,
    arrayIndex: number
  ) {
    const arrayByteIndex = (arrayIndex / 8) >> 0;
    const arrayBitIndex = arrayIndex - arrayByteIndex * 8;
    const arrayByte = data.getUint8(arrayByteIndex + byteOffset);
    return BinaryUtil.getBitValue(arrayByte, arrayBitIndex, 1);
  }

  static setBitArrayIndexView(
    data: DataView,
    byteOffset: number,
    arrayIndex: number,
    value: number
  ) {
    const arrayByteIndex = (arrayIndex / 8) >> 0;
    const arrayBitIndex = arrayIndex - arrayByteIndex * 8;
    const arrayByte = data.getUint8(arrayByteIndex + byteOffset);
    data.setUint8(
      arrayByteIndex + byteOffset,
      BinaryUtil.setBitValue(arrayByte, arrayBitIndex, value, 1)
    );
  }

  static getBitArrayIndex(
    data: Uint8Array,
    byteOffset: number,
    arrayIndex: number
  ) {
    const arrayByteIndex = (arrayIndex / 8) >> 0;
    const arrayBitIndex = arrayIndex - arrayByteIndex * 8;
    const arrayByte = data[arrayByteIndex + byteOffset];
    return BinaryUtil.getBitValue(arrayByte, arrayBitIndex, 1);
  }

  static setBitArrayIndex(
    data: Uint8Array,
    byteOffset: number,
    arrayIndex: number,
    value: number
  ) {
    const arrayByteIndex = (arrayIndex / 8) >> 0;
    const arrayBitIndex = arrayIndex - arrayByteIndex * 8;
    const arrayByte = data[arrayByteIndex + byteOffset];
    data[arrayByteIndex + byteOffset] = BinaryUtil.setBitValue(
      arrayByte,
      arrayBitIndex,
      value,
      1
    );
  }

  static getNibbleArrayIndex(
    data: DataView,
    byteOffset: number,
    arrayIndex: number
  ) {
    const arrayByteIndex = (arrayIndex / 2) >> 0;
    const isHighNibble = arrayIndex % 2 === 0;
    const arrayByte = data.getUint8(arrayByteIndex + byteOffset);
    return BinaryUtil.getBitValue(arrayByte, isHighNibble ? 4 : 0, 4);
  }

  static setNibbleArrayIndex(
    data: DataView,
    byteOffset: number,
    arrayIndex: number,
    value: number
  ) {
    const arrayByteIndex = (arrayIndex / 2) >> 0;
    const isHighNibble = arrayIndex % 2 === 0;
    const arrayByte = data.getUint8(arrayByteIndex + byteOffset);
    data.setUint8(
      arrayByteIndex + byteOffset,
      BinaryUtil.setBitValue(arrayByte, isHighNibble ? 4 : 0, value, 4)
    );
  }

  static getHalfNibbleArrayIndex(
    data: DataView,
    byteOffset: number,
    arrayIndex: number
  ) {
    const arrayByteIndex = (arrayIndex / 4) >> 0;
    const nibbleIndex = arrayIndex % 4;
    const arrayByte = data.getUint8(arrayByteIndex + byteOffset);
    return BinaryUtil.getBitValue(arrayByte, nibbleIndex * 2, 2);
  }

  static setHalfNibbleArrayIndex(
    data: DataView,
    byteOffset: number,
    arrayIndex: number,
    value: number
  ) {
    const arrayByteIndex = (arrayIndex / 4) >> 0;
    const nibbleIndex = arrayIndex % 4;
    const arrayByte = data.getUint8(arrayByteIndex + byteOffset);
    data.setUint8(
      arrayByteIndex + byteOffset,
      BinaryUtil.setBitValue(arrayByte, nibbleIndex * 2, value, 2)
    );
  }
}
