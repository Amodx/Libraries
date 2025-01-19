import {
  BinaryPropertyTypes,
  PropertyData,
  PropertyMetaData,
} from "./Property/Property.types";
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

export type SchemaCursor<Shape extends {} = {}> = SchemaCursorBase<Shape> &
  Shape;

export interface SchemaCursorBase<Shape extends {} = any> {
  __view: SchemaView<Shape>;
  __cursor: SchemaArrayCursor;
  getSchemaIndex(): SchemaCursorIndex<Shape>;
  getInstance(): number;
  setInstance(index: number): void;
  getCursor(): SchemaArrayCursor;
  clone(): SchemaCursorBase<Shape>;
  toJSON(): Shape;
}
export type SchemaMetaOverrideData = PropertyMetaData[] | Record<number, PropertyMetaData>;
export type SchemaCreateData =
  | {
      id: string;
      type: "object";
      meta?: SchemaMetaOverrideData|null
    }
  | {
      id: string;
      type: "typed-array";
      arrayType: BinaryPropertyTypes;
      sharedMemory?: true;
      meta?: SchemaMetaOverrideData|null
    }
  | {
      id: string;
      type: "binary-object";
      sharedMemory?: true;
      meta?: SchemaMetaOverrideData|null
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

export class SchemaProperty<T extends any> {
  constructor(
    public value: T,
    public meta: PropertyMetaData
  ) {}
}

export type ExtractSchemaClass<T> =
  T extends SchemaProperty<infer U>
    ? U extends object
      ? { [K in keyof U]: ExtractSchemaClass<U[K]> }
      : U
    : T extends object
      ? { [K in keyof T]: ExtractSchemaClass<T[K]> }
      : T;
