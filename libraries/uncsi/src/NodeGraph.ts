import { Observable } from "@amodx/core/Observers";
import { NodeData } from "./NodeData.types";
import { Node } from "./Node";
import { shortId } from "@amodx/core/Ids/ShortIds";

export interface NodeGraphObservers {}

export class NodeGraphObservers {
  nodeAdded = new Observable<Node>();
  nodeRemoved = new Observable<Node>();
  nodesUpdated = new Observable();
}

export interface NodeGraphDependencies {
  [key: string]: any;
}
export interface NodeGraph {
  [key: string]: any;
}
export class NodeGraph {
  static GenerateId(): string {
    return shortId();
  }
  _nodes = new Map<string, Node>();

  observers = new NodeGraphObservers();
  root: Node;

  constructor(public dependencies: NodeGraphDependencies) {}

  getNode(id: string) {
    const node = this._nodes.get(id);
    if (!node) throw new Error(`Node with id ${id} does not exist`);
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
    this._nodes.set(newNode.data.id, newNode);
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

  removeNode(id: string) {
    const node = this._nodes.get(id);
    if (!node) return;
    node.dispose();
    this._nodes.delete(id);
    this.observers.nodeRemoved.notify(node);
    this.observers.nodesUpdated.notify();
  }

  toJSON() {
    return this.root.toJSON();
  }
}
