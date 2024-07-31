import { TraitData, TraitRegisterData, TraitStateData } from "./TraitData";
import { ObjectSchemaInstance, Schema } from "@amodx/schemas";
import { ComponentInstance } from "../Components/ComponentInstance";
import { NodeInstance } from "../Nodes/NodeInstance";
import { TraintContainer } from "./TraitContainer";
import { TraitObservers } from "./TraitObservers";
import { TraitPipelines } from "./TraitPipelines";
import { TraitPrototype } from "./TraitPrototype";

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

  private _shared: Shared;
  get shared() {
    return this._shared;
  }

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
  public parent:
    | ComponentInstance<any, any, any, any>
    | TraitInstance<any, any, any, any>;
  public traitProotype: TraitPrototype<TraitSchema, Data, Logic, Shared>;

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

  async init() {
    if (!this.traitProotype.data.init) return;
    await this.traitProotype.data.init(this);
  }

  private _disposed = false;
  isDisposed() {
    return this._disposed;
  }
  async dispose() {
    this.hasPipelines &&
      this.pipelines.isDisposedSet() &&
      this.pipelines.disposed.pipe(this);
    this.hasObservers &&
      this.observers.isDisposedSet() &&
      this.observers.disposed.notify();
    if (this.traitProotype.data.dispose)
      await this.traitProotype.data.dispose(this);

    this._disposed = true;

    if (this.hasTraits) await this.traits.dispose();

    this.traitProotype.destory(this);

    delete this._traits;
    delete this._observers;
    delete this._pipelines;
  }

  copy(): TraitData {
    const data: TraitData = {
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
  toJSON(): TraitData {
    const data: TraitData = {
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
}
