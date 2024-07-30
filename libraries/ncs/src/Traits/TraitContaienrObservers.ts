import { Observable } from "@amodx/core/Observers";
import { TraitInstance } from "Traits/TraitInstance";

export interface TraitContainerObservers {}

export class TraitContainerObservers {
  private _traitAdded?: Observable<TraitInstance>;
  private _traitRemoved?: Observable<TraitInstance>;
  private _traitsUpdated?: Observable<void>;

  get traitAdded(): Observable<TraitInstance> {
    if (!this._traitAdded) {
      this._traitAdded = new Observable();
    }
    return this._traitAdded;
  }

  get traitRemoved(): Observable<TraitInstance> {
    if (!this._traitRemoved) {
      this._traitRemoved = new Observable();
    }
    return this._traitRemoved;
  }

  get traitsUpdated(): Observable<void> {
    if (!this._traitsUpdated) {
      this._traitsUpdated = new Observable();
    }
    return this._traitsUpdated;
  }

  isTraitAddedSet(): boolean {
    return !!this._traitAdded;
  }

  isTraitRemovedSet(): boolean {
    return !!this._traitRemoved;
  }

  isTraitsUpdatedSet(): boolean {
    return !!this._traitsUpdated;
  }
}
