import { NodeData } from "../Nodes/NodeData";
import { NodeInstance } from "../Nodes/NodeInstance";
import { NodeId } from "../Nodes/NodeId";
import { GraphEvents } from "./GraphEvents";
import { Node } from "../NCS";
import { GraphUpdate } from "./GraphUpdate";
import { GraphObservers } from "./GraphObservers";

export interface GraphDependencies {
  [key: string]: any;
}
export interface Graph {}

const create = (graph: Graph, data: NodeData, parent: NodeInstance) => {
  const newNode = new NodeInstance(parent, data, graph);

  newNode.parent = parent;
  parent.children.push(newNode);

  let high = graph._nodeMap.get(newNode.id.low);
  if (!high) {
    high = new Map<BigInt, NodeInstance>();
    graph._nodeMap.set(newNode.id.low, high);
  }
  high.set(newNode.id.high, newNode);

  if (data.components?.length) {
    newNode.components.addComponents(...data.components);
  }

  parent.hasObservers &&
    parent.observers.isChildAddedSet() &&
    parent.observers.childAdded.notify(newNode);
  graph.observers.nodeAdded.notify(newNode);
  graph.observers.nodesUpdated.notify();

  if (data.children?.length) {
    for (const child of data.children) {
      create(graph, child, newNode);
    }
  }

  return newNode;
};

export class Graph {
  _nodeMap = new Map<BigInt, Map<BigInt, NodeInstance>>();
  events = new GraphEvents();
  observers = new GraphObservers();
  root = new NodeInstance(null as any, Node({ name: "__root__" }), this);

  constructor(public dependencies: GraphDependencies) {}

  getNode(id: NodeId | string) {
    if (typeof id == "string") id = NodeId.Create(id);

    const high = this._nodeMap.get(id.low);
    if (!high) throw new Error(`Node with id ${id.idString} does not exist`);
    const node = high.get(id.high);
    if (!node) throw new Error(`Node with id ${id.idString} does not exist`);
    return node;
  }

  loadInRoot(data: NodeData) {
    if (this.root) this.root.dispose();
    const root = new NodeInstance({} as any, data, this);
    root.addChildren(...data.children);
    this.root = root;
  }

  addNode(data: NodeData, parent: NodeInstance = this.root) {
    const newNode = create(this, data, parent);
    if (newNode.hasComponents) {
      for (const comp of newNode.components.components) {
        comp.init();
      }
    }
    for (const child of newNode.traverseChildren()) {
      if (child.hasComponents) {
        for (const comp of child.components.components) {
          comp.init();
        }
      }
    }
    return newNode;
  }

  removeNode(id: NodeId) {
    const low = this._nodeMap.get(id.low);
    if (!low) return;

    const node = low.get(id.high);

    if (!node) return;
    if (!node.isDisposed()) node.dispose();
    this._nodeMap.delete(id.low);
    low.delete(id.high);
    this.observers.nodeRemoved.notify(node);
    this.observers.nodesUpdated.notify();
  }

  update() {
    const updating = GraphUpdate.getItems(this);
    if (updating) {
      for (const item of updating) {
        item.update();
      }
    }
  }

  toJSON() {
    return this.root.toJSON();
  }
}
