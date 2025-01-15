import { NodeCursor } from "../Nodes/NodeCursor";
import { NCSRegister } from "../Register/NCSRegister";
import { Tag } from "./Tag";
import { TagArray } from "./TagArray";
import { NCSPools } from "../Pools/NCSPools";
export class TagCursor {
  static Get() {
    const cursor = NCSPools.tagCursor.get();
    if (!cursor) return new TagCursor();
    return cursor;
  }
  static Retrun(cursor: TagCursor) {
    return NCSPools.tagCursor.addItem(cursor);
  }
  get id() {
    return this.tag.id;
  }
  private _index = 0;
  get index() {
    return this._index;
  }
  _type = 0;
  get typeId() {
    return this._type;
  }
  get type() {
    return NCSRegister.tags.idPalette.getStringId(this.typeId);
  }
  public tag: Tag;
  public node: NodeCursor;
  private constructor() {}
  tagArray: TagArray;

  setTag(node: NodeCursor, type: number, index: number) {
    this.node = node;
    this._type = type;
    this._index = index;
    this.tagArray = node.graph._tags[type];
    this.tag = NCSRegister.tags.get(this.typeId);
    return this;
  }

  dispose() {
    return this.tagArray.removeTag(this._index);
  }

  toJSON(): string {
    return this.id;
  }
}
