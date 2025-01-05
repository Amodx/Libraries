import { Observable } from "@amodx/core/Observers";
import { Nullable } from "@amodx/core/Types/UtilityTypes";
export interface TraitObservers {}

export class TraitObservers {
  private _disposed: Nullable<Observable<void>> = null;

  get disposed() {
    if (!this._disposed) this._disposed = new Observable();
    return this._disposed;
  }

  get isDisposedSet(): boolean {
    return this._disposed !== null;
  }
}
