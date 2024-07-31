import { Observable } from "@amodx/core/Observers";
import { NodeInstance } from "../Nodes/NodeInstance";

class NodeGraphMapObservers {
  nodeAdded = new Observable<NodeInstance>();
  nodeRemoved = new Observable<NodeInstance>();
}

export class ItemNodeMap<MappedItem> {
  private nodes = new Set<NodeInstance>();
  private items = new Set<MappedItem>();
  private nodeMap = new Map<NodeInstance, MappedItem[]>();
  observers = new NodeGraphMapObservers();
  addNode(node: NodeInstance, mappedItem: MappedItem) {
    this.nodes.add(node);
    this.items.add(mappedItem);
    let mapped = this.nodeMap.get(node);
    if (!mapped) {
      mapped = [];
      this.nodeMap.set(node, mapped);
    }
    mapped.push(mappedItem);
    this.observers.nodeAdded.notify(node);
  }
  removeNode(node: NodeInstance, mappedItem: MappedItem) {
    this.nodes.delete(node);
    this.items.delete(mappedItem);
    let mapped = this.nodeMap.get(node);
    if (!mapped) return;
    mapped = mapped.filter((_) => _ != mappedItem);
    if (!mapped.length) {
      this.nodeMap.delete(node);
      this.nodes.delete(node);
      this.observers.nodeRemoved.notify(node);
    }
  }
  getNodes() {
    return this.nodes;
  }
  getItems() {
    return this.items;
  }
}
