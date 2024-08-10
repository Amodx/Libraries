import { BinaryArrays } from "../Util/BinaryArrays";

export interface HalfNibbleArray {
  [index: number]: number;
}
export class HalfNibbleArray {
  private data: DataView;

  constructor(public buffer: ArrayBufferLike) {
    this.data = new DataView(ArrayBuffer.isView(buffer) ? buffer.buffer : buffer);
    return new Proxy(this, {
      get: (target, property) => {
        if (typeof property === "string" && !isNaN(Number(property))) {
          const index = Number(property);
          return target.get(index);
        }
        return target[property as keyof HalfNibbleArray];
      },
      set: (target, property, value) => {
        if (typeof property === "string" && !isNaN(Number(property))) {
          const index = Number(property);
          target.set(index, value);
          return true;
        }
        (target as any)[property] = value;
        return true;
      },
    });
  }

  get length() {
    return this.buffer.byteLength * 4;
  }

  get(index: number): number {
    if (index < 0 || index >= this.length) {
      throw new RangeError(`Index ${index} is out of bounds`);
    }
    return BinaryArrays.getHalfNibbleArrayIndex(this.data, 0, index);
  }

  set(index: number, value: number): void {
    if (index < 0 || index >= this.length) {
      throw new RangeError(`Index ${index} is out of bounds`);
    }
    if (value < 0 || value > 3) {
      throw new RangeError(`Value ${value} is out of bounds for a half nibble`);
    }
    BinaryArrays.setHalfNibbleArrayIndex(this.data, 0, index, value);
  }

  [Symbol.iterator](): Iterator<number> {
    let index = 0;
    return {
      next: (): IteratorResult<number> => {
        if (index < this.length) {
          return { value: this.get(index++), done: false };
        } else {
          return { value: undefined as any, done: true };
        }
      },
    };
  }

  forEach(
    callback: (value: number, index: number, array: HalfNibbleArray) => void
  ): void {
    for (let i = 0; i < this.length; i++) {
      callback(this.get(i), i, this);
    }
  }
}
