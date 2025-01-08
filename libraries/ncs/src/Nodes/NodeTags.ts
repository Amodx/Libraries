import { NCSRegister } from "../Register/NCSRegister";
import { TagCursor } from "../Tags/TagCursor";
import { NodeCursor } from "./NodeCursor";

const tagCursor = new TagCursor();
export class NodeTags {
  node: NodeCursor;

  get tags() {
    return this.node.arrays._tags[this.node.index];
  }

  dispose() {
    for (let i = 0; i < this.tags.length; i += 2) {
      tagCursor.setTag(this.node, this.tags[i], this.tags[i + 1]);
      tagCursor.dispose();
    }
  }

  add(id: string, cursor = tagCursor): any {
    const tagId = NCSRegister.tags.idPalette.getNumberId(id);
    const newTag = this.node.graph.tags.get(id)!.addTag(this.node.index);
    this.tags.push(tagId, newTag);
    cursor.setTag(this.node, tagId, newTag);
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
        tags.push(new TagCursor().setTag(this.node, found.type, found.index));
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
        tags.push(new TagCursor().setTag(this.node, found.type, found.index));
      }
    }
    return tags;
  }
}
