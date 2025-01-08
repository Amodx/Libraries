import { TagRegisterData } from "./Tag.types";

export class Tag {
  get id() {
    return this.tagData.id;
  }

  children: Tag[] = [];

  constructor(public parent: Tag | null, private tagData: TagRegisterData) {}

  *traverseChildren(): Generator<Tag> {
    const children = [...this.children];
    while (children.length) {
      const child = children.shift()!;
      yield child;
      if (child.children.length) children.push(...child.children);
    }
  }
  *traverseParents(): Generator<Tag> {
    let parent = this.parent;
    while (parent) {
      yield parent;
      parent = parent.parent;
    }
  }

  addChild(tag: Tag) {
    tag.parent = this;
    this.children.push(tag);
  }

  removeChild(id: string) {
    const tag = this.children.splice(
      this.children.findIndex((_) => _.id == id),
      1
    )[0];
    if (!tag) return null;
    tag.parent = null;
    return tag;
  }

  dispose() {
    for (const child of this.children) {
      child.dispose();
    }
    this.children = [];
  }

  toJSON(): TagRegisterData {
    return {
      id: this.id,
      meta: this.tagData.meta,
    };
  }
}
