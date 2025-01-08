import {
  BinaryPropertyTypes,
  PropertyData,
} from "./Property/Property.types";
import { Schema } from "./Schema";
import { SchemaView } from "./SchemaView";
import { SchemaArrayCursor } from "./SchemaArrayCursor";
export type SchemaTypes = "object" | "binay";
export type SchemaData = PropertyData[];

export type SchemaProxyData<T extends Record<string | number, any> = {}> = [
  object: T,
  key: keyof T,
];
export type BinaryObjectSchemaView = {
  view: DataView;
  buffer: Uint8Array;
};

export type SchemaCursor<Shape extends {} = any> = SchemaCursorBase & Shape;

export interface SchemaCursorBase<Shape extends {} = any> {
  __view: SchemaView<Shape>;
  __cursor: SchemaArrayCursor;
  getSchemaIndex(): Schema<Shape>["index"];
  getInstance(): number;
  setInstance(index: number): void;
  getCursor() :SchemaArrayCursor ;
  clone(): SchemaCursorBase<Shape>;
  toJSON(): Shape;
}

export type SchemaCreateData =
  | {
      type: "object";
    }
  | {
      type: "typed-array";
      arrayType: BinaryPropertyTypes;
      sharedMemory: boolean;
    }
  | {
      type: "binary-object";
      byteSize: number;
      sharedMemory: boolean;
    };

export interface SchemaCursorClassBase extends SchemaCursorBase {
  __index: number;
  __cursor: SchemaArrayCursor;
  __cursors: any[];
}

export type SchemaCursorIndex<T> = {
  [K in keyof T]: T[K] extends
    | string
    | number
    | boolean
    | bigint
    | symbol
    | undefined
    | null
    ? number
    : T[K] extends object
      ? SchemaCursorIndex<T[K]>
      : never;
};
