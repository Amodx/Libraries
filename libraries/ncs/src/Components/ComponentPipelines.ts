import { Pipeline } from "@amodx/core/Pipelines";
import { ComponentInstance } from "./ComponentInstance";
import { ComponentData } from "./ComponentData";

export interface ComponentPipelines {}

export class ComponentPipelines<ComponentSchema extends object = {}> {
  private _disposed?: Pipeline<ComponentInstance<ComponentSchema>>;
  private _toJSON?: Pipeline<ComponentData<ComponentSchema>>;
  private _copy?: Pipeline<ComponentData<ComponentSchema>>;

  get disposed(): Pipeline<ComponentInstance<ComponentSchema>> {
    if (!this._disposed) {
      this._disposed = new Pipeline();
    }
    return this._disposed;
  }

  get toJSON(): Pipeline<ComponentData<ComponentSchema>> {
    if (!this._toJSON) {
      this._toJSON = new Pipeline();
    }
    return this._toJSON;
  }

  get copy(): Pipeline<ComponentData<ComponentSchema>> {
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