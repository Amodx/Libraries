import { BinaryNumberTypes } from "../../Constants/BinaryTypes.js";
import {
  BinaryObjectMarkers,
  
  MappedMarkertoPrimitive,
} from "../Constants/BinaryObjectMarkers.js";

export class TypedNode<T> {
  data: [
    type: BinaryObjectMarkers,
    listType: BinaryNumberTypes,
    length: number,
    value: T
  ];
  get length() {
    return this.data[2];
  }
  get marker() {
    return this.data[0];
  }
  get numberType(): BinaryNumberTypes | undefined {
    return MappedMarkertoPrimitive[this.marker];
  }
  get listType() {
    return this.data[1];
  }
  get value() {
    return this.data[3];
  }
  set value(data: T) {
    this.data[3] = data;
  }

  constructor(marker: BinaryObjectMarkers, value: T, listType = 0, length = 0) {
    this.data = [marker, listType, length, value];
  }
}
