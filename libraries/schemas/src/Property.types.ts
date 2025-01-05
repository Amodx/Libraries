import { SchemaNode } from "./Schemas/SchemaNode";
import { PropertyInputBase, PropertyInputData } from "./Inputs/PropertyInput";
import { Property } from "./Properties/Property";
export type PropertyCreateData<
  Value extends any,
  Input extends PropertyInputData,
> = {
  name?: string;
  value?: Value;
  initialize?: (node: SchemaNode) => void;
} & Partial<Input["properties"]>;

export type PropertyFC<Value extends any, Input extends PropertyInputBase> = (
  id: string,
  data?: Exclude<PropertyCreateData<Value, Input["data"]>, "id">
) => Property<Value, Input["data"]>;

export type PropertyRenderFCDefaultProps<
  Value extends any,
  Input extends PropertyInputBase,
> = {
  node: SchemaNode<Value, Input>;
};

export type PropertyRenderFC<
  RenderedType extends any,
  Value extends any,
  Input extends PropertyInputBase,
  Props extends any = {},
> = (props: Props & PropertyRenderFCDefaultProps<Value,Input>) => RenderedType;
