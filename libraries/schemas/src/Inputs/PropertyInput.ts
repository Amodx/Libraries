import { Pipeline } from "@amodx/core/Pipelines";
import { SchemaNode } from "Schemas/SchemaNode";

class PropertyInputPipelines<Value = any> {
  onGet = new Pipeline<{ value: Value; input: PropertyInputBase }>();
  onSet = new Pipeline<{ newValue: any; input: PropertyInputBase }>();
}

export interface PropertyInputData<
  Value = any,
  Properties extends object = any
> {
  type: string;
  properties: Properties;
  mode?: string;
  required?: boolean;
  validator?: string;
}

export interface PropertyInputMetaData {
  id: string;
  name: string;
  [key: string]: any;
}

export interface PropertyInputConstructor<
  Value = any,
  Properties extends object = any
> {
  Meta: PropertyInputMetaData;
  Create(
    overrides: Partial<PropertyInputData<Value, Properties>>
  ): PropertyInputData<Value, Properties>;
  new (
    data: PropertyInputData<Value, Properties>,
    node: SchemaNode
  ): PropertyInputBase<Value, Properties>;
}

export interface PropertyInputBase {
  init?(): void;
}

export abstract class PropertyInputBase<
  Value = any,
  Properties extends object = any
> {
  static CreateBase<Value = any, Properties extends object = any>(
    data: Partial<PropertyInputConstructor<Value, Properties>>
  ): PropertyInputData<Value, Properties> {
    return {
      type: "",
      properties: {} as Properties,
      ...data,
    };
  }

  pipelines = new PropertyInputPipelines();
  constructor(
    public data: PropertyInputData<Value, Properties>,
    public node: SchemaNode
  ) {
    if (this.init) this.init();
  }

  get() {
    return this.pipelines.onGet.pipe({
      input: this,
      value: this.node.property.value,
    }).value;
  }
  set(newValue: Value) {
    this.node.update(
      this.pipelines.onSet.pipe({
        input: this,
        newValue,
      }).newValue
    );
  }
  abstract getClass(): PropertyInputConstructor<Value, Properties>;
  abstract getMeta(): PropertyInputMetaData;
}
