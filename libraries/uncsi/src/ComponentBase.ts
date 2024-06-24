import { ComponentData, ComponentStateData, TraitData } from "./NodeData.types";
import { Node } from "./Node";
import { Observable } from "@amodx/core/Observers";
import { Pipeline } from "@amodx/core/Pipelines";
import { TraitBase, TraitBaseConstructor } from "./TraitBase";
import { NodeRegister } from "./NodeRegister";
import { NodeGraph } from "./NodeGraph";
import { Schema, ObjectSchemaInstance } from "@amodx/schemas";
export interface ComponentMetaData<Properties extends object = any> {
  id: string;
  name: string;
  schema?: Schema<Properties>;
  [key: string]: any;
}
export type ComponentCreateFC<Properties extends object = any> = (
  overrides: Partial<Properties>,
  traits?: TraitData[],
  state?: ComponentStateData
) => ComponentData<Properties>;

export interface ComponentBaseConstructor<Properties extends object = any> {
  Meta: ComponentMetaData<Properties>;
  Create: ComponentCreateFC<Properties>;
  new (node: Node, data: ComponentData<Properties>): ComponentBase<Properties>;
}

export interface ComponentObservers {}

export class ComponentObservers {
  disposed = new Observable();
  traitAdded = new Observable<TraitBase>();
  traitRemoved = new Observable<TraitBase>();
  traitsUpdated = new Observable();
}

export interface ComponentPipelines {}

class ComponentBasePipelines<Properties extends object = any> {
  disposed = new Pipeline<ComponentBase<Properties>>();
  toJSON = new Pipeline<ComponentData<Properties>>();
  copy = new Pipeline<ComponentData<Properties>>();
}

export interface ComponentBase {}

export abstract class ComponentBase<Properties extends object = any> {
  static OnCreateData = new Pipeline<ComponentData>();
  static OnCreate = new Observable<ComponentBase>();
  static CreateBase(
    traits?: TraitData[],
    state?: ComponentStateData
  ): ComponentData {
    return this.OnCreateData.pipe({
      type: "",
      state: state ? state : [],
      properties: "",
      traits: traits ? traits : [],
    });
  }

  isNode: false = false;
  isComponent: true = true;
  isTrait: false = false;

  type: string;
  state: ComponentStateData;
  properties: ObjectSchemaInstance<Properties>;
  observers = new ComponentObservers();
  pipelines = new ComponentBasePipelines<Properties>();
  traits: TraitBase<any>[] = [];
  constructor(public node: Node, data: ComponentData<Properties>) {
    this.type = data.type;
    for (const component of data.traits) {
      this.addTraits(component);
    }
    this.state = data.state;
    if (this.getClass().Meta.schema)
      this.properties = this.getClass().Meta.schema!.instantiate(
        data.properties
      );

    ComponentBase.OnCreate.notify(this);
  }

  abstract init(): Promise<void>;
  abstract getClass(): ComponentBaseConstructor;
  getMeta() {
    return this.getClass().Meta;
  }
  async initAllTraits() {
    for (const trait of this.traits) {
      await trait.init();
    }
  }

  *traverseTraits(): Generator<TraitBase> {
    const children = [...this.traits];
    while (children.length) {
      const child = children.shift()!;
      yield child;
      if (child.traits.length) children.push(...child.traits);
    }
  }

  private _disposed = false;
  isDisposed() {
    return this._disposed;
  }
  dispose() {
    this._disposed = true;
    for (const child of this.traits) {
      child.dispose();
    }
    this.pipelines.disposed.pipe(this);
    this.observers.disposed.notify();
  }

  getTraitByClass<TraitClass extends TraitBase>(
    traitClass: TraitBaseConstructor
  ) {
    return this.getTraitByType(traitClass.Meta.id) as TraitClass;
  }

  addTraits(...traits: TraitData[]) {
    for (const trait of traits) {
      const traitType = NodeRegister.getTrait(trait.type);
      const newTrait = new traitType(this, trait);
      this.traits.push(newTrait);
      this.observers.traitAdded.notify(newTrait);
    }
    this.observers.traitsUpdated.notify();
  }

  removeTraitByIndex(index: number) {
    const trait = this.traits[index];
    if (trait) {
      const child = this.traits.splice(index, 1)![0];
      this.observers.traitRemoved.notify(child);
      return true;
    }
    return false;
  }
  removeTrait(type: string) {
    return this.removeTraitByIndex(
      this.traits.findIndex((_) => _.getMeta().name)
    );
  }

  getTraitByType(type: string) {
    return this.traits.find((_) => _.type == type);
  }
  getAllTraitsOfType(type: string) {
    return this.traits.filter((_) => _.type == type);
  }

  copy(): ComponentData {
    return this.pipelines.toJSON.pipe({
      properties: this.properties ? this.properties.getSchema().store() : {},
      type: this.getMeta().id,
      state: this.state,
      traits: this.traits.map((_) => _.copy()),
    });
  }
  toJSON(): ComponentData {
    return this.pipelines.toJSON.pipe({
      properties: this.properties ? this.properties.getSchema().store() : {},
      type: this.getMeta().id,
      state: this.state,
      traits: this.traits.map((_) => _.toJSON()),
    });
  }
}
