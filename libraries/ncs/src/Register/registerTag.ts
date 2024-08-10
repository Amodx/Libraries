import { NCS } from "../NCS";

import { NCSRegister } from "./NCSRegister";
import { TagData, TagRegisterData } from "../Tags/TagData";
import { NodeInstance } from "../Nodes/NodeInstance";
import { TagInstance } from "../Tags/TagInstance";
import { Tag } from "../Tags/Tag";
import { TagPrototype } from "../Tags/TagPrototype";
import { Graph } from "../Graphs/Graph";
import { TagInstanceMap } from "../Tags/TagInstanceMap";

export type RegisteredTag = (TagRegisterData & {
  tag: Tag;
  prototype: TagPrototype;
  set: (parent: NodeInstance) => TagInstance;
  get: (parent: NodeInstance) => TagInstance | null;
  getChild: (parent: NodeInstance) => TagInstance | null;
  getAllChildlren: (parent: NodeInstance) => TagInstance[] | null;
  getParent: (parent: NodeInstance) => TagInstance | null;
  getAllParents: (parent: NodeInstance) => TagInstance[] | null;
  remove: (parent: NodeInstance) => TagInstance | null;
  getNodes: (grpah: Graph) => Set<NodeInstance>;
  getTags: (grpah: Graph) => Set<TagInstance>;
}) &
  (() => TagData);

export function registerTag(data: TagRegisterData): RegisteredTag {
  const tag = new Tag(null, data);
  const prototype = new TagPrototype(data, tag);
  NCSRegister.tags.register(data.id, data.namespace || "main", prototype);
  const map = TagInstanceMap.registerTag(tag.id);
  const createTag = (): TagData => {
    return NCS.Pipelines.OnTagDataCreate.pipe({
      id: data.id,
    });
  };

  return Object.assign(createTag, data, {
    tag,
    prototype,
    getNodes: (graph: Graph) => map.getNodes(graph),
    getTags: (graph: Graph) => map.getItems(graph),
    getChild: (parent: NodeInstance) => {
      return parent.tags.getChild(data.id);
    },
    getAllChildlren: (parent: NodeInstance) => {
      return parent.tags.getAllChildlren(data.id);
    },
    getParent: (parent: NodeInstance) => {
      return parent.tags.getParent(data.id);
    },
    getAllParents: (parent: NodeInstance) => {
      return parent.tags.getAllParents(data.id);
    },
    set: (parent: NodeInstance) => {
      return parent.tags.add(createTag());
    },
    get: (parent: NodeInstance) => {
      return parent.tags.get(data.id);
    },
    remove: (parent: NodeInstance) => {
      return parent.tags.remove(data.id);
    },
  }) as any;
}
