import { Observable } from "@amodx/core/Observers";
import { NodeData } from "../Nodes/NodeData";
import { NodeInstance } from "../Nodes/NodeInstance";
import { NodeId } from "../Nodes/NodeId";
import { GraphEvents } from "./GraphEvents";
import { Node } from "../NCS";
import { GraphUpdate } from "./GraphUpdate";
export interface GraphObservers {}

export class GraphObservers {
  nodeAdded = new Observable<NodeInstance>();
  nodeRemoved = new Observable<NodeInstance>();
  nodesUpdated = new Observable();
}

export interface GraphDependencies {
  [key: string]: any;
}
export interface Graph {}
export class Graph {
  _nodeMap = new Map<BigInt, Map<BigInt, NodeInstance>>();

  observers = new GraphObservers();
  root = new NodeInstance(null as any, Node({ name: "__root__" }), this);

  events = new GraphEvents();

  constructor(public dependencies: GraphDependencies) {}

  getNode(id: NodeId | string) {
    if (typeof id == "string") id = NodeId.Create(id);

    const high = this._nodeMap.get(id.low);
    if (!high) throw new Error(`Node with id ${id.idString} does not exist`);
    const node = high.get(id.high);
    if (!node) throw new Error(`Node with id ${id.idString} does not exist`);
    return node;
  }

  async loadInRoot(data: NodeData) {
    if (this.root) this.root.dispose();
    const root = new NodeInstance({} as any, data, this);
    await root.addChildren(...data.children);
    this.root = root;
  }

  async addNode(data: NodeData, parent: NodeInstance = this.root) {
    const newNode = new NodeInstance(parent, data, this);

    parent.addChild(newNode);

    let high = this._nodeMap.get(newNode.id.low);
    if (!high) {
      high = new Map<BigInt, NodeInstance>();
      this._nodeMap.set(newNode.id.low, high);
    }
    high.set(newNode.id.high, newNode);

    this.observers.nodeAdded.notify(newNode);
    this.observers.nodesUpdated.notify();
    if (data.children?.length) {
      for (const child of data.children) {
        await this.addNode(child, newNode);
      }
    }
    await newNode.initAllComponents();

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
    const updating = GraphUpdate.getUpdating(this);
    if (!updating) return;
    for (const component of updating) {
      component.componentPrototype.update!(component);
    }
  }

  toJSON() {
    return this.root.toJSON();
  }
}
