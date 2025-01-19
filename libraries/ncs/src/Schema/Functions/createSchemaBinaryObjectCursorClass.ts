import {
  SchemaCursorClassBase,
  SchemaProxyData,
  BinaryObjectSchemaView,
} from "../Schema.types";
import { Property } from "../Property/Property";
import { Schema } from "../Schema";
import { createBaseSchemaCursor } from "./createBaseSchemaCursor";
import {
  BinaryPropertyTypes,
  PropertyMetaData,
} from "../Property/Property.types";
import { SchemaView } from "../SchemaView";
import { SchemaArrayCursor } from "../SchemaArrayCursor";

const valueSetMap: Record<
  BinaryPropertyTypes,
  (dataView: DataView, index: number, value: number) => void
> = {
  i8(dataView: DataView, index: number, value: number): void {
    dataView.setInt8(index, value);
  },
  ui8(dataView: DataView, index: number, value: number): void {
    dataView.setUint8(index, value);
  },
  i16(dataView: DataView, index: number, value: number): void {
    dataView.setInt16(index, value);
  },
  ui16(dataView: DataView, index: number, value: number): void {
    dataView.setUint16(index, value);
  },
  i32(dataView: DataView, index: number, value: number): void {
    dataView.setInt32(index, value);
  },
  ui32(dataView: DataView, index: number, value: number): void {
    dataView.setUint32(index, value);
  },
  f32(dataView: DataView, index: number, value: number): void {
    dataView.setFloat32(index, value);
  },
  f64(dataView: DataView, index: number, value: number): void {
    dataView.setFloat64(index, value);
  },
};

const valueGetMap: Record<
  BinaryPropertyTypes,
  (dataView: DataView, index: number) => number
> = {
  i8(dataView: DataView, index: number): number {
    return dataView.getInt8(index);
  },
  ui8(dataView: DataView, index: number): number {
    return dataView.getUint8(index);
  },
  i16(dataView: DataView, index: number): number {
    return dataView.getInt16(index);
  },
  ui16(dataView: DataView, index: number): number {
    return dataView.getUint16(index);
  },
  i32(dataView: DataView, index: number): number {
    return dataView.getInt32(index);
  },
  ui32(dataView: DataView, index: number): number {
    return dataView.getUint32(index);
  },
  f32(dataView: DataView, index: number): number {
    return dataView.getFloat32(index);
  },
  f64(dataView: DataView, index: number): number {
    return dataView.getFloat64(index);
  },
};

export function setBinaryObjectData(
  current: BinaryObjectSchemaView,
  meta: PropertyMetaData,
  index: number,
  value: number
) {
  if (!meta.binary) return undefined;
  if (typeof meta.binary == "object")
    return meta.binary.set(current.view, meta, index, value);
  return valueSetMap[meta.binary](current.view, index, value);
}
export function getBinaryObjectData(
  current: BinaryObjectSchemaView,
  meta: PropertyMetaData,
  index: number
): any {
  if (!meta.binary) return undefined;
  if (typeof meta.binary == "object")
    return meta.binary.get(current.view, meta, index);
  return valueGetMap[meta.binary](current.view, index);
}

function traverse(parent: any, properties: Property[]) {
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    const index = property.index;

    if (!property.children) {
      Object.defineProperty(parent.prototype, property.id, {
        get(this: SchemaCursorClassBase): any {
          if (this.__cursor.hasProxy(index)) {
            return this.__cursor.fetchProxyData(index);
          }
          return getBinaryObjectData(
            this.__cursor.data,
            this.__view.meta[index],
            this.__view.byteOffset![index]
          );
        },
        set(this: SchemaCursorClassBase, value: any) {
          let obs = this.__cursor.getObserver(index);
          let proxy = this.__cursor.hasProxy(index);
          if (obs) {
            const oldVale = proxy
              ? this.__cursor.fetchProxyData(index)
              : getBinaryObjectData(
                  this.__cursor.data,
                  this.__view.meta[index],
                  this.__view.byteOffset![index]
                );
            if (oldVale != value) {
              setBinaryObjectData(
                this.__cursor.data,
                this.__view.meta[index],
                this.__view.byteOffset![index],
                value
              );
              if (proxy) {
                this.__cursor.setProxyData(index, value);
              }
              obs.notify(value);
              return;
            }
          }
          setBinaryObjectData(
            this.__cursor.data,
            this.__view.meta[index],
            this.__view.byteOffset![index],
            value
          );
          if (proxy) {
            this.__cursor.setProxyData(index, value);
          }
        },
      });
      continue;
    }
    class SchemaCursorProperty {
      constructor(
        public __cursor: SchemaArrayCursor,
        public __cursors: SchemaCursorClassBase[],
        public __view: SchemaView
      ) {}
    }
    traverse(SchemaCursorProperty, property.children!);
    Object.defineProperty(parent.prototype, property.id, {
      get(this: SchemaCursorClassBase): any {
        let v = this.__cursors[index];
        if (!v) {
          v = new SchemaCursorProperty(
            this.__cursor,
            this.__cursors,
            this.__view
          );
          this.__cursors[index] = v;
        }
        return v;
      },
      set(this: SchemaCursorClassBase, value: any) {
        //  (this as SchemaClassBase).__data.current[index] = value;
      },
    });
  }
}

export function createSchemaBinaryObjectCursorClass(schema: Schema) {
  const SchemaCursor = createBaseSchemaCursor();
  traverse(SchemaCursor, schema.root.children!);
  return SchemaCursor;
}
