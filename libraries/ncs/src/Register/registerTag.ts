import { NCSRegister } from "./NCSRegister";
import {  TagRegisterData } from "../Tags/Tag.types";
import { NodeCursor } from "../Nodes/NodeCursor";
import { TagCursor } from "../Tags/TagCursor";
import { Tag } from "../Tags/Tag";
import { Graph } from "../Graphs/Graph";
export type RegisteredTag = (TagRegisterData & {
  tag: Tag;
  data: TagRegisterData;
  set: (parent: NodeCursor) => TagCursor;
  get: (parent: NodeCursor) => TagCursor | null;
  getChild: (parent: NodeCursor) => TagCursor | null;
  getAllChildlren: (parent: NodeCursor) => TagCursor[] | null;
  getParent: (parent: NodeCursor) => TagCursor | null;
  getAllParents: (parent: NodeCursor) => TagCursor[] | null;
  remove: (parent: NodeCursor) => TagCursor | null;
  getNodes: (grpah: Graph) => Set<NodeCursor>;
  getTags: (grpah: Graph) => Set<TagCursor>;
}) &
  (() => string);

export function registerTag(data: TagRegisterData): RegisteredTag {
  const tag = new Tag(null, data);

  NCSRegister.tags.register(data.id, tag);
 // const map = TagInstanceMap.registerTag(tag.id);
  const createTag = (): string => {
    return data.id
  };

  return Object.assign(createTag, data, {
    tag,
    data,
   // getNodes: (graph: Graph) => map.getNodes(graph),
   // getTags: (graph: Graph) => map.getItems(graph),
    getChild: (parent: NodeCursor) => {
      return parent.tags.getChild(data.id);
    },
    getAllChildlren: (parent: NodeCursor) => {
      return parent.tags.getAllChildlren(data.id);
    },
    getParent: (parent: NodeCursor) => {
      return parent.tags.getParent(data.id);
    },
    getAllParents: (parent: NodeCursor) => {
      return parent.tags.getAllParents(data.id);
    },
    set: (parent: NodeCursor) => {
      return parent.tags.add(createTag());
    },
    get: (parent: NodeCursor) => {
      return parent.tags.get(data.id);
    },
    remove: (parent: NodeCursor) => {
      return parent.tags.remove(data.id);
    },
  }) as any;
}
