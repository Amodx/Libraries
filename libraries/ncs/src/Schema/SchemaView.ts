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
function traverseCreateJSON(property: Property, target: any, source: any) {
  for (const child of property.children!) {
    if (child.children) {
      target[property.id] ??= {};
      traverseCreateJSON(child, target[property.id], source[property.id]);
    } else {
      target[property.id] = source[property.id];
    }
  }
  return property;
}

const tempData: any[] = [];

export class SchemaView<Shape extends {} = any> {
  constructor(
    public schema: Schema<Shape>,
    public id: string,
    public meta: PropertyMetaData[],
    public byteOffset: number[],
    public _createData: SchemaCreateData,
    private _cursorClass: any
  ) {}

  createData(overrides?: RecursivePartial<Shape> | null): any {
    const data = this._createData;

    let baseData = !overrides
      ? this.schema._data
      : this.schema.createData(tempData, overrides);
    if (data.type == "object") {
      const newData: any[] = new Array(baseData.length);
      for (let i = 0; i < baseData.length; i++) {
        newData[i] =
          typeof baseData[i] == "object"
            ? structuredClone(baseData[i])
            : baseData[i];
      }
      return newData
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
      return typedArray
    }
    if (data.type == "binary-object") {
      let byteSize = data.byteSize;
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
      return [current, null, null, this.id];
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
  toJSON(cursor: SchemaCursor<Shape>) {
    return traverseCreateJSON(this.schema.root, {}, cursor);
  }
}