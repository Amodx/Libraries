import { BinaryNumberTypes, ByteCounts } from "../../Constants/BinaryTypes";
import { BinaryUtil } from "../../Util/BinaryUtil";

const StuctIndexData: [
  byteIndex: number,
  bitOffSet: number,
  bitSize: number,
  length: number,
  type: number
] = [0, 0, 0, 0, 0];

export const GetIndexData = (data: DataView, indexBufferIndex: number) => {
  StuctIndexData[0] = data.getUint32(indexBufferIndex);
  indexBufferIndex += BinaryUtil.getTypedSize(BinaryNumberTypes.Uint32);
  StuctIndexData[1] = data.getUint8(indexBufferIndex);
  indexBufferIndex += BinaryUtil.getTypedSize(BinaryNumberTypes.Uint8);
  StuctIndexData[2] = data.getUint8(indexBufferIndex);
  indexBufferIndex += BinaryUtil.getTypedSize(BinaryNumberTypes.Uint8);
  StuctIndexData[3] = data.getUint32(indexBufferIndex);
  indexBufferIndex += BinaryUtil.getTypedSize(BinaryNumberTypes.Uint32);
  StuctIndexData[4] = data.getUint8(indexBufferIndex);
  indexBufferIndex += BinaryUtil.getTypedSize(BinaryNumberTypes.Uint8);
  return StuctIndexData;
};

export const SetIndexData = (
  data: DataView,
  indexBufferIndex: number,
  byteIndex: number,
  bitOffSet: number,
  bitSize: number,
  length: number,
  type: number
) => {
  data.setUint32(indexBufferIndex, byteIndex);
  indexBufferIndex += ByteCounts.Uint32;
  data.setUint8(indexBufferIndex, bitOffSet);
  indexBufferIndex += ByteCounts.Uint8;
  data.setUint8(indexBufferIndex, bitSize);
  indexBufferIndex += ByteCounts.Uint8;
  data.setUint32(indexBufferIndex, length);
  indexBufferIndex += ByteCounts.Uint32;
  
  data.setUint8(indexBufferIndex, type);
  indexBufferIndex += ByteCounts.Uint8;
  return indexBufferIndex;
};
