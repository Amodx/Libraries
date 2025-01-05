import { NodeInstance } from "../NodeInstance";
import { NodeTagObservers } from "./NodeTagObservers";
import { NCSRegister } from "../../Register/NCSRegister";
import { TagInstance } from "../../Tags/TagInstance";
import { TagData } from "../../Tags/TagData";
import { TagInstanceMap } from "../../Tags/TagInstanceMap";

export class NodeTags {
  private _observers?: NodeTagObservers;
  get observers() {
    if (!this._observers) {
      this._observers = new NodeTagObservers();
    }
    return this._observers;
  }
  get hasObservers() {
    return Boolean(this._observers);
  }
  tags: TagInstance[] = [];
  constructor(public node: NodeInstance) {}

  dispose() {
    for (const tag of this.tags) {
      tag.dispose();
    }
  }

  add(tag: TagData): TagInstance {
    const tagType = NCSRegister.tags.get(tag.id, tag.namespace || "main");
    const newTag = tagType.create(this.node, tag);
    const map = TagInstanceMap.getMap(newTag.id);
    map.addNode(this.node, newTag);
    this.tags.push(newTag);

    this.hasObservers &&
      this.observers.isTagsAddedSet &&
      this.hasObservers &&
      this.observers.tagsAdded.notify(newTag);
    return newTag;
  }

  addTags(...tags: TagData[]) {
    for (const tag of tags) {
      this.add(tag);
    }
    this.hasObservers &&
      this.observers.isTagsUpdatedSet &&
      this.observers.tagsUpdated.notify();
  }

  remove(type: string) {
    const index = this.tags.findIndex((_) => _.id == type);
    const tag = this.tags[index];
    if (tag) {
      const child = this.tags.splice(index, 1)![0];
      this.hasObservers &&
        this.observers.isTagsRemovedSet &&
        this.observers.tagsRemoved.notify(child);
      this.hasObservers &&
        this.observers.isTagsUpdatedSet &&
        this.observers.tagsUpdated.notify();
      tag.dispose();
      return true;
    }
    return false;
  }

  get(type: string): TagInstance | null {
    return this.tags.find((_) => _.id == type) || null;
  }

  getChild(type: string): TagInstance | null {
    for (const child of this.node.traverseChildren()) {
      const found = child.tags.get(type);
      if (found) return found;
    }
    return null;
  }
  getAllChildlren(type: string): TagInstance[] {
    const tags: TagInstance[] = [];
    for (const child of this.node.traverseChildren()) {
      const found = child.tags.get(type);
      if (found) tags.push(found);
    }
    return tags;
  }
  getParent(type: string): TagInstance | null {
    for (const parent of this.node.traverseParents()) {
      const found = parent.tags.get(type);
      if (found) return found;
    }
    return null;
  }
  getAllParents(type: string): TagInstance[] {
    const tags: TagInstance[] = [];
    for (const child of this.node.traverseParents()) {
      const found = child.tags.get(type);
      if (found) tags.push(found);
    }
    return tags;
  }
}
