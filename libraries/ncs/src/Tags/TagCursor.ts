import { NodeCursor } from "../Nodes/NodeCursor";
import { NCSRegister } from "../Register/NCSRegister";
import { Tag } from "./Tag";
import { TagArray } from "./TagArray";

export class TagCursor {
  get id() {
    return this.tag.id;
  }
  private _index = 0;
  get index() {
    return this._index;
  }
  _type = 0;
  get type() {
    return this._type;
  }
  public tag: Tag;
  public node: NodeCursor;
  constructor() {}
  tagArray: TagArray;

  setTag(node: NodeCursor, type: number, index: number) {
    this.node = node;
    this._type = type;
    this._index = index;
    this.tagArray = node.graph.tags.get(
      NCSRegister.tags.idPalette.getStringId(type)
    )!;
    this.tag = NCSRegister.tags.get(this.type);
    return this;
  }

  dispose() {
    return this.tagArray.removeTag(this._index);
  }

  toJSON(): string {
    return this.id;
  }
}
