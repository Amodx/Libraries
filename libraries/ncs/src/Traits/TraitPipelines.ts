import { Pipeline } from "@amodx/core/Pipelines";
import { TraitInstance } from "./TraitInstance";
import { TraitData } from "./TraitData";
import { Nullable } from "@amodx/core/Types/UtilityTypes";
export interface TraitPipelines {}

export class TraitPipelines<TraitSchema extends object = {}> {
  private _disposed: Nullable<Pipeline<TraitInstance<TraitSchema>>> = null;
  private _toJSON: Nullable<Pipeline<TraitData<TraitSchema>>> = null;
  private _copy: Nullable<Pipeline<TraitData<TraitSchema>>> = null;

  get disposed() {
    if (!this._disposed) this._disposed = new Pipeline();
    return this._disposed;
  }

  get toJSON(){
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
