import { Observable } from "@amodx/core/Observers";
import { NodeInstance } from "./NodeInstance";

export interface NodeObservers {}

export class NodeObservers {
  private _disposed?: Observable<void>;
  private _parented?: Observable<void>;
  private _removedFromParent?: Observable<void>;
  private _childAdded?: Observable<NodeInstance>;
  private _childRemoved?: Observable<NodeInstance>;
  private _childrenUpdated?: Observable<void>;

  get disposed(): Observable<void> {
    if (!this._disposed) {
      this._disposed = new Observable();
    }
    return this._disposed;
  }

  get parented(): Observable<void> {
    if (!this._parented) {
      this._parented = new Observable();
    }
    return this._parented;
  }

  get removedFromParent(): Observable<void> {
    if (!this._removedFromParent) {
      this._removedFromParent = new Observable();
    }
    return this._removedFromParent;
  }

  get childAdded(): Observable<NodeInstance> {
    if (!this._childAdded) {
      this._childAdded = new Observable();
    }
    return this._childAdded;
  }

  get childRemoved(): Observable<NodeInstance> {
    if (!this._childRemoved) {
      this._childRemoved = new Observable();
    }
    return this._childRemoved;
  }

  get childrenUpdated(): Observable<void> {
    if (!this._childrenUpdated) {
      this._childrenUpdated = new Observable();
    }
    return this._childrenUpdated;
  }

  isDisposedSet(): boolean {
    return !!this._disposed;
  }

  isParentedSet(): boolean {
    return !!this._parented;
  }

  isRemovedFromParentSet(): boolean {
    return !!this._removedFromParent;
  }

  isChildAddedSet(): boolean {
    return !!this._childAdded;
  }

  isChildRemovedSet(): boolean {
    return !!this._childRemoved;
  }

  isChildrenUpdatedSet(): boolean {
    return !!this._childrenUpdated;
  }
}
