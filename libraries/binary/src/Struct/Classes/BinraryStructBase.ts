import { BinaryUtil } from "../../Util/BinaryUtil.js";
import { BinaryNumberTypes } from "../../Constants/BinaryTypes.js";
import { StructPropertyTypes } from "../Constants/StructPropertyTypes.js";
import { BufferTypes } from "../../Util/BufferTypes.js";
import { InstantiatedStruct } from "./InstantiatedStruct.js";

const StuctIndexData: [
  byteIndex: number,
  bitOffSet: number,
  bitSize: number,
  type: number
] = [0, 0, 0, 0];

const getIndexData = (data: DataView, indexBufferIndex: number) => {
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

export class BinraryStructBase {
  byteOffSet = 0;
  structSize = 0;
  structArrayIndexes = 0;
  structArrayIndex = 0;
  data = new DataView(new ArrayBuffer(0));

  indexMap: Map<string, number> = new Map();
  index = new DataView(new ArrayBuffer(0));

  constructor(public id: string) {}

  setBuffer(data: BufferTypes | DataView) {
    if (data instanceof DataView) {
      this.data = data;
      return;
    }
    this.data = new DataView(data);
  }

  getBuffer() {
    if (this.data instanceof DataView) {
      return this.data.buffer;
    }
    return this.data;
  }

  setStructArrayIndex(index: number) {
    this.structArrayIndex = index;
    this.byteOffSet = index * this.structSize;
  }

  getProperty(id: string): number {
    const byteIndex = this.indexMap.get(id);
    if (byteIndex === undefined) {
      throw new Error(`Tag with id: ${id} does not exist.`);
    }
    const indexData = getIndexData(this.index, byteIndex);
    if (indexData[3] == StructPropertyTypes.Boolean) {
      return BinaryUtil.getBitValue(
        this.data.getUint8(indexData[0] + this.byteOffSet),
        indexData[1],
        indexData[2]
      );
    }
    if (indexData[3] == StructPropertyTypes.TypedNumber) {
      return BinaryUtil.getTypedNumber(
        this.data,
        indexData[0] + this.byteOffSet,
        indexData[2]
      );
    }
    return -Infinity;
  }

  setProperty(id: string, value: number) {
    const byteIndex = this.indexMap.get(id);
    if (byteIndex === undefined) {
      throw new Error(`Tag with id: ${id} does not exist.`);
    }
    const indexData = getIndexData(this.index, byteIndex);
    if (indexData[3] == StructPropertyTypes.Boolean) {
      this.data.setUint8(
        indexData[0] + this.byteOffSet,
        BinaryUtil.setBitValue(
          this.data.getUint8(indexData[0] + this.byteOffSet),
          indexData[1],
          value,
          indexData[2]
        )
      );
      return true;
    }
    if (indexData[3] == StructPropertyTypes.TypedNumber) {
      BinaryUtil.setTypedNumber(
        this.data,
        indexData[0] + this.byteOffSet,
        indexData[2],
        value
      );
      return true;
    }
    return false;
  }

  getArrayPropertyValue(id: string, index: number) {
    const byteIndex = this.indexMap.get(id);
    if (byteIndex === undefined) {
      throw new Error(`Tag with id: ${id} does not exist.`);
    }
    const indexData = getIndexData(this.index, byteIndex);
    if (indexData[3] == StructPropertyTypes.TypedNumberArray) {
      return BinaryUtil.getTypedNumber(
        this.data,
        indexData[0] +
          this.byteOffSet +
          index * BinaryUtil.getTypedSize(indexData[2]),
        indexData[2]
      );
    }
    if (indexData[3] == StructPropertyTypes.BitArray) {
      return BinaryUtil.getBitArrayIndex(
        this.data,
        indexData[0] + this.byteOffSet,
        index
      );
    }
    throw new Error(`Tag with id: ${id} is not an array.`);
  }

  /**## getArrayTagByteIndex
   *  Get the actual byte index for the provided index of the array.
   * @param id
   * @param index
   * @returns
   */
  getArrayPropertyByteIndex(id: string, index: number) {
    const byteIndex = this.indexMap.get(id);
    if (byteIndex === undefined) {
      throw new Error(`Tag with id: ${id} does not exist.`);
    }
    const indexData = getIndexData(this.index, byteIndex);
    if (indexData[3] == StructPropertyTypes.TypedNumberArray) {
      return (
        indexData[0] +
        this.byteOffSet +
        index * BinaryUtil.getTypedSize(indexData[2])
      );
    }
    return -Infinity;
  }

  setArrayPropertyValue(id: string, index: number, value: number) {
    const byteIndex = this.indexMap.get(id);
    if (byteIndex === undefined) {
      throw new Error(`Tag with id: ${id} does not exist.`);
    }
    const indexData = getIndexData(this.index, byteIndex);
    if (indexData[3] == StructPropertyTypes.TypedNumberArray) {
      return BinaryUtil.setTypedNumber(
        this.data,
        indexData[0] +
          this.byteOffSet +
          index * BinaryUtil.getTypedSize(indexData[2]),
        indexData[2],
        value
      );
    }
    if (indexData[3] == StructPropertyTypes.BitArray) {
      return BinaryUtil.setBitArrayIndex(
        this.data,
        indexData[0] + this.byteOffSet,
        index,
        value
      );
    }
    return -Infinity;
  }

  loopThroughProperties(run: (id: string, value: number) => void) {
    this.indexMap.forEach((i, id) => {
      run(id, this.getProperty(id));
    });
  }
  loopThroughIndex(run: (data: number[]) => void) {
    this.indexMap.forEach((index, id) => {
      const indexData = getIndexData(this.index, index);
      run(indexData);
    });
  }
  loopThroughAllIndexAndProperties(
    run: (id: string, value: number, index: number) => void
  ) {
    for (let index = 0; index < this.structArrayIndexes; index++) {
      this.setStructArrayIndex(index);
      this.indexMap.forEach((i, id) => {
        run(id, this.getProperty(id), index);
      });
    }
  }

  /**## instantiate
   * Creates an object to read/write to the struct buffer.
   * @param structArrayIndex - Default is the current index.
   * @returns
   */
  instantiate<T extends any>(): T & InstantiatedStruct<T> {
    const self = this;

    const GeneratedClass = class extends InstantiatedStruct<T> {
      constructor() {
        super();
        this.setBuffer(self.getBuffer());
        this.setIndex(self.structArrayIndex);
        this.structSize = self.structSize;
        this.structArrayIndexes = self.structArrayIndexes;
      }

      _bitArrays = new Map<string, number[]>();
      _typedArrays = new Map<string, number[]>();
    };

    const cloneClass = () => {
      return new GeneratedClass();
    };

    Object.defineProperty(GeneratedClass.prototype, "clone", {
      get() {
        return cloneClass;
      },
    });

    for (const [key, propertyByteIndex] of this.indexMap) {
      const [byteIndex, bitOffSet, bitSize, type] = getIndexData(
        this.index,
        propertyByteIndex
      );

      if (type == StructPropertyTypes.Boolean) {
        Object.defineProperty(GeneratedClass.prototype, key, {
          get() {
            return BinaryUtil.getBitValue(
              this.data.getUint8(byteIndex + this.byteOffSet),
              bitOffSet,
              bitSize
            );
          },
          set(value: number) {
            this.data.setUint8(
              byteIndex + this.byteOffSet,
              BinaryUtil.setBitValue(
                this.data.getUint8(byteIndex + this.byteOffSet),
                bitOffSet,
                value,
                bitSize
              )
            );
          },
        });
      }
      if (type == StructPropertyTypes.TypedNumber) {
        Object.defineProperty(GeneratedClass.prototype, key, {
          get() {
            return BinaryUtil.getTypedNumber(
              this.data,
              byteIndex + this.byteOffSet,
              bitSize
            );
          },
          set(value: number) {
            BinaryUtil.setTypedNumber(
              this.data,
              byteIndex + this.byteOffSet,
              bitSize,
              value
            );
          },
        });
      }
      if (type == StructPropertyTypes.BitArray) {
        Object.defineProperty(GeneratedClass.prototype, key, {
          get() {
            const self = this as any;
            if (!self._bitArrays.has(key)) {
              const proxy = new Proxy([], {
                get(target, index) {
                  return BinaryUtil.getBitArrayIndex(
                    self.data,
                    byteIndex + self.byteOffSet,
                    +(index as string)
                  );
                },
                set(target, index, value) {
                  BinaryUtil.setBitArrayIndex(
                    self.data,
                    byteIndex + self.byteOffSet,
                    +(index as string),
                    value
                  );
                  return true;
                },
              });
              self._bitArrays.set(key, proxy);
            }

            return self._bitArrays.get(key)!;
          },
        });
      }
      if (type == StructPropertyTypes.TypedNumberArray) {
        const typedNumberSize = BinaryUtil.getTypedSize(bitSize);

        Object.defineProperty(GeneratedClass.prototype, key, {
          get() {
            const self = this as any;
            if (!self._typedArrays.has(key)) {
              const proxy = new Proxy([], {
                get(target, index) {
                  return BinaryUtil.getTypedNumber(
                    self.data,
                    byteIndex +
                      self.byteOffSet +
                      +(index as string) * typedNumberSize,
                    bitSize
                  );
                },
                set(target, index, value) {
                  BinaryUtil.setTypedNumber(
                    self.data,
                    byteIndex +
                      self.byteOffSet +
                      +(index as string) * typedNumberSize,
                    bitSize,
                    value
                  );
                  return true;
                },
              });
              self._typedArrays.set(key, proxy);
            }

            return self._typedArrays.get(key);
          },
        });
      }
    }

    return new GeneratedClass() as any as InstantiatedStruct<T> & T;
  }
}
