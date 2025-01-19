export interface PropertyData<Meta extends {} = {}> {
  id: string;

  name?: string;
  value: any;
  meta?: PropertyMetaData<Meta>;
  children?: PropertyData[];
}

export type BinaryPropertyTypes =
  | "i8"
  | "ui8"
  | "i16"
  | "ui16"
  | "i32"
  | "ui32"
  | "f32"
  | "f64";
export type TypedArrays =
  | typeof Int8Array
  | typeof Uint8Array
  | typeof Int16Array
  | typeof Uint16Array
  | typeof Int32Array
  | typeof Uint32Array
  | typeof Float32Array
  | typeof Float64Array;

export const TypedArrayMap: Record<BinaryPropertyTypes, TypedArrays> = {
  i8: Int8Array,
  ui8: Uint8Array,
  i16: Int16Array,
  ui16: Uint16Array,
  i32: Int32Array,
  ui32: Uint32Array,
  f32: Float32Array,
  f64: Float64Array,
};
export const BinaryPropertyTypeSizeMap: Record<BinaryPropertyTypes, number> = {
  i8: Int8Array.BYTES_PER_ELEMENT,
  ui8: Uint8Array.BYTES_PER_ELEMENT,
  i16: Int16Array.BYTES_PER_ELEMENT,
  ui16: Uint16Array.BYTES_PER_ELEMENT,
  i32: Int32Array.BYTES_PER_ELEMENT,
  ui32: Uint32Array.BYTES_PER_ELEMENT,
  f32: Float32Array.BYTES_PER_ELEMENT,
  f64: Float64Array.BYTES_PER_ELEMENT,
};

export type BinaryPropertyData =
  | BinaryPropertyTypes
  | {
      byteSize: number;
      set(data: DataView, meta: any, index: number, value: any): void;
      get(data: DataView, meta: any, index: number): any;
    };

export type PropertyMetaData<MetaData extends {} = any> = {
  binary?: BinaryPropertyData;
  data?: MetaData;
  /**If the property was created from an object */
  child?: true;
  type?: string;
  units?: string;
  options?: string[] | [string, string | number][];
  name?: string;
};
