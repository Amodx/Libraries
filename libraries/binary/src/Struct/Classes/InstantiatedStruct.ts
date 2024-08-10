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

  serialize(): Properties {
    throw new Error("Not implemented");
  }
  deserialize(data:Properties) {
    throw new Error("Not implemented");
  }
  createClone(): InstantiatedStruct<Properties> & Properties {
    throw new Error("Not implemented");
  }
  setDefaults(): void {
    throw new Error("Not implemented");
  }
  getKeys(): string[] {
    throw new Error("Not implemented");
  }
}
