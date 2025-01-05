import type { TypedArrays } from "../../Util/TypedArrays";
import { BinaryObjectMarkers } from "../Constants/BinaryObjectMarkers.js";
import {
  BinaryNumberTypes,
  ByteCounts,
  MappedByteCounts,
} from "../../Constants/BinaryTypes.js";
import { TypedNode } from "../Classes/TypedNode.js";
import { ByteDataGet } from "../../Util/ByteDataGet";
import { TypedArrayCreate } from "../../Util/TypedArrayCreate";

export class BufferToObject {
  static _mode: "object" | "type-node" | "json" = "object";
  static _sharedMemory = false;
  static _cobj: any = {};
  static _parents: any[] = [];
  static _objArray: any[] = [];
  static _name = "";
  static _length = 0;
  static _objCount = 0;
  static _inOject = false;

  static _newTypedNode(
    type: BinaryObjectMarkers,
    value: any,
    listType: BinaryNumberTypes | 0 = 0
  ) {
    return new TypedNode(type, value, listType);
  }

  static _assign(value: any) {
    if (this._mode == "object" || this._mode == "json") {
      if (Array.isArray(this._cobj)) {
        this._cobj.push(value);
      } else {
        this._cobj[this._name] = value;
      }
    } else {
      if (Array.isArray(this._cobj.value)) {
        this._cobj.value.push(value);
      } else {
        this._cobj.value[this._name] = value;
      }
    }
  }

