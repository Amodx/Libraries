import { Property } from "../Properties/Property";
import { PropertyInputBase, PropertyInputData } from "../Inputs/PropertyInput";
import { PropertyInputRegister } from "../Inputs/PropertyInputRegister";

import { Observable } from "@amodx/core/Observers/index";
import { Pipeline } from "@amodx/core/Pipelines";
import { PropertyConditionAction } from "../Properties/PropertyConditionAction";
import { ObjectSchema } from "./ObjectSchema";
import {
  ObjectPropertyValidatorRegister,
  ObjectPropertyValidatorResponse,
} from "../Validation";
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
  set = new Observable<SchemaNode<Value, Input>>();
  loadedIn = new Observable<SchemaNode<Value, Input>>();
  updatedOrLoadedIn = new Observable<SchemaNode<Value, Input>>();
  evaluate = new Observable<void>();
  validate = new Observable<void>();
}

class SchemaNodePipelines<
  Value = any,
  Input extends PropertyInputBase<any, any> = any
> {
  onStore = new Pipeline<Property<Value, Input["data"]>>();
  updated = new Pipeline<{ newValue: any; node: SchemaNode<Value, Input> }>();
  
  loadedIn = new Pipeline<{ value: any; node: SchemaNode<Value, Input> }>();
}

class SchemaNodeProxy<Value = any> {
  constructor(public get: () => Value, public set: (value: Value) => Value) {}
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

  validatorResponse: ObjectPropertyValidatorResponse;

  constructor(
    public property: Property<Value, Input["data"]>,
    public root: any
  ) {
    if (property.input) {
      const inputClass = PropertyInputRegister.getProperty(property.input.type);
      this.input = new inputClass(property.input, this as any) as any;
    }
  }

  private proxy: SchemaNodeProxy<Value> | null = null;

  enableProxy(get: () => Value, set: (value: Value) => Value) {
    this.proxy = new SchemaNodeProxy(get, set);
  }

  disableProxy() {
    this.proxy = null;
  }

  private getValue() {
    if (!this.proxy) return this.property.value;
    return this.proxy.get();
  }

  private setValue(value: Value) {
    if (!this.proxy) return (this.property.value = value);
    return this.proxy.set(value);
  }

  init(schema: ObjectSchema) {
    const property = this.property;
    if (property.conditions && property.conditions.length) {
      for (const action of property.conditions) {
        for (const condition of action.conditions) {
          const otherNode = schema.getNode(condition.path)!;
          otherNode.observers.updatedOrLoadedIn.subscribe(this, () => {
            action.evaluate(otherNode.get(), this);
          });
          this.observers.evaluate.subscribe(this, () => {
            action.evaluate(otherNode.get(), this);
          });
        }
        this.conditions.push(action);
      }
    }
    if (property.input?.validator) {
      const validator = ObjectPropertyValidatorRegister.getValidator(
        property.input.validator
      );

      this.observers.updatedOrLoadedIn.subscribe(this, () => {
        const response = validator.validate(this.get(), this);
        this.validatorResponse = response;
        if (response.success) {
          if (!property.state.valid) {
            property.state.valid = true;
            this.observers.stateUpdated.notify(this);
          }
        } else {
          if (property.state.valid) {
            property.state.valid = false;
            this.observers.stateUpdated.notify(this);
          }
        }
      });
    }
  }

  evaluateConditions() {
    this.observers.evaluate.notify();
  }

  validate() {
    this.observers.validate.notify();
  }

  isValid() {
    return this.property.state.valid;
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
    this.setValue(
      this.pipelines.loadedIn.pipe({
        node: this,
        value,
      }).value
    );
    this.observers.loadedIn.notify(this);
    this.observers.updatedOrLoadedIn.notify(this);
  }

  get() {
    return this.getValue();
  }

  update(newValue: any) {
    const oldValue = this.getValue();
    const finalNewValue = this.pipelines.updated.pipe({
      node: this,
      newValue,
    }).newValue;
    this.setValue(finalNewValue);
    this.observers.set.notify(this);

    if (this.input) {
      if (!this.input.compare(oldValue, finalNewValue)) {
        this.observers.updated.notify(this);
        this.observers.updatedOrLoadedIn.notify(this);
      }
      return;
    }

    if (oldValue != finalNewValue) {
      this.observers.updated.notify(this);
      this.observers.updatedOrLoadedIn.notify(this);
    }
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
