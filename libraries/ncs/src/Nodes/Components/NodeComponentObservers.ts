import { Observable } from "@amodx/core/Observers";
import { ComponentInstance } from "../../Components/ComponentInstance";

export interface NodeComponentObservers {}

export class NodeComponentObservers {
  private _componentAdded?: Observable<ComponentInstance<any>>;
  private _componentRemoved?: Observable<ComponentInstance<any>>;
  private _componentsUpdated?: Observable<void>;

  get componentAdded(): Observable<ComponentInstance<any>> {
    if (!this._componentAdded) {
      this._componentAdded = new Observable();
    }
    return this._componentAdded;
  }

  get componentRemoved(): Observable<ComponentInstance<any>> {
    if (!this._componentRemoved) {
      this._componentRemoved = new Observable();
    }
    return this._componentRemoved;
  }

  get componentsUpdated(): Observable<void> {
    if (!this._componentsUpdated) {
      this._componentsUpdated = new Observable();
    }
    return this._componentsUpdated;
  }

  isComponentAddedSet(): boolean {
    return !!this._componentAdded;
  }

  isComponentRemovedSet(): boolean {
    return !!this._componentRemoved;
  }

  isComponentsUpdatedSet(): boolean {
    return !!this._componentsUpdated;
  }
}
