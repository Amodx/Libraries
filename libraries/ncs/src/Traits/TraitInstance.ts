import { TraitData, TraitRegisterData, TraitStateData } from "./TraitData";
import { ObjectSchemaInstance, Schema } from "@amodx/schemas";
import { ComponentInstance } from "../Components/ComponentInstance";
import { NodeInstance } from "../Nodes/NodeInstance";
import { TraintContainer } from "./TraitContainer";
import { TraitObservers } from "./TraitObservers";
import { TraitPipelines } from "./TraitPipelines";

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

  constructor(
    public parent: ComponentInstance<any, any, any, any> | TraitInstance,
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
  

    if (data.state) {
      this.state = structuredClone(data.state);
    }

    this._shared = traitProotypeData.shared
      ? traitProotypeData.shared
      : ({} as any);
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
    if (this.hasTraits) await this.traits.dispose();
    this.hasPipelines && this.pipelines.disposed.pipe(this);
    this.hasObservers && this.observers.disposed.notify();
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
