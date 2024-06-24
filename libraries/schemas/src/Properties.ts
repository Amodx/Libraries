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
  id: string;
  name?: string;
  value?: Value;
  initialize?: (node: SchemaNode) => void;
} & Partial<Input["properties"]>;

type PropertyFC<Value extends any, Input extends PropertyInputBase> = (
  data: PropertyCreateData<Value, Input["data"]>
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
export const AnyProp: PropertyFC<any, any> = (data) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : null,
    initialize: data.initialize,
    input: null,
  });
};

export const StringProp: PropertyFC<string, StringPropertyInput> = (data) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : "",
    initialize: data.initialize,
    input: StringPropertyInput.Create({
      properties: {
        min: data.min ? data.min : 0,
        max: data.max ? data.max : Number.MAX_SAFE_INTEGER,
      },
    }),
  });
};

export const PasswordProp: PropertyFC<string, PasswordPropertyInput> = (
  data
) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : "",
    initialize: data.initialize,
    input: PasswordPropertyInput.Create({
      properties: {
        min: data.min ? data.min : 0,
        max: data.max ? data.max : Number.MAX_SAFE_INTEGER,
      },
    }),
  });
};

export const FloatProp: PropertyFC<number, FloatPropertyInput> = (data) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : 0,
    initialize: data.initialize,
    input: FloatPropertyInput.Create({
      properties: {
        min: data.min ? data.min : 0,
        max: data.max ? data.max : Number.MAX_VALUE,
      },
    }),
  });
};
export const IntProp: PropertyFC<number, IntPropertyInput> = (data) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : 0,
    initialize: data.initialize,
    input: IntPropertyInput.Create({
      properties: {
        min: data.min ? data.min : 0,
        max: data.max ? data.max : Number.MAX_SAFE_INTEGER,
      },
    }),
  });
};
export const RangeProp: PropertyFC<number, RangePropertyInput> = (data) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : 0,
    initialize: data.initialize,
    input: RangePropertyInput.Create({
      properties: {
        min: data.min ? data.min : 0,
        max: data.max ? data.max : Number.MAX_VALUE,
        step: data.step ? data.step : 0.1,
      },
    }),
  });
};
export const ColorProp: PropertyFC<string, ColorPropertyInput> = (data) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : "#ffffff",
    initialize: data.initialize,
    input: ColorPropertyInput.Create({
      properties: {},
    }),
  });
};

export const SelectProp: PropertyFC<string, SelectPropertyInput> = (data) => {
  return Property.Create<string, SelectPropertyInput["data"]>({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : "",
    initialize: data.initialize,
    input: SelectPropertyInput.Create({
      properties: {
        options: data.options ? data.options : [],
      },
    }),
  });
};

export const FilePathProp: PropertyFC<string, FilePathPropertyInput> = (
  data
) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : "#ffffff",
    initialize: data.initialize,
    input: FilePathPropertyInput.Create({
      properties: {
        acceptedFileExtensions: data.acceptedFileExtensions
          ? data.acceptedFileExtensions
          : [],
      },
    }),
  });
};

export const Vec2Prop: PropertyFC<[number, number], Vec2PropertyInput> = (
  data
) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : [0, 0],
    initialize: data.initialize,
    input: Vec2PropertyInput.Create({
      properties: {
        valueType: data.valueType ? data.valueType : "position",
      },
    }),
  });
};

export const Vec3Prop: PropertyFC<
  [number, number, number],
  Vec3PropertyInput
> = (data) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : [0, 0, 0],
    initialize: data.initialize,
    input: Vec3PropertyInput.Create({
      properties: {
        valueType: data.valueType ? data.valueType : "position",
      },
    }),
  });
};

export const CheckboxProp: PropertyFC<boolean, CheckboxPropertyInput> = (
  data
) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : false,
    initialize: data.initialize,
    input: CheckboxPropertyInput.Create({
      properties: {},
    }),
  });
};

export const DateProp: PropertyFC<string, DatePropertyInput> = (data) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : "",
    initialize: data.initialize,
    input: DatePropertyInput.Create({
      properties: {},
    }),
  });
};

export const TextareaProp: PropertyFC<string, TextareaPropertyInput> = (
  data
) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : "",
    initialize: data.initialize,
    input: TextareaPropertyInput.Create({
      properties: {
        rows: data.rows ? data.rows : 4,
        cols: data.cols ? data.cols : 10,
      },
    }),
  });
};

export const EmailProp: PropertyFC<string, EmailPropertyInput> = (data) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : "",
    initialize: data.initialize,
    input: EmailPropertyInput.Create({
      properties: {},
    }),
  });
};

export const UrlProp: PropertyFC<string, UrlPropertyInput> = (data) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : "",
    initialize: data.initialize,
    input: UrlPropertyInput.Create({
      properties: {},
    }),
  });
};
