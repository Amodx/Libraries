import { Property } from "../Properties/Property";
import { PropertyInputBase, PropertyInputData } from "../Inputs/PropertyInput";
import { PropertyInputRegister } from "../Inputs/PropertyInputRegister";

import { Observable } from "@amodx/core/Observers/index";
import { Pipeline } from "@amodx/core/Pipelines";
import { PropertyConditionAction } from "Properties/PropertyConditionAction";
export class TemplateNode {
  constructor(public property: Property) {}
  children: TemplateNode[];
}

class SchemaNodeObservers<
  Value = any,
  Input extends PropertyInputBase<any, any> = any
> {
  stateUpdated = new Observable<SchemaNode<Value, Input>>();
  updated = new Observable<SchemaNode<Value, Input>>();
  loadedIn = new Observable<SchemaNode<Value, Input>>();
}

class SchemaNodePipelines<
  Value = any,
  Input extends PropertyInputBase<any, any> = any
> {
  onStore = new Pipeline<Property<Value, Input["data"]>>();
  updated = new Pipeline<{ newValue: any; node: SchemaNode<Value, Input> }>();
  loadedIn = new Pipeline<{ value: any; node: SchemaNode<Value, Input> }>();
}

export class SchemaNode<
  Value = any,
  Input extends PropertyInputBase<any, any> = any
> {
  children: SchemaNode[] | null = null;
  conditions: PropertyConditionAction[] = [];
  input: Input | null;

  observers = new SchemaNodeObservers<Value, Input>();
  pipelines = new SchemaNodePipelines<Value, Input>();

  constructor(
    public property: Property<Value, Input["data"]>,
    public root: any
  ) {
    if (property.input) {
      const inputClass = PropertyInputRegister.getProperty(property.input.type);
      this.input = new inputClass(property.input, this as any) as any;
    }
    if (property.conditions && property.conditions.length) {
      for (const condition of property.conditions) {
        condition.node = this as any;
        this.conditions.push(condition);
      }
      this.observers.updated.subscribe(this, () => {
        this.conditions.forEach((_) => _.evaluate(this.root));
      });
    }
  
  }

  isEnabled() {
    return this.property.state.enabled;
  }
  setEnabled(enabled: boolean) {
    this.property.state.enabled = enabled;
    this.observers.stateUpdated.notify(this);
  }
  isLocked() {
    return this.property.state.locked;
  }
  setLocked(locked: boolean) {
    this.property.state.locked = locked;
    this.observers.stateUpdated.notify(this);
  }

  store() {
    return this.pipelines.onStore.pipe(Property.Create(this.property)).value;
  }
  loadIn(value: any) {
    const oldValue = this.property.value;
    this.property.value = this.pipelines.loadedIn.pipe({
      node: this,
      value,
    }).value;
    if (oldValue != this.property.value) this.observers.loadedIn.notify(this);
  }
  get() {
    return this.property.value;
  }
  update(newValue: any) {
    const oldValue = this.property.value;
    this.property.value = this.pipelines.updated.pipe({
      node: this,
      newValue,
    }).newValue;
    if (oldValue != this.property.value) this.observers.updated.notify(this);
  }
  forEach(run: (node: SchemaNode) => void) {
    if (!this.children) return;
    for (const child of this.children) {
      run(child);
    }
  }
  map<T>(map: (node: SchemaNode) => T): T[] {
    const data: T[] = [];
    this.forEach((_) => data.push(map(_)));
    return data;
  }
}
