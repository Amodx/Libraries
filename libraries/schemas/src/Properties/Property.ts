import { PropertyConditionAction } from "./PropertyConditionAction";
import { PropertyInputBase } from "../Inputs/PropertyInput";
import { SchemaNode } from "Schemas/SchemaNode";

class PropertyState {
  static Create(data: Partial<PropertyState>) {
    return new PropertyState(data.enabled, data.locked);
  }
  private constructor(public enabled = true, public locked = false) {}
}

export class Property<Value = any, Input extends PropertyInputBase = any> {
  static Create<T>(data: Partial<Property<T>>) {
    return new Property(
      data.id ? data.id : "",
      data.name ? data.name : data.id ? data.id : "",
      data.value as any,
      data.state ? PropertyState.Create(data.state) : PropertyState.Create({}),
      data.hydrate,
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
    public hydrate?: (node:SchemaNode )=>void,
    public input?: Input,
    public editable?: boolean,
    public conditions?: PropertyConditionAction[],
    public children?: Property<any>[]
  ) {}
}
