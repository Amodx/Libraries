import { Pipeline } from "@amodx/core/Pipelines";
import { NodeInstance } from "./NodeInstance";
import { NodeData } from "./NodeData";
import { Nullable } from "@amodx/core/Types/UtilityTypes";
export interface NodePipelines {}

export class NodePipelines {
  private _disposed: Nullable<Pipeline<NodeInstance>> = null;
  private _toJSON: Nullable<Pipeline<NodeData>> = null;
  private _copy: Nullable<Pipeline<NodeData>> = null;

  get disposed() {
    if (!this._disposed) this._disposed = new Pipeline();
    return this._disposed;
  }

  get toJSON() {
    if (!this._toJSON) this._toJSON = new Pipeline();
    return this._toJSON;
  }

  get copy() {
    if (!this._copy) this._copy = new Pipeline();
    return this._copy;
  }

  get isDisposedSet(): boolean {
    return this._disposed !== null;
  }

  get isToJSONSet(): boolean {
    return this._toJSON !== null;
  }

  get isCopySet(): boolean {
    return this._copy !== null;
  }
}
