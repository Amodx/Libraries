import { Pipeline } from "@amodx/core/Pipelines";
import { ContextData, ContextRegisterData } from "./ContextData";
import { Observable } from "@amodx/core/Observers";
import { NodeInstance } from "../Nodes/NodeInstance";

export interface ContextObservers {}

export class ContextObservers<Data extends object = {}> {
  disposed = new Observable();
}

export interface ContextPipelines {}

class ContextBasePipelines<Data extends object = {}> {
  disposed = new Pipeline<ContextInstance<Data>>();
  toJSON = new Pipeline<ContextData>();
  copy = new Pipeline<ContextData>();
}

export class ContextInstance<Data extends object = {}> {
  type: string;
  data: Data;
  isContext: true = true;

  observers = new ContextObservers<Data>();
  pipelines = new ContextBasePipelines<Data>();
  constructor(
    public node: NodeInstance,
    private contextPrototypeData: ContextRegisterData<Data>,
    data: ContextData
  ) {
    this.type = contextPrototypeData.type;

    this.data = contextPrototypeData.data
      ? typeof contextPrototypeData.data == "function"
        ? contextPrototypeData.data(this)
        : structuredClone(contextPrototypeData.data)
      : ({} as Data);
  }

  async init() {
    if (!this.contextPrototypeData.init) return;
    await this.contextPrototypeData.init(this);
  }

  private _disposed = false;
  isDisposed() {
    return this._disposed;
  }

  async dispose() {
    if (!this.contextPrototypeData.dispose) return;
    await this.contextPrototypeData.dispose(this);
    this._disposed = true;
    this.pipelines.disposed.pipe(this);
    this.observers.disposed.notify();
  }

  copy(): ContextData {
    return this.pipelines.toJSON.pipe({
      type: this.type,
    });
  }
  toJSON(): ContextData {
    return this.pipelines.toJSON.pipe({
      type: this.type,
    });
  }
}
