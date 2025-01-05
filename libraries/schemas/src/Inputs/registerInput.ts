import { PropertyFC, PropertyRenderFC } from "Property.types";
import {
  AbstractPropertyInput,
  PropertyInputBase,
  PropertyInputBaseProperties,
  PropertyInputData,
} from "./PropertyInput";
import { PropertyInputRegister } from "./PropertyInputRegister";
import { Property } from "../Properties/Property";
import { SchemaNode } from "../Schemas/SchemaNode";

export type RegisteredInput<
  Value extends any = any,
  Properties extends PropertyInputBaseProperties = PropertyInputBaseProperties,
> = ((
  initalProperties?: Partial<Properties>
) => PropertyInputData<Value, Properties>) & {
  id: string;
  meta: {
    name: string;
  };
  default: PropertyInputBase<Value, Properties>;
  data: PropertyInputData<Value, Properties>;
  properties: Properties;
  value: Value;
  createPropertyFC(
    defaultValue: Value
  ): PropertyFC<Value, PropertyInputBase<Value, Properties>>;
  createPropertyRenderFC<
    RenderedData extends any = any,
    Props extends any = any,
  >(
    fc: (
      props: {
        node: SchemaNode<Value, PropertyInputBase<Value, Properties>>;
      } & Props
    ) => RenderedData
  ): PropertyRenderFC<
    RenderedData,
    Value,
    PropertyInputBase<Value, Properties>,
    Props
  >;
};
export function registerInput<
  Value extends any,
  InitalProperties extends object = {},
>(
  data: AbstractPropertyInput<Value, InitalProperties>
): RegisteredInput<Value, PropertyInputBaseProperties & InitalProperties> {
  PropertyInputRegister.regsiterProperty(data);

  const Create = (
    initalProperties: Partial<InitalProperties> = {}
  ): PropertyInputData<Value, InitalProperties> => {
    return {
      type: data.id,
      properties: data.createProperties(initalProperties),
    };
  };

  return Object.assign(Create, {
    id: data.id,
    meta: {
      name: data.name,
    },
    createPropertyFC(defaultValue: Value) {
      const fc: PropertyFC<
        Value,
        PropertyInputBase<Value, InitalProperties & PropertyInputBaseProperties>
      > = (id, data = {} as any) => {
        return Property.Create({
          id,
          name: data.name,
          value: data.value ? data.value : defaultValue,
          initialize: data.initialize,
          input: Create(data),
        });
      };
      return fc;
    },
    createPropertyRenderFC(fn: any) {
      return fn;
    },
  }) as any;
}
