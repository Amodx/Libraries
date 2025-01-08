import { Graph } from "../Graphs/Graph";
import { QueryData } from "./Query.types";
import { NodeCursor } from "../Nodes/NodeCursor";
import { NCSRegister } from "../Register/NCSRegister";
import { ObservableFunction } from "../Util/Observable";

export class QueryInstance {
  nodes: number[] = [];

  private _updateFunction: ObservableFunction<number>;
  private nodeCursor = new NodeCursor();
  constructor(
    public graph: Graph,
    public data: QueryData
  ) {}

  evulate(node: NodeCursor): boolean {
    if (this.data.inclueComponents) {
      for (const comp of this.data.inclueComponents) {
        if (!(node.hasComponents && node.components.get(comp.type))) {
          return false;
        }
      }
    }

    if (this.data.includeTags) {
      for (const tag of this.data.includeTags) {
        if (!(node.hasTags && node.tags.get(tag.id))) {
          return false;
        }
      }
    }
    if (this.data.excludeComponents) {
      for (const comp of this.data.excludeComponents) {
        if (node.hasComponents && node.components.get(comp.type)) {
          return false;
        }
      }
    }
    if (this.data.excludeTags) {
      for (const tag of this.data.excludeTags) {
        if (node.hasTags && node.tags.get(tag.id)) {
          return false;
        }
      }
    }
    return true;
  }

  init() {
    this._updateFunction = (nodeIndex: number) => {
      const node = this.nodeCursor.setNode(nodeIndex);
      if (!this.evulate(node)) {
        for (let i = 0; i < this.nodes.length; i++) {
          if (this.nodes[i] == node.index) {
            this.nodes.splice(i, 1);
          }
        }
        return;
      }
      this.nodes.push(node.index);
    };

    if (this.data.inclueComponents) {
      for (const comp of this.data.inclueComponents) {
        const map = this.graph.components.get(comp.type)!;
        map.observers.nodeAdded.subscribe(this._updateFunction);
        map.observers.nodeRemoved.subscribe(this._updateFunction);
      }
    }
    if (this.data.includeTags) {
      for (const tagId of this.data.includeTags) {
        const tag = NCSRegister.tags.get(tagId.id)!;
        const tagMap = this.graph.tags.get(tagId.id)!;
        tagMap.observers.nodeAdded.subscribe(this._updateFunction);
        tagMap.observers.nodeRemoved.subscribe(this._updateFunction);
        for (const child of tag.traverseChildren()) {
          const chidMap = this.graph.tags.get(child.id)!;
          chidMap.observers.nodeAdded.subscribe(this._updateFunction);
          chidMap.observers.nodeRemoved.subscribe(this._updateFunction);
        }
      }
    }
  }

  dispose() {
    if (this.data.inclueComponents) {
      for (const comp of this.data.inclueComponents) {
        const map = this.graph.components.get(comp.type)!;
        map.observers.nodeAdded.unsubscribe(this._updateFunction);
        map.observers.nodeRemoved.unsubscribe(this._updateFunction);
      }
    }
    if (this.data.includeTags) {
      for (const tagId of this.data.includeTags) {
        const tag = NCSRegister.tags.get(tagId.id)!;
        const tagMap = this.graph.tags.get(tagId.id)!;
        tagMap.observers.nodeAdded.unsubscribe(this._updateFunction);
        tagMap.observers.nodeRemoved.unsubscribe(this._updateFunction);
        for (const child of tag.traverseChildren()) {
          const chidMap = this.graph.tags.get(child.id)!;
          chidMap.observers.nodeAdded.unsubscribe(this._updateFunction);
          chidMap.observers.nodeRemoved.unsubscribe(this._updateFunction);
        }
      }
    }
  }
}
