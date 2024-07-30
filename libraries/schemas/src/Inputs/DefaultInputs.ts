import { PropertyInputBase, PropertyInputMetaData } from "./PropertyInput";
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

  compare(value1: string, value2: string): boolean {
    return value1 == value2;
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

  compare(value1: string, value2: string): boolean {
    return value1 == value2;
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

  compare(value1: number, value2: number): boolean {
    return value1 == value2;
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

  compare(value1: number, value2: number): boolean {
    return value1 == value2;
  }

  getClass() {
    return FloatInput;
  }
  getMeta(): PropertyInputMetaData {
    return FloatInput.Meta;
  }
}

class Vec2Input extends PropertyInputBase<
  { x: number; y: number },
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

  compare(
    value1: { x: number; y: number },
    value2: { x: number; y: number }
  ): boolean {
    return value1.x == value2.x && value1.y == value2.y;
  }

  getClass() {
    return Vec2Input;
  }
  getMeta(): PropertyInputMetaData {
    return Vec2Input.Meta;
  }
}

class Vec3Input extends PropertyInputBase<
  { x: number; y: number; z: number },
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

  compare(
    value1: { x: number; y: number; z: number },
    value2: { x: number; y: number; z: number }
  ): boolean {
    return value1.x == value2.x && value1.y == value2.y && value1.z == value2.z;
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
  compare(value1: number, value2: number): boolean {
    return value1 == value2;
  }
  getClass() {
    return IntInput;
  }
  getMeta(): PropertyInputMetaData {
    return IntInput.Meta;
  }
}

class SelectInput extends PropertyInputBase<
  string | number,
  {
    options: string[] | [display: string, value: string | number][];
    mode?: string;
  }
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
  compare(value1: string | number, value2: string | number): boolean {
    return value1 == value2;
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
  compare(value1: string, value2: string): boolean {
    return value1 == value2;
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
  compare(value1: string, value2: string): boolean {
    return value1 == value2;
  }

  getClass() {
    return PasswordInput;
  }
  getMeta(): PropertyInputMetaData {
    return PasswordInput.Meta;
  }
}

class CheckboxInput extends PropertyInputBase<boolean, {}> {
  static Meta = {
    id: "checkbox",
    name: "Checkbox",
  };

  static Create(data: Partial<CheckboxInput["data"]>): CheckboxInput["data"] {
    return {
      ...PropertyInputBase.CreateBase({}),
      type: CheckboxInput.Meta.id,
      properties: {},
      ...data,
    };
  }
  
  compare(value1: boolean, value2: boolean): boolean {
    return value1 == value2;
  }

  getClass() {
    return CheckboxInput;
  }
  getMeta(): PropertyInputMetaData {
    return CheckboxInput.Meta;
  }
}

class DateInput extends PropertyInputBase<string, {}> {
  static Meta = {
    id: "date",
    name: "Date",
  };

  static Create(data: Partial<DateInput["data"]>): DateInput["data"] {
    return {
      ...PropertyInputBase.CreateBase({}),
      type: DateInput.Meta.id,
      properties: {},
      ...data,
    };
  }
  compare(value1: string, value2: string): boolean {
    return value1 == value2;
  }

  getClass() {
    return DateInput;
  }
  getMeta(): PropertyInputMetaData {
    return DateInput.Meta;
  }
}

class TextareaInput extends PropertyInputBase<
  string,
  { rows: number; cols: number }
> {
  static Meta = {
    id: "textarea",
    name: "Textarea",
  };

  static Create(data: Partial<TextareaInput["data"]>): TextareaInput["data"] {
    return {
      ...PropertyInputBase.CreateBase({}),
      type: TextareaInput.Meta.id,
      properties: {
        rows: 4,
        cols: 50,
      },
      ...data,
    };
  }
  compare(value1: string, value2: string): boolean {
    return value1 == value2;
  }

  getClass() {
    return TextareaInput;
  }
  getMeta(): PropertyInputMetaData {
    return TextareaInput.Meta;
  }
}

class EmailInput extends PropertyInputBase<string, {}> {
  static Meta = {
    id: "email",
    name: "Email",
  };

  static Create(data: Partial<EmailInput["data"]>): EmailInput["data"] {
    return {
      ...PropertyInputBase.CreateBase({}),
      type: EmailInput.Meta.id,
      properties: {},
      ...data,
    };
  }
  compare(value1: string, value2: string): boolean {
    return value1 == value2;
  }

  getClass() {
    return EmailInput;
  }
  getMeta(): PropertyInputMetaData {
    return EmailInput.Meta;
  }
}

class UrlInput extends PropertyInputBase<string, {}> {
  static Meta = {
    id: "url",
    name: "URL",
  };

  static Create(data: Partial<UrlInput["data"]>): UrlInput["data"] {
    return {
      ...PropertyInputBase.CreateBase({}),
      type: UrlInput.Meta.id,
      properties: {},
      ...data,
    };
  }
  compare(value1: string, value2: string): boolean {
    return value1 == value2;
  }

  getClass() {
    return UrlInput;
  }
  getMeta(): PropertyInputMetaData {
    return UrlInput.Meta;
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
  PasswordInput,
  CheckboxInput,
  DateInput,
  TextareaInput,
  EmailInput,
  UrlInput
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
  CheckboxInput as CheckboxPropertyInput,
  DateInput as DatePropertyInput,
  TextareaInput as TextareaPropertyInput,
  EmailInput as EmailPropertyInput,
  UrlInput as UrlPropertyInput,
};
