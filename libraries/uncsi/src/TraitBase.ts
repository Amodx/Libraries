import { TraitData, TraitStateData } from "./NodeData.types";
import { ComponentBase } from "./ComponentBase";
import { Observable } from "@amodx/core/Observers";
import { Pipeline } from "@amodx/core/Pipelines";
import { NodeRegister } from "./NodeRegister";
import { NodeGraph } from "./NodeGraph";
import { Node } from "./Node";
import { Schema, ObjectSchemaInstance } from "@amodx/schemas";
export interface TraitMetaData {
  id: string;
  name: string;
  schema?: Schema;
  [key: string]: any;
}

export type TraitCreateFC<Properties extends object = any> = (
  overrides: Partial<Properties>,
  traits?: TraitData[],
  state?: TraitStateData
) => TraitData<Properties>;

export interface TraitBaseConstructor<Properties extends object = any> {
  Meta: TraitMetaData;
  Create: TraitCreateFC<Properties>;
  new (
    parent: TraitBase<any> | ComponentBase<any>,
    data: TraitData<Properties>
  ): TraitBase<Properties>;
}

export interface TraitObservers {
  [key: string]: any;
}

export class TraitObservers {
  disposed = new Observable();
  traitAdded = new Observable<TraitBase>();
  traitRemoved = new Observable<TraitBase>();
}

class TraitBasePipelines<Properties extends object = any> {
  disposed = new Pipeline<TraitBase<Properties>>();
  toJSON = new Pipeline<TraitData<Properties>>();
  copy = new Pipeline<TraitData<Properties>>();
}
export interface TraitBase {}

export abstract class TraitBase<Properties extends object = any> {
  static OnCreateData = new Pipeline<TraitData>();
  static OnCreate = new Observable<TraitBase>();
  static CreateBase(traits?: TraitData[], state?: TraitStateData): TraitData {
    return this.OnCreateData.pipe({
      type: "",
      state: state ? state : {},
      properties: {},
      traits: traits ? traits : [],
    });
  }
  isNode: false = false;
  isComponent: false = false;
  isTrait: true = true;

  type: string;
  state: TraitStateData;
  properties: ObjectSchemaInstance<Properties>;
  observers = new TraitObservers();
  pipelines = new TraitBasePipelines<Properties>();
  traits: TraitBase<any>[] = [];
  constructor(
    public parent: TraitBase<any> | ComponentBase<any>,
    data: TraitData<Properties>
  ) {
    this.type = data.type;
    for (const component of data.traits) {
      this.addTraits(component);
    }
    this.state = data.state;
    if (this.getClass().Meta.schema)
      this.properties = this.getClass().Meta.schema!.instantiate(
        data.properties
      );
    TraitBase.OnCreate.notify(this);
  }

  abstract init(): Promise<void>;
  abstract getClass(): TraitBaseConstructor<Properties>;
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

  private _active = false;
  isActive() {
    return this._active;
  }
  setActive(active: boolean) {
    this._active = active;
    this.observers.active.notify(active);
  }

  private _visible = false;
  isVisible() {
    return this._visible;
  }
  setVisible(visible: boolean) {
    this._visible = visible;
    this.observers.visible.notify(visible);
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
  addTraits(...traits: TraitData[]) {
    for (const trait of traits) {
      const traitType = NodeRegister.getTrait(trait.type);
      const newTrait = new traitType(this, trait);
      this.traits.push(newTrait);
      this.observers.traitAdded.notify(newTrait);
    }
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
  getTrait(type: string) {
    return this.traits.find((_) => _.type == type);
  }
  getAllTraitsOfType(type: string) {
    return this.traits.filter((_) => _.type == type);
  }

  getNode(): Node {
    if (this.parent.isComponent) return this.parent.node;
    let parent: TraitBase | ComponentBase = this.parent;
    while (parent) {
      if (parent.isComponent) return parent.node;
      parent = parent.parent;
    }
    throw new Error(`Node not found for trait.`);
  }

  copy(): TraitData {
    return this.pipelines.copy.pipe({
      properties: this.properties.getSchema().store(),
      state: this.state,
      type: this.type,
      traits: this.traits.map((_) => _.copy()),
    });
  }

  toJSON(): TraitData {
    return this.pipelines.toJSON.pipe({
      properties: this.properties.getSchema().store(),
      state: this.state,
      type: this.type,
      traits: this.traits.map((_) => _.toJSON()),
    });
  }
}
