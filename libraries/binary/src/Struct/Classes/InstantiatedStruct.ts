export interface InstantiatedStruct<Properties> {}

export class InstantiatedStruct<Properties> {
  structByteOffSet = 0;
  structSize = 0;
  structArrayIndexes = 0;
  structArrayIndex = 0;
  structData: DataView;

  setData(view: DataView) {
    this.structData = view;
  }
  setBuffer(buffer: ArrayBuffer | SharedArrayBuffer) {
    this.structData = new DataView(buffer);
  }

  setIndex(index: number) {
    this.structArrayIndex = index;
    this.structByteOffSet = index * this.structSize;
  }

  clone(): InstantiatedStruct<Properties> & Properties {
    throw new Error("Not implemented");
  }
  setDefaults(): void {
    throw new Error("Not implemented");
  }
}
