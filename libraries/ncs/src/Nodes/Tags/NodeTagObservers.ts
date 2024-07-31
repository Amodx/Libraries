import { Observable } from "@amodx/core/Observers";
import { TagInstance } from "../../Tags/TagInstance";

export interface NodeTagObservers {}

export class NodeTagObservers {
  private _tagAdded?: Observable<TagInstance>;
  private _tagRemoved?: Observable<TagInstance>;
  private _tagsUpdated?: Observable<void>;

  get tagsAdded(): Observable<TagInstance> {
    if (!this._tagAdded) {
      this._tagAdded = new Observable();
    }
    return this._tagAdded;
  }

  get tagsRemoved(): Observable<TagInstance> {
    if (!this._tagRemoved) {
      this._tagRemoved = new Observable();
    }
    return this._tagRemoved;
  }

  get tagsUpdated(): Observable<void> {
    if (!this._tagsUpdated) {
      this._tagsUpdated = new Observable();
    }
    return this._tagsUpdated;
  }

  isTagsAddedSet(): boolean {
    return !!this._tagAdded;
  }

  isTagsRemovedSet(): boolean {
    return !!this._tagRemoved;
  }

  isTagsUpdatedSet(): boolean {
    return !!this._tagsUpdated;
  }
}
