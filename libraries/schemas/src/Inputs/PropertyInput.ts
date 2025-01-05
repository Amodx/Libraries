import { Pipeline } from "@amodx/core/Pipelines";
import { SchemaNode } from "../Schemas/SchemaNode";

type GetPipelineData<Value = any> = { value: Value; input: PropertyInputBase };
type SetPipelineData<Value = any> = {
  newValue: Value;
  input: PropertyInputBase;
};

class PropertyInputPipelines<Value = any> {
  onGet = new Pipeline<GetPipelineData<Value>>();
  onSet = new Pipeline<SetPipelineData<Value>>();
}

export interface PropertyInputBaseProperties {
  disabled?: boolean;
  required?: boolean;
  validator?: string;
  variation?: string;
}

export interface PropertyInputData<
  Value = any,
  Properties extends PropertyInputBaseProperties = PropertyInputBaseProperties,
> {
  type: string;
  properties: Properties;
}

export interface AbstractPropertyInput<
  Value extends any = any,
  Properties extends PropertyInputBaseProperties = PropertyInputBaseProperties,
> {
  id: string;
  name?: string;
  init?(input: PropertyInputBase<Value, Properties>): void;
  createProperties(properties: Partial<Properties>): Properties;
  compare(value1: Value, value2: Value): boolean;
}

export class PropertyInputBase<Value = any, Properties extends PropertyInputBaseProperties = PropertyInputBaseProperties> {
  private _getData: GetPipelineData;
  private _setData: SetPipelineData;
  pipelines = new PropertyInputPipelines();
  constructor(
    public abstractInput: AbstractPropertyInput<Value>,
    public data: PropertyInputData<Value, Properties>,
    public node: SchemaNode
  ) {
    this._getData = {
      input: this,
      value: this.node.get(),
    };
    this._setData = {
      input: this,
      newValue: this.node.get(),
    };
    if (abstractInput.init) abstractInput.init(this);
  }

  compare(value1: Value, value2: Value) {
    return this.abstractInput.compare(value1, value2);
  }
  get() {
    this._getData.value = this.node.get();
    return this.pipelines.onGet.pipe(this._getData).value;
  }
  set(newValue: Value) {
    this._setData.newValue = newValue;
    this.node.update(this.pipelines.onSet.pipe(this._setData).newValue);
  }
}
