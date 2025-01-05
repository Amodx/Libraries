import { Pipeline } from "@amodx/core/Pipelines";
import { ComponentInstance } from "./ComponentInstance";
import { ComponentData } from "./ComponentData";
import { Nullable } from "@amodx/core/Types/UtilityTypes";
export interface ComponentPipelines {}

export class ComponentPipelines<ComponentSchema extends object = {}> {
  private _disposed: Nullable<Pipeline<ComponentInstance<ComponentSchema>>> =
    null;
  private _toJSON: Nullable<Pipeline<ComponentData<ComponentSchema>>> = null;
  private _copy: Nullable<Pipeline<ComponentData<ComponentSchema>>> = null;

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

  get isDisposedSet() {
    return this._disposed !== null;
  }

  get isToJSONSet() {
    return this._toJSON !== null;
  }

  get isCopySet() {
    return this._copy !== null;
  }
}
