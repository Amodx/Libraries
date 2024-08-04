import { BinaryNumberTypes } from "../../Constants/BinaryTypes";

export type BinaryPropertyValueTypes = "number" | "boolean";

export type BinaryBooleanProperty = {
  id: string;
  type: "boolean";
  default?: boolean;
};
export type BinaryNumberProperty = {
  id: string;
  type: "number";
  range: [min: number, max: number];
  default?: number;
};
export type BinaryTypedNumberProperty = {
  id: string;
  type: "typed-number";
  numberType: BinaryNumberTypes;
  default?: number;
};
export type BinaryTypedVector2Property = {
  id: string;
  type: "vector-2";
  numberType: BinaryNumberTypes;
  default?: { x: number; y: number };
};
export type BinaryTypedVector3Property = {
  id: string;
  type: "vector-3";
  numberType: BinaryNumberTypes;
  default?: { x: number; y: number; z: number };
};
export type BinaryTypedVector4Property = {
  id: string;
  type: "vector-4";
  numberType: BinaryNumberTypes;
  default?: { x: number; y: number; z: number; w: number };
};

export type BinaryTypedNumberArrayProperty = {
  id: string;
  type: "typed-number-array";
  numberType: BinaryNumberTypes;
  length: number;
  default?: number[];
};
export type BinaryBitArrayProperty = {
  id: string;
  type: "bit-array";
  length: number;
  default?: boolean[];
};
export type BinaryHeaderProperty = {
  id: string;
  type: "header";
  numberType: BinaryNumberTypes;
  default?: number;
};

export type BinaryPropertyNodes =
  | BinaryBooleanProperty
  | BinaryNumberProperty
  | BinaryBitArrayProperty
  | BinaryTypedNumberProperty
  | BinaryTypedNumberArrayProperty
  | BinaryHeaderProperty
  | BinaryTypedVector2Property
  | BinaryTypedVector3Property
  | BinaryTypedVector4Property;

export type BinaryPropertySchema = Map<string, BinaryPropertyNodes>;
