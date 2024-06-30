import { PropertyConditionAction } from "./PropertyConditionAction";
import { PropertyInputBase, PropertyInputData } from "../Inputs/PropertyInput";
import { SchemaNode } from "../Schemas/SchemaNode";

class PropertyState {
  static Create(data: Partial<PropertyState>) {
    return new PropertyState(data.enabled, data.locked);
  }
  private constructor(
    public enabled = true,
    public locked = false,
    public valid = true
  ) {}
}

export class Property<
  Value = any,
  Input extends PropertyInputData | null = null
> {
  static Create<Value = any, Input extends PropertyInputData | null = null>(
    data: Partial<Property<Value, Input>>
  ) {
    return new Property<Value, Input>(
      data.id ? data.id : "",
      data.name ? data.name : data.id ? data.id : "",
      data.value as any,
      data.state ? PropertyState.Create(data.state) : PropertyState.Create({}),
      data.initialize,
      data.input,
      data.editable,
      data.conditions,
      data.children
    );
  }

  private constructor(
    public id: string,
    public name: string,
    public value: Value,
    public state: PropertyState,
    public initialize?: (node: SchemaNode) => void,
    public input?: Input,
    public editable?: boolean,
    public conditions?: PropertyConditionAction[],
    public children?: Property<any>[]
  ) {}
}
