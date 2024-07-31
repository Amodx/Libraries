import { TagData } from "./TagData";
import { TagInstance } from "./TagInstance";
import { NodeInstance } from "../Nodes/NodeInstance";
import { ItemPool } from "../Pools/ItemPool";
import { TagInstanceMap } from "./TagInstanceMap";
import { TagRegisterData } from "./TagData";
import { Tag } from "./Tag";

export class TagPrototype {
  pool = new ItemPool<TagInstance>(1000);
  constructor(public data: TagRegisterData, public tag: Tag) {}

  private getPooled() {
    let tag: TagInstance | null = null;
    tag = this.pool.get();
    return tag || new TagInstance();
  }
  private return(tag: TagInstance) {
    this.pool.addItem(tag);
  }

  create(node: NodeInstance, data: TagData) {
    const instance = this.getPooled();
    instance.node = node;
    instance.tag = this.tag;
    instance.tagPrototype = this;

    const map = TagInstanceMap.getMap(data.id);
    map.addNode(node, instance);
    return instance;
  }

  destory(tag: TagInstance) {
    const map = TagInstanceMap.getMap(tag.id);
    map.removeNode(tag.node, tag);
    this.return(tag);
  }
}
