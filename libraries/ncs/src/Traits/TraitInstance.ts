import { Pipeline } from "@amodx/core/Pipelines";
import { TraitData, TraitRegisterData, TraitStateData } from "./TraitData";
import { Observable } from "@amodx/core/Observers";
import { ObjectSchemaInstance, Schema } from "@amodx/schemas";

import { ComponentInstance } from "../Components/ComponentInstance";
import { NCS } from "../NCS";
import { NodeInstance } from "../Nodes/NodeInstance";

export interface TraitObservers {}

export class TraitObservers {
  disposed = new Observable();
  traitAdded = new Observable<TraitInstance>();
  traitRemoved = new Observable<TraitInstance>();
  traitsUpdated = new Observable();
}

export interface TraitPipelines {}

class TraitBasePipelines<TraitSchema extends object = {}> {
  disposed = new Pipeline<TraitInstance<TraitSchema>>();
  toJSON = new Pipeline<TraitData<TraitSchema>>();
  copy = new Pipeline<TraitData<TraitSchema>>();
}

export class TraitInstance<
  TraitSchema extends object = {},
  Data extends object = {},
  Logic extends object = {},
  Shared extends object = {}
> {
  type: string;
  schema: ObjectSchemaInstance<TraitSchema>;
  data: Data;
  logic: Logic;
  state: TraitStateData;

  traits: TraitInstance[] = [];

  private _shared: Shared;
  get shared() {
    return this._shared;
  }

  observers = new TraitObservers();
  pipelines = new TraitBasePipelines();
  constructor(
    public parent: ComponentInstance | TraitInstance,
    private traitProotypeData: TraitRegisterData<
      TraitSchema,
      Data,
      Logic,
      Shared
    >,
    data: TraitData
  ) {
    this.type = traitProotypeData.type;
    this.logic = traitProotypeData.logic
      ? typeof traitProotypeData.logic == "function"
        ? traitProotypeData.logic(this)
        : structuredClone(traitProotypeData.logic)
      : ({} as Logic);

    this.data = traitProotypeData.data
      ? typeof traitProotypeData.data == "function"
        ? traitProotypeData.data(this)
        : structuredClone(traitProotypeData.data)
      : ({} as Data);

    this.schema =
      Array.isArray(traitProotypeData.schema) && traitProotypeData.schema.length
        ? Schema.CreateInstance(...traitProotypeData.schema)
        : ({} as any);

    if (this.schema.getSchema) this.schema.getSchema().loadIn(data.schema);
    if (data.traits?.length) {
      this.addTraits(...data.traits);
    }

    if (data.state) {
      this.state = structuredClone(data.state);
    }

    this._shared = traitProotypeData.shared
      ? traitProotypeData.shared
      : ({} as any);
  }

  async initAllTraits() {
    for (const trait of this.traits) {
      await trait.init();
    }
  }

  getNode(): NodeInstance {
    let node: any = this.parent;
    while (!(node instanceof NodeInstance)) {
      if ((node as any) instanceof ComponentInstance) {
        node = (node as any).node;
        break;
      }
      if ((node as any) instanceof TraitInstance) {
        node = (node as any).parent;
      }
    }
    return node;
  }

  *traverseTraits(): Generator<any> {
    const children = [...this.traits];
    while (children.length) {
      const child = children.shift()!;
      yield child;
      if (child.traits.length) children.push(...child.traits);
    }
  }

  async init() {
    if (!this.traitProotypeData.init) return;
    await this.traitProotypeData.init(this);
  }

  private _disposed = false;
  isDisposed() {
    return this._disposed;
  }
  async dispose() {
    if (!this.traitProotypeData.dispose) return;
    await this.traitProotypeData.dispose(this);
    this._disposed = true;
    for (const child of this.traits) {
      child.dispose();
    }
    this.pipelines.disposed.pipe(this);
    this.observers.disposed.notify();
  }

  addTraits(...traits: TraitData[]) {
    for (const trait of traits) {
      const traitType = NCS.getTrait(trait.type);
      const newTrait = new TraitInstance(this, traitType, trait);
      this.traits.push(newTrait);
      this.observers.traitAdded.notify(newTrait);
    }
    this.observers.traitsUpdated.notify();
  }

  async removeTraitByIndex(index: number) {
    const trait = this.traits[index];
    if (trait) {
      const child = this.traits.splice(index, 1)![0];
      this.observers.traitRemoved.notify(child);
      this.observers.traitsUpdated.notify();
      await trait.dispose();
      return true;
    }
    return false;
  }
  removeTrait(type: string) {
    return this.removeTraitByIndex(
      this.traits.findIndex((_) => _.type == type)
    );
  }

  getTrait(type: string) {
    return this.traits.find((_) => _.type == type);
  }
  getAllTraitsOfType(type: string) {
    return this.traits.filter((_) => _.type == type);
  }
  async removeAllTraitsOfType(type: string) {
    const filtered = this.getAllTraitsOfType(type);
    for (const trait of filtered) {
      await trait.dispose();
    }
    this.traits = this.traits.filter((_) => _.type != type);
    for (const comp of filtered) {
      this.observers.traitRemoved.notify(comp);
    }
    this.observers.traitsUpdated.notify();
    return filtered;
  }

  copy(): TraitData {
    return this.pipelines.toJSON.pipe({
      schema: this.schema?.getSchema
        ? this.schema.getSchema().store()
        : ({} as any),
      type: this.type,
      state: this.state,
      traits: this.traits.map((_) => _.copy()),
    });
  }
  toJSON(): TraitData {
    return this.pipelines.toJSON.pipe({
      schema: this.schema?.getSchema
        ? this.schema.getSchema().store()
        : ({} as any),
      type: this.type,
      state: this.state,
      traits: this.traits.map((_) => _.toJSON()),
    });
  }
}
