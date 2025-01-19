import { ItemPool } from "../Util/ItemPool";
import { RecursivePartial } from "../Util/Util.types";
import { setBinaryObjectData } from "./Functions/createSchemaBinaryObjectCursorClass";
import { Property } from "./Property/Property";
import { PropertyMetaData, TypedArrayMap } from "./Property/Property.types";
import { Schema } from "./Schema";
import {
  BinaryObjectSchemaView,
  SchemaCreateData,
  SchemaCursor,
} from "./Schema.types";
function traverseCreateJSON(parent: Property, target: any, source: any) {
  for (const child of parent.children!) {
    if (child.children) {
      target[child.id] ??= {};
      traverseCreateJSON(child, target[child.id], source[child.id]);
    } else {
      target[child.id] = source[child.id];
    }
  }
  return target;
}

const tempData: any[] = [];

export class SchemaView<Shape extends {} = any> {
  _dataPool = new ItemPool();

  constructor(
    public schema: Schema<Shape>,
    public id: string,
    public meta: PropertyMetaData[],
    public byteOffset: number[],
    public byteSize: number,
    public _createData: SchemaCreateData,
    private _cursorClass: any
  ) {}

  returnData(returnData: any) {
    this._dataPool.addItem(returnData);
  }

  createData(overrides?: RecursivePartial<Shape> | null): any {
    const data = this._createData;
    overrides && (tempData.length = 0);
    let baseData = !overrides
      ? this.schema._data
      : this.schema.createData(tempData, overrides);

    if (this._dataPool.items.length) {
      const newData = this._dataPool.get()! as any;
      if (data.type == "object") {
        for (let i = 0; i < baseData.length; i++) {
          newData[i] =
            typeof baseData[i] == "object"
              ? structuredClone(baseData[i])
              : baseData[i];
        }
        return newData;
      }
      if (data.type == "typed-array") {
        (newData as Uint32Array).set(baseData);
        return newData;
      }
      if (data.type == "binary-object") {
        for (let i = 0; i < baseData.length; i++) {
          const meta = this.meta[i];
          if (!meta.binary) continue;
          setBinaryObjectData(newData, meta, this.byteOffset![i], baseData[i]);
        }
        return newData;
      }
    }

    if (data.type == "object") {
      const newData: any[] = new Array(baseData.length);
      for (let i = 0; i < baseData.length; i++) {
        newData[i] =
          typeof baseData[i] == "object"
            ? structuredClone(baseData[i])
            : baseData[i];
      }
      return newData;
    }
    if (data.type == "typed-array") {
      const size = baseData.length;
      const typedArrayClass = TypedArrayMap[data.arrayType];
      let byteSize = size * typedArrayClass.BYTES_PER_ELEMENT;
      const typedArray = new typedArrayClass(
        data.sharedMemory
          ? (new SharedArrayBuffer(byteSize) as any)
          : new ArrayBuffer(byteSize)
      );
      typedArray.set(baseData);
      return typedArray;
    }
    if (data.type == "binary-object") {
      let byteSize = this.byteSize;
      const buffer = data.sharedMemory
        ? (new SharedArrayBuffer(byteSize) as any)
        : new ArrayBuffer(byteSize);
      const current: BinaryObjectSchemaView = {
        view: new DataView(buffer),
        buffer: new Uint8Array(buffer),
      };
      for (let i = 0; i < baseData.length; i++) {
        const meta = this.meta[i];
        if (!meta.binary) continue;
        setBinaryObjectData(current, meta, this.byteOffset![i], baseData[i]);
      }
      return current;
    }
    throw new Error(`Invalid create data`);
  }

  createCursor(): SchemaCursor<Shape> {
    return new this._cursorClass(
      this,
      this.meta,
      this._createData,
      this.byteOffset
    );
  }

  /** Converts data for use of remote components */
  toRemote(cursor: SchemaCursor<Shape>): any {
    if (this._createData.type == "object") {
      return cursor.__cursor.data;
    }
    if (this._createData.type == "typed-array") {
      return cursor.__cursor.data;
    }
    if (this._createData.type == "binary-object") {
      return cursor.__cursor.data.buffer;
    }
  }
  /** Converts data for remote data to local data*/
  fromRemote(remoteData: any): any {
    if (this._createData.type == "object") {
      return remoteData;
    }
    if (this._createData.type == "typed-array") {
      return remoteData;
    }
    if (this._createData.type == "binary-object") {
      return {
        view: new DataView(remoteData.buffer),
        buffer: new Uint8Array(remoteData.buffer),
      };
    }
  }
  toJSON(cursor: SchemaCursor<Shape>) {
    return traverseCreateJSON(this.schema.root, {}, cursor);
  }
}
