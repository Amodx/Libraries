import { Property } from "../Properties/Property";
import { PropertyInputBase } from "../Inputs/PropertyInput";
import { PropertyInputRegister } from "../Inputs/PropertyInputRegister";

import { Observable } from "@amodx/core/Observers/index";
import { Pipeline } from "@amodx/core/Pipelines";
import { PropertyConditionAction } from "Properties/PropertyConditionAction";
export class TemplateNode {
  constructor(public property: Property) {}
  children: TemplateNode[];
}

class SchemaNodeObservers {
  updated = new Observable<Property>();
  loadedIn = new Observable<Property>();
}

class SchemaNodePipelines {
  onStore = new Pipeline<Property>();
  updated = new Pipeline<{ newValue: any; property: Property }>();
  loadedIn = new Pipeline<{ value: any; property: Property }>();
}

export class SchemaNode {
  children: SchemaNode[] | null = null;
  conditions: PropertyConditionAction[];
  input: PropertyInputBase;

  observers = new SchemaNodeObservers();
  pipelines = new SchemaNodePipelines();

  constructor(public property: Property, public root: any) {
    if (property.input) {
      const inputClass = PropertyInputRegister.getProperty(property.input.id);
      this.input = new inputClass(property.input, this);
    }
    if (property.conditions && property.conditions.length) {
      for (const condition of property.conditions) {
        condition.node = this;
        this.conditions.push(condition);
      }
      this.observers.updated.subscribe(this, () => {
        this.conditions.forEach((_) => _.evaluate(this.root));
      });
    }
  }

  store() {
    return this.pipelines.onStore.pipe(Property.Create(this.property)).value;
  }
  loadIn(value: any) {
    const oldValue = this.property.value;
    this.property.value = this.pipelines.loadedIn.pipe({
      property: this.property,
      value,
    }).value;
    if (oldValue != this.property.value)
      this.observers.loadedIn.notify(this.property);
  }
  update(newValue: any) {
    const oldValue = this.property.value;
    this.property.value = this.pipelines.updated.pipe({
      property: this.property,
      newValue,
    }).newValue;
    if (oldValue != this.property.value)
      this.observers.updated.notify(this.property);
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
