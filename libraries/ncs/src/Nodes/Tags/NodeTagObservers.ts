import { Observable } from "@amodx/core/Observers";
import { TagInstance } from "../../Tags/TagInstance";
import { Nullable } from "@amodx/core/Types/UtilityTypes";
export interface NodeTagObservers {}

export class NodeTagObservers {
  private _tagAdded: Nullable<Observable<TagInstance>> = null;
  private _tagRemoved: Nullable<Observable<TagInstance>> = null;
  private _tagsUpdated: Nullable<Observable<void>> = null;

  get tagsAdded() {
    if (!this._tagAdded) this._tagAdded = new Observable();
    return this._tagAdded;
  }

  get tagsRemoved() {
    if (!this._tagRemoved) this._tagRemoved = new Observable();
    return this._tagRemoved;
  }

  get tagsUpdated() {
    if (!this._tagsUpdated) this._tagsUpdated = new Observable();
    return this._tagsUpdated;
  }

  get isTagsAddedSet() {
    return this._tagAdded !== null;
  }

  get isTagsRemovedSet() {
    return this._tagRemoved !== null;
  }

  get isTagsUpdatedSet() {
    return this._tagsUpdated !== null;
  }
}
