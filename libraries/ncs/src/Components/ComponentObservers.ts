import { Observable } from "@amodx/core/Observers";

export interface ComponentObservers {}

export class ComponentObservers {
  private _disposed?: Observable<void>;

  get disposed(): Observable<void> {
    if (!this._disposed) {
      this._disposed = new Observable();
    }
    return this._disposed;
  }

  isDisposedSet(): boolean {
    return !!this._disposed;
  }
}
