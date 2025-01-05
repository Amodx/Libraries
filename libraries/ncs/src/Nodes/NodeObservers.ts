import { Observable } from "@amodx/core/Observers";
import { NodeInstance } from "./NodeInstance";
import { Nullable } from "@amodx/core/Types/UtilityTypes";
export interface NodeObservers {}

export class NodeObservers {
  private _disposed: Nullable<Observable<void>> = null;
  private _parented: Nullable<Observable<void>> = null;
  private _removedFromParent: Nullable<Observable<void>> = null;
  private _childAdded: Nullable<Observable<NodeInstance>> = null;
  private _childRemoved: Nullable<Observable<NodeInstance>> = null;
  private _childrenUpdated: Nullable<Observable<void>> = null;

  get disposed() {
    if (!this._disposed) this._disposed = new Observable();
    return this._disposed;
  }

  get parented() {
    if (!this._parented) this._parented = new Observable();
    return this._parented;
  }

  get removedFromParent() {
    if (!this._removedFromParent) this._removedFromParent = new Observable();
    return this._removedFromParent;
  }

  get childAdded() {
    if (!this._childAdded) this._childAdded = new Observable();
    return this._childAdded;
  }

  get childRemoved() {
    if (!this._childRemoved) this._childRemoved = new Observable();
    return this._childRemoved;
  }

  get childrenUpdated() {
    if (!this._childrenUpdated) this._childrenUpdated = new Observable();
    return this._childrenUpdated;
  }

  get isDisposedSet() {
    return this._disposed !== null;
  }

  get isParentedSet() {
    return this._parented !== null;
  }

  get isRemovedFromParentSet() {
    return this._removedFromParent !== null;
  }

  get isChildAddedSet() {
    return this._childAdded !== null;
  }

  get isChildRemovedSet() {
    return this._childRemoved !== null;
  }

  get isChildrenUpdatedSet() {
    return this._childrenUpdated !== null;
  }
}
