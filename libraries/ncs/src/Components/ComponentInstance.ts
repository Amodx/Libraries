import { Pipeline } from "@amodx/core/Pipelines";
import {
  ComponentData,
  ComponentStateData,
  ComponentRegisterData,
} from "./ComponentData";
import { Observable } from "@amodx/core/Observers";
import {
  ObjectPath,
  ObjectSchemaInstance,
  QueryPath,
  Schema,
} from "@amodx/schemas";

import { TraitData } from "../Traits/TraitData";
import { NodeInstance } from "../Nodes/NodeInstance";
import { NCS } from "../NCS";
import { TraitInstance } from "../Traits/TraitInstance";
import { ComponentInstanceMap } from "./ComponentInstanceMap";
import { SchemaNode } from "@amodx/schemas/Schemas/SchemaNode";
import { GraphUpdate } from "../Graph/GraphUpdate";

export interface ComponentObservers {}

export class ComponentObservers {
  disposed = new Observable();
  traitAdded = new Observable<TraitInstance>();
  traitRemoved = new Observable<TraitInstance>();
  traitsUpdated = new Observable();
}

export interface ComponentPipelines {}

class ComponentBasePipelines<ComponentSchema extends object = {}> {
  disposed = new Pipeline<ComponentInstance<ComponentSchema>>();
  toJSON = new Pipeline<ComponentData<ComponentSchema>>();
  copy = new Pipeline<ComponentData<ComponentSchema>>();
}

export class ComponentInstance<
  ComponentSchema extends object = {},
  Data extends object = {},
  Logic extends object = {},
  Shared extends object = {}
> {
  type: string;
  schema: ObjectSchemaInstance<ComponentSchema>;
  data: Data;
  logic: Logic;
  state: ComponentStateData;

  traits: TraitInstance[] = [];

  private _shared: Shared;
  get shared() {
    return this._shared;
  }
  get componentPrototype() {
    return this.componentProotypeData;
  }

  observers = new ComponentObservers();
  pipelines = new ComponentBasePipelines<ComponentSchema>();
  constructor(
    public node: NodeInstance,
    private componentProotypeData: ComponentRegisterData<
      ComponentSchema,
      Data,
      Logic,
      Shared
    >,
    data: ComponentData
  ) {
    this.type = componentProotypeData.type;
    this.logic = componentProotypeData.logic
      ? typeof componentProotypeData.logic == "function"
        ? componentProotypeData.logic(this)
        : structuredClone(componentProotypeData.logic)
      : ({} as Logic);

    this.data = componentProotypeData.data
      ? typeof componentProotypeData.data == "function"
        ? componentProotypeData.data(this)
        : structuredClone(componentProotypeData.data)
      : ({} as Data);

    this.schema =
      Array.isArray(componentProotypeData.schema) &&
      componentProotypeData.schema.length
        ? Schema.CreateInstance(...componentProotypeData.schema)
        : ({} as any);

    if (this.schema.getSchema) this.schema.getSchema().loadIn(data.schema);

    if (data.traits?.length) {
      this.addTraits(...data.traits);
    }

    if (data.state) {
      this.state = structuredClone(data.state);
    }

    this._shared = componentProotypeData.shared
      ? componentProotypeData.shared
      : ({} as any);

    const map = ComponentInstanceMap.getMap(data.type);
    map.addNode(node, this);



  }

  async initAllTraits() {
    for (const trait of this.traits) {
      await trait.init();
    }
  }

  addOnSchemaUpdate(
    path: QueryPath<ComponentSchema>,
    listener: (node: SchemaNode) => void
  ) {
    this.schema
      .getSchema()
      .getNode(ObjectPath.Create<ComponentSchema>(path as unknown as any))
      ?.observers.updatedOrLoadedIn.subscribe(listener);
  }
  removeOnSchemaUpdate(
    path: QueryPath<ComponentSchema>,
    listener: (node: SchemaNode) => void
  ) {
    this.schema
      .getSchema()
      .getNode(ObjectPath.Create<ComponentSchema>(path as unknown as any))
      ?.observers.updatedOrLoadedIn.unsubscribe(listener);
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
    if (!this.componentProotypeData.init) return;
    await this.componentProotypeData.init(this);
    if(this.componentProotypeData.update) {
      GraphUpdate.addToUpdate(this)
    }
  }

  private _disposed = false;
  isDisposed() {
    return this._disposed;
  }
  async dispose() {
    if (!this.componentProotypeData.dispose) return;
    await this.componentProotypeData.dispose(this);
    this._disposed = true;

    const map = ComponentInstanceMap.getMap(this.type);
    map.removeNode(this.node, this);

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

  getDependencies() {
    return this.node.graph.dependencies;
  }

  copy(): ComponentData {
    return this.pipelines.toJSON.pipe({
      schema: this.schema?.getSchema
        ? this.schema.getSchema().store()
        : ({} as any),
      type: this.type,
      state: this.state,
      traits: this.traits.map((_) => _.copy()),
    });
  }
  toJSON(): ComponentData {
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
