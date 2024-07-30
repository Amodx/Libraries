import { Pipeline } from "@amodx/core/Pipelines";
import { NodeInstance } from "./NodeInstance";
import { NodeData } from "./NodeData";

export interface NodePipelines {}

export class NodePipelines {
  private _disposed?: Pipeline<NodeInstance>;
  private _toJSON?: Pipeline<NodeData>;
  private _copy?: Pipeline<NodeData>;

  get disposed(): Pipeline<NodeInstance> {
    if (!this._disposed) {
      this._disposed = new Pipeline();
    }
    return this._disposed;
  }

  get toJSON(): Pipeline<NodeData> {
    if (!this._toJSON) {
      this._toJSON = new Pipeline();
    }
    return this._toJSON;
  }

  get copy(): Pipeline<NodeData> {
    if (!this._copy) {
      this._copy = new Pipeline();
    }
    return this._copy;
  }

  isDisposedSet(): boolean {
    return !!this._disposed;
  }

  isToJSONSet(): boolean {
    return !!this._toJSON;
  }

  isCopySet(): boolean {
    return !!this._copy;
  }
}