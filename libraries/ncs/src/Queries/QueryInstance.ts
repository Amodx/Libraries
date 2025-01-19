import { Graph } from "../Graphs/Graph";
import { QueryData } from "./Query.types";
import { NodeCursor } from "../Nodes/NodeCursor";
import { NCSRegister } from "../Register/NCSRegister";
import { ObservableFunction } from "../Util/Observable";
import { ComponentArray } from "../Components/ComponentArray";
import { TagArray } from "../Tags/TagArray";

export class QueryInstance {
  nodes: number[] = [];

  private _updateFunction: ObservableFunction<number>;
  private nodeCursor = NodeCursor.Get();
  constructor(
    public graph: Graph,
    public data: QueryData
  ) {}

  evulate(node: NodeCursor): boolean {
    if (this.data.inclueComponents) {
      for (const comp of this.data.inclueComponents) {
        if (!node.components.has(comp.type)) {
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
        if (node.components.has(comp.type)) {
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
      const node = this.nodeCursor.setNode(this.graph, nodeIndex);
      if (!this.evulate(node)) {
        for (let i = 0; i < this.nodes.length; i++) {
          if (this.nodes[i] == node.index) {
            this.nodes.splice(i, 1);
          }
        }
        return;
      }

      this.nodes.push(nodeIndex);
    };

    if (this.data.inclueComponents) {
      for (const comp of this.data.inclueComponents) {
        const compId = NCSRegister.components.idPalette.getNumberId(comp.type);
        let map = this.graph._components[compId];
        if (!map) {
          map = new ComponentArray(this.graph, compId);
          this.graph._components[compId] = map;
        }

        map.observers.nodeAdded.subscribe(this._updateFunction);
        map.observers.nodeRemoved.subscribe(this._updateFunction);
      }
    }
    if (this.data.includeTags) {
      for (const includeTag of this.data.includeTags) {
        const tag = NCSRegister.tags.get(includeTag.id)!;
        const tagId = NCSRegister.tags.idPalette.getNumberId(includeTag.id);
        let tagMap = this.graph._tags[tagId];
        if (!tagMap) {
          tagMap = new TagArray(includeTag.id);
          this.graph._tags[tagId] = tagMap;
        }
        tagMap.observers.nodeAdded.subscribe(this._updateFunction);
        tagMap.observers.nodeRemoved.subscribe(this._updateFunction);
        for (const child of tag.traverseChildren()) {
          const tagId = NCSRegister.tags.idPalette.getNumberId(child.id);
          let chidMap = this.graph._tags[tagId];
          if (!chidMap) {
            chidMap = new TagArray(child.id);
            this.graph._tags[tagId] = chidMap;
          }
          chidMap.observers.nodeAdded.subscribe(this._updateFunction);
          chidMap.observers.nodeRemoved.subscribe(this._updateFunction);
        }
      }
    }
  }

  dispose() {
    if (this.data.inclueComponents) {
      for (const comp of this.data.inclueComponents) {
        const map =
          this.graph._components[
            NCSRegister.components.idPalette.getNumberId(comp.type)
          ];
        if (!map) continue;
        map.observers.nodeAdded.unsubscribe(this._updateFunction);
        map.observers.nodeRemoved.unsubscribe(this._updateFunction);
      }
    }
    if (this.data.includeTags) {
      for (const includeTag of this.data.includeTags) {
        const tag = NCSRegister.tags.get(includeTag.id)!;
        const tagMap =
          this.graph._tags[
            NCSRegister.tags.idPalette.getNumberId(includeTag.id)
          ];
        if (!tagMap) continue;
        tagMap.observers.nodeAdded.unsubscribe(this._updateFunction);
        tagMap.observers.nodeRemoved.unsubscribe(this._updateFunction);
        for (const child of tag.traverseChildren()) {
          const childMap =
            this.graph._tags[NCSRegister.tags.idPalette.getNumberId(child.id)];
          if (!childMap) continue;
          childMap.observers.nodeAdded.unsubscribe(this._updateFunction);
          childMap.observers.nodeRemoved.unsubscribe(this._updateFunction);
        }
      }
    }
  }
}