  static markFunctions: Record<
    BinaryObjectMarkers,
    (dv: DataView, index: number) => number
  > = {
    [BinaryObjectMarkers.Name]: (dv, index) => {
      this._name = "";
      const length = Number(
        ByteDataGet[BinaryNumberTypes.Uint8](dv, index + 1)
      );
      index += ByteCounts.Uint8 * 2;
      for (let i = index; i < index + length; i++) {
        this._name += String.fromCharCode(
          ByteDataGet[BinaryNumberTypes.Uint8](dv, i)
        );
      }
      return index + length * ByteCounts.Uint8;
    },
    //made this actually do something not sure if it is was meant not to
    [BinaryObjectMarkers.Object]: (dv, index) => {
      let newObj: any;
      if (this._mode == "object") {
        newObj = {};
      } else {
        newObj = this._newTypedNode(BinaryObjectMarkers.Object, {});
      }
      if (this._objCount != 0) {
        this._assign(newObj);
        this._parents.push(this._cobj);
      }

      this._objCount++;
      this._cobj = newObj;
      return ByteCounts.Uint8 + index;
    },
    [BinaryObjectMarkers.ObjectEnd]: (dv, index) => {
      if (this._parents.length > 0) {
        this._cobj = this._parents.pop();
      }
      return ByteCounts.Uint8 + index;
    },
    [BinaryObjectMarkers.Array]: (dv, index) => {
      let newObj: any;
      if (this._mode == "object") {
        newObj = [];
      } else {
        newObj = this._newTypedNode(BinaryObjectMarkers.Array, []);
      }
      if (this._objCount != 0) {
        this._assign(newObj);
        this._parents.push(this._cobj);
      }

      this._objCount++;
      this._cobj = newObj;

      return ByteCounts.Uint8 + index;
    },
    [BinaryObjectMarkers.ArrayEnd]: (dv, index) => {
      if (this._parents.length > 0) {
        this._cobj = this._parents.pop();
      }
      return ByteCounts.Uint8 + index;
    },
    [BinaryObjectMarkers.Boolean]: (dv, index) => {
      const value = ByteDataGet[BinaryNumberTypes.Uint8](dv, index + 1);
      if (this._mode != "type-node") {
        this._assign(value ? false : true);
      } else {
        this._assign(
          this._newTypedNode(BinaryObjectMarkers.Boolean, value ? false : true)
        );
      }
      return ByteCounts.Uint8 + ByteCounts.Int8 + index;
    },
    [BinaryObjectMarkers.Undefined]: (dv, index) => {
      if (this._mode != "type-node") {
        this._assign(undefined);
      } else {
        this._assign(
          this._newTypedNode(BinaryObjectMarkers.Undefined, undefined)
        );
      }
      return ByteCounts.Uint8 + index;
    },
 
    [BinaryObjectMarkers.Int8]: (dv, index) => {
      const value = ByteDataGet[BinaryNumberTypes.Int8](dv, index + 1);
      if (this._mode != "type-node") {
        this._assign(value);
      } else {
        this._assign(this._newTypedNode(BinaryObjectMarkers.Int8, value));
      }
      return ByteCounts.Uint8 + ByteCounts.Int8 + index;
    },
    [BinaryObjectMarkers.Uint8]: (dv, index) => {
      const value = ByteDataGet[BinaryNumberTypes.Uint8](dv, index + 1);
      if (this._mode != "type-node") {
        this._assign(value);
      } else {
        this._assign(this._newTypedNode(BinaryObjectMarkers.Uint8, value));
      }
      return ByteCounts.Uint8 + ByteCounts.Uint8 + index;
    },
    [BinaryObjectMarkers.Uint8Clamped]: (dv, index) => {
      const value = ByteDataGet[BinaryNumberTypes.Uint8](dv, index + 1);
      if (this._mode != "type-node") {
        this._assign(value);
      } else {
        this._assign(this._newTypedNode(BinaryObjectMarkers.Uint8, value));
      }
      return ByteCounts.Uint8 + ByteCounts.Uint8 + index;
    },
    [BinaryObjectMarkers.Int16]: (dv, index) => {
      const value = ByteDataGet[BinaryNumberTypes.Int16](dv, index + 1);
      if (this._mode != "type-node") {
        this._assign(value);
      } else {
        this._assign(this._newTypedNode(BinaryObjectMarkers.Int16, value));
      }
      return ByteCounts.Uint8 + ByteCounts.Int16 + index;
    },
    [BinaryObjectMarkers.Uint16]: (dv, index) => {
      const value = ByteDataGet[BinaryNumberTypes.Uint16](dv, index + 1);
      if (this._mode != "type-node") {
        this._assign(value);
      } else {
        this._assign(this._newTypedNode(BinaryObjectMarkers.Uint16, value));
      }
      return ByteCounts.Uint8 + ByteCounts.Uint16 + index;
    },
    [BinaryObjectMarkers.Float32]: (dv, index) => {
      const value = ByteDataGet[BinaryNumberTypes.Float32](dv, index + 1);
      if (this._mode != "type-node") {
        this._assign(value);
      } else {
        this._assign(this._newTypedNode(BinaryObjectMarkers.Float32, value));
      }
      return ByteCounts.Uint8 + ByteCounts.Float32 + index;
    },
    [BinaryObjectMarkers.Int32]: (dv, index) => {
      const value = ByteDataGet[BinaryNumberTypes.Int32](dv, index + 1);
      if (this._mode != "type-node") {
        this._assign(value);
      } else {
        this._assign(this._newTypedNode(BinaryObjectMarkers.Int32, value));
      }
      return ByteCounts.Uint8 + ByteCounts.Int32 + index;
    },
    [BinaryObjectMarkers.Uint32]: (dv, index) => {
      const value = ByteDataGet[BinaryNumberTypes.Uint32](dv, index + 1);
      if (this._mode != "type-node") {
        this._assign(value);
      } else {
        this._assign(this._newTypedNode(BinaryObjectMarkers.Uint32, value));
      }
      return (
        ByteCounts.Uint8 + ByteCounts.Uint8 + ByteCounts.Uint32 + index + 1
      );
    },
    [BinaryObjectMarkers.Float64]: (dv, index) => {
      const value = ByteDataGet[BinaryNumberTypes.Float64](dv, index + 1);
      if (this._mode != "type-node") {
        this._assign(value);
      } else {
        this._assign(this._newTypedNode(BinaryObjectMarkers.Float64, value));
      }
      return ByteCounts.Uint8 + ByteCounts.Float64 + index;
    },
    [BinaryObjectMarkers.BigInt]: (dv, index) => {
      const value = ByteDataGet[BinaryNumberTypes.BigInt](dv, index + 1);
      if (this._mode != "type-node") {
        this._assign(value);
      } else {
        this._assign(this._newTypedNode(BinaryObjectMarkers.BigInt, value));
      }
      return ByteCounts.Uint8 + ByteCounts.BigInt + index;
    },
    [BinaryObjectMarkers.BigUint]: (dv, index) => {
      const value = ByteDataGet[BinaryNumberTypes.BigUint](dv, index + 1);
      if (this._mode != "type-node") {
        this._assign(value);
      } else {
        this._assign(this._newTypedNode(BinaryObjectMarkers.BigUint, value));
      }
      return ByteCounts.Uint8 + ByteCounts.BigUint + index;
    },
    [BinaryObjectMarkers.String]: (dv, index) => {
      const length = ByteDataGet[BinaryNumberTypes.Uint32](dv, index + 1);
      index += ByteCounts.Uint32 + ByteCounts.Uint8;
      let string = "";
      for (let i = index; i < index + length; i++) {
        string += String.fromCharCode(
          ByteDataGet[BinaryNumberTypes.Uint8](dv, i)
        );
      }
      if (this._mode != "type-node") {
        this._assign(string);
      } else {
        this._assign(this._newTypedNode(BinaryObjectMarkers.String, string));
      }
      return index + length * ByteCounts.Uint8;
    },
    [BinaryObjectMarkers.TypedArray]: (dv, index) => {
      const type = ByteDataGet[BinaryNumberTypes.Uint8](
        dv,
        index + 1
      ) as BinaryNumberTypes;
      if (type === undefined) throw new Error(`Not a valid type for a typed array ${type}`);
      const length = ByteDataGet[BinaryNumberTypes.Uint32](dv, index + 2);
      index += ByteCounts.Uint8 * 2 + ByteCounts.Uint32;
      let array: TypedArrays | number[];
      if (this._mode == "json") {
        array = [];
      } else {
        array = TypedArrayCreate[type](length, this._sharedMemory);
      }
      const func = ByteDataGet[<BinaryNumberTypes>type];
      for (let i = 0; i < length; i++) {
        array[i] = func(dv, index);
        index += MappedByteCounts[<BinaryNumberTypes>type];
      }
      if (this._mode != "type-node") {
        this._assign(array);
      } else {
        this._assign(
          this._newTypedNode(BinaryObjectMarkers.TypedArray, array, type)
        );
      }
      return index;
    },
    [BinaryObjectMarkers.Blob]: (dv, index) => {
      if (this._mode != "type-node") {
        this._assign(Blob);
      } else {
        this._assign(
          this._newTypedNode(BinaryObjectMarkers.Blob, undefined)
        );
      }
      return ByteCounts.Uint8 + index;
    },
    [BinaryObjectMarkers.ArrayBuffer]: (dv, index) => {
      const length = ByteDataGet[BinaryNumberTypes.Uint32](dv, index + 1);
      index += ByteCounts.Uint8 + ByteCounts.Uint32;
      const array = new Uint8Array(
        this._sharedMemory
          ? new SharedArrayBuffer(length)
          : new ArrayBuffer(length)
      );
      for (let i = 0; i < length; i++) {
        array[i] = ByteDataGet[BinaryNumberTypes.Uint8](dv, index);
        index += BinaryNumberTypes.Uint8;
      }
      if (this._mode != "type-node") {
        this._assign(array.buffer);
      } else {
        this._assign(
          this._newTypedNode(BinaryObjectMarkers.ArrayBuffer, array.buffer)
        );
      }
      return index;
    },
    [BinaryObjectMarkers.Json]: (dv, index) => {
      const length = ByteDataGet[BinaryNumberTypes.Uint32](dv, index + 1);
      index += ByteCounts.Float32 + ByteCounts.Uint8;
      let jsonString = "";
      for (let i = index; i < index + length; i++) {
        jsonString += String.fromCharCode(
          ByteDataGet[BinaryNumberTypes.Uint8](dv, i)
        );
      }

      const result = JSON.parse(jsonString);
      if (this._mode != "type-node") {
        this._assign(result);
      } else {
        this._assign(this._newTypedNode(BinaryObjectMarkers.Json, result));
      }
      return index + length * ByteCounts.Uint8;
    },
  };

