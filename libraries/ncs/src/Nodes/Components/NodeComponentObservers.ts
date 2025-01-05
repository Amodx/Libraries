import { Observable } from "@amodx/core/Observers";
import { ComponentInstance } from "../../Components/ComponentInstance";
import { Nullable } from "@amodx/core/Types/UtilityTypes";
export interface NodeComponentObservers {}

export class NodeComponentObservers {
  private _componentAdded: Nullable<Observable<ComponentInstance<any>>> = null;
  private _componentRemoved: Nullable<Observable<ComponentInstance<any>>> =
    null;
  private _componentsUpdated: Nullable<Observable<void>> = null;

  get componentAdded() {
    if (!this._componentAdded) this._componentAdded = new Observable();
    return this._componentAdded;
  }

  get componentRemoved() {
    if (!this._componentRemoved) this._componentRemoved = new Observable();
    return this._componentRemoved;
  }

  get componentsUpdated() {
    if (!this._componentsUpdated) this._componentsUpdated = new Observable();
    return this._componentsUpdated;
  }

  get isComponentAddedSet() {
    return this._componentAdded !== null;
  }

  get isComponentRemovedSet() {
    return this._componentRemoved !== null;
  }

  get isComponentsUpdatedSet() {
    return this._componentsUpdated !== null;
  }
}
