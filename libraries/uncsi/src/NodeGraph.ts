import { Observable } from "@amodx/core/Observers";
import { NodeData } from "./NodeData.types";
import { Node, NodeId } from "./Node";

export interface NodeGraphObservers {}

export class NodeGraphObservers {
  nodeAdded = new Observable<Node>();
  nodeRemoved = new Observable<Node>();
  nodesUpdated = new Observable();
}

export interface NodeGraphDependencies {
  [key: string]: any;
}
export interface NodeGraph {}
export class NodeGraph {
  _nodeMap = new Map<BigInt, Map<BigInt, Node>>();

  observers = new NodeGraphObservers();
  root = new Node(null as any, Node.Create({}), this);

  constructor(public dependencies: NodeGraphDependencies) {}

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
    const root = new Node({} as any, data, this);
    await root.addChildren(...data.children);
    this.root = root;
  }

  async addNode(data: NodeData, parent: Node = this.root) {
    const newNode = new Node(parent, data, this);

    parent.addChild(newNode);

    let high = this._nodeMap.get(newNode.id.low);
    if (!high) {
      high = new Map<BigInt, Node>();
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
    const high = this._nodeMap.get(id.low);

    if (!high) return;

    const node = high.get(id.high);

    if (!node) return;
    if (!node.isDisposed()) node.dispose();
    high.delete(id.high);
    this.observers.nodeRemoved.notify(node);
    this.observers.nodesUpdated.notify();
  }

  toJSON() {
    return this.root.toJSON();
  }
}
