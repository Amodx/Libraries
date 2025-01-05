import { registerInput } from "./registerInput";

const StringInput = registerInput<string, { min: number; max: number }>({
  id: "string",
  name: "String",
  compare(value1, value2) {
    return value1 == value2;
  },
  createProperties(properties) {
    return {
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      ...properties,
    };
  },
});

const ColorInput = registerInput<string, {}>({
  id: "color",
  name: "Color",
  compare(value1, value2) {
    return value1 === value2;
  },
  createProperties(properties) {
    return {
      ...properties,
    };
  },
});

const RangeInput = registerInput<
  number,
  { min: number; max: number; step: number }
>({
  id: "range",
  name: "Range",
  compare(value1, value2) {
    return value1 === value2;
  },
  createProperties(properties) {
    return {
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      step: 1,
      ...properties,
    };
  },
});

const FloatInput = registerInput<number, { min: number; max: number }>({
  id: "float",
  name: "Float",
  compare(value1, value2) {
    return value1 === value2;
  },
  createProperties(properties) {
    return {
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      ...properties,
    };
  },
});

const Vec2Input = registerInput<
  { x: number; y: number },
  { valueType: "position" | "dimension" }
>({
  id: "vec2",
  name: "Vec2",
  compare(value1, value2) {
    return value1.x === value2.x && value1.y === value2.y;
  },
  createProperties(properties) {
    return {
      valueType: "position",
      ...properties,
    };
  },
});

const Vec3Input = registerInput<
  { x: number; y: number; z: number },
  { valueType: "position" | "dimension" }
>({
  id: "vec3",
  name: "Vec3",
  compare(value1, value2) {
    return (
      value1.x === value2.x && value1.y === value2.y && value1.z === value2.z
    );
  },
  createProperties(properties) {
    return {
      valueType: "position",
      ...properties,
    };
  },
});

const IntInput = registerInput<number, { min: number; max: number }>({
  id: "int",
  name: "Int",
  compare(value1, value2) {
    return value1 === value2;
  },
  createProperties(properties) {
    return {
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      ...properties,
    };
  },
});

const SelectInput = registerInput<
  string | number,
  { options: string[] | [string, string | number][]; mode?: string }
>({
  id: "select",
  name: "Select",
  compare(value1, value2) {
    return value1 === value2;
  },
  createProperties(properties) {
    return {
      options: [],
      ...properties,
    };
  },
});

const BooleanInput = registerInput<boolean, {}>({
  id: "boolean",
  name: "Boolean",
  compare(value1, value2) {
    return value1 === value2;
  },
  createProperties(properties) {
    return {
      ...properties,
    };
  },
});


export {
  ColorInput as ColorPropertyInput,
  RangeInput as RangePropertyInput,
  FloatInput as FloatPropertyInput,
  Vec2Input as Vec2PropertyInput,
  Vec3Input as Vec3PropertyInput,
  IntInput as IntPropertyInput,
  StringInput as StringPropertyInput,
  SelectInput as SelectPropertyInput,
  BooleanInput as BooleanPropertyInput,
};