  static setUseSharedMemory(useSharedMemory: boolean) {
    this._sharedMemory = useSharedMemory;
  }

  static toObject<T>(
    buffer: ArrayBufferLike,
    byteOffSet = 0,
    byteOffSetEnd = 0
  ): T {
    this._mode = "object";
    let legnth;

    if (byteOffSetEnd == 0) {
      legnth = buffer.byteLength;
    } else {
      legnth = byteOffSetEnd;
    }
    const dv = new DataView(buffer);
    this._objCount = 0;
    let index = byteOffSet;
    let markType: BinaryObjectMarkers = BinaryObjectMarkers.Object;
    while (index < legnth) {
      markType = ByteDataGet[BinaryNumberTypes.Uint8](
        dv,
        index
      ) as BinaryObjectMarkers;
      index = this.markFunctions[markType](dv, index);
    }
    return <T>this._cobj;
  }

  static toJSON<T>(buffer: ArrayBufferLike, byteOffSet = 0, byteOffSetEnd = 0): T {
    this._mode = "json";
    let legnth;

    if (byteOffSetEnd == 0) {
      legnth = buffer.byteLength;
    } else {
      legnth = byteOffSetEnd;
    }
    const dv = new DataView(buffer);
    this._objCount = 0;
    let index = byteOffSet;
    let markType: BinaryObjectMarkers = BinaryObjectMarkers.Object;
    while (index < legnth) {
      markType = ByteDataGet[BinaryNumberTypes.Uint8](
        dv,
        index
      ) as BinaryObjectMarkers;

      index = this.markFunctions[markType](dv, index);
    }
    return <T>this._cobj;
  }

  static toTypedNodes<T>(
    buffer: ArrayBufferLike,
    byteOffSet = 0,
    byteOffSetEnd = 0
  ): T {
    this._mode = "type-node";
    let legnth;

    if (byteOffSetEnd == 0) {
      legnth = buffer.byteLength;
    } else {
      legnth = byteOffSetEnd;
    }

    this._mode = "object";

    const dv = new DataView(buffer);
    this._objCount = 0;
    let index = byteOffSet;
    let markType: BinaryObjectMarkers = BinaryObjectMarkers.Object;
    while (index < legnth) {
      markType = ByteDataGet[BinaryNumberTypes.Uint8](
        dv,
        index
      ) as BinaryObjectMarkers;

      index = this.markFunctions[markType](dv, index);
    }
    return <T>this._cobj;
  }
}
