import { Pipeline } from "@amodx/core/Pipelines";
import { TraitInstance } from "./TraitInstance";
import { TraitData } from "./TraitData";

export interface TraitPipelines {}

export class TraitPipelines<TraitSchema extends object = {}> {
  private _disposed?: Pipeline<TraitInstance<TraitSchema>>;
  private _toJSON?: Pipeline<TraitData<TraitSchema>>;
  private _copy?: Pipeline<TraitData<TraitSchema>>;

  get disposed(): Pipeline<TraitInstance<TraitSchema>> {
    if (!this._disposed) {
      this._disposed = new Pipeline();
    }
    return this._disposed;
  }

  get toJSON(): Pipeline<TraitData<TraitSchema>> {
    if (!this._toJSON) {
      this._toJSON = new Pipeline();
    }
    return this._toJSON;
  }

  get copy(): Pipeline<TraitData<TraitSchema>> {
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
