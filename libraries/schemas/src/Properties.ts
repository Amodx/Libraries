import { PropertyInputBase, PropertyInputData } from "./Inputs/PropertyInput";
import {
  ColorPropertyInput,
  FilePathPropertyInput,
  FloatPropertyInput,
  IntPropertyInput,
  PasswordPropertyInput,
  RangePropertyInput,
  SelectPropertyInput,
  StringPropertyInput,
  Vec2PropertyInput,
  Vec3PropertyInput,
  CheckboxPropertyInput,
  DatePropertyInput,
  TextareaPropertyInput,
  EmailPropertyInput,
  UrlPropertyInput,
} from "./Inputs/DefaultInputs";
import { ObjectPath } from "./Properties/ObjectPath";
import { Property } from "./Properties/Property";
import { PropertyCondition } from "./Properties/PropertyCondition";
import { PropertyConditionAction } from "./Properties/PropertyConditionAction";
import { SchemaNode } from "./Schemas/SchemaNode";

type PropertyCreateData<Value extends any, Input extends PropertyInputData> = {
  name?: string;
  value?: Value;
  validator?: string;
  initialize?: (node: SchemaNode) => void;
} & Partial<Input["properties"]>;

type PropertyFC<Value extends any, Input extends PropertyInputBase> = (
  id: string,
  data?: Exclude<PropertyCreateData<Value, Input["data"]>, "id">
) => Property<Value, Input["data"]>;

export const PropConditions = Object.assign(
  (data: Property<any, any>, ...conditions: PropertyConditionAction[]) => {
    data.conditions = conditions;
    return data;
  },
  {
    Action: PropertyConditionAction.Create,
    Condition: PropertyCondition.Create,
    Path: ObjectPath.Create,
  }
);

export const ObjectProp = (
  id: string,
  name: string,
  ...properties: Property<any, any>[]
) => {
  return Property.Create({
    id: id,
    name: name,
    children: properties,
  });
};
export const AnyProp: PropertyFC<any, any> = (id, data = {}) => {
  return Property.Create({
    id,
    name: data.name,
    value: data.value ? data.value : null,
    initialize: data.initialize,
    input: null,
  });
};

export const StringProp: PropertyFC<string, StringPropertyInput> = (
  id,
  data = {}
) => {
  return Property.Create({
    id,
    name: data.name,
    value: data.value ? data.value : "",
    initialize: data.initialize,
    input: StringPropertyInput.Create({
      validator: data.validator,
      properties: {
        min: data.min ? data.min : 0,
        max: data.max ? data.max : Number.MAX_SAFE_INTEGER,
      },
    }),
  });
};

export const PasswordProp: PropertyFC<string, PasswordPropertyInput> = (
  id,
  data = {}
) => {
  return Property.Create({
    id,
    name: data.name,
    value: data.value ? data.value : "",
    initialize: data.initialize,
    input: PasswordPropertyInput.Create({
      validator: data.validator,
      properties: {
        min: data.min ? data.min : 0,
        max: data.max ? data.max : Number.MAX_SAFE_INTEGER,
      },
    }),
  });
};

export const FloatProp: PropertyFC<number, FloatPropertyInput> = (
  id,
  data = {}
) => {
  return Property.Create({
    id,
    name: data.name,
    value: data.value ? data.value : 0,
    initialize: data.initialize,
    input: FloatPropertyInput.Create({
      validator: data.validator,
      properties: {
        min: data.min ? data.min : 0,
        max: data.max ? data.max : Number.MAX_VALUE,
      },
    }),
  });
};
export const IntProp: PropertyFC<number, IntPropertyInput> = (
  id,
  data = {}
) => {
  return Property.Create({
    id,
    name: data.name,
    value: data.value ? data.value : 0,
    initialize: data.initialize,
    input: IntPropertyInput.Create({
      validator: data.validator,
      properties: {
        min: data.min ? data.min : 0,
        max: data.max ? data.max : Number.MAX_SAFE_INTEGER,
      },
    }),
  });
};
export const RangeProp: PropertyFC<number, RangePropertyInput> = (
  id,
  data = {}
) => {
  return Property.Create({
    id,
    name: data.name,
    value: data.value ? data.value : 0,
    initialize: data.initialize,
    input: RangePropertyInput.Create({
      validator: data.validator,
      properties: {
        min: data.min ? data.min : 0,
        max: data.max ? data.max : Number.MAX_VALUE,
        step: data.step ? data.step : 0.1,
      },
    }),
  });
};
export const ColorProp: PropertyFC<string, ColorPropertyInput> = (
  id,
  data = {}
) => {
  return Property.Create({
    id,
    name: data.name,
    value: data.value ? data.value : "#ffffff",
    initialize: data.initialize,
    input: ColorPropertyInput.Create({
      validator: data.validator,
      properties: {},
    }),
  });
};

