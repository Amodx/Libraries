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
} from "./Inputs/DefaultInputs";
import { Path } from "./Properties/Path";
import { Property } from "./Properties/Property";
import { PropertyCondition } from "./Properties/PropertyCondition";
import { PropertyConditionAction } from "./Properties/PropertyConditionAction";
import { Schema } from "./Schema";
import { SchemaNode } from "./Schemas/SchemaNode";

type PropertyCreateData<T = any, V = any> = {
  id: string;
  name?: string;
  value?: V;
  hydrate?: (node: SchemaNode) => void;
} & T;

type PropertyFC<T = any, V = any> = (
  data: PropertyCreateData<T, V>
) => Property;

export const PropConditions = Object.assign(
  (data: Property, ...conditions: PropertyConditionAction[]) => {
    data.conditions = conditions;
    return data;
  },
  {
    Action: PropertyConditionAction.Create,
    Condition: PropertyCondition.Create,
    Path: Path.Create,
  }
);

export const ObjectProp = (
  id: string,
  name: string,
  ...properties: Property[]
) => {
  return Property.Create({
    id: id,
    name: name,
    children: properties,
  });
};

export const StringProp: PropertyFC<
  StringPropertyInput["data"]["properties"],
  string
> = (data) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : "",
    hydrate: data.hydrate,
    input: StringPropertyInput.Create({
      properties: {
        min: data.min,
        max: data.max,
      },
    }),
  });
};

export const PasswordProp: PropertyFC<
  StringPropertyInput["data"]["properties"],
  string
> = (data) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : "",
    hydrate: data.hydrate,
    input: PasswordPropertyInput.Create({
      properties: {
        min: data.min,
        max: data.max,
      },
    }),
  });
};

export const FloatProp: PropertyFC<
  StringPropertyInput["data"]["properties"],
  number
> = (data) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : 0,
    hydrate: data.hydrate,
    input: FloatPropertyInput.Create({
      properties: {
        min: data.min,
        max: data.max,
      },
    }),
  });
};
export const IntProp: PropertyFC<
  StringPropertyInput["data"]["properties"],
  number
> = (data) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : 0,
    hydrate: data.hydrate,
    input: IntPropertyInput.Create({
      properties: {
        min: data.min,
        max: data.max,
      },
    }),
  });
};
export const RangeProp: PropertyFC<
  RangePropertyInput["data"]["properties"],
  number
> = (data) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : 0,
    hydrate: data.hydrate,
    input: RangePropertyInput.Create({
      properties: {
        min: data.min,
        max: data.max,
        step: data.step,
      },
    }),
  });
};
export const ColorProp: PropertyFC<
  StringPropertyInput["data"]["properties"],
  string
> = (data) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : "#ffffff",
    hydrate: data.hydrate,
    input: ColorPropertyInput.Create({
      properties: {},
    }),
  });
};

export const SelectProp: PropertyFC<
  SelectPropertyInput["data"]["properties"],
  string
> = (data) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : "",
    hydrate: data.hydrate,
    input: SelectPropertyInput.Create({
      properties: {
        options: data.options,
      },
    }),
  });
};

export const FilePathProp: PropertyFC<
  FilePathPropertyInput["data"]["properties"],
  string
> = (data) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : "#ffffff",
    hydrate: data.hydrate,
    input: FilePathPropertyInput.Create({
      properties: {
        acceptedFileExtensions: data.acceptedFileExtensions,
      },
    }),
  });
};

export const Vec2Prop: PropertyFC<
  Vec2PropertyInput["data"]["properties"],
  [number, number]
> = (data) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : [0, 0],
    hydrate: data.hydrate,
    input: Vec2PropertyInput.Create({
      properties: {
        valueType: data.valueType,
      },
    }),
  });
};

export const Vec3Prop: PropertyFC<
  Vec3PropertyInput["data"]["properties"],
  [number, number, number]
> = (data) => {
  return Property.Create({
    id: data.id,
    name: data.name,
    value: data.value ? data.value : [0, 0, 0],
    hydrate: data.hydrate,
    input: Vec3PropertyInput.Create({
      properties: {
        valueType: data.valueType,
      },
    }),
  });
};

Schema.Create(
  StringProp({
    id: "main",
    name: "what is up",
    min: 0,
    max: 100,
  }),
  StringProp({
    id: "main",
    name: "what is up",
    min: 0,
    max: 100,
  }),
  PropConditions(
    ObjectProp(
      "property",
      "Cool",
      StringProp({
        id: "main",
        name: "what is up",
        min: 0,
        max: 100,
      })
    ),
    PropConditions.Action("enable", [
      PropConditions.Condition(PropConditions.Path("a.b"), "==", null),
    ]),
    PropConditions.Action("lock", [
      PropConditions.Condition(PropConditions.Path("a.b"), "==", null),
    ]),
    PropConditions.Action(() => {}, [
      PropConditions.Condition(PropConditions.Path("a.b"), "==", null),
    ])
  )
);
