import { BinaryNumberTypes } from "../../Constants/BinaryTypes";

export type BinaryPropertyValueTypes = "number" | "boolean";

export type BinaryBooleanProperty = {
  id: string;
  type: "boolean";
};
export type BinaryNumberProperty = {
  id: string;
  type: "number";
  range: [min: number, max: number];
};
export type BinaryTypedNumberProperty = {
  id: string;
  type: "typed-number";
  numberType: BinaryNumberTypes;
};
export type BinaryTypedNumberArrayProperty = {
  id: string;
  type: "typed-number-array";
  numberType: BinaryNumberTypes;
  length: number;
};
export type BinaryBitArrayProperty = {
  id: string;
  type: "bit-array";
  length: number;
}; 
export type BinaryHeaderProperty = {
  id: string;
  type: "header";
  numberType: BinaryNumberTypes;
};

export type BinaryPropertyNodes =
  | BinaryBooleanProperty
  | BinaryNumberProperty
  | BinaryBitArrayProperty
  | BinaryTypedNumberProperty
  | BinaryTypedNumberArrayProperty
  | BinaryHeaderProperty;

export type BinaryPropertySchema = Map<string, BinaryPropertyNodes>;
