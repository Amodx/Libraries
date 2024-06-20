export interface InstantiatedStruct<Properties> {}

export class InstantiatedStruct<Properties> {
  byteOffSet = 0;
  structSize = 0;
  structArrayIndexes = 0;
  structArrayIndex = 0;
  data: DataView;

  setData(view: DataView) {
    this.data = view;
  }
  setBuffer(buffer: ArrayBuffer | SharedArrayBuffer) {
    this.data = new DataView(buffer);
  }

  setIndex(index: number) {
    this.structArrayIndex = index;
    this.byteOffSet = index * this.structSize;
  }

  clone(): InstantiatedStruct<Properties> & Properties {
    throw new Error("Not implemented");
  }
}