export const SelectProp: PropertyFC<string | number, SelectPropertyInput> = (
  id,
  data = {}
) => {
  return Property.Create<string | number, SelectPropertyInput["data"]>({
    id,
    name: data.name,
    value: data.value ? data.value : "",
    initialize: data.initialize,
    input: SelectPropertyInput.Create({
      validator: data.validator,
      properties: {
        options: data.options ? data.options : [],
        mode: data.mode,
      },
    }),
  });
};

export const FilePathProp: PropertyFC<string, FilePathPropertyInput> = (
  id,
  data = {}
) => {
  return Property.Create({
    id,
    name: data.name,
    value: data.value ? data.value : "#ffffff",
    initialize: data.initialize,
    input: FilePathPropertyInput.Create({
      validator: data.validator,
      properties: {
        acceptedFileExtensions: data.acceptedFileExtensions
          ? data.acceptedFileExtensions
          : [],
      },
    }),
  });
};

export const Vec2Prop: PropertyFC<
  { x: number; y: number },
  Vec2PropertyInput
> = (id, data = {}) => {
  return Property.Create({
    id,
    name: data.name,
    value: data.value ? data.value : { x: 0, y: 0 },
    initialize: data.initialize,
    input: Vec2PropertyInput.Create({
      validator: data.validator,
      properties: {
        valueType: data.valueType ? data.valueType : "position",
      },
    }), 
  });
};

export const Vec3Prop: PropertyFC<
  { x: number; y: number; z: number },
  Vec3PropertyInput
> = (id, data = {}) => {
  return Property.Create({
    id,
    name: data.name,
    value: data.value ? data.value : { x: 0, y: 0, z: 0 },

    initialize: data.initialize,
    input: Vec3PropertyInput.Create({
      validator: data.validator,
      properties: {
        valueType: data.valueType ? data.valueType : "position",
      },
    }),
  });
};

export const CheckboxProp: PropertyFC<boolean, CheckboxPropertyInput> = (
  id,
  data = {}
) => {
  return Property.Create({
    id,
    name: data.name,
    value: data.value ? data.value : false,
    initialize: data.initialize,
    input: CheckboxPropertyInput.Create({
      validator: data.validator,
      properties: {},
    }),
  });
};

export const DateProp: PropertyFC<string, DatePropertyInput> = (
  id,
  data = {}
) => {
  return Property.Create({
    id,
    name: data.name,
    value: data.value ? data.value : "",
    initialize: data.initialize,
    input: DatePropertyInput.Create({
      validator: data.validator,
      properties: {},
    }),
  });
};

export const TextareaProp: PropertyFC<string, TextareaPropertyInput> = (
  id,
  data = {}
) => {
  return Property.Create({
    id,
    name: data.name,
    value: data.value ? data.value : "",
    initialize: data.initialize,
    input: TextareaPropertyInput.Create({
      validator: data.validator,
      properties: {
        rows: data.rows ? data.rows : 4,
        cols: data.cols ? data.cols : 10,
      },
    }),
  });
};

export const EmailProp: PropertyFC<string, EmailPropertyInput> = (
  id,
  data = {}
) => {
  return Property.Create({
    id,
    name: data.name,
    value: data.value ? data.value : "",
    initialize: data.initialize,
    input: EmailPropertyInput.Create({
      validator: data.validator,
      properties: {},
    }),
  });
};

export const UrlProp: PropertyFC<string, UrlPropertyInput> = (
  id,
  data = {}
) => {
  return Property.Create({
    id,
    name: data.name,
    value: data.value ? data.value : "",
    initialize: data.initialize,
    input: UrlPropertyInput.Create({
      validator: data.validator,
      properties: {},
    }),
  });
};
