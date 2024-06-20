import {
  PropertyInputBase,
  PropertyInputConstructor,
  PropertyInputData,
  PropertyInputMetaData,
} from "./PropertyInput";
import { PropertyInputRegister } from "./PropertyInputRegister";

class StringInput extends PropertyInputBase<
  string,
  { min: number; max: number }
> {
  static Meta = {
    id: "string",
    name: "string",
  };

  static Create(data: Partial<StringInput["data"]>): StringInput["data"] {
    return {
      ...PropertyInputBase.CreateBase({}),
      type: StringInput.Meta.id,
      properties: {
        min: 0,
        max: Number.MAX_SAFE_INTEGER,
      },
      ...data,
    };
  }

  getClass() {
    return StringInput;
  }
  getMeta(): PropertyInputMetaData {
    return StringInput.Meta;
  }
}

class ColorInput extends PropertyInputBase<string, {}> {
  static Meta = {
    id: "color",
    name: "Color",
  };

  static Create(data: Partial<ColorInput["data"]>): ColorInput["data"] {
    return {
      ...PropertyInputBase.CreateBase({}),
      type: ColorInput.Meta.id,
      properties: {},
      ...data,
    };
  }

  getClass() {
    return ColorInput;
  }
  getMeta(): PropertyInputMetaData {
    return ColorInput.Meta;
  }
}

class RangeInput extends PropertyInputBase<
  number,
  { min: number; max: number; step: number }
> {
  static Meta = {
    id: "range",
    name: "Range",
  };

  static Create(data: Partial<RangeInput["data"]>): RangeInput["data"] {
    return {
      ...PropertyInputBase.CreateBase({}),
      type: RangeInput.Meta.id,
      properties: {
        min: 0,
        max: Number.MAX_SAFE_INTEGER,
        step: 1,
      },
      ...data,
    };
  }

  getClass() {
    return RangeInput;
  }
  getMeta(): PropertyInputMetaData {
    return RangeInput.Meta;
  }
}

class FloatInput extends PropertyInputBase<
  number,
  { min: number; max: number }
> {
  static Meta = {
    id: "float",
    name: "Float",
  };

  static Create(data: Partial<FloatInput["data"]>): FloatInput["data"] {
    return {
      ...PropertyInputBase.CreateBase({}),
      type: FloatInput.Meta.id,
      properties: {
        min: 0,
        max: Number.MAX_SAFE_INTEGER,
      },
      ...data,
    };
  }

  getClass() {
    return FloatInput;
  }
  getMeta(): PropertyInputMetaData {
    return FloatInput.Meta;
  }
}

class Vec2Input extends PropertyInputBase<
  [number, number],
  { valueType: "position" | "dimension" }
> {
  static Meta = {
    id: "vec2",
    name: "Vec2",
  };

  static Create(data: Partial<Vec2Input["data"]>): Vec2Input["data"] {
    return {
      ...PropertyInputBase.CreateBase({}),
      type: Vec2Input.Meta.id,
      properties: {
        valueType: "position",
      },
      ...data,
    };
  }

  getClass() {
    return Vec2Input;
  }
  getMeta(): PropertyInputMetaData {
    return Vec2Input.Meta;
  }
}

class Vec3Input extends PropertyInputBase<
  [number, number, number],
  { valueType: "position" | "dimension" }
> {
  static Meta = {
    id: "vec3",
    name: "Vec3",
  };

  static Create(data: Partial<Vec3Input["data"]>): Vec3Input["data"] {
    return {
      ...PropertyInputBase.CreateBase({}),
      type: Vec3Input.Meta.id,
      properties: {
        valueType: "position",
      },
      ...data,
    };
  }

  getClass() {
    return Vec3Input;
  }
  getMeta(): PropertyInputMetaData {
    return Vec3Input.Meta;
  }
}

class IntInput extends PropertyInputBase<number, { min: number; max: number }> {
  static Meta = {
    id: "int",
    name: "Int",
  };

  static Create(data: Partial<IntInput["data"]>): IntInput["data"] {
    return {
      ...PropertyInputBase.CreateBase({}),
      type: IntInput.Meta.id,
      properties: {
        min: 0,
        max: Number.MAX_SAFE_INTEGER,
      },
      ...data,
    };
  }

  getClass() {
    return IntInput;
  }
  getMeta(): PropertyInputMetaData {
    return IntInput.Meta;
  }
}

class SelectInput extends PropertyInputBase<
  string,
  { options: [string, string][] }
> {
  static Meta = {
    id: "select",
    name: "Select",
  };

  static Create(data: Partial<SelectInput["data"]>): SelectInput["data"] {
    return {
      ...PropertyInputBase.CreateBase({}),
      type: SelectInput.Meta.id,
      properties: {
        options: [],
      },
      ...data,
    };
  }

  getClass() {
    return SelectInput;
  }
  getMeta(): PropertyInputMetaData {
    return SelectInput.Meta;
  }
}

class FilePathInput extends PropertyInputBase<
  string,
  { acceptedFileExtensions: string[] }
> {
  static Meta = {
    id: "file-path",
    name: "File Path",
  };

  static Create(data: Partial<FilePathInput["data"]>): FilePathInput["data"] {
    return {
      ...PropertyInputBase.CreateBase({}),
      type: FilePathInput.Meta.id,
      properties: {
        acceptedFileExtensions: [],
      },
      ...data,
    };
  }

  getClass() {
    return FilePathInput;
  }
  getMeta(): PropertyInputMetaData {
    return FilePathInput.Meta;
  }
}

class PasswordInput extends PropertyInputBase<
  string,
  { min: number; max: number }
> {
  static Meta = {
    id: "password",
    name: "Password",
  };

  static Create(data: Partial<PasswordInput["data"]>): PasswordInput["data"] {
    return {
      ...PropertyInputBase.CreateBase({}),
      type: PasswordInput.Meta.id,
      properties: {
        min: 0,
        max: Number.MAX_SAFE_INTEGER,
      },
      ...data,
    };
  }

  getClass() {
    return PasswordInput;
  }
  getMeta(): PropertyInputMetaData {
    return PasswordInput.Meta;
  }
}

PropertyInputRegister.regsiterProperty(
  ColorInput,
  RangeInput,
  FloatInput,
  Vec2Input,
  Vec3Input,
  IntInput,
  StringInput,
  SelectInput,
  FilePathInput,
  PasswordInput
);

export {
  ColorInput as ColorPropertyInput,
  RangeInput as RangePropertyInput,
  FloatInput as FloatPropertyInput,
  Vec2Input as Vec2PropertyInput,
  Vec3Input as Vec3PropertyInput,
  IntInput as IntPropertyInput,
  StringInput as StringPropertyInput,
  SelectInput as SelectPropertyInput,
  FilePathInput as FilePathPropertyInput,
  PasswordInput as PasswordPropertyInput,
};
