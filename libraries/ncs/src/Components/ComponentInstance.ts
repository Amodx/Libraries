import {
  ComponentData,
  ComponentStateData,
  ComponentRegisterData,
} from "./ComponentData";
import {
  ObjectPath,
  ObjectSchemaInstance,
  QueryPath,
  Schema,
} from "@amodx/schemas";

import { NodeInstance } from "../Nodes/NodeInstance";
import { ComponentInstanceMap } from "./ComponentInstanceMap";
import { SchemaNode } from "@amodx/schemas/Schemas/SchemaNode";
import { GraphUpdate } from "../Graphs/GraphUpdate";
import { ComponentObservers } from "./ComponentObservers";
import { ComponentPipelines } from "./ComponentPipelines";
import { TraintContainer } from "../Traits/TraitContainer";

export class ComponentInstance<
  ComponentSchema extends object = {},
  Data extends object = {},
  Logic extends object = {},
  Shared extends object = {}
> {
  get type() {
    return this.componentProotypeData.type;
  }
  get shared() {
    return this.componentProotypeData.shared as Shared;
  }
  get componentPrototype() {
    return this.componentProotypeData;
  }

  schema: ObjectSchemaInstance<ComponentSchema>;
  data: Data;
  logic: Logic;
  state: ComponentStateData;

  private _traits?: TraintContainer;
  get traits() {
    if (!this._traits) {
      this._traits = new TraintContainer(this);
    }
    return this._traits;
  }
  get hasTraits() {
    return Boolean(this._traits);
  }

  private _observers?: ComponentObservers;
  get observers() {
    if (!this._observers) {
      this._observers = new ComponentObservers();
    }
    return this._observers;
  }
  get hasObservers() {
    return Boolean(this._observers);
  }

  private _pipelines?: ComponentPipelines<ComponentSchema>;
  get pipelines(): ComponentPipelines<ComponentSchema> {
    if (!this._pipelines) {
      this._pipelines = new ComponentPipelines<ComponentSchema>();
    }
    return this._pipelines;
  }
  get hasPipelines() {
    return Boolean(this._pipelines);
  }

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
    this.schema =
      Array.isArray(componentProotypeData.schema) &&
      componentProotypeData.schema.length
        ? Schema.CreateInstance(...componentProotypeData.schema)
        : ({} as any);

    if (this.schema.getSchema) this.schema.getSchema().loadIn(data.schema);

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

    if (data.state) {
      this.state = structuredClone(data.state);
    }

    const map = ComponentInstanceMap.getMap(data.type);
    map.addNode(node, this);
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

  async init() {
    if (!this.componentProotypeData.init) return;
    await this.componentProotypeData.init(this);
    if (this.componentProotypeData.update) {
      GraphUpdate.addToUpdate(this);
    }
  }

  private _disposed = false;
  isDisposed() {
    return this._disposed;
  }
  async dispose() {
    if (this.componentProotypeData.update) {
      GraphUpdate.removeFromUpate(this);
    }
    this.hasPipelines &&
      this.pipelines.isDisposedSet() &&
      this.pipelines.disposed.pipe(this);
    this.hasObservers &&
      this.observers.isDisposedSet() &&
      this.observers.disposed.notify();
    if (this.componentProotypeData.dispose)
      await this.componentProotypeData.dispose(this);

    this._disposed = true;

    const map = ComponentInstanceMap.getMap(this.type);
    map.removeNode(this.node, this);

    if (this.hasTraits) await this.traits.dispose();

    (this as any).logic = null;
    (this as any).data = null;
    (this as any).schema = null;
    delete this._traits;
    delete this._observers;
    delete this._pipelines;
  }

  getDependencies() {
    //  return this.node.graph.dependencies;
    return false;
  }

  copy(): ComponentData {
    const data: ComponentData = {
      schema: this.schema?.getSchema
        ? this.schema.getSchema().store()
        : ({} as any),
      type: this.type,
      state: this.state,
      traits:
        (this.hasTraits && this.traits.traits.map((_) => _.toJSON())) || [],
    };
    return (
      (this.hasPipelines &&
        this.pipelines.isCopySet() &&
        this.pipelines.copy.pipe(data)) ||
      data
    );
  }
  toJSON(): ComponentData {
    const data: ComponentData = {
      schema: this.schema?.getSchema
        ? this.schema.getSchema().store()
        : ({} as any),
      type: this.type,
      state: this.state,
      traits:
        (this.hasTraits && this.traits.traits.map((_) => _.toJSON())) || [],
    };
    return (
      (this.hasPipelines &&
        this.pipelines.isToJSONSet() &&
        this.pipelines.toJSON.pipe(data)) ||
      data
    );
  }
}
