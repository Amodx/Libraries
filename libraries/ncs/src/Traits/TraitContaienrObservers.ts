import { Observable } from "@amodx/core/Observers";
import { TraitInstance } from "Traits/TraitInstance";
import { Nullable } from "@amodx/core/Types/UtilityTypes";
export interface TraitContainerObservers {}

export class TraitContainerObservers {
  _traitAdded: Nullable<Observable<TraitInstance>> = null;
  _traitRemoved: Nullable<Observable<TraitInstance>> = null;
  _traitsUpdated: Nullable<Observable<void>> = null;

  get traitAdded() {
    if (!this._traitAdded) this._traitAdded = new Observable();
    return this._traitAdded;
  }

  get traitRemoved() {
    if (!this._traitRemoved) this._traitRemoved = new Observable();
    return this._traitRemoved;
  }

  get traitsUpdated() {
    if (!this._traitsUpdated) this._traitsUpdated = new Observable();
    return this._traitsUpdated;
  }

  get isTraitAddedSet() {
    return this._traitAdded !== null;
  }

  get isTraitRemovedSet() {
    return this._traitRemoved !== null;
  }

  get isTraitsUpdatedSet() {
    return this._traitsUpdated !== null;
  }
}
