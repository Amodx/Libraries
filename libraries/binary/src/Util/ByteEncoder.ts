import { BinaryNumberTypes, MappedByteCounts } from "../Constants/BinaryTypes";
import { ByteDataSet } from "./ByteDataSet";

export class ByteEncoder {
  static view = new DataView(new ArrayBuffer(8));
  static count = 0;
  static value = 0;
  static setValue(type: BinaryNumberTypes, value: number) {
    this.value = value;
    ByteDataSet[type](this.view, 0, value);
    this.count = MappedByteCounts[type];
    return this;
  }
  static addBytes(data: number[]) {
    for (let i = 0; i < this.count; i++) {
      data.push(this.view.getUint8(i));
    }
  }
}
