import { BinaryNumberTypes } from "../../Constants/BinaryTypes";
import { BinaryUtil } from "../../Util/BinaryUtil";

const StuctIndexData: [
  byteIndex: number,
  bitOffSet: number,
  bitSize: number,
  type: number
] = [0, 0, 0, 0];

export const GetIndexData = (data: DataView, indexBufferIndex: number) => {
  StuctIndexData[0] = data.getUint32(indexBufferIndex);
  indexBufferIndex += BinaryUtil.getTypedSize(BinaryNumberTypes.Uint32);
  StuctIndexData[1] = data.getUint8(indexBufferIndex);
  indexBufferIndex += BinaryUtil.getTypedSize(BinaryNumberTypes.Uint8);
  StuctIndexData[2] = data.getUint8(indexBufferIndex);
  indexBufferIndex += BinaryUtil.getTypedSize(BinaryNumberTypes.Uint8);
  StuctIndexData[3] = data.getUint8(indexBufferIndex);
  indexBufferIndex += BinaryUtil.getTypedSize(BinaryNumberTypes.Uint8);
  return StuctIndexData;
};
