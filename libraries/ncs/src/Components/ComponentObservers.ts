import { Observable } from "@amodx/core/Observers";
import { Nullable } from "@amodx/core/Types/UtilityTypes";
export interface ComponentObservers {}

export class ComponentObservers {
  private _disposed: Nullable<Observable<void>> = null;

  get disposed(): Observable<void> {
    if (!this._disposed) this._disposed = new Observable();
    return this._disposed;
  }

  get isDisposedSet() {
    return this._disposed !== null;
  }
}
