import { Observable } from "@amodx/core/Observers";
import { NodeInstance } from "../Nodes/NodeInstance";

export interface GraphObservers {}

export class GraphObservers {
  nodeAdded = new Observable<NodeInstance>();
  nodeRemoved = new Observable<NodeInstance>();
  nodesUpdated = new Observable();
}
