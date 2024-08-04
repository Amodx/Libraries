import { NodeInstance } from "../Nodes/NodeInstance";
import { Tag } from "./Tag";
import { TagData } from "./TagData";
import { TagPrototype } from "./TagPrototype";

export class TagInstance {
  get id() {
    return this.tag.id;
  }
  public proto: TagPrototype;
  public node: NodeInstance;
  public tag: Tag;
  constructor() {}

  dispose() {
    this.proto.destory(this);
  }

  toJSON(): TagData {
    return {
      id: this.id,
    };
  }
}
