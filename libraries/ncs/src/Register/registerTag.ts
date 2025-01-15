import { NCSRegister } from "./NCSRegister";
import { TagRegisterData } from "../Tags/Tag.types";
import { NodeCursor } from "../Nodes/NodeCursor";
import { TagCursor } from "../Tags/TagCursor";
import { Tag } from "../Tags/Tag";
import { Graph } from "../Graphs/Graph";
export type RegisteredTag = (TagRegisterData & {
  tag: Tag;
  data: TagRegisterData;
  set(parent: NodeCursor, cursor?: TagCursor): TagCursor;
  get(parent: NodeCursor, cursor?: TagCursor): TagCursor | null;
  getChild(parent: NodeCursor, cursor?: TagCursor): TagCursor | null;
  getAllChildlren(parent: NodeCursor): TagCursor[] | null;
  getParent(parent: NodeCursor, cursor?: TagCursor): TagCursor | null;
  getAllParents(parent: NodeCursor): TagCursor[] | null;
  remove(parent: NodeCursor): boolean;
  getNodes(grpah: Graph): Generator<NodeCursor>;
  getTags(grpah: Graph): Generator<TagCursor>;
}) &
  (() => number);

export function registerTag(data: TagRegisterData): RegisteredTag {
  const tag = new Tag(null, data);

  const typeId = NCSRegister.tags.register(data.id, tag);
  // const map = TagInstanceMap.registerTag(tag.id);
  const createTag = (): number => {
    return typeId;
  };

  return Object.assign(createTag, data, {
    tag,
    data,
    // getNodes: (graph: Graph) => map.getNodes(graph),
    // getTags: (graph: Graph) => map.getItems(graph),
    getChild(parent: NodeCursor, cursor?: TagCursor) {
      return parent.tags.getChild(data.id, cursor);
    },
    getAllChildlren(parent: NodeCursor) {
      return parent.tags.getAllChildlren(data.id);
    },
    getParent(parent: NodeCursor, cursor?: TagCursor) {
      return parent.tags.getParent(data.id,cursor);
    },
    getAllParents(parent: NodeCursor) {
      return parent.tags.getAllParents(data.id);
    },
    set(
      parent: NodeCursor,
      cursor: TagCursor = TagCursor.Get(),
    ) {
      const newTag = parent.tags.add(createTag());
      cursor.setTag(parent, typeId, newTag);
      return cursor;
    },
    get(parent: NodeCursor, cursor?: TagCursor) {
      return parent.tags.get(data.id,cursor);
    },
    remove(parent: NodeCursor) {
      return parent.tags.remove(data.id,);
    },
  }) as any;
}
