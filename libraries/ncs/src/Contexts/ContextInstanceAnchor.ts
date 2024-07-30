import { Pipeline } from "@amodx/core/Pipelines";
import { ContextData } from "./ContextData";
import { Observable } from "@amodx/core/Observers";
import { NodeInstance } from "../Nodes/NodeInstance";
import { ContextInstance } from "./ContextInstance";

export interface ContextAnchorObservers {}

export class ContextAnchorObservers<Data extends object = {}> {
  disposed = new Observable();
}

export interface ContextAnchorPipelines {}

class ContextBasePipelines<Data extends object = {}> {
  disposed = new Pipeline<ContextAnchorInstance<Data>>();
  toJSON = new Pipeline<ContextData>();
  copy = new Pipeline<ContextData>();
}

export class ContextAnchorInstance<Data extends object = {}> {
  get type() {
    return this.context.type;
  }
  get data() {
    return this.context.data;
  }
  isAnchor: true = true;

  observers = new ContextAnchorObservers<Data>();
  pipelines = new ContextBasePipelines<Data>();
  constructor(
    public node: NodeInstance,
    private context: ContextInstance<Data>
  ) {}

  getContext() {
    return this.context;
  }

  private _disposed = false;
  isDisposed() {
    return this._disposed;
  }

  async dispose() {
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
