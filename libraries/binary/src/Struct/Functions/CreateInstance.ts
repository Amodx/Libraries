import { InstantiatedStruct } from "../Classes/InstantiatedStruct";
import { StructPropertyTypes } from "../Constants/StructPropertyTypes";
import { BinaryStructData } from "../Types";
import { BinaryUtil } from "../../Util/BinaryUtil";
import { GetIndexData } from "./GetIndexData";
const vector2Indexes = { x: 0, y: 1 };
const vector3Indexes = { x: 0, y: 1, z: 2 };
const vector4Indexes = { x: 0, y: 1, z: 2, w: 3 };
export function CreateInstance<T extends any>(
  data: BinaryStructData
): T & InstantiatedStruct<T> {
  const index = new DataView(data.indexBuffer);
  const GeneratedClass = class extends InstantiatedStruct<T> {
    constructor() {
      super();
      this.structSize = data.structSize;
      this.structArrayIndexes = data.structArrayIndexes;
    }

    _bitArrays: Map<string, number[]>;
    _typedArrays: Map<string, number[]>;
    _vector2s: Map<string, { x: number; y: number }>;
    _vector3s: Map<string, { x: number; y: number; z: number }>;
    _vector4s: Map<string, { x: number; y: number; z: number; w: number }>;
  };

  Object.defineProperty(GeneratedClass.prototype, "clone", {
    get() {
      return () => {
        const clone = new GeneratedClass();
        if (this.structData?.buffer) clone.setBuffer(this.structData.buffer);
        clone.setIndex(this.structArrayIndex);
        return clone;
      };
    },
  });

  Object.defineProperty(GeneratedClass.prototype, "setDefaults", {
    get() {
      return () => {
        for (const [id, value] of Object.entries(data.propertyDefaults)) {
          const v = this[id];
          if (Array.isArray(v) && Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
              v[i] = value[i];
            }
            continue;
          }
          if (typeof v == "object" && typeof value == "object") {
            for (const key of Object.keys(value)) {
              v[key] = value[key];
            }
            continue;
          }
          if (typeof v == "number" && typeof value == "number") {
            this[id] = value;
          }
        }
      };
    },
  });

  for (const [key, propertyByteIndex] of Object.entries(data.indexMap)) {
    const [byteIndex, bitOffSet, bitSize, type] = GetIndexData(
      index,
      propertyByteIndex
    );

    if (type == StructPropertyTypes.Boolean) {
      Object.defineProperty(GeneratedClass.prototype, key, {
        get() {
          return BinaryUtil.getBitValue(
            this.structData.getUint8(byteIndex + this.structByteOffSet),
            bitOffSet,
            bitSize
          );
        },
        set(value: number) {
          this.structData.setUint8(
            byteIndex + this.structByteOffSet,
            BinaryUtil.setBitValue(
              this.structData.getUint8(byteIndex + this.structByteOffSet),
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
            this.structData,
            byteIndex + this.structByteOffSet,
            bitSize
          );
        },
        set(value: number) {
          BinaryUtil.setTypedNumber(
            this.structData,
            byteIndex + this.structByteOffSet,
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
                  byteIndex + self.structByteOffSet,
                  +(index as string)
                );
              },
              set(target, index, value) {
                BinaryUtil.setBitArrayIndex(
                  self.data,
                  byteIndex + self.structByteOffSet,
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
          if (!this._typedArrays) this._typedArrays = new Map();
          const self = this as InstantiatedStruct<T>;

          if (!(self as any)._typedArrays.has(key)) {
            const proxy = new Proxy([], {
              get(target, index) {
                return BinaryUtil.getTypedNumber(
                  self.structData,
                  byteIndex +
                    self.structByteOffSet +
                    +(index as string) * typedNumberSize,
                  bitSize
                );
              },
              set(target, index, value) {
                BinaryUtil.setTypedNumber(
                  self.structData,
                  byteIndex +
                    self.structByteOffSet +
                    +(index as string) * typedNumberSize,
                  bitSize,
                  value
                );
                return true;
              },
            });
            (self as any)._typedArrays.set(key, proxy);
          }

          return (self as any)._typedArrays.get(key);
        },
      });
    }
    if (type == StructPropertyTypes.Vector2) {
      const typedNumberSize = BinaryUtil.getTypedSize(bitSize);

      Object.defineProperty(GeneratedClass.prototype, key, {
        get() {
          if (!this._vector2s) this._vector2s = new Map();
          const self = this as InstantiatedStruct<T>;
          if (!(self as any)._vector2s.has(key)) {
            const proxy = new Proxy(
              {},
              {
                get(target, property) {
                  return BinaryUtil.getTypedNumber(
                    self.structData,
                    byteIndex +
                      self.structByteOffSet +
                      vector2Indexes[property as keyof typeof vector2Indexes] *
                        typedNumberSize,
                    bitSize
                  );
                },
                set(target, property, value) {
                  BinaryUtil.setTypedNumber(
                    self.structData,
                    byteIndex +
                      self.structByteOffSet +
                      vector2Indexes[property as keyof typeof vector2Indexes] *
                        typedNumberSize,
                    bitSize,
                    value
                  );
                  return true;
                },
              }
            );
            (self as any)._vector2s.set(key, proxy);
          }

          return (self as any)._vector2s.get(key);
        },
      });
    }
    if (type == StructPropertyTypes.Vector3) {
      const typedNumberSize = BinaryUtil.getTypedSize(bitSize);

      Object.defineProperty(GeneratedClass.prototype, key, {
        get() {
          if (!this._vector3s) this._vector3s = new Map();
          const self = this as InstantiatedStruct<T>;
          if (!(self as any)._vector3s.has(key)) {
            const proxy = new Proxy(
              {},
              {
                get(target, property) {
                  return BinaryUtil.getTypedNumber(
                    self.structData,
                    byteIndex +
                      self.structByteOffSet +
                      vector3Indexes[property as keyof typeof vector3Indexes] *
                        typedNumberSize,
                    bitSize
                  );
                },
                set(target, property, value) {
                  BinaryUtil.setTypedNumber(
                    self.structData,
                    byteIndex +
                      self.structByteOffSet +
                      vector3Indexes[property as keyof typeof vector3Indexes] *
                        typedNumberSize,
                    bitSize,
                    value
                  );
                  return true;
                },
              }
            );
            (self as any)._vector3s.set(key, proxy);
          }

          return (self as any)._vector3s.get(key);
        },
      });
    }
    if (type == StructPropertyTypes.Vector4) {
      const typedNumberSize = BinaryUtil.getTypedSize(bitSize);

      Object.defineProperty(GeneratedClass.prototype, key, {
        get() {
          if (!this._vector4s) this._vector4s = new Map();
          const self = this as InstantiatedStruct<T>;
          if (!(self as any)._vector4s.has(key)) {
            const proxy = new Proxy(
              {},
              {
                get(target, property) {
                  return BinaryUtil.getTypedNumber(
                    self.structData,
                    byteIndex +
                      self.structByteOffSet +
                      vector4Indexes[property as keyof typeof vector4Indexes] *
                        typedNumberSize,
                    bitSize
                  );
                },
                set(target, property, value) {
                  BinaryUtil.setTypedNumber(
                    self.structData,
                    byteIndex +
                      self.structByteOffSet +
                      vector4Indexes[property as keyof typeof vector4Indexes] *
                        typedNumberSize,
                    bitSize,
                    value
                  );
                  return true;
                },
              }
            );
            (self as any)._vector4s.set(key, proxy);
          }

          return (self as any)._vector4s.get(key);
        },
      });
    }
  }

  return new GeneratedClass() as any as InstantiatedStruct<T> & T;
}
