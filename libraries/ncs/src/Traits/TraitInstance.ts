import { TraitData, TraitStateData } from "./TraitData";
import { ObjectSchemaInstance } from "@amodx/schemas";
import { ComponentInstance } from "../Components/ComponentInstance";
import { NodeInstance } from "../Nodes/NodeInstance";
import { TraintContainer } from "./TraitContainer";
import { TraitObservers } from "./TraitObservers";
import { TraitPipelines } from "./TraitPipelines";
import { TraitPrototype } from "./TraitPrototype";
import { GraphUpdtable, GraphUpdate } from "../Graphs/GraphUpdate";

export class TraitInstance<
  TraitSchema extends object = {},
  Data extends object = {},
  Logic extends object = {},
  Shared extends object = {}
> implements GraphUpdtable
{
  get type() {
    return this.proto.data.type;
  }
  get shared() {
    return this.proto.data.shared as Shared;
  }
  parent:
    | ComponentInstance<any, any, any, any>
    | TraitInstance<any, any, any, any>;
  proto: TraitPrototype<TraitSchema, Data, Logic, Shared>;

  schema: ObjectSchemaInstance<TraitSchema>;
  data: Data;
  logic: Logic;
  state: TraitStateData;

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

  private _observers?: TraitObservers;
  get observers() {
    if (!this._observers) {
      this._observers = new TraitObservers();
    }
    return this._observers;
  }
  get hasObservers() {
    return Boolean(this._observers);
  }

  private _pipelines?: TraitPipelines<TraitSchema>;
  get pipelines(): TraitPipelines<TraitSchema> {
    if (!this._pipelines) {
      this._pipelines = new TraitPipelines<TraitSchema>();
    }
    return this._pipelines;
  }
  get hasPipelines() {
    return Boolean(this._pipelines);
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
  getComponent(): ComponentInstance<{}, any, any, any> {
    let node: any = this.parent;
    while (!(node instanceof NodeInstance)) {
      if ((node as any) instanceof ComponentInstance) {
        break;
      }
      if ((node as any) instanceof TraitInstance) {
        node = (node as any).parent;
      }
    }
    return node;
  }
  init() {
    if (this.proto.data.update) {
      GraphUpdate.addITem(this.getNode().graph, this);
    }
    if (this.proto.data.init) {
      this.proto.data.init(this);
    }
  }

  private _disposed = false;
  isDisposed() {
    return this._disposed;
  }
  dispose() {
    if (this.proto.data.update) {
      GraphUpdate.removeItem(this.getNode().graph, this);
    }
    this.hasPipelines &&
      this.pipelines.isDisposedSet() &&
      this.pipelines.disposed.pipe(this);
    this.hasObservers &&
      this.observers.isDisposedSet() &&
      this.observers.disposed.notify();
    if (this.proto.data.dispose) this.proto.data.dispose(this);

    this._disposed = true;

    if (this.hasTraits) this.traits.dispose();

    this.proto.destory(this);

    delete this._traits;
    delete this._observers;
    delete this._pipelines;
  }

  update() {
    this.proto.data.update && this.proto.data.update(this);
  }

  copy(): TraitData {
    const data: TraitData = {
      schema: this.schema?.getSchema
        ? this.schema.getSchema().store()
        : ({} as any),
      type: this.type,
      state: this.state,
      traits:
        (this.hasTraits && this.traits.traits.map((_) => _.toJSON())) || undefined,
    };
    return (
      (this.hasPipelines &&
        this.pipelines.isCopySet() &&
        this.pipelines.copy.pipe(data)) ||
      data
    );
  }
  toJSON(): TraitData {
    const data: TraitData = {
      schema: this.schema?.getSchema
        ? this.schema.getSchema().store()
        : ({} as any),
      type: this.type,
      state: this.state,
      traits:
        (this.hasTraits && this.traits.traits.map((_) => _.toJSON())) || undefined,
    };
    return (
      (this.hasPipelines &&
        this.pipelines.isCopySet() &&
        this.pipelines.copy.pipe(data)) ||
      data
    );
  }
}
