import { ComponentData, TraitData } from "./NodeData.types";
import { Node } from "./Node";
import { Observable } from "@amodx/core/Observers";
import { Pipeline } from "@amodx/core/Pipelines";
import { TraitBase, TraitBaseConstructor } from "./TraitBase";
import { NodeRegister } from "./NodeRegister";
import { NodeGraph } from "./NodeGraph";

export interface ComponentMetaData {
  id: string;
  name: string;
  schema: any;
  [key: string]: any;
}

export interface ComponentBaseConstructor<Properties extends object = any> {
  Meta: ComponentMetaData;
  CreateNew(
    overrides: Partial<ComponentData<Properties>>
  ): ComponentData<Properties>;
  new (node: Node, data: ComponentData<Properties>): ComponentBase<Properties>;
}

export interface ComponentObservers {
  [key: string]: any;
}

export class ComponentObservers {
  disposed = new Observable();
  traitAdded = new Observable<TraitBase>();
  traitRemoved = new Observable<TraitBase>();
  traitsUpdated = new Observable();
}

export interface ComponentPipelines {
  [key: string]: any;
}

class ComponentBasePipelines<Properties extends object = any> {
  disposed = new Pipeline<ComponentBase<Properties>>();
  toJSON = new Pipeline<ComponentData<Properties>>();
  copy = new Pipeline<ComponentData<Properties>>();
}

export interface ComponentBase {
  [key: string]: any;
}

export abstract class ComponentBase<Properties extends object = any> {
  static CreateBase(): ComponentData {
    return {
      id: NodeGraph.GenerateId(),
      type: "",
      state: {},
      properties: "",
      traits: [],
    };
  }

  isNode: false = false;
  isComponent: true = true;
  isTrait: false = false;

  observers = new ComponentObservers();
  pipelines = new ComponentBasePipelines<Properties>();
  traits: TraitBase<any>[] = [];
  constructor(public node: Node, public data: ComponentData<Properties>) {
    for (const component of data.traits) {
      this.addTraits(component);
    }
  }

  abstract init(): Promise<void>;
  abstract getClass(): ComponentBaseConstructor;
  abstract getMeta(): ComponentMetaData;

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
  getTraitById(id: string) {
    return this.traits.find((_) => _.data.id == id);
  }
  removeTraitById(id: string) {
    const index = this.traits.findIndex((_) => _.data.id == id);
    if (index !== -1) {
      const child = this.traits.splice(index, 1)![0];
      this.observers.traitRemoved.notify(child);
    }
    this.observers.traitsUpdated.notify();
  }
  removeTraitsByType(type: string) {
    const components = this.traits.filter((_) => _.data.type == type);
    components.forEach((_) => this.removeTraitById(_.data.id));
  }

  getTraitByType(type: string) {
    return this.traits.find((_) => _.data.type == type);
  }
  getTraitsByType(type: string) {
    return this.traits.filter((_) => _.data.type == type);
  }
  copy(): ComponentData {
    return this.pipelines.toJSON.pipe({
      id: NodeGraph.GenerateId(),
      properties: { ...this.data.properties },
      type: this.data.type,
      state: this.data.state,
      traits: this.traits.map((_) => _.copy()),
    });
  }
  toJSON(): ComponentData {
    return this.pipelines.toJSON.pipe({
      id: this.data.id,
      properties: { ...this.data.properties },
      type: this.data.type,
      state: this.data.state,
      traits: this.traits.map((_) => _.toJSON()),
    });
  }
}
