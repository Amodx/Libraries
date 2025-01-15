import { NCSPools } from "../Pools/NCSPools";
import { NCSRegister } from "../Register/NCSRegister";
import { TagCursor } from "../Tags/TagCursor";
import { NodeCursor } from "./NodeCursor";

const tagCursor = TagCursor.Get();
export class NodeTags {
  node: NodeCursor;
  static Get() {
    const cursor = NCSPools.nodeTags.get();
    if (!cursor) return new NodeTags();
    return cursor;
  }

  static Retrun(cursor: NodeTags) {
    return NCSPools.nodeTags.addItem(cursor);
  }
  get tags() {
    return this.node.arrays._tags[this.node.index];
  }

  private constructor() {}

  dispose() {
    for (let i = 0; i < this.tags.length; i += 2) {
      tagCursor.setTag(this.node, this.tags[i], this.tags[i + 1]);
      tagCursor.dispose();
    }
  }

  add(id: number, cursor = tagCursor): any {
    const newTag = this.node.graph._tags[id]!.addTag(this.node.index);
    this.tags.push(id, newTag);
    cursor.setTag(this.node, id, newTag);
    if (this.node.hasObservers) {
      this.node.observers.isTagsAddedSet &&
        this.node.observers.tagsAdded.notify(cursor);
    }

    return cursor;
  }

  remove(id: string) {
    const tagId = NCSRegister.tags.idPalette.getNumberId(id);
    const tags = this.tags;
    for (let i = 0; i < tags.length; i++) {
      if (tags[i] == tagId) {
        tagCursor.setTag(this.node, tagId, tags[i]);
        tagCursor.dispose();
        this.tags.splice(i, 2);
        this.node.hasObservers &&
          this.node.observers.isTagsRemovedSet &&
          this.node.observers.tagsRemoved.notify(tagCursor);
        this.node.hasObservers &&
          this.node.observers.isTagsUpdatedSet &&
          this.node.observers.tagsUpdated.notify(0);
        return true;
      }
    }
    return false;
  }

  get(type: string, cursor = tagCursor): TagCursor | null {
    const tagId = NCSRegister.tags.idPalette.getNumberId(type);
    const tags = this.tags;
    for (let i = 0; i < tags.length; i += 2) {
      if (tags[i] == tagId) {
        cursor.setTag(this.node, tags[i], tags[i + 1]);
        return cursor;
      }
    }
    return null;
  }

  getChild(type: string, cursor = tagCursor): TagCursor | null {
    for (const child of this.node.traverseChildren()) {
      const found = child.tags.get(type, cursor);
      if (found) return found;
    }
    return null;
  }
  getAllChildlren(type: string): TagCursor[] {
    const tags: TagCursor[] = [];
    for (const child of this.node.traverseChildren()) {
      const found = child.tags.get(type);
      if (found) {
        tags.push(TagCursor.Get().setTag(this.node, found.typeId, found.index));
      }
    }
    return tags;
  }
  getParent(type: string, cursor = tagCursor): TagCursor | null {
    for (const parent of this.node.traverseParents()) {
      const found = parent.tags.get(type, cursor);
      if (found) return found;
    }
    return null;
  }
  getAllParents(type: string): TagCursor[] {
    const tags: TagCursor[] = [];
    for (const child of this.node.traverseParents()) {
      const found = child.tags.get(type, tagCursor);
      if (found) {
        tags.push(TagCursor.Get().setTag(this.node, found.typeId, found.index));
      }
    }
    return tags;
  }
}
