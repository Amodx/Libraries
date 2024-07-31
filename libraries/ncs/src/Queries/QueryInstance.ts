import { ComponentInstanceMap } from "../Components/ComponentInstanceMap";
import { Graph } from "../Graphs/Graph";
import { QueryData } from "./QueryData";
import { NodeInstance } from "../Nodes/NodeInstance";
import { TagInstanceMap } from "../Tags/TagInstanceMap";
import { NCSRegister } from "../Register/NCSRegister";

export class QueryInstance {
  nodes = new Set<NodeInstance>();
  constructor(public graph: Graph, public data: QueryData) {}

  evulate(node: NodeInstance): boolean {
    for (const comp of this.data.inclueComponents) {
      if (!(node.hasComponents && node.components.get(comp.type))) {
        return false;
      }
    }
    for (const tag of this.data.includeTags) {
      if (!(node.hasTags && node.tags.get(tag.id))) {
        return false;
      }
    }
    for (const comp of this.data.excludeComponents) {
      if (node.hasComponents && node.components.get(comp.type)) {
        return false;
      }
    }
    for (const tag of this.data.excludeTags) {
      if (node.hasTags && node.tags.get(tag.id)) {
        return false;
      }
    }
    return true;
  }

  init() {
    const onupdate = (node: NodeInstance) => {
      if (!this.evulate(node)) {
        this.nodes.delete(node);
        return;
      }
      this.nodes.add(node);
    };

    for (const comp of this.data.inclueComponents) {
      const map = ComponentInstanceMap.getMap(comp.type).getMap(this.graph);
      map.observers.nodeAdded.subscribe(this, onupdate);
      map.observers.nodeRemoved.subscribe(this, onupdate);
    }
    for (const tagId of this.data.includeTags) {
      const tagPrototype = NCSRegister.tags.get(
        tagId.id,
        tagId.namespace || "main"
      )!;
      const tagMap = TagInstanceMap.getMap(tagId.id).getMap(this.graph);
      tagMap.observers.nodeAdded.subscribe(this, onupdate);
      tagMap.observers.nodeRemoved.subscribe(this, onupdate);
      for (const child of tagPrototype.tag.traverseChildren()) {
        const chidMap = TagInstanceMap.getMap(child.id).getMap(this.graph);
        chidMap.observers.nodeAdded.subscribe(this, onupdate);
        chidMap.observers.nodeRemoved.subscribe(this, onupdate);
      }
    }
  }

  dispose() {
    for (const comp of this.data.inclueComponents) {
      const map = ComponentInstanceMap.getMap(comp.type).getMap(this.graph);
      map.observers.nodeAdded.unsubscribe(this);
      map.observers.nodeRemoved.unsubscribe(this);
    }
    for (const tagId of this.data.includeTags) {
      const tagPrototype = NCSRegister.tags.get(
        tagId.id,
        tagId.namespace || "main"
      )!;
      const tagMap = TagInstanceMap.getMap(tagId.id).getMap(this.graph);
      tagMap.observers.nodeAdded.unsubscribe(this);
      tagMap.observers.nodeRemoved.unsubscribe(this);
      for (const child of tagPrototype.tag.traverseChildren()) {
        const chidMap = TagInstanceMap.getMap(child.id).getMap(this.graph);
        chidMap.observers.nodeAdded.unsubscribe(this);
        chidMap.observers.nodeRemoved.unsubscribe(this);
      }
    }
  }
}
