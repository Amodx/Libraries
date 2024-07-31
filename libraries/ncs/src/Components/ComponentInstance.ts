import { ComponentData, ComponentStateData } from "./ComponentData";
import { ObjectPath, ObjectSchemaInstance, QueryPath } from "@amodx/schemas";
import { SchemaNode } from "@amodx/schemas/Schemas/SchemaNode";
import { NodeInstance } from "../Nodes/NodeInstance";

import { GraphUpdate } from "../Graphs/GraphUpdate";
import { ComponentObservers } from "./ComponentObservers";
import { ComponentPipelines } from "./ComponentPipelines";
import { TraintContainer } from "../Traits/TraitContainer";
import { ComponentPrototype } from "./ComponentPrototype";

export class ComponentInstance<
  ComponentSchema extends object = {},
  Data extends object = {},
  Logic extends object = {},
  Shared extends object = {}
> {
  get type() {
    return this.componentPrototype.data.type;
  }
  get shared() {
    return this.componentPrototype.data.shared as Shared;
  }
  componentPrototype: ComponentPrototype<ComponentSchema, Data, Logic, Shared>;

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
  public node: NodeInstance;

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
    if (!this.componentPrototype.data.init) return;
    await this.componentPrototype.data.init(this);
    if (this.componentPrototype.data.update) {
      GraphUpdate.addComponentToUpdate(this);
    }
  }

  private _disposed = false;
  isDisposed() {
    return this._disposed;
  }
  async dispose() {
    if (this.componentPrototype.data.update) {
      GraphUpdate.removeComponentFromUpate(this);
    }
    this.hasPipelines &&
      this.pipelines.isDisposedSet() &&
      this.pipelines.disposed.pipe(this);
    this.hasObservers &&
      this.observers.isDisposedSet() &&
      this.observers.disposed.notify();
    if (this.componentPrototype.data.dispose)
      await this.componentPrototype.data.dispose(this);

    this._disposed = true;

    if (this.hasTraits) await this.traits.dispose();

    this.componentPrototype.destory(this);

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
